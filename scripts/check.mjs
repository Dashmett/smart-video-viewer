import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const resources = path.join(root, 'Smart Video Viewer/Smart Open in IINA Extension/Resources');
const manifest = JSON.parse(readFileSync(path.join(resources, 'manifest.json'), 'utf8'));
const project = readFileSync(path.join(root, 'Smart Video Viewer/Smart Open in IINA.xcodeproj/project.pbxproj'), 'utf8');
const versions = [...project.matchAll(/MARKETING_VERSION = ([^;]+);/g)].map(match => match[1]);
assert.ok(versions.length > 0, 'Missing Xcode marketing version');
assert.ok(versions.every(version => version === manifest.version), 'Manifest/Xcode version mismatch');

const scripts = [manifest.background.service_worker, ...manifest.content_scripts.flatMap(item => item.js)];
for (const filename of [...scripts, manifest.action.default_popup]) {
  assert.ok(existsSync(path.join(resources, filename)), `Missing manifest resource: ${filename}`);
}
for (const icons of [manifest.icons, manifest.action.default_icon]) {
  for (const [size, filename] of Object.entries(icons)) {
    const png = readFileSync(path.join(resources, filename));
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${filename}: invalid PNG`);
    assert.equal(png.toString('ascii', 12, 16), 'IHDR');
    assert.equal(png.readUInt32BE(16), Number(size), `${filename}: incorrect width`);
    assert.equal(png.readUInt32BE(20), Number(size), `${filename}: incorrect height`);
    assert.equal(png[25], 6, `${filename}: expected explicit RGBA export`);
  }
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(directory, entry.name);
    if (entry.name === 'xcuserdata') return [];
    return entry.isDirectory() ? walk(full) : [full];
  });
}
const sourceFiles = ['Smart Video Viewer', 'scripts'].flatMap(directory => walk(path.join(root, directory)));
for (const file of sourceFiles.filter(file => /\.(?:js|mjs)$/.test(file))) {
  execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
}
const docs = [
  ...readdirSync(root).filter(file => file.endsWith('.md')).map(file => path.join(root, file)),
  ...['docs', '.github', 'design', 'Smart Video Viewer'].flatMap(directory => walk(path.join(root, directory))).filter(file => file.endsWith('.md')),
];
for (const file of docs) {
  const body = readFileSync(file, 'utf8');
  for (const match of body.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)) {
    const target = match[1];
    if (/^(?:[a-z]+:|#)/i.test(target)) continue;
    const local = decodeURIComponent(target.split('#')[0]);
    assert.ok(existsSync(path.resolve(path.dirname(file), local)), `${path.relative(root, file)}: broken local link ${target}`);
  }
}
console.log(`Static checks passed: version ${manifest.version}, manifest assets, PNG dimensions/RGBA, JavaScript syntax and local Markdown links.`);
console.log('These checks do not validate raster appearance or actual Safari playback.');

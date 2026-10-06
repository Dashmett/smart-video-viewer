#!/bin/bash
set -euo pipefail
repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_root"
app_path="output/distribution-build/Build/Products/Release/Smart Open in IINA.app"
version="$(/usr/libexec/PlistBuddy -c 'Print CFBundleShortVersionString' "$app_path/Contents/Info.plist")"
package_dir="${PREVIEW_OUTPUT_DIR:-release/github-v${version}}"
if [[ -e "$package_dir" ]]; then
  echo "Output already exists: $package_dir; refusing to overwrite published artifacts." >&2
  exit 1
fi
codesign --verify --deep --strict "$app_path"
signature_details="$(codesign -dvv "$app_path" 2>&1)"
if [[ "$signature_details" != *"Signature=adhoc"* ]]; then
  echo 'Expected an ad-hoc preview; do not accidentally publish personal development certificates.' >&2
  exit 1
fi
mkdir -p "$package_dir" output
staging_dir="$(mktemp -d "$repo_root/output/preview-stage.XXXXXX")"
ditto --norsrc --noextattr "$app_path" "$staging_dir/Smart Open in IINA.app"
# Remove debug/local symbol paths before re-signing the staging copy.
# Do not alter the user-installed app or the source build product.
preview_app="$staging_dir/Smart Open in IINA.app"
preview_extension="$preview_app/Contents/PlugIns/Smart Open in IINA Extension.appex"
strip -S -x "$preview_extension/Contents/MacOS/Smart Open in IINA Extension"
strip -S -x "$preview_app/Contents/MacOS/Smart Open in IINA"
codesign --force --sign - --options runtime "$preview_extension"
codesign --force --sign - --options runtime "$preview_app"
codesign --verify --deep --strict "$preview_app"
node scripts/privacy-check.mjs --artifact "$preview_app"
cp LICENSE "$staging_dir/LICENSE"
cp docs/INSTALL.md "$staging_dir/INSTALL.txt"
printf 'Source commit: %s\nBuild: %s\nArchitecture: arm64\nSignature: ad-hoc; not notarized\n' "$(git rev-parse HEAD)" "$version" > "$staging_dir/BUILD.txt"
node scripts/privacy-check.mjs --artifact "$staging_dir"
# ZIP has no Applications link; the DMG adds the standard drag-install destination.
zip_name="Smart-Video-Viewer-${version}-macOS-arm64-preview.zip"
dmg_name="Smart-Video-Viewer-${version}-macOS-arm64-preview.dmg"
ditto -c -k --norsrc --noextattr "$staging_dir" "$package_dir/$zip_name"
ln -s /Applications "$staging_dir/Applications"
hdiutil create -volname "Smart Video Viewer $version" -srcfolder "$staging_dir" -format UDZO "$package_dir/$dmg_name"
hdiutil verify "$package_dir/$dmg_name"
cp docs/INSTALL.md "$package_dir/INSTALL.md"
(cd "$package_dir" && shasum -a 256 "$zip_name" "$dmg_name" INSTALL.md > SHA256SUMS.txt)
echo "Preview artifacts: $package_dir"

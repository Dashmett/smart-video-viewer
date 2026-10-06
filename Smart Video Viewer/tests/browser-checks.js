async (page) => {
  const results = [];
  const check = (name, condition) => { if (!condition) throw new Error(name); results.push(name); };
  await page.reload();
  await page.waitForFunction(() => document.querySelector('video').readyState >= 2);
  const before = await page.evaluate(() => {
    const v = document.querySelector('video'); v.currentTime = 12; v.playbackRate = 1.25;
    window.originalParent = v.parentNode; window.originalSrc = v.currentSrc;
    return { style: v.style.cssText, container: document.querySelector('#container').style.cssText, body: document.body.style.cssText };
  });
  await page.getByRole('button', { name: '进入观影', exact: true }).click();
  await page.getByRole('region', { name: '视频播放控制' }).waitFor();
  check('original video stays connected with unchanged source and position', await page.evaluate(() => {
    const v = document.querySelector('video'); return v.parentNode === originalParent && v.currentSrc === originalSrc && v.currentTime >= 12 && v.currentTime < 13;
  }));
  await page.getByRole('spinbutton', { name: '播放倍速', exact: true }).fill('2.37');
  await page.getByRole('spinbutton', { name: '播放倍速', exact: true }).press('Tab');
  check('arbitrary rate 2.37x applies', await page.evaluate(() => document.querySelector('video').playbackRate === 2.37));
  await page.getByRole('spinbutton', { name: '每次跳转秒数', exact: true }).fill('7.5');
  await page.getByRole('spinbutton', { name: '每次跳转秒数', exact: true }).press('Tab');
  await page.getByRole('button', { name: '快进 7.5 秒', exact: true }).click();
  check('button seeks configured 7.5 seconds', await page.evaluate(() => Math.abs(document.querySelector('video').currentTime - 19.5) < .1));
  await page.keyboard.press('ArrowLeft');
  check('left shortcut seeks configured 7.5 seconds', await page.evaluate(() => Math.abs(document.querySelector('video').currentTime - 12) < .1));
  await page.getByRole('spinbutton', { name: '每次跳转秒数', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  check('input editing does not seek video', await page.evaluate(() => Math.abs(document.querySelector('video').currentTime - 12) < .1));
  await page.getByRole('spinbutton', { name: '播放倍速', exact: true }).fill('0');
  await page.getByRole('spinbutton', { name: '播放倍速', exact: true }).press('Tab');
  check('invalid rate leaves playback rate intact', await page.evaluate(() => document.querySelector('video').playbackRate === 2.37));
  await page.evaluate(() => { document.querySelector('video').currentTime = 38; });
  await page.getByRole('button', { name: '快进 7.5 秒', exact: true }).click();
  check('seek clamps to media end', await page.evaluate(() => document.querySelector('video').currentTime <= 40));
  await page.evaluate(() => { document.querySelector('video').currentTime = 2; });
  await page.getByRole('button', { name: '快退 7.5 秒', exact: true }).click();
  check('seek clamps to media start', await page.evaluate(() => document.querySelector('video').currentTime === 0));
  await page.screenshot({ path: 'output/playwright/viewer-desktop.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  check('controls fit narrow viewport', await page.evaluate(() => {
    const r = document.querySelector('[data-smart-video-viewer]').shadowRoot.querySelector('.panel').getBoundingClientRect();
    return r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight;
  }));
  await page.screenshot({ path: 'output/playwright/viewer-narrow.png' });
  await page.keyboard.press('Escape');
  check('Escape removes viewer', await page.locator('[data-smart-video-viewer]').count() === 0);
  const after = await page.evaluate(() => ({ style: document.querySelector('video').style.cssText, container: document.querySelector('#container').style.cssText, body: document.body.style.cssText, controls: document.querySelector('video').controls, rate: document.querySelector('video').playbackRate }));
  check('original controls and speed restored', after.controls && after.rate === 1.25);
  check('original page and video styles restored', before.style === after.style && before.container === after.container && before.body === after.body);
  await page.getByRole('button', { name: '进入观影', exact: true }).click();
  check('settings persist when reopening', await page.getByRole('spinbutton', { name: '播放倍速', exact: true }).inputValue() === '2.37' && await page.getByRole('spinbutton', { name: '每次跳转秒数', exact: true }).inputValue() === '7.5');
  await page.evaluate(() => document.querySelector('video').remove());
  await page.waitForFunction(() => !document.querySelector('[data-smart-video-viewer]'));
  check('removing video automatically restores page', await page.evaluate(() => document.body.style.cssText === ''));
  await page.setViewportSize({ width: 1280, height: 720 });
  return { passed: results.length, results };
}

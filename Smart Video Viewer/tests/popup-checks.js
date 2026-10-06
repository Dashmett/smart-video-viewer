async (page) => {
  await page.goto('http://127.0.0.1:8766/output/playwright/popup-fixture.html');
  await page.waitForFunction(() => !document.querySelector('#viewer').disabled);
  const check = (name, value) => { if (!value) throw Error(name); };
  check('detected video shown', (await page.locator('#videos').textContent()).includes('正在播放'));
  await page.locator('#rate').fill('2.37'); await page.locator('#seek').fill('7.5'); await page.locator('#seek').press('Tab');
  check('settings persisted', await page.evaluate(() => testSettings.viewerSettings.rate === 2.37 && testSettings.viewerSettings.seekSeconds === 7.5));
  await page.getByRole('button', {name:'进入独立观影',exact:true}).click();
  check('selection passed to background', await page.evaluate(() => testCommands.find(c=>c.type==='open-viewer')?.video?.id === 'one'));
  check('failure shown', (await page.locator('#status').textContent()).includes('本地测试'));
  await page.locator('#rate').fill('0'); await page.locator('#rate').press('Tab');
  check('invalid settings rejected', await page.evaluate(() => testSettings.viewerSettings.rate === 2.37));
  await page.locator('#rate').fill('2.37'); await page.locator('#rate').press('Tab');
  await page.screenshot({path:'output/playwright/popup.png'});
  return {passed:5};
}

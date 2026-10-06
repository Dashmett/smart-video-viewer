async (page) => {
  await page.goto('http://127.0.0.1:8766/output/playwright/fixture.html');
  await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
  await page.evaluate(()=>smartVideoViewer.open(smartVideoViewer.inventory()[0].id,'glass-test'));
  await page.locator('.dock').hover();
  const material=await page.locator('.panel').evaluate(el=>{const s=getComputedStyle(el);return {blur:s.backdropFilter||s.webkitBackdropFilter,background:s.backgroundColor,border:s.borderTopColor};});
  if(!material.blur.includes('blur(28px)'))throw Error('Glass blur unavailable');
  if(!material.background.includes('0.58'))throw Error('Translucent surface missing');
  await page.locator('.panel').screenshot({path:`output/playwright/liquid-glass-${page.context().browser().browserType().name()}.png`});
  await page.emulateMedia({contrast:'more'});
  const fallback=await page.locator('.panel').evaluate(el=>{const s=getComputedStyle(el);return s.backdropFilter||s.webkitBackdropFilter;});
  if(fallback!=='none')throw Error('High contrast fallback missing');
  await page.emulateMedia({contrast:'no-preference'});
  await page.keyboard.press('Escape');
  return {passed:3,material,highContrastFallback:fallback};
}

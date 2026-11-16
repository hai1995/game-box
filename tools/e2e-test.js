const { chromium } = require('playwright');
const DIRS = [[-1,0],[0,1],[1,0],[0,-1]];

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true,
    args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error' && !m.text().includes('favicon')) errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERR ' + e.message));

  await page.goto('http://localhost:8899/games/arrow-out/index.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.setItem('gb-arrow-level', '1'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.getElementById('loading').classList.contains('hidden'), { timeout: 8000 });

  const info = await page.evaluate(() => {
    const cv = document.getElementById('cv');
    return {
      lv: document.getElementById('lvNum').textContent,
      left: document.getElementById('leftNum').textContent,
      lives: document.getElementById('livesNum').textContent,
      time: document.getElementById('timeNum').textContent,
      cw: cv.clientWidth, ch: cv.clientHeight,
      rect: (() => { const r = cv.getBoundingClientRect(); return { x: r.x, y: r.y }; })(),
      data: window.GB_LEVEL_CHUNKS[1][0]
    };
  });
  console.log('初始:', JSON.stringify({ lv: info.lv, left: info.left, lives: info.lives, time: info.time, cw: info.cw, ch: info.ch }));

  const data = info.data, R = data.r, C = data.c;
  const cell = info.cw / C;
  function decodeLevel(d) {
    return d.a.map(s => { const p = s.split(',').map(Number), cells = [];
      for (let i = 1; i < p.length; i += 2) cells.push([p[i], p[i+1]]);
      return { dir: p[0], cells }; });
  }
  const arrows = decodeLevel(data);
  const occ = new Int32Array(R * C).fill(-1);
  arrows.forEach((a, id) => a.cells.forEach(p => occ[p[0]*C+p[1]] = id));
  function clear(a, id) {
    const h = a.cells[a.cells.length-1], v = DIRS[a.dir];
    let r = h[0]+v[0], c = h[1]+v[1];
    while (r>=0&&r<R&&c>=0&&c<C) { const o=occ[r*C+c]; if(o!==-1&&o!==id) return false; r+=v[0]; c+=v[1]; }
    return true;
  }
  async function clickCell(p) {
    const x = info.rect.x + (p[1] + 0.5) * cell, y = info.rect.y + (p[0] + 0.5) * cell;
    await page.mouse.click(x, y);
    await page.waitForTimeout(60);
  }
  // 找到一个当前被挡的箭头验证扣机会
  let blocked = arrows.findIndex((a,id) => !clear(a,id));
  const beforeLives = await page.evaluate(() => document.getElementById('livesNum').textContent);
  if (blocked >= 0) {
    await clickCell(arrows[blocked].cells[0]);
    const afterLives = await page.evaluate(() => document.getElementById('livesNum').textContent);
    console.log('阻挡测试: 点击被挡箭头', blocked, '机会', beforeLives, '->', afterLives);
  } else {
    console.log('阻挡测试: 第1关无被挡箭头（可能全是直线可消）');
  }

  // 计时是否从点击开始：reload 后等待 2 秒应仍为初始
  // 已点过，跳过。改为新开一页验证
  const page2 = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page2.goto('http://localhost:8899/games/arrow-out/index.html', { waitUntil: 'networkidle' });
  await page2.evaluate(() => localStorage.setItem('gb-arrow-level', '1'));
  await page2.reload({ waitUntil: 'networkidle' });
  await page2.waitForFunction(() => document.getElementById('loading').classList.contains('hidden'));
  const t0 = await page2.evaluate(() => document.getElementById('timeNum').textContent);
  await page2.waitForTimeout(2200);
  const t1 = await page2.evaluate(() => document.getElementById('timeNum').textContent);
  console.log('计时启动测试: 进关2.2秒后', t0, '->', t1, t0===t1 ? '(未提前扣时 OK)' : '(异常提前扣时!)');
  await page2.close();

  // 清空所有箭头直到通关：生成器保证「数组逆序」是一条可行解（后放入的先消除）
  for (let id = arrows.length - 1; id >= 0; id--) {
    await clickCell(arrows[id].cells[0]);
  }
  await page.waitForTimeout(700);
  const final = await page.evaluate(() => ({
    overlay: !document.getElementById('overlay').classList.contains('hidden'),
    title: document.getElementById('ovTitle').textContent,
    left: document.getElementById('leftNum').textContent,
    hasNext: Array.from(document.querySelectorAll('#ovBtns button')).some(b => b.textContent.includes('下一关'))
  }));
  console.log('通关测试:', JSON.stringify(final));
  // 阻挡扣机会测试：跳到有遮挡的关500，连点被挡箭头3次直到失败
  const page3 = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page3.goto('http://localhost:8899/games/arrow-out/index.html', { waitUntil: 'networkidle' });
  await page3.evaluate(() => localStorage.setItem('gb-arrow-level', '500'));
  await page3.reload({ waitUntil: 'networkidle' });
  await page3.waitForFunction(() => document.getElementById('loading').classList.contains('hidden'), { timeout: 8000 });
  const b3 = await page3.evaluate(() => {
    const cv = document.getElementById('cv'), r = cv.getBoundingClientRect();
    return { rect: { x: r.x, y: r.y }, cw: cv.clientWidth, data: window.GB_LEVEL_CHUNKS[5][99] };
  });
  const d3 = b3.data, R3 = d3.r, C3 = d3.c, cell3 = b3.cw / C3;
  const ar3 = decodeLevel(d3), occ3 = new Int32Array(R3*C3).fill(-1);
  ar3.forEach((a,id)=>a.cells.forEach(p=>occ3[p[0]*C3+p[1]]=id));
  function clear3(a,id){const h=a.cells[a.cells.length-1],v=DIRS[a.dir];let r=h[0]+v[0],c=h[1]+v[1];
    while(r>=0&&r<R3&&c>=0&&c<C3){const o=occ3[r*C3+c];if(o!==-1&&o!==id)return false;r+=v[0];c+=v[1];}return true;}
  const blockedId = ar3.findIndex((a,id)=>!clear3(a,id));
  console.log('关500被挡箭头索引:', blockedId);
  const livesBefore = await page3.evaluate(()=>document.getElementById('livesNum').textContent);
  for (let i=0;i<3;i++){
    const p = ar3[blockedId].cells[0];
    await page3.mouse.click(b3.rect.x+(p[1]+0.5)*cell3, b3.rect.y+(p[0]+0.5)*cell3);
    await page3.waitForTimeout(i === 2 ? 600 : 150);
  }
  const blockRes = await page3.evaluate(()=>({
    lives: document.getElementById('livesNum').textContent,
    overlay: !document.getElementById('overlay').classList.contains('hidden'),
    title: document.getElementById('ovTitle').textContent,
    hasRetry: Array.from(document.querySelectorAll('#ovBtns button')).some(b=>b.textContent.includes('重试'))
  }));
  console.log('阻挡扣机会测试: 机会', livesBefore, '->', blockRes.lives, '| 失败弹层', blockRes.overlay, blockRes.title, '| 重试按钮', blockRes.hasRetry);
  await page3.close();

  console.log('页面错误数:', errors.length, errors.slice(0,5));

  await page.screenshot({ path: '/tmp/arrow-out.png' });
  await browser.close();
  const ok = final.overlay && final.left === '0' && final.hasNext && t0 === t1 &&
    blockRes.lives === '—' && blockRes.overlay && blockRes.hasRetry && errors.length === 0;
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  process.exit(ok ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });

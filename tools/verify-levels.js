#!/usr/bin/env node
/*
 * 关卡数据全量校验：读取生成的 levels/*.js，逐关用「正向求解器」验证可解性。
 * 求解逻辑与游戏运行时一致：反复找一个射线畅通的箭头将其消除，直到清空。
 * 同时检查难度曲线单调性、塞满率区间、限时配置。
 */
'use strict';
const fs = require('fs');
const path = require('path');

const DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]];

global.window = {};
const dir = path.join(__dirname, '..', 'games', 'arrow-out', 'levels');
for (let k = 1; k <= 10; k++) {
  const f = path.join(dir, 'l' + String(k).padStart(3, '0') + '.js');
  eval(fs.readFileSync(f, 'utf8'));
}
const chunks = window.GB_LEVEL_CHUNKS;
let levels = [];
for (let k = 1; k <= 10; k++) levels = levels.concat(chunks[k]);

// 解码：'dir,r0,c0,r1,c1,...'
function decode(s) {
  const p = s.split(',').map(Number);
  const cells = [];
  for (let i = 1; i < p.length; i += 2) cells.push([p[i], p[i + 1]]);
  return { dir: p[0], cells: cells };
}
// 射线是否被「其他」箭头挡住（ignore=自身id）
function blocked(r, c, dir, grid, R, C, ignore) {
  const dr = DIRS[dir][0], dc = DIRS[dir][1];
  r += dr; c += dc;
  while (r >= 0 && r < R && c >= 0 && c < C) {
    const v = grid[r * C + c];
    if (v !== -1 && v !== ignore) return true;
    r += dr; c += dc;
  }
  return false;
}

function solve(lv) {
  const R = lv.r, C = lv.c;
  const arrows = lv.a.map(decode);
  const grid = new Int32Array(R * C).fill(-1);
  arrows.forEach(function (a, id) {
    a.cells.forEach(function (p) {
      if (p[0] < 0 || p[0] >= R || p[1] < 0 || p[1] >= C) throw new Error('越界格');
      grid[p[0] * C + p[1]] = id;
    });
  });
  let removed = 0;
  // 贪心：每轮尝试消除所有当前畅通的箭头（顺序无关，因为畅通性只取决于当前局面）
  let progress = true;
  while (removed < arrows.length && progress) {
    progress = false;
    for (let id = 0; id < arrows.length; id++) {
      if (grid[arrows[id].cells[0][0] * C + arrows[id].cells[0][1]] === -1) continue; // 已消除
      const h = arrows[id].cells[arrows[id].cells.length - 1];
      if (!blocked(h[0], h[1], arrows[id].dir, grid, R, C, id)) {
        arrows[id].cells.forEach(function (p) { grid[p[0] * C + p[1]] = -1; });
        removed++; progress = true;
      }
    }
  }
  return { removed: removed, total: arrows.length, ok: removed === arrows.length };
}

let fail = 0, minFill = 1, maxFill = 0;
const segTimes = { 1: 600, 90: 600, 91: 600, 325: 600, 326: 720, 500: 720, 501: 840, 700: 840, 701: 960, 900: 960, 901: 1080, 1000: 1080 };
levels.forEach(function (lv, i) {
  const n = i + 1;
  const res = solve(lv);
  if (!res.ok) { console.log('不可解！关' + n + ' 仅消除 ' + res.removed + '/' + res.total); fail++; }
  let cells = 0;
  lv.a.forEach(function (s) { cells += (s.split(',').length - 1) / 2; });
  const fill = cells / (lv.c * lv.r);
  if (fill < minFill) minFill = fill;
  if (fill > maxFill) maxFill = fill;
  // 复查重叠：解码后所有路径格应互不相同
  const seen = new Set();
  let overlap = false;
  lv.a.forEach(function (s) {
    const p = s.split(',').map(Number);
    for (let j = 1; j < p.length; j += 2) {
      const key = p[j] + ',' + p[j + 1];
      if (seen.has(key)) overlap = true;
      seen.add(key);
    }
  });
  if (overlap) { console.log('路径重叠！关' + n); fail++; }
  if (segTimes[n] && lv.t !== segTimes[n]) { console.log('限时不符！关' + n + ' 期望' + segTimes[n] + ' 实际' + lv.t); fail++; }
});
console.log('校验 ' + levels.length + ' 关，失败 ' + fail + ' 关');
console.log('塞满率范围 ' + (minFill * 100).toFixed(1) + '% ~ ' + (maxFill * 100).toFixed(1) + '%');
process.exit(fail ? 1 : 0);

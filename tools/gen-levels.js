#!/usr/bin/env node
/*
 * 箭头消除 · 关卡生成器（反向构造法 + 求解器验证 + 拒绝采样）
 * ------------------------------------------------------------------
 * 原理：正向消除 = 点击箭头，从其末端沿朝向射向边界，射线上无其他箭头则飞出。
 *       反向构造 = 从空棋盘开始，按「正向消除顺序的逆序」依次放入箭头：
 *         放入第 k 个箭头时，只要求它的射线不碰到「已经放入」的箭头
 *         （这些是正向中在它之后才消除的）。以后放入的箭头会挡在它的射线上，
 *         但正向时那些箭头先被消除，所以它最终一定能飞出。
 *       因此逆序消除整局必然可解 —— 求解器按此顺序复核一遍。
 *
 * 难度六段：段内线性插值，棋盘 / 箭头数 / 折弯 / 塞满率都平滑变化。
 * 输出：games/arrow-out/levels/l001.js … l010.js，每块 100 关，按需加载。
 *
 * 用法：
 *   node tools/gen-levels.js            # 生成全部 1000 关
 *   node tools/gen-levels.js sample     # 只打印样本，不写文件
 */
'use strict';

const fs = require('fs');
const path = require('path');

// 方向：0上 1右 2下 3左；OPP 为反方向
const DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]];
const OPP = [2, 3, 0, 1];

// 六段难度曲线。棋盘按 cols(列) × rows(行)，宽小于高，贴合手机竖屏。
const SEGMENTS = [
  { from: 1,   to: 90,   cols: [6, 8],   rows: [7, 9],   arrows: [10, 18], bends: 1, time: 600,  fill: 0.66, name: '入门' },
  { from: 91,  to: 325,  cols: [10, 14], rows: [12, 18], arrows: [18, 30], bends: 2, time: 600,  fill: 0.68, name: '进阶' },
  { from: 326, to: 500,  cols: [16, 20], rows: [22, 26], arrows: [28, 40], bends: 3, time: 720,  fill: 0.70, name: '迷宫' },
  { from: 501, to: 700,  cols: [20, 24], rows: [26, 30], arrows: [38, 48], bends: 3, time: 840,  fill: 0.72, name: '深迷宫A' },
  { from: 701, to: 900,  cols: [24, 26], rows: [30, 34], arrows: [45, 55], bends: 3, time: 960,  fill: 0.74, name: '深迷宫B' },
  { from: 901, to: 1000, cols: [26, 28], rows: [34, 37], arrows: [50, 60], bends: 4, time: 1080, fill: 0.76, name: '终极' }
];

/* ---------------- 可复现随机数 ---------------- */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
let rng = mulberry32(1);
function ri(a, b) { return a + Math.floor(rng() * (b - a + 1)); }
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}
function lerp(a, b, t) { return Math.round(a + (b - a) * t); }

function paramsFor(level) {
  const seg = SEGMENTS.find(function (s) { return level <= s.to; }) || SEGMENTS[SEGMENTS.length - 1];
  const t = seg.to === seg.from ? 1 : (level - seg.from) / (seg.to - seg.from);
  return {
    cols: lerp(seg.cols[0], seg.cols[1], t),
    rows: lerp(seg.rows[0], seg.rows[1], t),
    count: lerp(seg.arrows[0], seg.arrows[1], t),
    bends: seg.bends,
    time: seg.time,
    fill: seg.fill,
    name: seg.name
  };
}

/* ---------------- 射线与网格 ---------------- */
// 从 (r,c) 沿 dir 射向边界，是否撞到「其他箭头」占用格。
// ignoreId：自身 id，自身路径格不阻挡自己飞出（飞出时整条箭头一起离开）。
function rayHit(r, c, dir, grid, R, C, ignoreId) {
  const dr = DIRS[dir][0], dc = DIRS[dir][1];
  r += dr; c += dc;
  while (r >= 0 && r < R && c >= 0 && c < C) {
    const v = grid[r * C + c];
    if (v !== -1 && v !== ignoreId) return true;
    r += dr; c += dc;
  }
  return false;
}
function arrowBlocked(a, grid, R, C, id) {
  const h = a.cells[a.cells.length - 1];
  return rayHit(h[0], h[1], a.dir, grid, R, C, id);
}

/* 从末端反向走出一条候选箭头路径。
 * 先选一个「射线畅通」的末端 + 朝向，再朝内走 wantLen 格（可折弯）。
 * 末端朝外、路径朝内，保证射线一侧干净，同时箭头深入棋盘形成嵌套依赖。
 * 关键：末端优先贴边朝外 —— 射线越短越容易畅通，才能塞得更满。 */
function tryMakeArrow(R, C, grid, wantLen, maxBends) {
  for (let attempt = 0; attempt < 600; attempt++) {
    // 60% 概率从四条边界挑末端（射线天然短），40% 全盘随机
    let er, ec;
    if (rng() < 0.6) {
      const side = ri(0, 3);
      if (side === 0) { er = 0; ec = ri(0, C - 1); }
      else if (side === 1) { er = R - 1; ec = ri(0, C - 1); }
      else if (side === 2) { er = ri(0, R - 1); ec = 0; }
      else { er = ri(0, R - 1); ec = C - 1; }
    } else {
      er = ri(0, R - 1); ec = ri(0, C - 1);
    }
    if (grid[er * C + ec] !== -1) continue;
    // 朝向优先选「朝外」：让射线尽快出界
    let dir;
    if (attempt % 3 === 0) {
      const outs = [];
      if (er === 0) outs.push(0);
      if (er === R - 1) outs.push(2);
      if (ec === 0) outs.push(3);
      if (ec === C - 1) outs.push(1);
      dir = outs.length ? outs[ri(0, outs.length - 1)] : ri(0, 3);
    } else {
      dir = ri(0, 3);
    }
    if (rayHit(er, ec, dir, grid, R, C)) continue;

    // 朝内的可用深度：至少能走 1 格，路径才有意义
    const back = OPP[dir];
    let depth = 0, rr = er, cc = ec;
    while (true) {
      rr += DIRS[back][0]; cc += DIRS[back][1];
      if (rr < 0 || rr >= R || cc < 0 || cc >= C) break;
      depth++;
    }
    if (depth < 1) continue;

    const len = Math.max(2, Math.min(wantLen + ri(-1, 1), depth + 1));
    const cells = [[er, ec]];
    let r = er, c = ec, lastBack = back, bends = 0;
    while (cells.length < len) {
      // 优先沿当前方向直行（深入棋盘），必要时才折弯，避免过早撞墙/自交而走不长
      let dirs;
      if (rng() < 0.72) {
        dirs = [lastBack].concat(shuffle([0, 1, 2, 3]).filter(function (d) { return d !== lastBack; }));
      } else {
        dirs = shuffle([0, 1, 2, 3]);
      }
      let moved = false;
      for (let i = 0; i < dirs.length; i++) {
        const d = dirs[i];
        if (d === OPP[lastBack]) continue;           // 不原路折返
        const nr = r + DIRS[d][0], nc = c + DIRS[d][1];
        if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
        if (grid[nr * C + nc] !== -1) continue;       // 不碰已放箭头
        let dup = false;
        for (let k = 0; k < cells.length; k++) {
          if (cells[k][0] === nr && cells[k][1] === nc) { dup = true; break; }
        }
        if (dup) continue;                            // 不自交
        const nb = d !== lastBack ? bends + 1 : bends;
        if (nb > maxBends) continue;                  // 折弯预算
        cells.push([nr, nc]);
        if (d !== lastBack) bends = nb;
        lastBack = d; r = nr; c = nc; moved = true;
        break;
      }
      if (!moved) break;
    }
    if (cells.length < 2) continue;
    cells.reverse();                                  // 存成「起点→末端」，末端带方向
    return { cells: cells, dir: dir };
  }
  return null;
}

/* 反向构造一关：按目标数量依次放入，放不下时逐级缩短路径兜底。 */
function buildOnce(p, level) {
  const R = p.rows, C = p.cols, N = p.count;
  const bends = level <= 3 ? 0 : p.bends;             // 第 1 关极简：无折弯
  const targetCells = Math.round(R * C * p.fill);
  const grid = new Int32Array(R * C).fill(-1);
  const arrows = [];
  let used = 0;

  for (let k = 0; k < N; k++) {
    const remainArrows = N - k;
    const remainCells = Math.max(2, targetCells - used);
    // 乘 1.3 抬高长度目标：路径会被占用格自然截断，略高才能把格子吃满
    const want0 = Math.max(3, Math.round(remainCells / remainArrows * 1.3));
    const cap = Math.max(5, Math.floor(Math.max(R, C) * 0.9));
    let placed = false;
    for (let relax = 0; relax < 9 && !placed; relax++) {
      const want = Math.max(2, Math.min(cap, want0 - Math.floor(relax / 2)));
      const a = tryMakeArrow(R, C, grid, want, bends);
      if (!a) continue;
      const id = arrows.length;
      for (let i = 0; i < a.cells.length; i++) grid[a.cells[i][0] * C + a.cells[i][1]] = id;
      arrows.push(a);
      used += a.cells.length;
      placed = true;
    }
    if (!placed) break;                               // 该关放不下更多，降级补足
  }
  return { R: R, C: C, arrows: arrows, used: used, bends: bends, targetCells: targetCells };
}

/* 求解器：按放入的逆序消除，复核「至少存在一条解」。 */
function solvable(board) {
  const R = board.R, C = board.C, arrows = board.arrows;
  const grid = new Int32Array(R * C).fill(-1);
  for (let id = 0; id < arrows.length; id++) {
    const cells = arrows[id].cells;
    for (let i = 0; i < cells.length; i++) grid[cells[i][0] * C + cells[i][1]] = id;
  }
  for (let i = arrows.length - 1; i >= 0; i--) {
    if (arrowBlocked(arrows[i], grid, R, C, i)) return false;
    const cells = arrows[i].cells;
    for (let j = 0; j < cells.length; j++) grid[cells[j][0] * C + cells[j][1]] = -1;
  }
  return true;
}

// 调试版求解器：返回第一个在逆序消除时被挡住的箭头下标，-1 表示可解
function debugSolvable(board) {
  const R = board.R, C = board.C, arrows = board.arrows;
  const grid = new Int32Array(R * C).fill(-1);
  for (let id = 0; id < arrows.length; id++) {
    const cells = arrows[id].cells;
    for (let i = 0; i < cells.length; i++) grid[cells[i][0] * C + cells[i][1]] = id;
  }
  for (let i = arrows.length - 1; i >= 0; i--) {
    if (arrowBlocked(arrows[i], grid, R, C, i)) return i;
    const cells = arrows[i].cells;
    for (let j = 0; j < cells.length; j++) grid[cells[j][0] * C + cells[j][1]] = -1;
  }
  return -1;
}

function encode(board) {
  return board.arrows.map(function (a) {
    return a.dir + ',' + a.cells.map(function (p) { return p[0] + ',' + p[1]; }).join(',');
  });
}

/* 拒绝采样：同一关换种子多生成几次，挑「可解 + 塞满率达标 + 箭头数达标」的最佳者。 */
function generateLevel(level) {
  const p = paramsFor(level);
  // 视觉上 65% 已足够密；66~76% 为目标带，略放宽下限避免大棋盘频繁降级
  const fillLo = 0.655, fillHi = 0.77;
  let best = null;
  const TRIES = 140;
  for (let t = 0; t < TRIES; t++) {
    rng = mulberry32((level * 2654435761 + t * 40503) >>> 0);
    const board = buildOnce(p, level);
    if (!solvable(board)) {
      if (process.argv[3] === 'dbg') {
        const badIdx = debugSolvable(board);
        const a = board.arrows[badIdx];
        console.log('  不可解 lv' + level + ' try' + t + ' 箭头=' + board.arrows.length +
          '/' + p.count + ' 塞满=' + (board.used / (board.R * board.C) * 100).toFixed(1) +
          '% 首个卡住=' + badIdx + ' 末端=' + JSON.stringify(a && a.cells.slice(-1)) + ' 朝向=' + (a && a.dir));
      }
      continue;
    }
    const fill = board.used / (board.R * board.C);
    const full = board.arrows.length >= p.count;
    const inBand = fill >= fillLo && fill <= fillHi;
    const score = (full ? 100 : 0) + (inBand ? 50 : 0) - Math.abs(fill - p.fill) * 100;
    if (!best || score > best.score) best = { board: board, fill: fill, score: score, full: full, inBand: inBand };
    if (full && inBand) break;
  }
  if (!best) throw new Error('关卡 ' + level + ' 无法生成可解布局');

  const b = best.board;
  return {
    data: { c: b.C, r: b.R, t: p.time, a: encode(b) },
    fill: best.fill, want: p.count, got: b.arrows.length,
    name: p.name, full: best.full, inBand: best.inBand, level: level
  };
}

/* ---------------- 输出 ---------------- */
function writeChunks(all) {
  const outDir = path.join(__dirname, '..', 'games', 'arrow-out', 'levels');
  fs.mkdirSync(outDir, { recursive: true });
  const chunks = {};
  all.forEach(function (lv) {
    const k = Math.floor((lv.level - 1) / 100) + 1;
    (chunks[k] || (chunks[k] = [])).push(lv.data);
  });
  Object.keys(chunks).forEach(function (k) {
    const file = path.join(outDir, 'l' + String(k).padStart(3, '0') + '.js');
    const body = 'window.GB_LEVEL_CHUNKS=window.GB_LEVEL_CHUNKS||{};' +
      'window.GB_LEVEL_CHUNKS[' + k + ']=' + JSON.stringify(chunks[k]) + ';';
    fs.writeFileSync(file, body);
  });
  return Object.keys(chunks).length;
}

function main() {
  const sample = process.argv[2] === 'sample';
  const levels = sample ? [1, 2, 3, 45, 90, 91, 200, 325, 326, 500, 501, 700, 701, 900, 901, 950, 1000] : [];
  const results = [];
  const t0 = Date.now();
  const seq = sample ? levels : Array.from({ length: 1000 }, function (_, i) { return i + 1; });
  seq.forEach(function (lv) {
    const r = generateLevel(lv);
    results.push(r);
    if (sample) {
      console.log(
        '关' + String(lv).padStart(4) + ' [' + r.name + '] ' +
        r.data.c + 'x' + r.data.r + ' 箭头 ' + r.got + '/' + r.want +
        ' 塞满 ' + (r.fill * 100).toFixed(1) + '%' +
        ' 折弯≤' + (lv <= 3 ? 0 : paramsFor(lv).bends) +
        (r.full && r.inBand ? ' OK' : ' !降级')
      );
    } else if (lv % 100 === 0) {
      process.stdout.write('.');
    }
  });
  const bad = results.filter(function (r) { return !r.full || !r.inBand; });
  if (!sample) {
    console.log('\n写块数：' + writeChunks(results));
  }
  console.log('\n总计 ' + results.length + ' 关，耗时 ' + ((Date.now() - t0) / 1000).toFixed(1) + 's');
  console.log('塞满率 ' + (Math.min.apply(null, results.map(function (r) { return r.fill; })) * 100).toFixed(1) +
    '% ~ ' + (Math.max.apply(null, results.map(function (r) { return r.fill; })) * 100).toFixed(1) + '%');
  console.log('未达标(降级/塞满越界) ' + bad.length + ' 关' +
    (bad.length ? '：' + bad.slice(0, 20).map(function (r) { return r.level; }).join(',') : ''));
}
main();

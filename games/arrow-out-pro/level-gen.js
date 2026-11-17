/*!
 * 箭头消除 · 高阶版（成人向）· 无限关卡运行时生成器（浏览器端）
 * ------------------------------------------------------------------
 * 与原版同源的「反向构造法 + 求解器复核 + 空腔填补」算法，但难度曲线完全不同：
 *   - 所有关卡都由本模块运行时生成，不使用预生成的入门关。
 *   - 第 1 关即 32×42 / 96 箭头起步（已超过原版第 1000 关的 28×37 / 60），
 *     随关号对数增长，约 800 关达到 76×102 / 280 后保持满配高难度。
 *   - 箭头绘制更细、纯黑系（见 index.html），同样盘面容纳更多箭头仍清晰可辨。
 *   - seed 仅由关号决定，同一关每次生成完全一致（可重试、可分享关号）。
 *   - 折弯预算从第 1 关即拉满，嵌套深度靠「初始可消箭头少 / 依赖层多」保持高难。
 *   - 反向构造天然保证可解，空腔填补后再跑求解器复核，绝不返回死局。
 * 暴露：window.ArrowLevelGen.generate(level) -> { c, r, t, a } | null
 *       window.ArrowLevelGen.paramsFor(level) -> 难度参数（调试用）
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ArrowLevelGen = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  var OPP = [2, 3, 0, 1];

  /* ===== 成人版难度曲线：所有关卡从大盘面高箭头起步，全程保持高难 =====
   * 第 1 关即 32×42 / 96（超过原版终关 28×37 / 60），随关号对数增长，
   * 约 800 关达到 76×102 / 280 满配后维持高难度。K=200 让前 200 关增速较快，
   * 玩家一开始就是高强度；满配后不再变大，避免手机生成过慢。 */
  var ADULT = {
    fromLevel: 1, K: 200, fullAt: 800,
    cols: [32, 76], rows: [42, 102], arrows: [96, 280],
    bends: [5, 6], time: [900, 1500], fill: [0.80, 0.82]
  };
  var ADULT_NAMES = ['黑带', '宗师', '深渊', '无尽', '传说'];
  function adultProgress(level) {
    var n = Math.max(0, level - ADULT.fromLevel);
    var denom = Math.log(1 + ADULT.fullAt / ADULT.K);
    return Math.min(1, Math.log(1 + n / ADULT.K) / denom);
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var rng = mulberry32(1);
  function ri(a, b) { return a + Math.floor(rng() * (b - a + 1)); }
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1)), t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }
  function lerp(a, b, t) { return Math.round(a + (b - a) * t); }
  function paramsFor(level) {
    level = Math.max(1, Math.floor(level));
    var pr = adultProgress(level);
    var nameIdx = Math.min(ADULT_NAMES.length - 1, Math.floor(pr * ADULT_NAMES.length));
    return {
      cols: lerp(ADULT.cols[0], ADULT.cols[1], pr),
      rows: lerp(ADULT.rows[0], ADULT.rows[1], pr),
      count: lerp(ADULT.arrows[0], ADULT.arrows[1], pr),
      bends: lerp(ADULT.bends[0], ADULT.bends[1], pr),
      time: lerp(ADULT.time[0], ADULT.time[1], pr),
      fill: ADULT.fill[0] + (ADULT.fill[1] - ADULT.fill[0]) * pr,
      name: ADULT_NAMES[nameIdx]
    };
  }

  function rayHit(r, c, dir, grid, R, C, ignoreId) {
    var dr = DIRS[dir][0], dc = DIRS[dir][1];
    r += dr; c += dc;
    while (r >= 0 && r < R && c >= 0 && c < C) {
      var v = grid[r * C + c];
      if (v !== -1 && v !== ignoreId) return true;
      r += dr; c += dc;
    }
    return false;
  }
  function arrowBlocked(a, grid, R, C, id) {
    var h = a.cells[a.cells.length - 1];
    return rayHit(h[0], h[1], a.dir, grid, R, C, id);
  }
  function tryMakeArrow(R, C, grid, wantLen, maxBends) {
    for (var attempt = 0; attempt < 600; attempt++) {
      var er, ec;
      if (rng() < 0.4) {
        var side = ri(0, 3);
        if (side === 0) { er = 0; ec = ri(0, C - 1); }
        else if (side === 1) { er = R - 1; ec = ri(0, C - 1); }
        else if (side === 2) { er = ri(0, R - 1); ec = 0; }
        else { er = ri(0, R - 1); ec = C - 1; }
      } else { er = ri(0, R - 1); ec = ri(0, C - 1); }
      if (grid[er * C + ec] !== -1) continue;
      var dir;
      if (attempt % 3 === 0) {
        var outs = [];
        if (er === 0) outs.push(0);
        if (er === R - 1) outs.push(2);
        if (ec === 0) outs.push(3);
        if (ec === C - 1) outs.push(1);
        dir = outs.length ? outs[ri(0, outs.length - 1)] : ri(0, 3);
      } else { dir = ri(0, 3); }
      if (rayHit(er, ec, dir, grid, R, C, -1)) continue;
      var back = OPP[dir], depth = 0, rr = er, cc = ec;
      while (true) {
        rr += DIRS[back][0]; cc += DIRS[back][1];
        if (rr < 0 || rr >= R || cc < 0 || cc >= C) break;
        depth++;
      }
      if (depth < 1) continue;
      var len = Math.max(2, Math.min(wantLen + ri(-1, 1), depth + 1));
      var cells = [[er, ec]], r = er, c = ec, lastBack = back, bends = 0;
      while (cells.length < len) {
        var dirs = rng() < 0.65
          ? [lastBack].concat(shuffle([0, 1, 2, 3]).filter(function (d) { return d !== lastBack; }))
          : shuffle([0, 1, 2, 3]);
        var moved = false;
        for (var i = 0; i < dirs.length; i++) {
          var d = dirs[i];
          if (d === OPP[lastBack]) continue;
          var nr = r + DIRS[d][0], nc = c + DIRS[d][1];
          if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
          if (grid[nr * C + nc] !== -1) continue;
          var dup = false;
          for (var k = 0; k < cells.length; k++) if (cells[k][0] === nr && cells[k][1] === nc) { dup = true; break; }
          if (dup) continue;
          var nb = d !== lastBack ? bends + 1 : bends;
          if (nb > maxBends) continue;
          cells.push([nr, nc]);
          if (d !== lastBack) bends = nb;
          lastBack = d; r = nr; c = nc; moved = true;
          break;
        }
        if (!moved) break;
      }
      if (cells.length < 2) continue;
      cells.reverse();
      return { cells: cells, dir: dir };
    }
    return null;
  }
  function buildOnce(p, level) {
    var R = p.rows, C = p.cols, N = p.count;
    var bends = p.bends; // 成人版：第 1 关即满折弯，不做新手简化
    var targetCells = Math.round(R * C * p.fill);
    var grid = new Int32Array(R * C).fill(-1), arrows = [], used = 0;
    for (var k = 0; k < N; k++) {
      var remainArrows = N - k, remainCells = Math.max(2, targetCells - used);
      var want0 = Math.max(3, Math.round(remainCells / remainArrows * 1.3));
      var cap = Math.max(5, Math.floor(Math.max(R, C) * 0.9)), placed = false;
      for (var relax = 0; relax < 9 && !placed; relax++) {
        var want = Math.max(2, Math.min(cap, want0 - Math.floor(relax / 2)));
        var a = tryMakeArrow(R, C, grid, want, bends);
        if (!a) continue;
        var id = arrows.length;
        for (var i = 0; i < a.cells.length; i++) grid[a.cells[i][0] * C + a.cells[i][1]] = id;
        arrows.push(a); used += a.cells.length; placed = true;
      }
      if (!placed) break;
    }
    return { R: R, C: C, arrows: arrows, used: used };
  }
  function solvable(board) {
    var R = board.R, C = board.C, arrows = board.arrows;
    var grid = new Int32Array(R * C).fill(-1);
    for (var id = 0; id < arrows.length; id++) {
      var cells = arrows[id].cells;
      for (var i = 0; i < cells.length; i++) grid[cells[i][0] * C + cells[i][1]] = id;
    }
    for (var j = arrows.length - 1; j >= 0; j--) {
      if (arrowBlocked(arrows[j], grid, R, C, j)) return false;
      var cs = arrows[j].cells;
      for (var m = 0; m < cs.length; m++) grid[cs[m][0] * C + cs[m][1]] = -1;
    }
    return true;
  }
  function fillGrid(board) {
    var grid = new Int32Array(board.R * board.C).fill(-1);
    board.arrows.forEach(function (a, id) { a.cells.forEach(function (p) { grid[p[0] * board.C + p[1]] = id; }); });
    return grid;
  }
  function openness(board) {
    var grid = fillGrid(board), R = board.R, C = board.C, n = 0;
    for (var id = 0; id < board.arrows.length; id++) if (!arrowBlocked(board.arrows[id], grid, R, C, id)) n++;
    return n;
  }
  function depth(board) {
    var grid = fillGrid(board), R = board.R, C = board.C, arrows = board.arrows, alive = [], i;
    for (i = 0; i < arrows.length; i++) alive.push(i);
    var inAlive = new Uint8Array(arrows.length).fill(1), rounds = 0;
    while (alive.length) {
      var clear = [];
      for (i = 0; i < alive.length; i++) { var id = alive[i]; if (!arrowBlocked(arrows[id], grid, R, C, id)) clear.push(id); }
      if (!clear.length) return -1;
      clear.forEach(function (id2) {
        arrows[id2].cells.forEach(function (p) { grid[p[0] * C + p[1]] = -1; });
        inAlive[id2] = 0;
      });
      alive = alive.filter(function (id3) { return inAlive[id3]; });
      rounds++;
    }
    return rounds;
  }
  /* 空隙填补：反向构造做到后期，空腔里的格子几乎都被四周箭头的射线「遮住」，
   * 无法再当新箭头的末端（末端射线必须畅通），于是留下大块空白。
   * 关键性质：把箭头放到消除序列的「最前面」（数组头部，最后才被消除）时，
   *   1) 它 id 最小、没有更低 id 的箭头挡它 —— 最后必然能飞出；
   *   2) 只要它的格子不落在其它任何箭头的射线上，就不会挡住别人。
   * 因此反复在「不在任何射线上」的安全空格里补箭头并头插，既能吃掉空腔，
   * 又不破坏可解性。方向挑选时避开会遮蔽更多安全格的朝向，尽量多填。 */
  function fillCavities(board, level) {
    var R = board.R, C = board.C, arrows = board.arrows.slice();
    var rnd = mulberry32((Math.imul(level, 2246822519) ^ 0x9e3779b9) >>> 0);
    function ri(a, b) { return a + Math.floor(rnd() * (b - a + 1)); }
    function shuf(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    var target = Math.round(R * C * 0.82);
    for (var iter = 0; iter < 520; iter++) {
      var grid = fillGrid({ R: R, C: C, arrows: arrows }), used = 0;
      for (var z = 0; z < R * C; z++) if (grid[z] !== -1) used++;
      if (used >= target) break;
      // 所有箭头射线覆盖到的空格（不含箭头自身格）标记为「不可用」
      var forb = new Uint8Array(R * C);
      arrows.forEach(function (a) {
        var h = a.cells[a.cells.length - 1], v = DIRS[a.dir];
        var r = h[0] + v[0], c = h[1] + v[1];
        while (r >= 0 && r < R && c >= 0 && c < C) {
          if (grid[r * C + c] === -1) forb[r * C + c] = 1;
          r += v[0]; c += v[1];
        }
      });
      var safe = new Uint8Array(R * C), sc = 0;
      for (var q = 0; q < R * C; q++) if (grid[q] === -1 && !forb[q]) { safe[q] = 1; sc++; }
      if (sc < 2) break;
      var best = null;
      for (var att = 0; att < 300; att++) {
        var hr = ri(0, R - 1), hc = ri(0, C - 1);
        if (!safe[hr * C + hc]) continue;
        var dirs = shuf([0, 1, 2, 3]);
        for (var di = 0; di < 4; di++) {
          var dir = dirs[di], back = OPP[dir];
          var cells = [[hr, hc]], r = hr, c = hc, lb = back, bends = 0, want = ri(8, 22);
          while (cells.length < want) {
            var order = rnd() < 0.7
              ? [lb].concat(shuf([0, 1, 2, 3]).filter(function (d) { return d !== lb; }))
              : shuf([0, 1, 2, 3]);
            var moved = false;
            for (var o = 0; o < order.length; o++) {
              var d = order[o];
              if (d === OPP[lb]) continue;
              var nr = r + DIRS[d][0], nc = c + DIRS[d][1];
              if (nr < 0 || nr >= R || nc < 0 || nc >= C || !safe[nr * C + nc]) continue;
              var dup = false;
              for (var k = 0; k < cells.length; k++) if (cells[k][0] === nr && cells[k][1] === nc) { dup = true; break; }
              if (dup) continue;
              var nb = d !== lb ? bends + 1 : bends;
              if (nb > 3) continue;
              cells.push([nr, nc]);
              if (d !== lb) bends = nb;
              lb = d; r = nr; c = nc; moved = true; break;
            }
            if (!moved) break;
          }
          if (cells.length < 2) continue;
          // 该填充箭头射线上还会遮蔽多少安全格（越少越好）
          var shadow = 0, rr = hr + DIRS[dir][0], cc = hc + DIRS[dir][1], own = {};
          cells.forEach(function (p) { own[p[0] * C + p[1]] = 1; });
          while (rr >= 0 && rr < R && cc >= 0 && cc < C) {
            if (safe[rr * C + cc] && !own[rr * C + cc]) shadow++;
            rr += DIRS[dir][0]; cc += DIRS[dir][1];
          }
          var score = cells.length * 3 - shadow * 2;
          if (!best || score > best.score) best = { cells: cells, dir: dir, score: score };
        }
      }
      if (!best) break;
      arrows.unshift({ cells: best.cells, dir: best.dir });
    }
    return { R: R, C: C, arrows: arrows };
  }
  function encode(board) {
    return board.arrows.map(function (a) {
      return a.dir + ',' + a.cells.map(function (p) { return p[0] + ',' + p[1]; }).join(',');
    });
  }

  /* 生成一关：换种子多次，挑「可解 + 箭头数达标 + 嵌套深/突破口少」的最佳者。
   * 运行时性能优先，TRIES 比离线版小；反向构造保证任意候选可解，故绝不返回死局。 */
  function generate(level) {
    level = Math.floor(level);
    var p = paramsFor(level);
    var fillLo = 0.66, fillHi = 0.82;   // 运行时略放宽，优先保证快且可解
    // 大盘面本身已足够复杂、且单次构造更耗时：按规模递减尝试次数（反向构造仍保证可解）
    var scale = (p.cols * p.rows) / (28 * 37);
    var TRIES = Math.max(18, Math.round(68 / Math.sqrt(scale)));
    var MAX_CAND = Math.max(3, Math.round(6 / Math.sqrt(scale)));
    var fallback = null, candidates = [];
    for (var t = 0; t < TRIES; t++) {
      rng = mulberry32((Math.imul(level, 2654435761) + Math.imul(t, 40503)) >>> 0);
      var board = buildOnce(p, level);
      if (!solvable(board)) continue;             // 反向构造下几乎不会发生，双保险
      if (board.arrows.length === 0) continue;
      var fill = board.used / (board.R * board.C);
      var full = board.arrows.length >= p.count;
      var inBand = fill >= fillLo && fill <= fillHi;
      if (full && inBand) {
        candidates.push({ board: board, fill: fill });
        if (candidates.length >= MAX_CAND) break;
      } else {
        var s = (full ? 100 : 0) - Math.abs(fill - p.fill) * 100;
        if (!fallback || s > fallback.s) fallback = { board: board, fill: fill, s: s };
      }
    }
    var best = fallback;
    if (candidates.length) {
      var top = -Infinity;
      candidates.forEach(function (c) {
        var open = openness(c.board), dep = depth(c.board);
        // 成年人难度：依赖层深、初始突破口少权重更高
        var sc = dep * 6 - open * 4 - Math.abs(c.fill - p.fill) * 100;
        if (sc > top) { top = sc; best = { board: c.board, fill: c.fill }; }
      });
    }
    if (!best) return null;
    // 填补反向构造留下的空腔，再复核一次可解性（失败则回退到未填补版本）
    var filled = fillCavities(best.board, level);
    if (!solvable(filled)) filled = best.board;
    var fg = fillGrid(filled), fused = 0;
    for (var fi = 0; fi < fg.length; fi++) if (fg[fi] !== -1) fused++;
    return {
      c: filled.C, r: filled.R, t: p.time,
      a: encode(filled),
      _meta: { name: p.name, arrows: filled.arrows.length, want: p.count, fill: +(fused / (filled.R * filled.C)).toFixed(3) }
    };
  }

  return { generate: generate, paramsFor: paramsFor, ADULT: ADULT };
});

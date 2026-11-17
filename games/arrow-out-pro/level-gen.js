/*!
 * 箭头消除 · 高阶版（成人向）· 无限关卡运行时生成器（浏览器端）
 * ------------------------------------------------------------------
 * 与原版同源的「反向构造法 + 求解器复核 + 空腔填补」算法，但难度曲线完全不同：
 *   - 所有关卡都由本模块运行时生成，不使用预生成的入门关。
 *   - 第 1 关即 32×42 / 96 箭头起步（已超过原版第 1000 关的 28×37 / 60），
 *     随关号对数增长，约 800 关达到 76×102 / 280 后保持满配高难度。
 *   - 箭头绘制更细、纯黑系（见 index.html），同样盘面容纳更多箭头仍清晰可辨。
 *   - seed 仅由关号决定，同一关每次生成完全一致（可重试、可分享关号）。
 *   - 折弯预算从第 1 关即拉满（16→26 折）；箭身中段全程只走垂直拐弯、零直线段
 *     （无 3 点共线），但「箭头头部直入直出」——第一段沿朝向正后方直行，三角头与
 *     身体成一条直线、清晰易辨；中段用射线覆盖热度引导横穿彼此弹道。
 *   - 8 方向（上下左右 + 4 斜向）：稀缺优先 + 局部邻域去同向使八向各约 12.5%，
 *     头部邻域同向率较 4 向版大幅下降；斜向射线斜穿棋盘、遮挡关系更复杂，
 *     中段走位仍只走垂直方向保持零直线段、头部直入直出。
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

  // 8方向（顺时针）：0上 1右上 2右 3右下 4下 5左下 6左 7左上
  var DIRS = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];
  var OPP = [4,5,6,7,0,1,2,3]; // 对向 = (d+4)%8

  /* ===== 成人版难度曲线：所有关卡从大盘面高箭头起步，全程保持高难 =====
   * 第 1 关即 32×42 / 96（超过原版终关 28×37 / 60），随关号对数增长，
   * 约 800 关达到 76×102 / 280 满配后维持高难度。K=200 让前 200 关增速较快，
   * 玩家一开始就是高强度；满配后不再变大，避免手机生成过慢。 */
  var ADULT = {
    fromLevel: 1, K: 200, fullAt: 800,
    cols: [32, 76], rows: [42, 102], arrows: [96, 280],
    bends: [16, 26], time: [900, 1500], fill: [0.80, 0.82]
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
  function tryMakeArrow(R, C, grid, wantLen, maxBends, rayCover, dirBalance, headDir) {
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
      // 八方向动态均衡：稀缺优先 + 局部邻域去同向（正交4向 + 斜向4向）。
      // 旧版仅4向，相邻同向率偏高且难度有上限；引入斜向后射线可斜穿棋盘、
      // 遮挡关系更复杂，方向有8种使同向率进一步下降、难度显著提升。
      if (dirBalance) {
        // 8方向到边界的射线长度：正交用行/列距离，斜向取行列较小值
        var reach = [
          er, Math.min(er, C - 1 - ec), C - 1 - ec, Math.min(R - 1 - er, C - 1 - ec),
          R - 1 - er, Math.min(R - 1 - er, ec), ec, Math.min(er, ec)
        ];
        var maxReach = 1;
        for (var mr = 0; mr < 8; mr++) if (reach[mr] > maxReach) maxReach = reach[mr];
        // 局部邻域方向热度：半径2内每个箭头头按距离衰减投票
        var localCnt = [0, 0, 0, 0, 0, 0, 0, 0];
        if (headDir) {
          for (var dr = -2; dr <= 2; dr++) for (var dc = -2; dc <= 2; dc++) {
            if (dr === 0 && dc === 0) continue;
            var nr = er + dr, nc = ec + dc;
            if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
            var hd = headDir[nr * C + nc];
            if (hd >= 0) localCnt[hd] += 1 / (1 + dr * dr + dc * dc);
          }
        }
        var w = [0, 0, 0, 0, 0, 0, 0, 0], wsum = 0;
        for (var dd = 0; dd < 8; dd++) {
          var localPenalty = 1 / (1 + localCnt[dd] * 1.6); // 邻域同向越多、权重越低
          w[dd] = (1 / (dirBalance[dd] + 1)) * (0.9 + 0.2 * (reach[dd] / maxReach)) * localPenalty;
          wsum += w[dd];
        }
        var pick = rng() * wsum;
        dir = 7;
        for (var dd = 0; dd < 8; dd++) { pick -= w[dd]; if (pick <= 0) { dir = dd; break; } }
      } else {
        dir = ri(0, 7);
      }
      if (rayHit(er, ec, dir, grid, R, C, -1)) continue;
      var back = OPP[dir], depth = 0, rr = er, cc = ec;
      while (true) {
        rr += DIRS[back][0]; cc += DIRS[back][1];
        if (rr < 0 || rr >= R || cc < 0 || cc >= C) break;
        depth++;
      }
      if (depth < 1) continue;
      var len = Math.max(2, Math.min(wantLen + ri(-1, 1), depth + 1));
      var cells = [[er, ec]], r = er, c = ec, lastBack = back, bends = 0, straightRun = 0;
      while (cells.length < len) {
        var dirs;
        if (cells.length === 1) {
          // 箭头头部直入直出：第一段箭身沿朝向正后方直行，让三角箭头头与身体成一条直线，
          // 尖端不拐 L 形弯、清晰易辨（中段仍全程拐弯、零直线段）。
          dirs = [back];
        } else {
          // 中段只走「垂直于当前方向」的拐弯方向（8方向下垂直=±90°即+2/+6 mod8），
          // 零直线段；正交箭头走正交折线、斜向箭头走斜线折线，各自方向一致不共线。
          // 且优先朝「已被别的箭头射线覆盖」的格子拐，横穿他人弹道制造遮挡依赖。
          var perps = [(lastBack + 2) % 8, (lastBack + 6) % 8];
          var hot = function (d) {
            var nr = r + DIRS[d][0], nc = c + DIRS[d][1];
            if (nr < 0 || nr >= R || nc < 0 || nc >= C) return -1;
            return rayCover ? rayCover[nr * C + nc] : 0;
          };
          dirs = perps.slice();
          if (rng() < 0.97) dirs.sort(function (x, y) { return hot(y) - hot(x); });
          else shuffle(dirs);
        }
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
          if (nb > maxBends) break;
          cells.push([nr, nc]);
          if (d !== lastBack) { bends = nb; straightRun = 0; }
          else straightRun++;
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
    // 射线覆盖热度图：每放一个箭头，把它尖端射线上经过的格子热度 +1；
    // 后续箭头优先朝高热度格拐弯，从而反复横穿已有弹道 → 互相包含更多。
    var rayCover = new Int32Array(R * C);
    var dirBalance = [0, 0, 0, 0, 0, 0, 0, 0]; // 八方向已用计数：供 tryMakeArrow 做稀缺优先均衡
    var headDir = new Int8Array(R * C).fill(-1); // 每格箭头头朝向(空格-1)：供局部邻域去同向
    for (var k = 0; k < N; k++) {
      var remainArrows = N - k, remainCells = Math.max(2, targetCells - used);
      var want0 = Math.max(3, Math.round(remainCells / remainArrows * 1.3));
      var cap = Math.max(5, Math.floor(Math.max(R, C) * 0.9)), placed = false;
      for (var relax = 0; relax < 9 && !placed; relax++) {
        var want = Math.max(2, Math.min(cap, want0 - Math.floor(relax / 2)));
        var a = tryMakeArrow(R, C, grid, want, bends, rayCover, dirBalance, headDir);
        if (!a) continue;
        dirBalance[a.dir]++;
        var id = arrows.length;
        for (var i = 0; i < a.cells.length; i++) grid[a.cells[i][0] * C + a.cells[i][1]] = id;
        // 沿新箭头尖端射线，把经过的空格热度 +1（遇到已占用格即止）
        var hh = a.cells[a.cells.length - 1], vv = DIRS[a.dir];
        headDir[hh[0] * C + hh[1]] = a.dir; // 记录头部朝向，供后续箭头局部避让
        var rr = hh[0] + vv[0], cc = hh[1] + vv[1];
        while (rr >= 0 && rr < R && cc >= 0 && cc < C && grid[rr * C + cc] === -1) {
          rayCover[rr * C + cc]++;
          rr += vv[0]; cc += vv[1];
        }
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
  /* 逐层剥离画像：模拟每层「清空当前所有可消箭头」，统计
   *   first = 第一层可消数（初始突破口，越少越好，理想 1）
   *   maxLayer = 单层最多可消数（越少越好，理想 1）
   *   singles = 恰好只有 1 个突破口的比例（越高越接近「每层一个」）
   *   rounds = 层深（越大越好，理想=箭头数）
   * 用于筛选：优先挑「突破口集中在单箭头」的盘面，逼近每层仅一个突破口。 */
  function layerProfile(board) {
    var grid = fillGrid(board), R = board.R, C = board.C, arrows = board.arrows;
    var alive = [], i;
    for (i = 0; i < arrows.length; i++) alive.push(i);
    var inAlive = new Uint8Array(arrows.length).fill(1), rounds = 0;
    var first = 0, maxLayer = 0, singles = 0;
    while (alive.length) {
      var clear = [];
      for (i = 0; i < alive.length; i++) { var id = alive[i]; if (!arrowBlocked(arrows[id], grid, R, C, id)) clear.push(id); }
      if (!clear.length) return null;
      if (rounds === 0) first = clear.length;
      if (clear.length > maxLayer) maxLayer = clear.length;
      if (clear.length === 1) singles++;
      clear.forEach(function (id2) {
        arrows[id2].cells.forEach(function (p) { grid[p[0] * C + p[1]] = -1; });
        inAlive[id2] = 0;
      });
      alive = alive.filter(function (id3) { return inAlive[id3]; });
      rounds++;
    }
    return { first: first, maxLayer: maxLayer, singles: singles, rounds: rounds };
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
    var dirBalance = [0, 0, 0, 0, 0, 0, 0, 0]; // 承接主生成器的方向分布，填补阶段继续做八向均衡
    arrows.forEach(function (a) { dirBalance[a.dir]++; });
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
      // 头部朝向图：本轮所有箭头头的位置→方向，供局部去同向（相邻朝向交错）
      var headDir = new Int8Array(R * C).fill(-1);
      arrows.forEach(function (a) { var h = a.cells[a.cells.length - 1]; headDir[h[0] * C + h[1]] = a.dir; });
      var best = null;
      for (var att = 0; att < 300; att++) {
        var hr = ri(0, R - 1), hc = ri(0, C - 1);
        if (!safe[hr * C + hc]) continue;
        // 方向也按「射线尽早撞到已有箭身」排序：朝内部的射线上可能已有箭身，
        // 选 shadow 小的方向 = 自身更可能被挡，减少新增突破口。
        var dirs = shuf([0, 1, 2, 3, 4, 5, 6, 7]);
        dirs.sort(function (a, b) {
          function blk(d) {
            var rr = hr + DIRS[d][0], cc = hc + DIRS[d][1];
            while (rr >= 0 && rr < R && cc >= 0 && cc < C) {
              if (grid[rr * C + cc] !== -1) return 1; // 前方遇到箭身→该箭头会被挡
              rr += DIRS[d][0]; cc += DIRS[d][1];
            }
            return 0;
          }
          return blk(b) - blk(a);
        });
        for (var di = 0; di < 8; di++) {
          var dir = dirs[di], back = OPP[dir];
          var cells = [[hr, hc]], r = hr, c = hc, lb = back, bends = 0, want = ri(8, 22), straightRun = 0;
          while (cells.length < want) {
            // 与主生成器一致：头部直入直出、中段零直线拐弯（8方向±90°垂直）
            var perps2 = [(lb + 2) % 8, (lb + 6) % 8];
            var order = cells.length === 1 ? [back] : shuf(perps2.slice());
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
              if (nb > 24) break;
              cells.push([nr, nc]);
              if (d !== lb) { bends = nb; straightRun = 0; }
              else straightRun++;
              lb = d; r = nr; c = nc; moved = true; break;
            }
            if (!moved) break;
          }
          if (cells.length < 2) continue;
          cells.reverse(); // 头部落在构造起点 (hr,hc)，箭身自尖端垂直伸出（无直线段）
          // 该填充箭头射线上还会遮蔽多少安全格（越少越好）
          var shadow = 0, rr = hr + DIRS[dir][0], cc = hc + DIRS[dir][1], own = {};
          cells.forEach(function (p) { own[p[0] * C + p[1]] = 1; });
          while (rr >= 0 && rr < R && cc >= 0 && cc < C) {
            if (safe[rr * C + cc] && !own[rr * C + cc]) shadow++;
            rr += DIRS[dir][0]; cc += DIRS[dir][1];
          }
          // 方向均衡：稀缺方向给正奖励，避免填补阶段堆积同向箭头（大片同向的最大来源）。
          var avgDir = (dirBalance[0] + dirBalance[1] + dirBalance[2] + dirBalance[3]
                      + dirBalance[4] + dirBalance[5] + dirBalance[6] + dirBalance[7]) / 8;
          var balBonus = (avgDir - dirBalance[dir]) * 2.5; // 用得越少奖励越高
          // 局部去同向：候选点半径2内与该方向相同的头部越多，惩罚越大（距离衰减）
          var localSame = 0;
          for (var dr2 = -2; dr2 <= 2; dr2++) for (var dc2 = -2; dc2 <= 2; dc2++) {
            if (dr2 === 0 && dc2 === 0) continue;
            var nr2 = hr + dr2, nc2 = hc + dc2;
            if (nr2 < 0 || nr2 >= R || nc2 < 0 || nc2 >= C) continue;
            if (headDir[nr2 * C + nc2] === dir) localSame += 1 / (1 + dr2 * dr2 + dc2 * dc2);
          }
          var localPenalty = localSame * 9;
          var score = cells.length * 3 - shadow * 2 + balBonus - localPenalty;
          if (!best || score > best.score) best = { cells: cells, dir: dir, score: score };
        }
      }
      if (!best) break;
      arrows.unshift({ cells: best.cells, dir: best.dir });
      dirBalance[best.dir]++;
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
    var MAX_CAND = Math.max(4, Math.round(9 / Math.sqrt(scale)));
    var fallback = null, candidates = [];
    // 两阶段：先用未填补盘面的画像快速粗筛出少量候选（填补很贵，只做少数），
    // 再对这些候选做空腔填补并对「最终盘面」精算打分。
    function quickScore(board) {
      var prof = layerProfile(board);
      if (!prof) return -Infinity;
      // 首层突破口权重翻倍：优先挑开局可下手箭头最少的盘面
      return prof.rounds * 10 + prof.singles * 6 - prof.first * 8 - prof.maxLayer * 3;
    }
    for (var t = 0; t < TRIES; t++) {
      rng = mulberry32((Math.imul(level, 2654435761) + Math.imul(t, 40503)) >>> 0);
      var board = buildOnce(p, level);
      if (!solvable(board)) continue;             // 反向构造下几乎不会发生，双保险
      if (board.arrows.length === 0) continue;
      var fill = board.used / (board.R * board.C);
      var full = board.arrows.length >= p.count;
      var inBand = fill >= fillLo && fill <= fillHi;
      var item = { board: board, fill: fill, quick: quickScore(board) };
      if (full && inBand) {
        candidates.push(item);
      } else {
        var s = (full ? 100 : 0) - Math.abs(fill - p.fill) * 100;
        if (!fallback || s > fallback.s) { fallback = item; fallback.s = s; }
      }
    }
    // 取粗分最高的少数做填补 + 精算
    candidates.sort(function (a, b) { return b.quick - a.quick; });
    var pool = candidates.slice(0, MAX_CAND);
    if (!pool.length && fallback) pool = [fallback];
    var best = null, top = -Infinity;
    pool.forEach(function (c) {
      // 填补空腔并复核可解性（失败则回退未填补版本）
      var filled = fillCavities(c.board, level);
      if (!solvable(filled)) filled = c.board;
      var fg = fillGrid(filled), fused = 0;
      for (var fi = 0; fi < fg.length; fi++) if (fg[fi] !== -1) fused++;
      var finalFill = fused / (filled.R * filled.C);
      var prof = layerProfile(filled);
      if (!prof) return;
      // 成年难度：层深/单突破口圈越多越好、每圈突破口(first/maxLayer)越少越难
      var sc = prof.rounds * 10 + prof.singles * 6 - prof.first * 8 - prof.maxLayer * 3
             - Math.abs(finalFill - p.fill) * 60;
      if (sc > top) { top = sc; best = { board: filled, fill: finalFill }; }
    });
    if (!best && fallback) best = { board: fallback.board, fill: fallback.fill };
    if (!best) return null;
    var out = best.board;
    return {
      c: out.C, r: out.R, t: p.time,
      a: encode(out),
      _meta: { name: p.name, arrows: out.arrows.length, want: p.count, fill: +(best.fill).toFixed(3) }
    };
  }

  return { generate: generate, paramsFor: paramsFor, ADULT: ADULT };
});

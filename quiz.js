/* =====================================================================
 * 🎮 GameBox 公共「定时做题」模块  quiz.js
 * ---------------------------------------------------------------------
 * 【维护说明】所有子游戏共用本文件，改这一处即可全站生效。
 *   1) QUIZ_INTERVAL_SECONDS —— 弹题间隔（秒）
 *   2) QUESTION_TYPES        —— 题型注册表，新增题型只写一个函数并加入数组
 *      · 选择题：返回 { ..., options: [4 个选项] }，玩家点选
 *      · 输入题：返回 { ..., input: true }，玩家自己输入数字（如顺位填空）
 *      当前题型：十以内加法 / 十以内减法 / 奇数·偶数顺数填空（随机出现）
 *   3) 下方样式字符串          —— 弹窗外观
 *
 * 【接入方式】每个游戏页面引入本文件后调用一次：
 *   <script src="../../quiz.js"></script>
 *   <script> GameQuiz.init({ ... }); </script>
 *   init 可选参数：
 *     interval   : 弹题间隔秒数（覆盖默认值）
 *     isPlaying  : function()->bool，是否在游戏中（不在游戏中不弹题）
 *     onOpen     : function()，弹窗打开时调用（用于暂停游戏）
 *     onClose    : function()，弹窗关闭时调用（用于恢复游戏）
 *     onReward   : function()，答对时调用（用于给游戏加分，可选）
 *     speech     : 是否朗读题目（默认 true）
 * 也暴露 GameQuiz.open() / GameQuiz.close() 供手动触发（调试用）。
 *
 * 【练习模式】独立的做题练习页（practice/）使用，连续出题、答对自动下一题：
 *   GameQuiz.startPractice({
 *     speech  : 是否朗读（默认 true）
 *     onScore : function(stats){...}，每题作答后回调，stats={total,correct,wrong,rate}
 *     onExit  : function()，点击「结束练习」时回调（练习页用于返回主页）
 *   });
 *   GameQuiz.stopPractice() —— 结束练习、关闭弹窗。
 * 统计口径：每道新题首次作答计 1 题；首次答对记「答对」，首次答错记「需再想」（可重试）。
 * ===================================================================== */
(function () {
  "use strict";
  if (window.GameQuiz) return;

  /* ---------- 全局配置：维护这里即可 ---------- */
  var QUIZ_INTERVAL_SECONDS = 300; // 每 5 分钟弹一道题
  var OPTIONS_COUNT = 4;           // 每题选项数

  /* ---------- 工具函数 ---------- */
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function cn(n) {
    var m = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
    return (n >= 0 && n <= 10) ? m[n] : String(n);
  }
  function pickUnique(pool, exclude, count) {
    var out = [], p = pool.slice();
    shuffle(p);
    for (var i = 0; i < p.length && out.length < count; i++) {
      if (exclude.indexOf(p[i]) < 0 && out.indexOf(p[i]) < 0) out.push(p[i]);
    }
    return out;
  }

  /* ==================================================================
   * 题型注册表：新增题型的唯一入口
   * 每个函数返回 { title, text, speech, correct, options }
   * ================================================================== */

  // 题型 1：十以内加法
  function additionQuestion() {
    var a, b;
    do { a = rnd(1, 9); b = rnd(1, 9); } while (a + b > 10);
    var correct = a + b;
    var pool = [];
    for (var i = 0; i <= 10; i++) pool.push(i);
    var opts = [correct].concat(pickUnique(pool, [correct], OPTIONS_COUNT - 1));
    return {
      title: "来做一道加法题吧！",
      text: a + " + " + b + " = ?",
      speech: "来做一道加法题，" + cn(a) + "加" + cn(b) + "等于几？",
      correct: correct,
      options: shuffle(opts)
    };
  }

  // 题型 2：十以内减法（选择题）
  function subtractionQuestion() {
    var a = rnd(2, 10);          // 被减数 2~10
    var b = rnd(1, a);           // 减数 1~a，保证结果 >= 0 且都在 10 以内
    var correct = a - b;
    var pool = [];
    for (var i = 0; i <= 10; i++) pool.push(i);
    var opts = [correct].concat(pickUnique(pool, [correct], OPTIONS_COUNT - 1));
    return {
      title: "来做一道减法题吧！",
      text: a + " − " + b + " = ?",
      speech: "来做一道减法题，" + cn(a) + "减" + cn(b) + "等于几？",
      correct: correct,
      options: shuffle(opts)
    };
  }

  // 题型 3：奇数/偶数顺数填空（输入题，不提供选项）
  // 贴合小朋友学习进度：只出 10 以内的单数(1,3,5,7,9)或双数(2,4,6,8,10)顺数，
  // 公差固定为 2。如 1、3、_、7 或 2、4、6、_
  function sequenceQuestion() {
    var isOdd = Math.random() < 0.5;            // 单数 or 双数
    // 起始值限定，保证 4 项都在 10 以内：奇数 1/3，偶数 2/4
    var start = isOdd ? (Math.random() < 0.5 ? 1 : 3) : (Math.random() < 0.5 ? 2 : 4);
    var len = 4;                                // 共 4 个数
    var seq = [];
    for (var i = 0; i < len; i++) seq.push(start + 2 * i);   // 公差 2
    var blank = rnd(1, len - 1);                // 挖空位置 1~3（末尾也可，如 2、4、6、_）
    var correct = seq[blank];

    var parts = seq.map(function (n, idx) { return idx === blank ? "_" : n; });
    var spoken = seq.map(function (n, idx) { return idx === blank ? "空" : cn(n); }).join("、");
    var kind = isOdd ? "单数" : "双数";          // 口语化，配合学习进度
    return {
      title: "找规律：" + kind + "排排队",
      text: parts.join("、"),
      speech: "看一看" + kind + "的顺序，" + spoken + "，空格里应该填几？",
      correct: correct,
      input: true   // 输入题：不显示选项，让小朋友自己输入数字
    };
  }

  // 题型注册表：加法、减法、顺位填空随机出现
  var QUESTION_TYPES = [additionQuestion, subtractionQuestion, sequenceQuestion];

  /* ---------- 语音 & 音效（公共自带，不依赖各游戏） ---------- */
  function speak(text, on) {
    if (on === false) return;
    try {
      if (!window.speechSynthesis) return;
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "zh-CN"; u.rate = 0.95; u.pitch = 1.2;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }
  var actx = null;
  function beep(freq, dur, type) {
    try {
      if (!actx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        actx = new AC();
      }
      if (actx.state === "suspended") actx.resume();
      var o = actx.createOscillator(), g = actx.createGain();
      o.type = type || "sine"; o.frequency.value = freq;
      o.connect(g).connect(actx.destination);
      var t = actx.currentTime;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.start(t); o.stop(t + dur + 0.02);
    } catch (e) {}
  }
  function chimeOK() { beep(660, .14, "sine"); setTimeout(function () { beep(880, .14, "sine"); }, 130); setTimeout(function () { beep(1320, .22, "triangle"); }, 260); }
  function buzz() { beep(240, .18, "sine"); }

  /* ---------- 弹窗样式（维护这里可改外观） ---------- */
  var CSS = [
    ".gq-mask{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;",
    "  background:rgba(18,28,48,.62);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);padding:18px;}",
    ".gq-card{background:#fff;border-radius:28px;padding:24px 22px 26px;width:min(92vw,460px);text-align:center;",
    "  box-shadow:0 16px 44px rgba(0,0,0,.4);animation:gqIn .3s cubic-bezier(.2,1.3,.4,1);}",
    "@keyframes gqIn{from{transform:scale(.8);opacity:0}to{transform:scale(1);opacity:1}}",
    ".gq-emoji{font-size:46px;line-height:1;margin-bottom:4px;display:flex;gap:10px;justify-content:center;align-items:center;}",
    ".gq-emoji [data-icon] svg{width:52px;height:52px;display:block;}",
    ".gq-score [data-icon]{display:inline-flex;vertical-align:-2px;} .gq-score [data-icon] svg{width:1.15em;height:1.15em;}",
    ".gq-action [data-icon]{display:inline-flex;vertical-align:-2px;} .gq-action [data-icon] svg{width:1.1em;height:1.1em;}",
    ".gq-msg [data-icon]{display:inline-flex;vertical-align:-3px;} .gq-msg [data-icon] svg{width:1.2em;height:1.2em;}",
    ".gq-title{font-size:clamp(20px,5.5vw,26px);color:#3a6ea5;margin:2px 0 10px;font-weight:800;}",
    ".gq-q{font-size:clamp(38px,11vw,58px);font-weight:900;color:#FB8C00;letter-spacing:3px;margin:8px 0 18px;}",
    ".gq-opts{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;}",
    ".gq-opt{width:88px;height:88px;font-size:38px;font-weight:900;color:#fff;border:none;border-radius:22px;",
    "  cursor:pointer;box-shadow:0 7px 0 rgba(0,0,0,.18);transition:transform .08s;}",
    ".gq-opt:active{transform:translateY(4px);box-shadow:0 3px 0 rgba(0,0,0,.18);}",
    ".gq-opt:disabled{opacity:.65;}",
    ".gq-opt.c0{background:linear-gradient(180deg,#4FC3F7,#29B6F6);}",
    ".gq-opt.c1{background:linear-gradient(180deg,#81C784,#66BB6A);}",
    ".gq-opt.c2{background:linear-gradient(180deg,#FFB74D,#FFA726);}",
    ".gq-opt.c3{background:linear-gradient(180deg,#BA68C8,#AB47BC);}",
    ".gq-opt.shake{animation:gqShake .4s;}",
    "@keyframes gqShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-9px)}75%{transform:translateX(9px)}}",
    /* 输入题样式：大号数字输入框 + 确定按钮（手机调出数字键盘） */
    ".gq-input-wrap{display:flex;flex-direction:column;align-items:center;gap:18px;}",
    ".gq-input{width:150px;height:98px;font-size:54px;font-weight:900;color:#FB8C00;text-align:center;",
    "  border:5px solid #FFB74D;border-radius:22px;outline:none;background:#FFF9F0;box-sizing:border-box;",
    "  -moz-appearance:textfield;}",
    ".gq-input::-webkit-outer-spin-button,.gq-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}",
    ".gq-input:focus{border-color:#FB8C00;box-shadow:0 0 0 5px rgba(251,140,0,.22);}",
    ".gq-input.shake{animation:gqShake .4s;}",
    ".gq-submit{padding:14px 46px;font-size:27px;font-weight:900;color:#fff;border:none;border-radius:20px;",
    "  background:linear-gradient(180deg,#81C784,#4CAF50);box-shadow:0 6px 0 #388E3C;cursor:pointer;}",
    ".gq-submit:active{transform:translateY(4px);box-shadow:0 2px 0 #388E3C;}",
    ".gq-msg{font-size:20px;font-weight:800;margin-top:18px;min-height:28px;color:#4a7ab0;}",
    /* 练习模式：统计条 + 底部操作按钮 */
    ".gq-score{display:flex;flex-wrap:wrap;gap:6px 16px;justify-content:center;margin-bottom:14px;",
    "  font-size:16px;font-weight:800;color:#5a6b7b;background:#f0f6ff;border-radius:16px;padding:10px 14px;}",
    ".gq-score .sc b{color:#FB8C00;font-size:20px;}",
    ".gq-score .ok b{color:#2E7D32;} .gq-score .no b{color:#EF6C00;}",
    ".gq-actions{display:flex;gap:12px;justify-content:center;margin-top:18px; flex-wrap:wrap;}",
    ".gq-action{border:none;border-radius:16px;padding:12px 22px;font-size:18px;font-weight:800;cursor:pointer;",
    "  box-shadow:0 5px 0 rgba(0,0,0,.14);color:#fff;}",
    ".gq-action:active{transform:translateY(3px);box-shadow:0 2px 0 rgba(0,0,0,.14);}",
    ".gq-action.skip{background:linear-gradient(180deg,#64B5F6,#42A5F5);}",
    ".gq-action.exit{background:linear-gradient(180deg,#FFB74D,#FB8C00);}"
  ].join("");

  /* ---------- 状态 ---------- */
  var cfg = {}, opened = false, elapsed = 0, current = null, mask = null, timer = null;
  /* 练习模式状态 */
  var practice = false;              // 是否处于练习模式
  var practiceCfg = {};             // 练习模式配置
  var stat = { total: 0, right: 0, wrong: 0 };  // 练习统计
  var answeredCurrent = false;      // 当前题是否已计入统计（避免重试重复计数）

  function injectDOM() {
    if (document.getElementById("gqMask")) { mask = document.getElementById("gqMask"); return; }
    var st = document.createElement("style");
    st.textContent = CSS;
    document.head.appendChild(st);
    mask = document.createElement("div");
    mask.id = "gqMask";
    mask.className = "gq-mask";
    mask.style.display = "none";
    mask.innerHTML =
      '<div class="gq-card">' +
      '  <div class="gq-score" id="gqScore" style="display:none">' +
      '    <span class="sc">已做 <b id="gqTotal">0</b> 题</span>' +
      '    <span class="ok"><span data-icon="check"></span> <b id="gqRight">0</b></span>' +
      '    <span class="no"><span data-icon="refresh"></span> <b id="gqWrong">0</b></span>' +
      '    <span class="sc">正确率 <b id="gqRate">0%</b></span>' +
      '  </div>' +
      '  <div class="gq-emoji"><span data-icon="pencil" data-mode="badge"></span> <span data-icon="brain" data-mode="badge"></span></div>' +
      '  <div class="gq-title" id="gqTitle">来做一道题吧！</div>' +
      '  <div class="gq-q" id="gqQ">?</div>' +
      '  <div class="gq-opts" id="gqOpts"></div>' +
      '  <div class="gq-msg" id="gqMsg"></div>' +
      '  <div class="gq-actions" id="gqActions" style="display:none">' +
      '    <button class="gq-action skip" id="gqSkip"><span data-icon="refresh"></span> 换一题</button>' +
      '    <button class="gq-action exit" id="gqExit"><span data-icon="home"></span> 结束练习</button>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(mask);
    // 用公共图标库填充弹窗里的 data-icon 占位符（icons.js 已在各游戏页先于本脚本加载）
    if (window.GameIcons && GameIcons.decorate) GameIcons.decorate();
    document.getElementById("gqSkip").addEventListener("click", function () {
      if (practice) { answeredCurrent = true; renderCurrentQuestion(); }
    });
    document.getElementById("gqExit").addEventListener("click", function () {
      var onExit = practiceCfg.onExit;   // 先保存，stopPractice 会清空 practiceCfg
      stopPractice();
      if (typeof onExit === "function") onExit();
    });
  }

  /* 生成并渲染一道新题（练习模式和定时模式共用） */
  function renderCurrentQuestion() {
    var maker = QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)];
    current = maker();
    answeredCurrent = false;
    document.getElementById("gqTitle").textContent = current.title;
    document.getElementById("gqQ").textContent = current.text;
    var msg = document.getElementById("gqMsg");
    msg.textContent = ""; msg.style.color = "#4a7ab0";

    var box = document.getElementById("gqOpts");
    box.innerHTML = "";
    if (current.input) {
      /* 输入题：数字输入框 + 确定按钮，不提供选项 */
      box.className = "gq-input-wrap";
      var inp = document.createElement("input");
      inp.type = "number";
      inp.inputMode = "numeric";        // 手机调出数字键盘
      inp.pattern = "[0-9]*";
      inp.className = "gq-input";
      inp.id = "gqInput";
      inp.autocomplete = "off";
      var sub = document.createElement("button");
      sub.className = "gq-submit";
      sub.textContent = "确定";
      sub.addEventListener("click", submitInput);
      inp.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.keyCode === 13) submitInput();
      });
      box.appendChild(inp);
      box.appendChild(sub);
      setTimeout(function () { try { inp.focus(); } catch (e) {} }, 80); // 自动聚焦，方便直接输入
    } else {
      /* 选择题：4 个彩色选项按钮 */
      box.className = "gq-opts";
      current.options.forEach(function (v, i) {
        var b = document.createElement("button");
        b.className = "gq-opt c" + i;
        b.textContent = v;
        b.addEventListener("click", function () { resolve(v, b); });
        box.appendChild(b);
      });
    }
    speak(current.speech, cfg.speech);
  }

  function open() {
    if (opened) return;
    injectDOM();
    opened = true;
    if (typeof cfg.onOpen === "function") cfg.onOpen();
    renderCurrentQuestion();
    mask.style.display = "flex";
  }

  /* 读取输入框的值并提交判定 */
  function submitInput() {
    if (!opened || !current || !current.input) return;
    var inp = document.getElementById("gqInput");
    if (!inp || inp.disabled) return;
    var raw = String(inp.value).trim();
    if (raw === "") {                 // 还没输入，提示一下
      var msg = document.getElementById("gqMsg");
      msg.style.color = "#EF6C00";
      msg.textContent = "先输入一个数字哦～";
      inp.classList.remove("shake"); void inp.offsetWidth; inp.classList.add("shake");
      return;
    }
    resolve(parseInt(raw, 10), inp);
  }

  /* 更新练习统计条并回调页面 */
  function refreshScore() {
    var rate = stat.total ? Math.round(stat.right / stat.total * 100) : 0;
    var set = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
    set("gqTotal", stat.total); set("gqRight", stat.right);
    set("gqWrong", stat.wrong); set("gqRate", rate + "%");
    if (typeof practiceCfg.onScore === "function") {
      practiceCfg.onScore({ total: stat.total, right: stat.right, wrong: stat.wrong, rate: rate });
    }
  }

  /* 统一的判定逻辑：val 为作答值，shakeEl 为答错时抖动的元素 */
  function resolve(val, shakeEl) {
    if (!opened || !current) return;
    var msg = document.getElementById("gqMsg");
    var isRight = (val === current.correct);

    /* 练习模式：每题首次作答计入统计 */
    if (practice && !answeredCurrent) {
      answeredCurrent = true;
      stat.total++;
      if (isRight) stat.right++; else stat.wrong++;
      refreshScore();
    }

    function ico(n) { return window.GameIcons ? GameIcons.symbol(n) : ""; }
    if (isRight) {
      msg.style.color = "#2E7D32";
      msg.innerHTML = ico("check") + " 答对啦！你真棒 " + ico("party");
      chimeOK(); speak("答对啦，你真棒！", cfg.speech);
      if (typeof cfg.onReward === "function") cfg.onReward();
      var items = document.getElementById("gqOpts").children;
      for (var i = 0; i < items.length; i++) items[i].disabled = true;
      setTimeout(function () {
        if (practice) { renderCurrentQuestion(); }  // 练习模式：自动出下一题
        else { close(); }
      }, 1200);
    } else {
      msg.style.color = "#EF6C00";
      msg.innerHTML = ico("refresh") + " 不对哦，再想想～";
      buzz(); speak("再想一想哦", cfg.speech);
      shakeEl.classList.remove("shake"); void shakeEl.offsetWidth; shakeEl.classList.add("shake");
      if (shakeEl.tagName === "INPUT") { try { shakeEl.select(); } catch (e) {} } // 选中内容，方便重输
    }
  }

  function close() {
    if (!opened) return;
    opened = false;
    if (mask) mask.style.display = "none";
    if (typeof cfg.onClose === "function") cfg.onClose();
    elapsed = 0;
  }

  function tick() {
    if (opened) return;
    if (typeof document !== "undefined" && document.hidden) return; // 页面不可见时不累计，省电
    if (typeof cfg.isPlaying === "function" && !cfg.isPlaying()) return;
    elapsed++;
    if (elapsed >= (cfg.interval || QUIZ_INTERVAL_SECONDS)) open();
  }

  /* ---------- 练习模式 ---------- */
  function startPractice(options) {
    practiceCfg = options || {};
    practice = true;
    stat = { total: 0, right: 0, wrong: 0 };
    answeredCurrent = false;
    cfg = { speech: practiceCfg.speech };  // 练习模式复用 cfg 的 speech
    if (timer) { clearInterval(timer); timer = null; }  // 练习模式不需要定时弹题
    injectDOM();
    document.getElementById("gqScore").style.display = "flex";
    document.getElementById("gqActions").style.display = "flex";
    refreshScore();
    opened = false;
    open();
  }

  function stopPractice() {
    practice = false;
    practiceCfg = {};
    if (mask) {
      document.getElementById("gqScore").style.display = "none";
      document.getElementById("gqActions").style.display = "none";
    }
    close();
  }

  /* ---------- 对外 API ---------- */
  window.GameQuiz = {
    init: function (options) {
      cfg = options || {};
      injectDOM();
      if (timer) clearInterval(timer);
      timer = setInterval(tick, 1000);
    },
    open: open,
    close: close,
    startPractice: startPractice,
    stopPractice: stopPractice
  };
})();

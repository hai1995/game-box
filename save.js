/* GameSave —— 游戏盒子公共存档模块
 * 统一 localStorage 读写，带命名空间前缀、异常保护与「升级不丢记录」兼容机制。
 * 用法：
 *   <script src="../../save.js"></script>
 *   GameSave.save('游戏key', { ... });       // 保存任意可 JSON 序列化对象
 *   var s = GameSave.load('游戏key', null);  // 读取，无存档/损坏时返回默认值
 *   GameSave.clear('游戏key');               // 清除某 key
 *   GameSave.clearAll();                     // 清除本模块所有存档
 *
 * 记录保留策略：升级/调整玩法时，切勿通过直接改 PREFIX 让旧存档失效。
 * 若必须换前缀，把旧前缀登记到 LEGACY_PREFIXES，load 会自动回退读取并迁移到新前缀，
 * 旧键保留作双保险——玩家已有的关卡进度、最高分不会因版本升级而清零。
 */
(function (global) {
  "use strict";
  /* 命名空间 + 版本。
   * 重要：升级时【不要】直接改 PREFIX 让旧存档失效——那会清空所有玩家记录。
   * 若确需升级前缀，把旧前缀加进 LEGACY_PREFIXES，load 会自动回退读取并迁移到当前前缀，
   * 旧键保留作为双保险，确保任何一次升级都不会丢失玩家已有记录。 */
  var PREFIX = "gb_save_v1_";
  var LEGACY_PREFIXES = [];   // 历史前缀（由旧到新）。升级换前缀时在此登记，例如 ["gb_save_v1_"]

  function fullKey(key) { return PREFIX + key; }
  // 找到一个 key 的原始值：先当前前缀，未命中再依次回退历史前缀，命中则迁移到当前前缀
  function readRaw(key) {
    var raw = null;
    try { raw = global.localStorage.getItem(fullKey(key)); } catch (e) { return null; }
    if (raw !== null) return raw;
    for (var i = 0; i < LEGACY_PREFIXES.length; i++) {
      try {
        var old = global.localStorage.getItem(LEGACY_PREFIXES[i] + key);
        if (old !== null) {
          raw = old;
          try { global.localStorage.setItem(fullKey(key), old); } catch (e2) {} // 迁移到当前前缀；旧键保留
          break;
        }
      } catch (e3) {}
    }
    return raw;
  }

  var GameSave = {
    // 保存。成功返回 true，失败（隐私模式/配额满）返回 false，绝不影响游戏主流程
    save: function (key, data) {
      try {
        global.localStorage.setItem(fullKey(key), JSON.stringify(data));
        return true;
      } catch (e) { return false; }
    },
    // 读取。无存档、JSON 损坏、存储不可用时返回 fallback；自动兼容并迁移历史前缀存档
    load: function (key, fallback) {
      if (fallback === undefined) fallback = null;
      try {
        var raw = readRaw(key);
        if (raw === null) return fallback;
        var val = JSON.parse(raw);
        return val === null ? fallback : val;
      } catch (e) { return fallback; }
    },
    // 判断某 key 是否有存档（含历史前缀）
    has: function (key) {
      try { return readRaw(key) !== null; }
      catch (e) { return false; }
    },
    // 清除某 key（含当前与全部历史前缀，避免清档后旧档"复活"）
    clear: function (key) {
      try {
        global.localStorage.removeItem(fullKey(key));
        for (var i = 0; i < LEGACY_PREFIXES.length; i++) {
          global.localStorage.removeItem(LEGACY_PREFIXES[i] + key);
        }
      } catch (e) {}
    },
    // 清除本模块的全部存档（含历史前缀；不影响其他业务 key，如最高分、关卡进度）
    clearAll: function () {
      try {
        var prefixes = [PREFIX].concat(LEGACY_PREFIXES), dead = [];
        for (var i = 0; i < global.localStorage.length; i++) {
          var k = global.localStorage.key(i), hit = false;
          if (k) for (var p = 0; p < prefixes.length; p++) if (k.indexOf(prefixes[p]) === 0) { hit = true; break; }
          if (hit) dead.push(k);
        }
        for (var j = 0; j < dead.length; j++) global.localStorage.removeItem(dead[j]);
      } catch (e) {}
    }
  };

  global.GameSave = GameSave;
})(window);

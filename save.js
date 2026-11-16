/* GameSave —— 游戏盒子公共存档模块
 * 统一 localStorage 读写，带命名空间前缀、版本号与异常保护。
 * 用法：
 *   <script src="../../save.js"></script>
 *   GameSave.save('游戏key', { ... });       // 保存任意可 JSON 序列化对象
 *   var s = GameSave.load('游戏key', null);  // 读取，无存档/损坏时返回默认值
 *   GameSave.clear('游戏key');               // 清除某 key
 *   GameSave.clearAll();                     // 清除本模块所有存档
 */
(function (global) {
  "use strict";
  var PREFIX = "gb_save_v1_";   // 命名空间 + 版本：升级时改版本号可令旧存档自然失效

  function fullKey(key) { return PREFIX + key; }

  var GameSave = {
    // 保存。成功返回 true，失败（隐私模式/配额满）返回 false，绝不影响游戏主流程
    save: function (key, data) {
      try {
        global.localStorage.setItem(fullKey(key), JSON.stringify(data));
        return true;
      } catch (e) { return false; }
    },
    // 读取。无存档、JSON 损坏、存储不可用时返回 fallback
    load: function (key, fallback) {
      if (fallback === undefined) fallback = null;
      try {
        var raw = global.localStorage.getItem(fullKey(key));
        if (raw === null) return fallback;
        var val = JSON.parse(raw);
        return val === null ? fallback : val;
      } catch (e) { return fallback; }
    },
    // 判断某 key 是否有存档
    has: function (key) {
      try { return global.localStorage.getItem(fullKey(key)) !== null; }
      catch (e) { return false; }
    },
    // 清除某 key
    clear: function (key) {
      try { global.localStorage.removeItem(fullKey(key)); } catch (e) {}
    },
    // 清除本模块的全部存档（不影响其他业务 key，如最高分、关卡进度）
    clearAll: function () {
      try {
        var dead = [];
        for (var i = 0; i < global.localStorage.length; i++) {
          var k = global.localStorage.key(i);
          if (k && k.indexOf(PREFIX) === 0) dead.push(k);
        }
        for (var j = 0; j < dead.length; j++) global.localStorage.removeItem(dead[j]);
      } catch (e) {}
    }
  };

  global.GameSave = GameSave;
})(window);

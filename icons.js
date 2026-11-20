/*
 * 公共手绘 SVG 图标库 —— 与「消消乐」同一套美术语言
 * 风格：果冻质感 / 2.5D 微立体 · 圆润饱满略 Q 版 · 左上统一光源
 *      柔和渐变 + 细腻高光 + 短软阴影 · 深色描边 · 48px 下仍能区分
 *
 * 用法：
 *   <script src="../../icons.js"></script>
 *   el.innerHTML = GameIcons.get("apple");      // 行内 SVG 字符串
 *   GameIcons.image("apple", function(img){ ... }); // 已加载好的 <img>（供 canvas 使用）
 *
 * 维护：所有图标集中在本文件 get() 内的 ICONS，新增图标只需加一个 key。
 */
(function () {
  "use strict";

  function wrap(inner) {
    return '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">' + inner + "</svg>";
  }

  // 每个图标：形状(渐变 url) + 特征 + 统一高光。描边色随主色，宽度统一 2.2，左上光源渐变 gLight。
  var ICONS = {
    /* ---------- 水果 12 种 ---------- */
    apple: wrap(
      '<path d="M32 19c-6-5-16-4-20 4-5 10 2 28 12 32 4 2 6 0 8 0s4 2 8 0c10-4 17-22 12-32-4-8-14-9-20-4z" fill="url(#gRed)" stroke="#c62828" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M32 20c0-6 1-10 3-13" fill="none" stroke="#7a4b2a" stroke-width="3.2" stroke-linecap="round"/>' +
      '<path d="M34 12c3-6 10-7 14-4-2 6-8 9-14 7z" fill="#57c26a" stroke="#2f9b48" stroke-width="1.8" stroke-linejoin="round"/>' +
      '<ellipse cx="23" cy="27" rx="6" ry="3.4" fill="#fff" opacity=".55" transform="rotate(-30 23 27)"/>'
    ),
    orange: wrap(
      '<circle cx="32" cy="35" r="20" fill="url(#gOrange)" stroke="#e65100" stroke-width="2.2"/>' +
      '<path d="M32 15c0-4 0-6 1-8" stroke="#7a4b2a" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M33 13c3-6 10-6 13-3-2 6-8 8-13 6z" fill="#57c26a" stroke="#2f9b48" stroke-width="1.8" stroke-linejoin="round"/>' +
      '<ellipse cx="23" cy="27" rx="6" ry="3.6" fill="#fff" opacity=".5" transform="rotate(-30 23 27)"/>'
    ),
    lemon: wrap(
      '<path d="M14 34c-2-3-2-5 0-8 6-10 30-14 40-4 3 3 3 13 0 16-10 10-34 6-40-4z" fill="url(#gYellow)" stroke="#f9a825" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M11 28c-3-1-4 1-2 3m2 3c-3 0-4 3-1 4" fill="none" stroke="#f9a825" stroke-width="2" stroke-linecap="round"/>' +
      '<ellipse cx="26" cy="24" rx="8" ry="3.4" fill="#fff" opacity=".6" transform="rotate(-12 26 24)"/>'
    ),
    watermelon: wrap(
      '<path d="M32 12c14 0 22 12 22 24S46 56 32 56 10 48 10 36 18 12 32 12z" fill="url(#gGreen)" stroke="#2e7d32" stroke-width="2.2"/>' +
      '<path d="M32 13c-4 8-5 14-5 23s1 15 5 21M22 17c-4 7-6 13-6 19s2 13 6 18M42 17c4 7 6 13 6 19s-2 13-6 18" fill="none" stroke="#1b5e20" stroke-width="2.6" stroke-linecap="round" opacity=".7"/>' +
      '<ellipse cx="23" cy="25" rx="6" ry="3.2" fill="#fff" opacity=".45" transform="rotate(-30 23 25)"/>'
    ),
    grapes: wrap(
      '<g fill="url(#gPurple)" stroke="#6a1b9a" stroke-width="2" stroke-linejoin="round">' +
      '<circle cx="25" cy="26" r="8"/><circle cx="39" cy="26" r="8"/><circle cx="32" cy="21" r="8"/>' +
      '<circle cx="27" cy="39" r="8"/><circle cx="38" cy="39" r="8"/><circle cx="32" cy="50" r="7.5"/></g>' +
      '<path d="M32 14c0-4 1-6 3-7" stroke="#7a4b2a" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path d="M34 12c3-5 9-5 12-2-2 5-7 7-12 5z" fill="#57c26a" stroke="#2f9b48" stroke-width="1.6"/>' +
      '<ellipse cx="22" cy="23" rx="3.4" ry="2" fill="#fff" opacity=".55" transform="rotate(-30 22 23)"/>'
    ),
    strawberry: wrap(
      '<path d="M32 20c-8-6-18-3-19 7-1 11 10 26 19 30 9-4 20-19 19-30-1-10-11-13-19-7z" fill="url(#gRed)" stroke="#c62828" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M32 21c-6-5-13-6-17-3 4 1 7 3 9 6 3-2 5-2 8-1 3-1 5-1 8 1 2-3 5-5 9-6-4-3-11-2-17 3z" fill="#57c26a" stroke="#2f9b48" stroke-width="1.8" stroke-linejoin="round"/>' +
      '<g fill="#ffe0a0"><circle cx="26" cy="32" r="1.7"/><circle cx="38" cy="32" r="1.7"/><circle cx="23" cy="39" r="1.7"/><circle cx="32" cy="38" r="1.7"/><circle cx="41" cy="39" r="1.7"/><circle cx="32" cy="46" r="1.7"/></g>' +
      '<ellipse cx="24" cy="29" rx="4.6" ry="2.8" fill="#fff" opacity=".5" transform="rotate(-28 24 29)"/>'
    ),
    cherry: wrap(
      '<path d="M32 20c-2-8 2-14 8-16M31 20c3-7 9-10 15-9" fill="none" stroke="#7a4b2a" stroke-width="2.6" stroke-linecap="round"/>' +
      '<circle cx="23" cy="38" r="12" fill="url(#gRed)" stroke="#c62828" stroke-width="2.2"/>' +
      '<circle cx="42" cy="41" r="11" fill="url(#gRed)" stroke="#c62828" stroke-width="2.2"/>' +
      '<path d="M31 21c4-2 9-2 12 0" fill="none" stroke="#57c26a" stroke-width="3" stroke-linecap="round"/>' +
      '<ellipse cx="19" cy="33" rx="3.6" ry="2.2" fill="#fff" opacity=".55" transform="rotate(-30 19 33)"/>'
    ),
    peach: wrap(
      '<path d="M32 17c-11-4-21 4-21 17 0 13 10 23 21 23s21-10 21-23c0-13-10-21-21-17z" fill="url(#gPink)" stroke="#e5577a" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M32 20c-3 7-3 20 0 33" fill="none" stroke="#d81b60" stroke-width="2" stroke-linecap="round" opacity=".55"/>' +
      '<path d="M32 18c2-6 8-8 12-6-1 6-6 9-12 8z" fill="#57c26a" stroke="#2f9b48" stroke-width="1.6"/>' +
      '<ellipse cx="23" cy="28" rx="5.4" ry="3.2" fill="#fff" opacity=".5" transform="rotate(-30 23 28)"/>'
    ),
    mango: wrap(
      '<path d="M44 14c4 8 2 24-6 34-7 9-18 12-24 7-5-5-3-16 4-25C27 19 39 12 44 14z" fill="url(#gMango)" stroke="#ef6c00" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M44 14c-3-3-3-7-1-9 3 1 5 4 5 8z" fill="#57c26a" stroke="#2f9b48" stroke-width="1.6"/>' +
      '<path d="M20 46c6-3 14-11 20-22" fill="none" stroke="#f9a825" stroke-width="2" stroke-linecap="round" opacity=".55"/>' +
      '<ellipse cx="24" cy="40" rx="5" ry="3" fill="#fff" opacity=".5" transform="rotate(-35 24 40)"/>'
    ),
    pineapple: wrap(
      '<path d="M32 14c3-7 6-9 6-9M32 14c-1-8-3-10-3-10M32 14c6-6 9-6 9-6M32 14c-6-5-10-5-10-5" fill="none" stroke="#2e7d32" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M32 16c11 0 17 9 17 21S43 56 32 56 15 49 15 37 21 16 32 16z" fill="url(#gYellow)" stroke="#f9a825" stroke-width="2.2"/>' +
      '<path d="M20 28l10 6M36 26l10 6M18 38l10 6M36 38l10 6M25 44l7 4" stroke="#ef6c00" stroke-width="1.8" opacity=".7"/>' +
      '<ellipse cx="23" cy="28" rx="5" ry="3" fill="#fff" opacity=".5" transform="rotate(-30 23 28)"/>'
    ),
    kiwi: wrap(
      '<circle cx="32" cy="34" r="21" fill="url(#gBrown)" stroke="#6d4c41" stroke-width="2.2"/>' +
      '<circle cx="32" cy="34" r="16" fill="#aed581" stroke="#7cb342" stroke-width="1.6"/>' +
      '<circle cx="32" cy="34" r="6" fill="#fff9c4"/>' +
      '<g fill="#33691e"><circle cx="32" cy="23" r="1.6"/><circle cx="41" cy="27" r="1.6"/><circle cx="43" cy="37" r="1.6"/><circle cx="36" cy="45" r="1.6"/><circle cx="26" cy="44" r="1.6"/><circle cx="21" cy="36" r="1.6"/><circle cx="24" cy="26" r="1.6"/></g>' +
      '<ellipse cx="23" cy="25" rx="4.6" ry="2.6" fill="#fff" opacity=".4" transform="rotate(-30 23 25)"/>'
    ),
    blueberry: wrap(
      '<circle cx="32" cy="35" r="20" fill="url(#gBlue)" stroke="#3949ab" stroke-width="2.2"/>' +
      '<path d="M32 22l3 5 6 0-5 4 2 6-6-4-6 4 2-6-5-4 6 0z" fill="#5c6bc0" stroke="#3949ab" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<ellipse cx="23" cy="29" rx="5.4" ry="3.2" fill="#fff" opacity=".5" transform="rotate(-30 23 29)"/>'
    ),

    /* ---------- 动物 8 种 ---------- */
    dog: wrap(
      '<ellipse cx="16" cy="34" rx="7" ry="14" fill="#c68b4a" stroke="#8d5524" stroke-width="2"/>' +
      '<ellipse cx="48" cy="34" rx="7" ry="14" fill="#c68b4a" stroke="#8d5524" stroke-width="2"/>' +
      '<circle cx="32" cy="33" r="19" fill="url(#gDog)" stroke="#8d5524" stroke-width="2.2"/>' +
      '<ellipse cx="32" cy="43" rx="10" ry="7" fill="#ffe0b2"/>' +
      '<circle cx="26" cy="30" r="2.4" fill="#3e2723"/><circle cx="38" cy="30" r="2.4" fill="#3e2723"/>' +
      '<ellipse cx="32" cy="39" rx="3.4" ry="2.6" fill="#3e2723"/><path d="M32 42v4m0 0c-2 3-6 2-7-1m7 1c2 3 6 2 7-1" fill="none" stroke="#3e2723" stroke-width="1.8" stroke-linecap="round"/>' +
      '<ellipse cx="24" cy="25" rx="4" ry="2.4" fill="#fff" opacity=".5" transform="rotate(-25 24 25)"/>'
    ),
    cat: wrap(
      '<path d="M17 24l-2-14 13 8M47 24l2-14-13 8" fill="url(#gOrange)" stroke="#e65100" stroke-width="2" stroke-linejoin="round"/>' +
      '<circle cx="32" cy="34" r="19" fill="url(#gOrange)" stroke="#e65100" stroke-width="2.2"/>' +
      '<circle cx="26" cy="31" r="2.4" fill="#3e2723"/><circle cx="38" cy="31" r="2.4" fill="#3e2723"/>' +
      '<path d="M29 40l3 2 3-2z" fill="#e57373" stroke="#c62828" stroke-width="1.2"/>' +
      '<path d="M28 42l-8-2m8 5l-8 1m16-4l8-2m-8 5l8 1" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>' +
      '<ellipse cx="24" cy="26" rx="4" ry="2.4" fill="#fff" opacity=".5" transform="rotate(-25 24 26)"/>'
    ),
    fox: wrap(
      '<path d="M13 22L12 4l17 12zM51 22L52 4 35 16z" fill="url(#gOrange)" stroke="#e65100" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M17 9l10 8-8 1zM47 9l-10 8 8 1z" fill="#3e2723"/>' +
      '<path d="M32 18c12 0 18 8 18 19 0 10-8 17-18 17S14 47 14 37c0-11 6-19 18-19z" fill="url(#gOrange)" stroke="#e65100" stroke-width="2.2"/>' +
      '<path d="M32 33c-8 0-13 8-13 16 0 5 6 8 13 8s13-3 13-8c0-8-5-16-13-16z" fill="#fff3e0"/>' +
      '<path d="M23 33l4 3 5-2 5 2 4-3" fill="none" stroke="#e65100" stroke-width="2" stroke-linejoin="round"/>' +
      '<circle cx="25" cy="31" r="2.4" fill="#3e2723"/><circle cx="39" cy="31" r="2.4" fill="#3e2723"/>' +
      '<ellipse cx="32" cy="50" rx="3.4" ry="2.6" fill="#3e2723"/>' +
      '<ellipse cx="24" cy="26" rx="4" ry="2.2" fill="#fff" opacity=".5" transform="rotate(-25 24 26)"/>'
    ),
    panda: wrap(
      '<circle cx="18" cy="20" r="8" fill="#3e2723"/><circle cx="46" cy="20" r="8" fill="#3e2723"/>' +
      '<circle cx="32" cy="34" r="20" fill="#fff" stroke="#bdbdbd" stroke-width="2.2"/>' +
      '<ellipse cx="25" cy="32" rx="6" ry="8" fill="#3e2723" transform="rotate(-18 25 32)"/>' +
      '<ellipse cx="39" cy="32" rx="6" ry="8" fill="#3e2723" transform="rotate(18 39 32)"/>' +
      '<circle cx="25" cy="32" r="2.2" fill="#fff"/><circle cx="39" cy="32" r="2.2" fill="#fff"/>' +
      '<ellipse cx="32" cy="44" rx="3.4" ry="2.6" fill="#3e2723"/><path d="M32 47v2m0 0c-2 2-5 2-6 0m6 0c2 2 5 2 6 0" fill="none" stroke="#3e2723" stroke-width="1.6" stroke-linecap="round"/>'
    ),
    lion: wrap(
      '<g fill="url(#gGold)" stroke="#ef6c00" stroke-width="2"><circle cx="32" cy="16" r="9"/><circle cx="18" cy="22" r="9"/><circle cx="46" cy="22" r="9"/><circle cx="14" cy="36" r="9"/><circle cx="50" cy="36" r="9"/><circle cx="20" cy="48" r="9"/><circle cx="44" cy="48" r="9"/><circle cx="32" cy="52" r="9"/></g>' +
      '<circle cx="32" cy="34" r="17" fill="url(#gGold)" stroke="#ef6c00" stroke-width="2.2"/>' +
      '<ellipse cx="32" cy="41" rx="9" ry="7" fill="#ffe0b2"/>' +
      '<circle cx="26" cy="31" r="2.3" fill="#3e2723"/><circle cx="38" cy="31" r="2.3" fill="#3e2723"/>' +
      '<path d="M29 39l3 2 3-2z" fill="#5d4037"/><path d="M32 41v3m0 0c-2 2-4 2-5 0m5 0c2 2 4 2 5 0" fill="none" stroke="#5d4037" stroke-width="1.6" stroke-linecap="round"/>'
    ),
    frog: wrap(
      '<circle cx="20" cy="24" r="10" fill="url(#gGreen)" stroke="#2e7d32" stroke-width="2.2"/>' +
      '<circle cx="44" cy="24" r="10" fill="url(#gGreen)" stroke="#2e7d32" stroke-width="2.2"/>' +
      '<ellipse cx="32" cy="38" rx="20" ry="16" fill="url(#gGreen)" stroke="#2e7d32" stroke-width="2.2"/>' +
      '<circle cx="20" cy="24" r="5" fill="#fff"/><circle cx="44" cy="24" r="5" fill="#fff"/>' +
      '<circle cx="21" cy="25" r="2.6" fill="#3e2723"/><circle cx="43" cy="25" r="2.6" fill="#3e2723"/>' +
      '<path d="M24 42c5 5 11 5 16 0" fill="none" stroke="#2e7d32" stroke-width="2.2" stroke-linecap="round"/>' +
      '<circle cx="26" cy="38" r="2" fill="#ef9a9a" opacity=".7"/><circle cx="38" cy="38" r="2" fill="#ef9a9a" opacity=".7"/>'
    ),
    rabbit: wrap(
      '<ellipse cx="23" cy="18" rx="7" ry="15" fill="#fff" stroke="#bdbdbd" stroke-width="2" transform="rotate(-10 23 18)"/>' +
      '<ellipse cx="41" cy="18" rx="7" ry="15" fill="#fff" stroke="#bdbdbd" stroke-width="2" transform="rotate(10 41 18)"/>' +
      '<ellipse cx="23" cy="18" rx="3" ry="10" fill="#f8bbd0" transform="rotate(-10 23 18)"/>' +
      '<ellipse cx="41" cy="18" rx="3" ry="10" fill="#f8bbd0" transform="rotate(10 41 18)"/>' +
      '<circle cx="32" cy="38" r="18" fill="#fff" stroke="#bdbdbd" stroke-width="2.2"/>' +
      '<circle cx="26" cy="35" r="2.4" fill="#3e2723"/><circle cx="38" cy="35" r="2.4" fill="#3e2723"/>' +
      '<path d="M29 43l3 2 3-2z" fill="#e57373"/><path d="M32 45v3" stroke="#bdbdbd" stroke-width="1.6"/>' +
      '<ellipse cx="25" cy="30" rx="4" ry="2.4" fill="#fff" opacity=".6"/>'
    ),
    bear: wrap(
      '<circle cx="19" cy="21" r="9" fill="url(#gBrown)" stroke="#5d4037" stroke-width="2.2"/>' +
      '<circle cx="45" cy="21" r="9" fill="url(#gBrown)" stroke="#5d4037" stroke-width="2.2"/>' +
      '<circle cx="19" cy="21" r="4" fill="#d7a67a"/><circle cx="45" cy="21" r="4" fill="#d7a67a"/>' +
      '<circle cx="32" cy="35" r="19" fill="url(#gBrown)" stroke="#5d4037" stroke-width="2.2"/>' +
      '<ellipse cx="32" cy="43" rx="10" ry="8" fill="#ffe0b2"/>' +
      '<circle cx="26" cy="32" r="2.4" fill="#3e2723"/><circle cx="38" cy="32" r="2.4" fill="#3e2723"/>' +
      '<ellipse cx="32" cy="40" rx="3.6" ry="2.8" fill="#3e2723"/><path d="M32 43v3m0 0c-2 2-5 2-6 0m6 0c2 2 5 2 6 0" fill="none" stroke="#3e2723" stroke-width="1.6" stroke-linecap="round"/>'
    ),

    /* ---------- 其他：地鼠/炸弹/星星/花 ---------- */
    hamster: wrap(
      '<circle cx="18" cy="22" r="7" fill="#c79a6b" stroke="#8d6e63" stroke-width="2"/><circle cx="46" cy="22" r="7" fill="#c79a6b" stroke="#8d6e63" stroke-width="2"/>' +
      '<circle cx="18" cy="22" r="3.4" fill="#f8bbd0"/><circle cx="46" cy="22" r="3.4" fill="#f8bbd0"/>' +
      '<circle cx="32" cy="35" r="19" fill="url(#gTan)" stroke="#8d6e63" stroke-width="2.2"/>' +
      '<circle cx="22" cy="42" r="7" fill="#ffe0b2" opacity=".9"/><circle cx="42" cy="42" r="7" fill="#ffe0b2" opacity=".9"/>' +
      '<circle cx="26" cy="32" r="2.4" fill="#3e2723"/><circle cx="38" cy="32" r="2.4" fill="#3e2723"/>' +
      '<ellipse cx="32" cy="40" rx="3" ry="2.2" fill="#e57373"/><path d="M32 42v3m0 0c-2 2-4 2-5 0m5 0c2 2 4 2 5 0" fill="none" stroke="#5d4037" stroke-width="1.6" stroke-linecap="round"/>' +
      '<ellipse cx="24" cy="27" rx="4" ry="2.4" fill="#fff" opacity=".5" transform="rotate(-25 24 27)"/>'
    ),
    bomb: wrap(
      '<path d="M40 18c3-4 7-4 9-2M45 14l2-5m3 8l5-2" fill="none" stroke="#6d4c41" stroke-width="2.6" stroke-linecap="round"/>' +
      '<circle cx="30" cy="37" r="19" fill="url(#gDark)" stroke="#212121" stroke-width="2.2"/>' +
      '<path d="M21 22l6 5" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/>' +
      '<circle cx="33" cy="14" r="4" fill="url(#gYellow)" stroke="#f57f17" stroke-width="1.6"/>'
    ),
    star: wrap(
      '<path d="M32 8l7 15 17 2-12 12 3 17-15-8-15 8 3-17L8 25l17-2z" fill="url(#gYellow)" stroke="#f9a825" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<ellipse cx="25" cy="22" rx="5" ry="3" fill="#fff" opacity=".6" transform="rotate(-30 25 22)"/>'
    ),
    flower: wrap(
      '<g fill="url(#gPink)" stroke="#e5577a" stroke-width="2"><ellipse cx="32" cy="18" rx="9" ry="12"/><ellipse cx="46" cy="30" rx="12" ry="9"/><ellipse cx="41" cy="46" rx="10" ry="11"/><ellipse cx="23" cy="46" rx="10" ry="11"/><ellipse cx="18" cy="30" rx="12" ry="9"/></g>' +
      '<circle cx="32" cy="33" r="10" fill="url(#gYellow)" stroke="#f9a825" stroke-width="2"/>' +
      '<g fill="#f57f17"><circle cx="29" cy="30" r="1.3"/><circle cx="35" cy="30" r="1.3"/><circle cx="32" cy="35" r="1.3"/><circle cx="27" cy="35" r="1.3"/><circle cx="37" cy="35" r="1.3"/></g>' +
      '<ellipse cx="27" cy="15" rx="3.4" ry="2" fill="#fff" opacity=".55" transform="rotate(-30 27 15)"/>'
    ),

    /* ---------- 场景：小孩 / 终点旗 ---------- */
    kid: wrap(
      '<circle cx="32" cy="20" r="10" fill="url(#gTan)" stroke="#8d6e63" stroke-width="2"/>' +
      '<path d="M22 18c0-8 20-8 20 0 0-10-20-12-20 0z" fill="#5d4037"/>' +
      '<circle cx="28" cy="20" r="1.8" fill="#3e2723"/><circle cx="36" cy="20" r="1.8" fill="#3e2723"/><path d="M29 25c2 2 4 2 6 0" fill="none" stroke="#3e2723" stroke-width="1.6" stroke-linecap="round"/>' +
      '<path d="M20 54c0-12 5-20 12-20s12 8 12 20z" fill="url(#gBlue)" stroke="#3949ab" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<ellipse cx="27" cy="16" rx="3" ry="2" fill="#fff" opacity=".5" transform="rotate(-30 27 16)"/>'
    ),
    flag: wrap(
      '<path d="M22 10v44" stroke="#6d4c41" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M24 12c8-6 16 4 24-2v20c-8 6-16-4-24 2z" fill="url(#gRed)" stroke="#c62828" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M30 13c5 0 9 3 13 1" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".5"/>' +
      '<circle cx="22" cy="10" r="3" fill="#ffd54f" stroke="#f9a825" stroke-width="1.4"/>'
    ),

    /* ---------- 男孩向主题：恐龙 / 火箭 / 赛车 / 矿工 ---------- */
    dino: wrap(
      '<path d="M14 44c-6 1-9-3-8-8 2 3 6 3 8 0" fill="url(#gGreen)" stroke="#2e7d32" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M16 46c0-12 6-20 16-20 8 0 13 5 13 12 0 5-3 8-7 8z" fill="url(#gGreen)" stroke="#2e7d32" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M22 30l2-6 3 5m4-1 2-6 3 5" fill="#2e7d32"/>' +
      '<path d="M44 30c6-3 12-1 13 4-4-1-7 0-9 3z" fill="url(#gGreen)" stroke="#2e7d32" stroke-width="2" stroke-linejoin="round"/>' +
      '<circle cx="47" cy="30" r="1.8" fill="#fff"/><circle cx="47.6" cy="30" r="1" fill="#333"/>' +
      '<path d="M20 46v8m14-8v8" stroke="#2e7d32" stroke-width="5" stroke-linecap="round"/>' +
      '<ellipse cx="26" cy="30" rx="4" ry="2.4" fill="#fff" opacity=".45" transform="rotate(-25 26 30)"/>'
    ),
    rocket: wrap(
      '<path d="M32 8c9 7 13 18 11 30l-11 8-11-8C19 26 23 15 32 8z" fill="url(#gBlue)" stroke="#3949ab" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<circle cx="32" cy="27" r="7" fill="#bff0ff" stroke="#3949ab" stroke-width="2"/><circle cx="32" cy="27" r="3.4" fill="#4a86e8"/>' +
      '<path d="M23 36l-7 10 9-4m16-6 7 10-9-4" fill="url(#gRed)" stroke="#c62828" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M28 46l4 12 4-12z" fill="url(#gYellow)" stroke="#f57f17" stroke-width="1.8" stroke-linejoin="round"/>' +
      '<ellipse cx="27" cy="19" rx="4" ry="2.4" fill="#fff" opacity=".5" transform="rotate(-30 27 19)"/>'
    ),
    car: wrap(
      '<path d="M14 30l4-11c1-3 3-4 6-4h16c3 0 5 1 6 4l4 11" fill="url(#gRed)" stroke="#b71c1c" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M20 19h24l3 11H17z" fill="#bff0ff" stroke="#b71c1c" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M12 30h40c2 0 3 1 3 3v14c0 2-1 3-3 3H12c-2 0-3-1-3-3V33c0-2 1-3 3-3z" fill="url(#gRed)" stroke="#b71c1c" stroke-width="2.2"/>' +
      '<circle cx="20" cy="50" r="6" fill="#424242" stroke="#212121" stroke-width="2"/><circle cx="44" cy="50" r="6" fill="#424242" stroke="#212121" stroke-width="2"/>' +
      '<circle cx="20" cy="50" r="2.4" fill="#bdbdbd"/><circle cx="44" cy="50" r="2.4" fill="#bdbdbd"/>' +
      '<path d="M15 35h8m18 0h8" stroke="#fff3a0" stroke-width="4" stroke-linecap="round"/>'
    ),
    pickaxe: wrap(
      '<path d="M30 26l5 34" stroke="#8d5524" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M12 24c8-10 32-10 40 0-6-3-11-3-15 1-1-4-3-6-5-6s-4 2-5 6c-4-4-9-4-15-1z" fill="url(#gBrown)" stroke="#5d4037" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M14 22c8-7 28-7 36 0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".5"/>' +
      '<circle cx="32" cy="20" r="3" fill="url(#gGold)" stroke="#f57f17" stroke-width="1.4"/>'
    ),

    /* ---------- 特效小图标 ---------- */
    sparkle: wrap('<path d="M32 8l4 16 16 4-16 4-4 16-4-16-16-4 16-4z" fill="url(#gYellow)" stroke="#f9a825" stroke-width="1.6" stroke-linejoin="round"/>'),
    heart: wrap('<path d="M32 54C18 45 10 36 10 26c0-8 6-13 13-13 4 0 7 2 9 6 2-4 5-6 9-6 7 0 13 5 13 13 0 10-8 19-22 28z" fill="url(#gRed)" stroke="#c62828" stroke-width="2.2" stroke-linejoin="round"/><ellipse cx="24" cy="24" rx="5" ry="3" fill="#fff" opacity=".55" transform="rotate(-25 24 24)"/>')
  };

  /* ==================== UI 装饰符号集（纯白，配彩色底使用） ====================
   * 这些符号不含底色，放进按钮/胶囊/返回键等已有彩色底的容器里，风格统一。
   * 需要独立图标时，get(name) 会自动套一个渐变小圆角底生成徽章。
   */
  var UI = {
    home:      '<path d="M14 30 32 14l18 16v20a2 2 0 0 1-2 2h-10V38H24v14H16a2 2 0 0 1-2-2z" fill="#fff"/>',
    refresh:   '<path d="M50 22a20 20 0 1 0 3 16" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M44 12l10 9-11 5z" fill="#fff"/>',
    trophy:    '<path d="M22 14h20v11c0 8-4 12-10 12S22 33 22 25z" fill="#fff"/><path d="M22 19h-6v4c0 5 2 7 6 7m20-11h6v4c0 5-2 7-6 7" fill="none" stroke="#fff" stroke-width="3"/><path d="M28 37h8v9h-8zM23 46h18v5H23z" fill="#fff"/>',
    clock:     '<circle cx="32" cy="32" r="20" fill="none" stroke="#fff" stroke-width="5"/><path d="M32 19v14l9 6" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
    target:    '<circle cx="32" cy="32" r="20" fill="none" stroke="#fff" stroke-width="4"/><circle cx="32" cy="32" r="11" fill="none" stroke="#fff" stroke-width="4"/><circle cx="32" cy="32" r="4" fill="#fff"/>',
    foot:      '<ellipse cx="26" cy="40" rx="9" ry="12" fill="#fff"/><circle cx="43" cy="23" r="5" fill="#fff"/><circle cx="36" cy="18" r="3.4" fill="#fff"/><circle cx="48" cy="30" r="3.4" fill="#fff"/>',
    fire:      '<path d="M34 10c3 10-7 12-6 21-4-2-6-6-6-10-7 7-8 14-4 20 4 6 9 9 14 9s11-3 14-9c3-6 0-12-5-17 0 6-3 8-3 8 2-9-3-15-8-22z" fill="#fff"/>',
    robot:     '<rect x="17" y="22" width="30" height="25" rx="7" fill="#fff"/><circle cx="26" cy="34" r="3.2" fill="#000" opacity=".32"/><circle cx="38" cy="34" r="3.2" fill="#000" opacity=".32"/><path d="M32 22v-8" stroke="#fff" stroke-width="3"/><circle cx="32" cy="12" r="3" fill="#fff"/>',
    undo:      '<path d="M24 26l-8 8 8 8" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 34h22c6 0 10 4 10 10" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>',
    bulb:      '<path d="M32 13a16 16 0 0 0-9 29c2 1 3 3 3 5h12c0-2 1-4 3-5a16 16 0 0 0-9-29z" fill="#fff"/><path d="M27 52h10" stroke="#fff" stroke-width="4" stroke-linecap="round"/>',
    shuffle:   '<path d="M14 22h8c12 0 12 20 24 20h4m-6-6 6 6-6 6M14 42h8c5 0 8-4 10-8m8-12h4l-6-6m6 6-6 6" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
    play:      '<path d="M24 17 51 32 24 47z" fill="#fff"/>',
    arrow:     '<path d="M16 28h20v-9l16 13-16 13v-9H16z" fill="#fff"/>',
    sound:     '<path d="M14 26h8l11-9v30l-11-9h-8z" fill="#fff"/><path d="M41 24c4 4 4 12 0 16m4-22c8 8 8 20 0 28" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>',
    mute:      '<path d="M14 26h8l11-9v30l-11-9h-8z" fill="#fff"/><path d="M42 26l12 12m0-12L42 38" stroke="#fff" stroke-width="4" stroke-linecap="round"/>',
    train:     '<rect x="18" y="12" width="28" height="32" rx="7" fill="#fff"/><rect x="23" y="19" width="18" height="12" rx="3" fill="#000" opacity=".22"/><circle cx="26" cy="50" r="4" fill="#fff"/><circle cx="38" cy="50" r="4" fill="#fff"/><path d="M25 39h14" stroke="#000" stroke-width="3" opacity=".25"/>',
    plane:     '<path d="M12 32 53 13 40 53l-8-15-20-6z" fill="#fff"/><path d="M32 38 53 13" stroke="#000" stroke-width="2" opacity=".18"/>',
    crown:     '<path d="M13 45 17 20l11 11 4-15 4 15 11-11 4 25z" fill="#fff"/><rect x="13" y="47" width="38" height="7" rx="3.5" fill="#fff"/>',
    sword:     '<path d="M44 12 54 22 30 46 20 36z" fill="#fff"/><path d="M20 34 30 44m-8-10-8 12 12-8" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
    brick:     '<g fill="#fff"><rect x="12" y="19" width="40" height="9" rx="2"/><rect x="12" y="30" width="18" height="9" rx="2"/><rect x="34" y="30" width="18" height="9" rx="2"/><rect x="12" y="41" width="40" height="9" rx="2"/></g>',
    snake:     '<path d="M18 46c0-11 17-8 17-19S26 20 26 13" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><circle cx="26" cy="13" r="7" fill="#fff"/><circle cx="23" cy="12" r="1.8" fill="#000" opacity=".4"/><path d="M29 16l6 4" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>',
    bubble:    '<circle cx="26" cy="39" r="14" fill="none" stroke="#fff" stroke-width="4"/><circle cx="43" cy="22" r="9" fill="none" stroke="#fff" stroke-width="4"/><circle cx="20" cy="33" r="3" fill="#fff"/>',
    hammer:    '<path d="M22 13h22v15H22z" fill="#fff"/><path d="M30 27h6v26h-6z" fill="#fff"/>',
    map:       '<path d="M13 20 26 14l12 6 13-6v30l-13 6-12-6-13 6z" fill="#fff"/><path d="M26 14v30M38 20v30" stroke="#000" stroke-width="2" opacity=".2"/>',
    eye:       '<path d="M10 32c9-13 35-13 44 0-9 13-35 13-44 0z" fill="#fff"/><circle cx="32" cy="32" r="7.5" fill="#000" opacity=".3"/>',
    brain:     '<path d="M32 48c-8 5-18 1-18-8-6-4-5-13 1-16-2-8 7-14 14-9 3-1 3-1 3-1z" fill="#fff"/><path d="M32 48c8 5 18 1 18-8 6-4 5-13-1-16 2-8-7-14-14-9" fill="#fff" opacity=".72"/><path d="M32 15v33" stroke="#000" stroke-width="2" opacity=".18"/>',
    pencil:    '<path d="M15 49l4-13 23-23 6 6-23 23z" fill="#fff"/><path d="M42 13l6 6" stroke="#fff" stroke-width="3"/>',
    medal:     '<circle cx="32" cy="39" r="13" fill="#fff"/><path d="M22 13l6 19m14-19-6 19" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M32 33l2 4 4 .5-3 3 .8 4-3.8-2-3.8 2 .8-4-3-3 4-.5z" fill="#000" opacity=".25"/>',
    sprout:    '<path d="M32 52V30" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M32 34c-9 0-14-5-14-15 9 0 14 5 14 15zm0-6c0-9 5-14 14-14 0 9-5 14-14 14z" fill="#fff"/>',
    note:      '<rect x="18" y="12" width="28" height="40" rx="4" fill="#fff"/><path d="M25 26h14M25 34h14M25 42h9" stroke="#000" stroke-width="2.6" opacity=".26" stroke-linecap="round"/>',
    check:     '<path d="M17 33l10 11 21-25" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>',
    party:     '<path d="M15 51 47 19M30 52l9-11" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M16 16h11v11H16zM41 13l4 4-4 4-4-4zM47 32l3 3-3 3-3-3z" fill="#fff"/>',
    dizzy:     '<circle cx="32" cy="32" r="20" fill="#fff"/><path d="M24 27l7 7m0-7-7 7m16-7 7 7m0-7-7 7" stroke="#000" stroke-width="2.6" opacity=".42" stroke-linecap="round"/><path d="M26 43c4-4 8-4 12 0" fill="none" stroke="#000" stroke-width="2.6" opacity=".42" stroke-linecap="round"/>',
    boom:      '<path d="M34 9c3 9-7 11-6 20-4-2-6-6-6-10-7 7-8 15-4 21 4 6 9 9 14 9s11-3 14-9c3-6 0-12-5-17 0 6-3 8-3 8 1-9-3-15-8-22z" fill="#fff"/>',
    cloud:     '<path d="M18 45a10 10 0 0 1-1-20 13 13 0 0 1 25-3 10 10 0 0 1 3 23z" fill="#fff"/>',
    puzzle:    '<path d="M17 17h11a5 5 0 1 1 9 0h10v11a5 5 0 1 0 0 9v10H36a5 5 0 1 0-9 0H17V37a5 5 0 1 1 0-9z" fill="#fff"/>',
    gamepad:   '<path d="M19 23h26c6 0 9 4 9 10v6c0 6-4 9-9 9-4 0-6-2-9-4h-8c-3 2-5 4-9 4-5 0-9-3-9-9v-6c0-6 3-10 9-10z" fill="#fff"/><path d="M19 33v9m-4.5-4.5h9" stroke="#000" stroke-width="3" opacity=".38" stroke-linecap="round"/><circle cx="44" cy="34" r="2.6" fill="#000" opacity=".38"/><circle cx="49" cy="40" r="2.6" fill="#000" opacity=".38"/>',
    hash:      '<path d="M25 15 20 49m19-34-5 34M15 26h34M13 38h34" stroke="#fff" stroke-width="5" stroke-linecap="round"/>',
    hex:       '<path d="M32 11 51 22v20L32 53 13 42V22z" fill="#fff"/>',
    link:      '<path d="M26 38 38 26m-16 2-4 4c-5 5-5 12 0 17s12 5 17 0l4-4m4-16 4-4c5-5 5-12 0-17s-12-5-17 0l-4 4" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>',
    candy:     '<ellipse cx="32" cy="32" rx="16" ry="13" fill="#fff"/><path d="M16 32 7 23v18zM48 32l9-9v18z" fill="#fff"/><path d="M32 19v26" stroke="#000" stroke-width="2" opacity=".18"/>',
    people:    '<circle cx="24" cy="23" r="8" fill="#fff"/><circle cx="43" cy="25" r="6" fill="#fff" opacity=".72"/><path d="M9 51c0-10 7-15 15-15s15 5 15 15z" fill="#fff"/><path d="M42 38c7 0 13 5 13 13" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>',
    bell:      '<path d="M32 13c-8 0-13 6-13 15 0 10-4 12-4 15h34c0-3-4-5-4-15 0-9-5-15-13-15z" fill="#fff"/><path d="M28 47a4 4 0 0 0 8 0" fill="none" stroke="#fff" stroke-width="3"/>',
    wind:      '<path d="M11 25h25a6 6 0 1 0-6-6M11 33h33a6 6 0 1 1-6 6M11 41h19" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>',
    lightning: '<path d="M37 10 18 36h12l-4 19 21-28H34z" fill="#fff"/>',
    shield:    '<path d="M32 11 51 19v13c0 13-8 19-19 23C21 51 13 45 13 32V19z" fill="#fff"/>',
    walk:      '<circle cx="32" cy="15" r="6" fill="#fff"/><path d="M32 23v14m0 0-8 13m8-13 8 13m-12-19-8 6m8-6 8 4" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>',
    plus:      '<path d="M32 18v28M18 32h28" stroke="#fff" stroke-width="7" stroke-linecap="round"/>',
    minus:     '<path d="M18 32h28" stroke="#fff" stroke-width="7" stroke-linecap="round"/>',
    "stone-black": '<circle cx="32" cy="32" r="18" fill="#2f2b2b" stroke="#171212" stroke-width="2"/><ellipse cx="26" cy="25" rx="6" ry="3.6" fill="#fff" opacity=".28"/>',
    "stone-white": '<circle cx="32" cy="32" r="18" fill="#fdfdfd" stroke="#c9c2b6" stroke-width="2"/><ellipse cx="26" cy="25" rx="6" ry="3.6" fill="#fff"/>',
    dino:      '<path d="M16 46c0-12 6-20 16-20 8 0 13 5 13 12 0 5-3 8-7 8z" fill="#fff"/><path d="M22 30l2-6 3 5m4-1 2-6 3 5" fill="#000" opacity=".3"/><path d="M44 30c6-3 12-1 13 4-4-1-7 0-9 3z" fill="#fff"/><circle cx="47" cy="30" r="2" fill="#000" opacity=".45"/><path d="M20 46v8m14-8v8" stroke="#fff" stroke-width="5" stroke-linecap="round"/>',
    rocket:    '<path d="M32 8c9 7 13 18 11 30l-11 8-11-8C19 26 23 15 32 8z" fill="#fff"/><circle cx="32" cy="27" r="6" fill="#000" opacity=".28"/><path d="M23 36l-7 10 9-4m16-6 7 10-9-4" fill="#fff"/><path d="M28 46l4 12 4-12z" fill="#fff"/>',
    car:       '<path d="M14 30l4-11c1-3 3-4 6-4h16c3 0 5 1 6 4l4 11" fill="#fff"/><path d="M20 19h24l3 11H17z" fill="#000" opacity=".3"/><path d="M12 30h40c2 0 3 1 3 3v14c0 2-1 3-3 3H12c-2 0-3-1-3-3V33c0-2 1-3 3-3z" fill="#fff"/><circle cx="20" cy="50" r="6" fill="#000" opacity=".55"/><circle cx="44" cy="50" r="6" fill="#000" opacity=".55"/>',
    pickaxe:   '<path d="M30 26l5 34" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M12 24c8-10 32-10 40 0-6-3-11-3-15 1-1-4-3-6-5-6s-4 2-5 6c-4-4-9-4-15-1z" fill="#fff"/>'
  };

  // 徽章底色映射：为 get() 生成的独立图标分配主色（统一深渐变，白符号始终清晰）
  var BADGE_GRAD = {
    home:"gRed", refresh:"gBlue", trophy:"gGold", clock:"gBlue", target:"gRed", foot:"gGreen",
    fire:"gOrange", robot:"gPurple", undo:"gBlue", bulb:"gOrange", shuffle:"gPurple", play:"gGreen",
    sound:"gBlue", mute:"gDark", train:"gBlue", plane:"gBlue", arrow:"gBlue", crown:"gGold", sword:"gBlue",
    brick:"gOrange", snake:"gGreen", bubble:"gBlue", hammer:"gDark", map:"gGreen", eye:"gPurple",
    brain:"gPink", pencil:"gGold", medal:"gGold", sprout:"gGreen", note:"gBlue", check:"gGreen",
    party:"gPink", dizzy:"gOrange", boom:"gOrange", cloud:"gBlue", puzzle:"gPurple", gamepad:"gPurple",
    hash:"gOrange", hex:"gBlue", link:"gBlue", candy:"gPink", people:"gGreen", bell:"gGold",
    wind:"gBlue", lightning:"gGold", shield:"gBlue", walk:"gPurple", plus:"gGreen", minus:"gRed",
    "stone-black":"gDark", "stone-white":"gBrown", dino:"gGreen", rocket:"gBlue", car:"gRed", pickaxe:"gGold"
  };
  function badge(name) {
    var g = BADGE_GRAD[name] || "gBlue";
    return wrap(
      '<rect x="5" y="5" width="54" height="54" rx="17" fill="url(#' + g + ')" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M14 17c2-4 6-6 11-6" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".5"/>' +
      UI[name]
    );
  }

  // 统一渐变定义（左上光源 -> 右下加深），一次注入，供所有内联 SVG 引用
  var GRADS =
    '<linearGradient id="gRed" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff8a80"/><stop offset="1" stop-color="#e53935"/></linearGradient>' +
    '<linearGradient id="gOrange" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffcc80"/><stop offset="1" stop-color="#fb8c00"/></linearGradient>' +
    '<linearGradient id="gYellow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff59d"/><stop offset="1" stop-color="#fbc02d"/></linearGradient>' +
    '<linearGradient id="gGreen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#aed581"/><stop offset="1" stop-color="#43a047"/></linearGradient>' +
    '<linearGradient id="gPurple" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ce93d8"/><stop offset="1" stop-color="#8e24aa"/></linearGradient>' +
    '<linearGradient id="gPink" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f8bbd0"/><stop offset="1" stop-color="#ec407a"/></linearGradient>' +
    '<linearGradient id="gBlue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fa8da"/><stop offset="1" stop-color="#3f51b5"/></linearGradient>' +
    '<linearGradient id="gGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe082"/><stop offset="1" stop-color="#f57f17"/></linearGradient>' +
    '<linearGradient id="gMango" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd54f"/><stop offset=".55" stop-color="#ff8f00"/><stop offset="1" stop-color="#e65100"/></linearGradient>' +
    '<linearGradient id="gDog" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe0a0"/><stop offset="1" stop-color="#c68b4a"/></linearGradient>' +
    '<linearGradient id="gBrown" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bcaaa4"/><stop offset="1" stop-color="#795548"/></linearGradient>' +
    '<linearGradient id="gTan" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d7a67a"/><stop offset="1" stop-color="#8d6e63"/></linearGradient>' +
    '<linearGradient id="gDark" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#616161"/><stop offset="1" stop-color="#212121"/></linearGradient>';

  var defsEl = null;
  function ensureDefs() {
    if (defsEl) return;
    defsEl = document.createElement("div");
    defsEl.setAttribute("aria-hidden", "true");
    defsEl.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
    defsEl.innerHTML = '<svg width="0" height="0"><defs>' + GRADS + "</defs></svg>";
    (document.body || document.head).appendChild(defsEl);
  }

  var imgCache = {};
  function image(name, cb) {
    if (imgCache[name]) { if (cb && imgCache[name].complete) cb(imgCache[name]); return imgCache[name]; }
    var svg = ICONS[name] || (UI[name] ? badge(name) : null);
    if (!svg) return null;
    var img = new Image();
    // 显式补 width/height，保证作为 <img> 绘制时有内在尺寸
    var full = svg.replace("<svg ", '<svg width="64" height="64" ');
    img.onload = function () { if (cb) cb(img); };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(full);
    imgCache[name] = img;
    return img;
  }

  // 把一段 inner 包成 SVG（供自动装饰用）。结果按 名称+模式 缓存，避免重复拼接字符串。
  var svgCache = {};
  function svgOf(name, mode) {
    var k = (mode || "symbol") + ":" + name;
    if (svgCache[k] !== undefined) return svgCache[k];
    var out = "";
    if (ICONS[name]) out = ICONS[name];
    else if (UI[name]) out = (mode === "badge") ? badge(name) : wrap(UI[name]);
    svgCache[k] = out;
    return out;
  }

  // emoji -> 图标名，用于把页面里的装饰 emoji 自动换成 SVG
  var EMOJI_MAP = {
    "🏠":"home","🔢":"hash","🎮":"gamepad","🚂":"train","👑":"crown","🧠":"brain","🫧":"bubble",
    "🔨":"hammer","🗺️":"map","🗺":"map","⚫":"stone-black","⚪":"stone-white","🔗":"link","🍬":"candy",
    "🐍":"snake","🧱":"brick","👀":"eye","✏️":"pencil","✏":"pencil","✈️":"plane","✈":"plane",
    "🏆":"trophy","⭐":"star","✅":"check","🔄":"refresh","⏰":"clock","⏱":"clock","⏱️":"clock",
    "🎯":"target","👣":"foot","❤️":"heart","❤":"heart","🔥":"fire","🤖":"robot","↩️":"undo","↩":"undo",
    "💡":"bulb","🔀":"shuffle","▶️":"play","▶":"play","🔊":"sound","🔇":"mute","⚔️":"sword","⚔":"sword",
    "💥":"boom","🎉":"party","😵":"dizzy","🚶":"walk","🛡️":"shield","🛡":"shield","🔔":"bell",
    "💨":"wind","⚡":"lightning","🌱":"sprout","🥇":"medal","🥈":"medal","🥉":"medal","📝":"note",
    "☁️":"cloud","☁":"cloud","🌟":"sparkle","✨":"sparkle","🍓":"strawberry","👥":"people","👆":"target",
    "💣":"bomb","🐹":"hamster","🐭":"hamster","🎈":"balloon","🍎":"apple",
    "🏓":"gamepad","📏":"target","🎊":"party","🥚":"star","💎":"star","🌈":"cloud",
    "➡️":"arrow","➡":"arrow","⬆️":"arrow","⬆":"arrow",
    "🦖":"dino","🦕":"dino","🚀":"rocket","🏎️":"car","🏎":"car","🚗":"car","⛏️":"pickaxe","⛏":"pickaxe",
    "🔵":"bubble","🟢":"bubble","🔴":"heart","🟡":"star","🟣":"bubble","⬡":"hex","⬢":"hex"
  };
  var EMOJI_RE = null;
  function buildEmojiRe() {
    var keys = Object.keys(EMOJI_MAP);
    keys.sort(function (a, b) { return b.length - a.length; }); // 长的先匹配（带变体选择符）
    var esc = keys.map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); });
    EMOJI_RE = new RegExp(esc.join("|") + "|[\\u{2B00}-\\u{2BFF}]", "gu");
  }
  function iconSpan(name, mode) {
    var s = document.createElement("span");
    s.setAttribute("data-icon", name);
    s.innerHTML = svgOf(name, mode || "symbol");
    return s;
  }
  // 递归扫描文本节点，把其中的装饰 emoji 换成 SVG（跳过脚本/样式/标题与公共题库弹窗）
  function scanText(node) {
    if (node.nodeType === 3) {
      var p = node.parentElement;
      if (!p) return;
      var tag = p.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "TITLE" || tag === "TEXTAREA") return;
      if (p.closest && p.closest('[id^="gq"],[class*="gq-"]')) return; // 公共题库弹窗交给 quiz.js 自己维护
      var text = node.nodeValue;
      if (!EMOJI_RE) buildEmojiRe();
      EMOJI_RE.lastIndex = 0;
      if (!EMOJI_RE.test(text)) return;
      EMOJI_RE.lastIndex = 0;
      var frag = document.createDocumentFragment(), last = 0, m, n = 0;
      while ((m = EMOJI_RE.exec(text))) {
        var name = EMOJI_MAP[m[0]];
        if (!name) continue;
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        frag.appendChild(iconSpan(name, "symbol"));
        last = m.index + m[0].length;
        n++;
      }
      if (n && last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      if (n) node.parentNode.replaceChild(frag, node);
      return;
    }
    if (node.nodeType === 1) {
      var kids = node.childNodes;
      for (var i = kids.length - 1; i >= 0; i--) scanText(kids[i]);
    }
  }

  // 自动装饰：无需逐游戏改 HTML，一次生效
  //  1) .home-btn 里的 🏠 -> 统一 SVG 房子（白符号，容器自带粉底）
  //  2) 任何 [data-icon="xxx"] 占位符 -> 自动填 SVG（可用 data-mode="badge" 取彩色徽章）
  //  3) 扫描所有文本节点里的装饰 emoji -> 自动换成 SVG（跳过公共题库弹窗）
  function autoDecorate() {
    var i, btn = document.querySelectorAll(".home-btn");
    for (i = 0; i < btn.length; i++) {
      var b = btn[i];
      if (UI.home) b.innerHTML = wrap(UI.home);
      b.setAttribute("aria-label", b.getAttribute("aria-label") || "返回主页");
    }
    var slots = document.querySelectorAll("[data-icon]");
    for (i = 0; i < slots.length; i++) {
      var el = slots[i];
      var name = el.getAttribute("data-icon");
      var mode = el.getAttribute("data-mode") || "symbol";
      var svg = svgOf(name, mode);
      if (svg) el.innerHTML = svg + (el.getAttribute("data-label") || "");
    }
    scanText(document.body);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", autoDecorate);
  else autoDecorate();

  // 对外 API 的结果缓存：游戏可能在绘制循环里反复取同一个图标，避免重复拼接 SVG 字符串
  var apiCache = {};
  window.GameIcons = {
    // 完整彩色图标（水果/动物/场景）——独立展示用
    get: function (name) {
      ensureDefs();
      var k = "g:" + name;
      if (apiCache[k] !== undefined) return apiCache[k];
      return (apiCache[k] = ICONS[name] || (UI[name] ? badge(name) : ""));
    },
    // 纯白符号——放进已有彩色底的按钮/胶囊/返回键里
    symbol: function (name) {
      ensureDefs();
      var k = "s:" + name;
      if (apiCache[k] !== undefined) return apiCache[k];
      return (apiCache[k] = UI[name] ? wrap(UI[name]) : "");
    },
    // 带圆角底的 UI 徽章（独立小图标）
    badge: function (name) {
      ensureDefs();
      var k = "b:" + name;
      if (apiCache[k] !== undefined) return apiCache[k];
      return (apiCache[k] = UI[name] ? badge(name) : "");
    },
    decorate: autoDecorate,
    image: image,
    has: function (name) { return !!(ICONS[name] || UI[name]); }
  };
})();

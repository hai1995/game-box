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

    /* ---------- 特效小图标 ---------- */
    sparkle: wrap('<path d="M32 8l4 16 16 4-16 4-4 16-4-16-16-4 16-4z" fill="url(#gYellow)" stroke="#f9a825" stroke-width="1.6" stroke-linejoin="round"/>'),
    heart: wrap('<path d="M32 54C18 45 10 36 10 26c0-8 6-13 13-13 4 0 7 2 9 6 2-4 5-6 9-6 7 0 13 5 13 13 0 10-8 19-22 28z" fill="url(#gRed)" stroke="#c62828" stroke-width="2.2" stroke-linejoin="round"/><ellipse cx="24" cy="24" rx="5" ry="3" fill="#fff" opacity=".55" transform="rotate(-25 24 24)"/>')
  };

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
    var svg = ICONS[name];
    if (!svg) return null;
    if (imgCache[name]) { if (cb && imgCache[name].complete) cb(imgCache[name]); return imgCache[name]; }
    var img = new Image();
    // 显式补 width/height，保证作为 <img> 绘制时有内在尺寸
    var full = svg.replace("<svg ", '<svg width="64" height="64" ');
    img.onload = function () { if (cb) cb(img); };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(full);
    imgCache[name] = img;
    return img;
  }

  window.GameIcons = {
    get: function (name) { ensureDefs(); return ICONS[name] || ""; },
    image: image,
    has: function (name) { return !!ICONS[name]; }
  };
})();

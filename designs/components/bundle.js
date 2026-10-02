/* @ds-bundle: {"format": 4, "namespace": "Bong", "components": [{"name": "Button"}, {"name": "SpeakerButton"}, {"name": "KeyHint"}, {"name": "Card"}, {"name": "ProgressBar"}, {"name": "Dialog"}, {"name": "FeedbackBar"}, {"name": "Mascot"}, {"name": "StatChip"}, {"name": "DataStates"}, {"name": "ThcsButton"}, {"name": "ThcsShell"}, {"name": "ThcsMascot"}, {"name": "ThcsAnswer"}, {"name": "ThcsRewards"}, {"name": "AdultShell"}, {"name": "AdultTable"}, {"name": "AdultField"}, {"name": "AdultCharts"}, {"name": "AdultKpi"}]} */
(function(){
"use strict";
/* ---------- Icons (24×24, nét tròn, màu theo currentColor) ---------- */
var ICONS = {
  speaker: '<path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" fill="currentColor" stroke="currentColor" stroke-linejoin="round"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="3" fill="currentColor"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none"/>',
  close: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  back: '<path d="M14.5 5.5L8 12l6.5 6.5"/>',
  next: '<path d="M9.5 5.5L16 12l-6.5 6.5"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  replay: '<path d="M5 12a7 7 0 1 0 2.2-5.1"/><path d="M5 4.5v4h4"/>',
  bulb: '<path d="M9 17.5h6M10 20.5h4"/><path d="M12 3.5a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V17h5.2v-.7c0-.8.4-1.5 1-2A6 6 0 0 0 12 3.5z" fill="none"/>',
  mic: '<rect x="9" y="3.5" width="6" height="11" rx="3" fill="currentColor"/><path d="M6 11.5a6 6 0 0 0 12 0M12 17.5v3" fill="none"/>',
  flip: '<path d="M4 9a8 8 0 0 1 14-3l1.5 1.5M20 15a8 8 0 0 1-14 3L4.5 16.5"/><path d="M19.5 3.5v4h-4M4.5 20.5v-4h4"/>',
  pause: '<path d="M9 6v12M15 6v12"/>',
  play: '<path d="M8 5.5v13l10-6.5z" fill="currentColor" stroke-linejoin="round"/>',
  map: '<path d="M3.5 6.5l5.5-2 6 2 5.5-2v13l-5.5 2-6-2-5.5 2z" fill="none"/><path d="M9 4.5v13M15 6.5v13"/>',
  book: '<path d="M4 5.5c2.5-1 5.5-1 8 .8 2.5-1.8 5.5-1.8 8-.8v13c-2.5-1-5.5-1-8 .8-2.5-1.8-5.5-1.8-8-.8z" fill="none"/><path d="M12 6.3v13"/>',
  gem: '<path d="M7 4.5h10l3.5 5L12 20 3.5 9.5z" fill="none"/><path d="M3.5 9.5h17M9.5 4.5L8 9.5l4 10.5 4-10.5-1.5-5"/>',
  house: '<path d="M4 11l8-6.5 8 6.5"/><path d="M6 9.5v10h12v-10" fill="none"/><path d="M10 19.5v-5h4v5"/>',
  user: '<circle cx="12" cy="8.5" r="4" fill="none"/><path d="M4.5 20c1.2-4 4-5.5 7.5-5.5s6.3 1.5 7.5 5.5" fill="none"/>',
  gear: '<circle cx="12" cy="12" r="3" fill="none"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>',
  moon: '<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" fill="currentColor" stroke-linejoin="round"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" fill="none"/><circle cx="12" cy="12" r="3" fill="currentColor"/>',
  wifi: '<path d="M3 9a13 13 0 0 1 18 0M6 12.5a8.5 8.5 0 0 1 12 0M9 16a4 4 0 0 1 6 0"/><circle cx="12" cy="19" r="1.2" fill="currentColor"/>',
  crown: '<path d="M4 17.5L3 7.5l5 4 4-6 4 6 5-4-1 10z" fill="currentColor" stroke-linejoin="round"/><path d="M4.5 20.5h15"/>',
  clock: '<circle cx="12" cy="12" r="8.5" fill="none"/><path d="M12 7.5V12l3 2"/>',
  keyboard: '<rect x="2.5" y="6" width="19" height="12" rx="2.5" fill="none"/><path d="M6 10h.01M9.5 10h.01M13 10h.01M16.5 10h.01M7 14.5h10"/>',
  /* biểu tượng có màu riêng (không theo currentColor) */
  star: '<path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9z" fill="var(--star)" stroke="var(--star-shade)" stroke-width="1.6" stroke-linejoin="round"/>',
  starEmpty: '<path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9z" fill="var(--star-empty)" stroke="#d6c8b0" stroke-width="1.6" stroke-linejoin="round"/>',
  coin: '<circle cx="12" cy="12" r="9" fill="var(--coin)" stroke="var(--star-shade)" stroke-width="1.8"/><circle cx="12" cy="12" r="5.6" fill="none" stroke="var(--star-shade)" stroke-width="1.6"/><path d="M12 9v6" stroke="var(--star-shade)" stroke-width="1.8"/>',
  flame: '<path d="M12 21.5c-4 0-7-2.8-7-6.6 0-3.4 2.4-5.4 3.6-8 .5 1.8 1.4 3 2.6 3.6C11 7 12.3 4.4 14.6 2.5c.3 3.6 4.4 6 4.4 11.6 0 4.3-3 7.4-7 7.4z" fill="var(--streak)" stroke="#d9541a" stroke-width="1.4" stroke-linejoin="round"/><path d="M12 21.5c-1.9 0-3.2-1.3-3.2-3.1 0-2 1.6-2.9 2.4-4.6.9 1.4 4 2.4 4 4.8 0 1.7-1.4 2.9-3.2 2.9z" fill="var(--star)"/>'
};
var COLORED = { star: 1, starEmpty: 1, coin: 1, flame: 1 };

function icon(name, size, extraClass) {
  var body = ICONS[name] || '';
  var s = size || 24;
  var stroke = COLORED[name] ? '' : ' fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
  return '<svg class="b-ico ' + (extraClass || '') + '" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" aria-hidden="true"' + stroke + '>' + body + '</svg>';
}

/* ---------- Hình minh hoạ từ vựng (120×120, nét viền dragon-line) ---------- */
var L = 'stroke="var(--dragon-line)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
var EYE = function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="5" fill="var(--dragon-line)"/><circle cx="' + (x + 1.6) + '" cy="' + (y - 1.8) + '" r="1.7" fill="#fff"/>'; };
var PICS = {
  cat: '<path d="M30 52 L28 20 L52 36 Z M90 52 L92 20 L68 36 Z" fill="#ffad5a" ' + L + '/><path d="M33 47 L32 29 L45 38 Z M87 47 L88 29 L75 38Z" fill="#ffd2c2"/>' +
       '<ellipse cx="60" cy="68" rx="38" ry="34" fill="#ffad5a" ' + L + '/><path d="M44 40 q4 8 0 14 M60 36 v14 M76 40 q-4 8 0 14" stroke="#e98a35" stroke-width="3" fill="none" stroke-linecap="round"/>' +
       EYE(46, 66) + EYE(74, 66) + '<path d="M56 78 h8 l-4 5 z" fill="#ff8fa8" ' + L + '/><path d="M60 83 q-4 6 -10 4 M60 83 q4 6 10 4" fill="none" ' + L + '/>' +
       '<path d="M30 76 h-16 M30 82 l-14 4 M90 76 h16 M90 82 l14 4" stroke="var(--dragon-line)" stroke-width="2.2" stroke-linecap="round"/>',
  dog: '<ellipse cx="60" cy="64" rx="36" ry="36" fill="#d79b62" ' + L + '/><path d="M28 40 C10 44 12 78 24 84 C34 80 34 56 34 46 Z M92 40 C110 44 108 78 96 84 C86 80 86 56 86 46 Z" fill="#8a5a35" ' + L + '/>' +
       '<ellipse cx="60" cy="82" rx="22" ry="16" fill="#fbe3c4" ' + L + '/>' + EYE(46, 60) + EYE(74, 60) +
       '<ellipse cx="60" cy="74" rx="7" ry="5" fill="var(--dragon-line)"/><path d="M60 79 v6 M52 86 q8 6 16 0" fill="none" ' + L + '/><path d="M56 88 q4 10 8 0" fill="#ff8fa8" ' + L + '/>',
  fish: '<path d="M88 60 L112 40 L108 60 L112 80 Z" fill="#ffb84d" ' + L + '/><ellipse cx="56" cy="60" rx="40" ry="28" fill="#4fb3ff" ' + L + '/>' +
        '<path d="M50 40 q10 -14 22 -4" fill="#ffb84d" ' + L + '/><path d="M58 50 q8 10 0 20 M68 48 q8 12 0 24" fill="none" stroke="#2f8fd8" stroke-width="3" stroke-linecap="round"/>' +
        EYE(34, 54) + '<path d="M20 66 q6 4 10 0" fill="none" ' + L + '/><circle cx="18" cy="30" r="5" fill="#d9f2ff" ' + L + '/><circle cx="10" cy="16" r="3" fill="#d9f2ff" stroke="var(--dragon-line)" stroke-width="2"/>',
  bird: '<path d="M46 98 v12 M66 98 v12 M40 110 h12 M60 110 h12" ' + L + '/><ellipse cx="58" cy="66" rx="38" ry="36" fill="#ffd23f" ' + L + '/>' +
        '<path d="M56 70 q18 -6 30 10 q-16 14 -30 -10z" fill="#ffb300" ' + L + '/><path d="M42 30 q4 -12 14 -8 q-2 -10 10 -8" fill="none" ' + L + '/>' +
        EYE(44, 56) + '<path d="M20 60 L6 66 L20 72 Z" fill="#ff8a3d" ' + L + '/><ellipse cx="34" cy="72" rx="6" ry="4" fill="var(--dragon-cheek)" opacity=".8"/>',
  duck: '<path d="M8 96 q14 -8 28 0 q14 8 28 0 q14 -8 28 0 q14 8 20 2" fill="none" stroke="#4fb3ff" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M22 70 q0 -18 30 -16 h20 q30 0 34 -18 q8 26 -8 44 q-12 12 -40 10 q-36 0 -36 -20z" fill="#ffe14d" ' + L + '/>' +
        '<circle cx="44" cy="40" r="22" fill="#ffe14d" ' + L + '/><path d="M20 42 q-12 2 -14 8 q10 4 18 -2z" fill="#ff8a3d" ' + L + '/>' + EYE(40, 36) +
        '<path d="M58 72 q14 6 26 -4" fill="none" ' + L + '/>',
  rabbit: '<path d="M40 50 C30 10 40 2 48 6 C56 12 54 34 52 48 Z M80 50 C90 10 80 2 72 6 C64 12 66 34 68 48 Z" fill="#f2eef8" ' + L + '/>' +
          '<path d="M44 44 C38 20 42 14 46 14 C50 18 50 32 49 44Z M76 44 C82 20 78 14 74 14 C70 18 70 32 71 44Z" fill="#ffc2d1"/>' +
          '<ellipse cx="60" cy="74" rx="36" ry="32" fill="#f2eef8" ' + L + '/>' + EYE(47, 70) + EYE(73, 70) +
          '<path d="M56 82 h8 l-4 4z" fill="#ff8fa8" ' + L + '/><path d="M60 86 v6 M54 92 h12" fill="none" ' + L + '/><ellipse cx="38" cy="84" rx="6" ry="4" fill="var(--dragon-cheek)" opacity=".7"/><ellipse cx="82" cy="84" rx="6" ry="4" fill="var(--dragon-cheek)" opacity=".7"/>',
  apple: '<path d="M60 36 C44 22 14 30 16 62 C18 92 40 110 60 100 C80 110 102 92 104 62 C106 30 76 22 60 36 Z" fill="#ef5350" ' + L + '/>' +
         '<path d="M60 36 C60 26 62 18 68 12" fill="none" stroke="#7a4b2a" stroke-width="5" stroke-linecap="round"/><path d="M66 24 C74 10 92 12 96 18 C88 30 74 30 66 24Z" fill="#6cc04a" ' + L + '/>' +
         '<path d="M30 56 C30 46 38 42 44 42" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>',
  banana: '<path d="M18 30 C14 70 44 104 98 96 C106 94 106 88 100 86 C58 88 36 62 34 30 C34 22 20 22 18 30Z" fill="#ffd93b" ' + L + '/>' +
          '<path d="M28 34 C30 66 52 86 86 90" fill="none" stroke="#e6b400" stroke-width="3" stroke-linecap="round"/><path d="M18 30 l-2 -10 l12 2z" fill="#7a5a2a" ' + L + '/><path d="M100 86 l8 2 l-6 6z" fill="#7a5a2a" ' + L + '/>',
  grapes: '<path d="M60 22 C60 14 64 8 70 6" fill="none" stroke="#7a4b2a" stroke-width="4" stroke-linecap="round"/><path d="M64 18 C76 6 98 10 100 18 C88 28 72 28 64 18Z" fill="#6cc04a" ' + L + '/>' +
          [[44, 36], [62, 34], [80, 36], [36, 54], [54, 54], [72, 54], [90, 54], [46, 72], [64, 72], [82, 72], [56, 90], [74, 90], [65, 106]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="11" fill="#9b5de5" ' + L + '/>'; }).join('') +
          '<circle cx="42" cy="50" r="3" fill="#fff" opacity=".7"/><circle cx="60" cy="68" r="3" fill="#fff" opacity=".7"/>',
  orange: '<circle cx="60" cy="66" r="42" fill="#ff9a1f" ' + L + '/><path d="M60 24 C58 16 60 12 64 8" fill="none" stroke="#7a4b2a" stroke-width="4" stroke-linecap="round"/><path d="M62 22 C70 8 90 10 94 16 C86 28 70 28 62 22Z" fill="#6cc04a" ' + L + '/>' +
          '<circle cx="44" cy="58" r="2" fill="#e07a00"/><circle cx="74" cy="80" r="2" fill="#e07a00"/><circle cx="60" cy="92" r="2" fill="#e07a00"/><circle cx="82" cy="56" r="2" fill="#e07a00"/><path d="M34 54 C36 44 42 40 48 38" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>',
  pear: '<path d="M60 22 C46 22 46 40 44 50 C40 62 24 70 26 90 C28 108 50 112 60 112 C70 112 92 108 94 90 C96 70 80 62 76 50 C74 40 74 22 60 22Z" fill="#a8d64b" ' + L + '/>' +
        '<path d="M60 22 C60 14 62 10 66 6" fill="none" stroke="#7a4b2a" stroke-width="4" stroke-linecap="round"/><path d="M64 16 C72 4 88 6 92 12 C84 22 72 22 64 16Z" fill="#4fae3a" ' + L + '/><path d="M40 82 C40 72 44 68 48 66" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>',
  strawberry: '<path d="M22 44 C22 30 98 30 98 44 C98 72 78 104 60 110 C42 104 22 72 22 44Z" fill="#ff5a6e" ' + L + '/>' +
              '<path d="M30 40 L40 22 L50 34 L60 16 L70 34 L80 22 L90 40 C76 48 44 48 30 40Z" fill="#4fae3a" ' + L + '/>' +
              [[40, 56], [60, 54], [80, 56], [48, 72], [70, 72], [58, 88], [42, 88], [76, 86], [60, 100]].map(function (p) { return '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="2.4" ry="3.4" fill="#ffe69a"/>'; }).join(''),
  ball: '<circle cx="60" cy="60" r="46" fill="#fff" ' + L + '/><path d="M60 14 C40 30 40 90 60 106 C42 100 16 80 14 60 C16 40 40 18 60 14Z" fill="#ff5a6e"/><path d="M60 14 C80 30 80 90 60 106 C78 100 104 80 106 60 C104 40 80 18 60 14Z" fill="#3fa9f5"/>' +
        '<circle cx="60" cy="60" r="46" fill="none" ' + L + '/><path d="M60 14 C40 30 40 90 60 106 M60 14 C80 30 80 90 60 106" fill="none" ' + L + '/><circle cx="60" cy="60" r="8" fill="#ffd23f" ' + L + '/>',
  kite: '<path d="M60 8 L94 46 L60 92 L26 46 Z" fill="#ff7a59" ' + L + '/><path d="M60 8 L60 92 M26 46 L94 46" ' + L + '/><path d="M60 8 L94 46 L60 46Z" fill="#ffd23f" ' + L + '/><path d="M60 46 L26 46 L60 92Z" fill="#3fa9f5" ' + L + '/>' +
        '<path d="M60 92 C52 100 68 104 60 112 C54 118 46 112 40 116" fill="none" ' + L + '/><path d="M54 102 l-8 -4 l2 8z M66 108 l8 -4 l-2 8z" fill="#9b5de5" ' + L + '/>',
  teddy: '<circle cx="30" cy="32" r="14" fill="#c98b55" ' + L + '/><circle cx="90" cy="32" r="14" fill="#c98b55" ' + L + '/><circle cx="30" cy="32" r="6" fill="#f2c79a"/><circle cx="90" cy="32" r="6" fill="#f2c79a"/>' +
         '<ellipse cx="60" cy="64" rx="40" ry="38" fill="#c98b55" ' + L + '/><ellipse cx="60" cy="80" rx="18" ry="14" fill="#f2c79a" ' + L + '/>' + EYE(45, 60) + EYE(75, 60) + '<ellipse cx="60" cy="74" rx="6" ry="4.5" fill="var(--dragon-line)"/><path d="M60 78 v5 M53 86 q7 5 14 0" fill="none" ' + L + '/>',
  red: '<path d="M60 14 C82 12 104 30 102 56 C110 70 104 98 80 102 C66 112 40 108 30 96 C10 88 12 62 22 50 C20 30 40 14 60 14Z" fill="#e53950" ' + L + '/><circle cx="100" cy="22" r="7" fill="#e53950" ' + L + '/><path d="M40 40 C44 34 50 32 56 32" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>',
  blue: '<path d="M60 14 C82 12 104 30 102 56 C110 70 104 98 80 102 C66 112 40 108 30 96 C10 88 12 62 22 50 C20 30 40 14 60 14Z" fill="#2f7ff0" ' + L + '/><circle cx="18" cy="100" r="7" fill="#2f7ff0" ' + L + '/><path d="M40 40 C44 34 50 32 56 32" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>',
  yellow: '<path d="M60 14 C82 12 104 30 102 56 C110 70 104 98 80 102 C66 112 40 108 30 96 C10 88 12 62 22 50 C20 30 40 14 60 14Z" fill="#ffd23f" ' + L + '/><circle cx="104" cy="98" r="7" fill="#ffd23f" ' + L + '/><path d="M40 40 C44 34 50 32 56 32" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>',
  green: '<path d="M60 14 C82 12 104 30 102 56 C110 70 104 98 80 102 C66 112 40 108 30 96 C10 88 12 62 22 50 C20 30 40 14 60 14Z" fill="#3fb950" ' + L + '/><circle cx="16" cy="22" r="7" fill="#3fb950" ' + L + '/><path d="M40 40 C44 34 50 32 56 32" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>',
  one: '<circle cx="60" cy="60" r="26" fill="#ffd23f" ' + L + '/>' ,
  two: '<circle cx="36" cy="60" r="22" fill="#ff7a59" ' + L + '/><circle cx="84" cy="60" r="22" fill="#ff7a59" ' + L + '/>',
  three: '<circle cx="60" cy="34" r="20" fill="#3fa9f5" ' + L + '/><circle cx="34" cy="80" r="20" fill="#3fa9f5" ' + L + '/><circle cx="86" cy="80" r="20" fill="#3fa9f5" ' + L + '/>'
};

var WORDS = {
  cat:    { vi: 'con mèo',   ipa: '/kæt/',        ex: 'The cat is sleeping.',   exVi: 'Con mèo đang ngủ.',            topic: 'animals' },
  dog:    { vi: 'con chó',   ipa: '/dɒɡ/',        ex: 'My dog can run.',        exVi: 'Con chó của tớ chạy được.',    topic: 'animals' },
  fish:   { vi: 'con cá',    ipa: '/fɪʃ/',        ex: 'The fish can swim.',     exVi: 'Con cá biết bơi.',             topic: 'animals' },
  bird:   { vi: 'con chim',  ipa: '/bɜːd/',       ex: 'The bird can fly.',      exVi: 'Con chim biết bay.',           topic: 'animals' },
  duck:   { vi: 'con vịt',   ipa: '/dʌk/',        ex: 'The duck is in the pond.', exVi: 'Con vịt ở dưới ao.',         topic: 'animals' },
  rabbit: { vi: 'con thỏ',   ipa: '/ˈræb.ɪt/',    ex: 'The rabbit is white.',   exVi: 'Con thỏ màu trắng.',           topic: 'animals' },
  apple:  { vi: 'quả táo',   ipa: '/ˈæp.əl/',     ex: 'I eat an apple.',        exVi: 'Tớ ăn một quả táo.',           topic: 'fruits' },
  banana: { vi: 'quả chuối', ipa: '/bəˈnɑː.nə/',  ex: 'The banana is yellow.',  exVi: 'Quả chuối màu vàng.',          topic: 'fruits' },
  grapes: { vi: 'quả nho',   ipa: '/ɡreɪps/',     ex: 'I like grapes.',         exVi: 'Tớ thích ăn nho.',             topic: 'fruits' },
  orange: { vi: 'quả cam',   ipa: '/ˈɒr.ɪndʒ/',   ex: 'This is an orange.',     exVi: 'Đây là một quả cam.',          topic: 'fruits' },
  pear:   { vi: 'quả lê',    ipa: '/peə/',        ex: 'The pear is green.',     exVi: 'Quả lê màu xanh.',             topic: 'fruits' },
  strawberry: { vi: 'quả dâu tây', ipa: '/ˈstrɔː.bər.i/', ex: 'The strawberry is red.', exVi: 'Quả dâu tây màu đỏ.', topic: 'fruits' },
  ball:   { vi: 'quả bóng',  ipa: '/bɔːl/',       ex: 'Kick the ball!',         exVi: 'Đá quả bóng nào!',             topic: 'toys' },
  kite:   { vi: 'cái diều',  ipa: '/kaɪt/',       ex: 'I fly a kite.',          exVi: 'Tớ thả diều.',                 topic: 'toys' },
  teddy:  { vi: 'gấu bông',  ipa: '/ˈted.i/',     ex: 'I hug my teddy.',        exVi: 'Tớ ôm gấu bông.',              topic: 'toys' },
  red:    { vi: 'màu đỏ',    ipa: '/red/',        ex: 'The apple is red.',      exVi: 'Quả táo màu đỏ.',              topic: 'colors' },
  blue:   { vi: 'màu xanh dương', ipa: '/bluː/',  ex: 'The sky is blue.',       exVi: 'Bầu trời màu xanh dương.',     topic: 'colors' },
  yellow: { vi: 'màu vàng',  ipa: '/ˈjel.əʊ/',    ex: 'The sun is yellow.',     exVi: 'Mặt trời màu vàng.',           topic: 'colors' },
  green:  { vi: 'màu xanh lá', ipa: '/ɡriːn/',    ex: 'The leaf is green.',     exVi: 'Chiếc lá màu xanh lá.',        topic: 'colors' },
  one:    { vi: 'số một',    ipa: '/wʌn/',        ex: 'I have one nose.',       exVi: 'Tớ có một cái mũi.',           topic: 'numbers' },
  two:    { vi: 'số hai',    ipa: '/tuː/',        ex: 'I have two eyes.',       exVi: 'Tớ có hai con mắt.',           topic: 'numbers' },
  three:  { vi: 'số ba',     ipa: '/θriː/',       ex: 'Three little ducks.',    exVi: 'Ba chú vịt nhỏ.',              topic: 'numbers' }
};
var TOPICS = { animals: 'Con vật', fruits: 'Trái cây', toys: 'Đồ chơi', colors: 'Màu sắc', numbers: 'Số đếm' };

function pic(word, size) {
  var s = size || 120;
  return '<svg class="b-pic" width="' + s + '" height="' + s + '" viewBox="0 0 120 120" role="img" aria-label="' + word + '">' + (PICS[word] || '') + '</svg>';
}

/* ---------- Rồng Bông: linh vật đồng hành, 6 biểu cảm ---------- */
var EXPR_LABEL = { chao: 'chào', vui: 'vui mừng', dongvien: 'động viên', suynghi: 'suy nghĩ', ngu: 'đang ngủ', chucmung: 'chúc mừng', tiec: 'hơi tiếc', xaydung: 'đang xây dựng' };
function tube(d, extra) {
  return '<g class="dg-arm ' + (extra || '') + '"><path d="' + d + '" fill="none" stroke="var(--dragon-line)" stroke-width="19" stroke-linecap="round"/>' +
         '<path d="' + d + '" fill="none" stroke="var(--dragon-body)" stroke-width="12" stroke-linecap="round"/></g>';
}
function dragon(expr, size, opts) {
  expr = expr || 'chao';
  opts = opts || {};
  var s = size || 200;
  var ln = 'stroke="var(--dragon-line)" stroke-width="3.5" stroke-linejoin="round"';
  var body = 'fill="var(--dragon-body)" ' + ln, wing = 'fill="var(--dragon-wing)" ' + ln, belly = 'fill="var(--dragon-belly)" ' + ln;
  var o = [];
  // đuôi + cánh (phía sau)
  o.push('<path d="M138 152 C170 158 186 140 180 114 C178 106 170 108 171 116 C172 134 158 142 136 138 Z" ' + body + '/>');
  o.push('<path d="M171 118 L160 100 L184 102 Z" ' + wing + '/>');
  o.push('<g class="dg-wings"><path d="M60 122 C38 104 24 112 18 126 C30 124 32 132 28 142 C42 134 48 140 52 148 Z" ' + wing + '/>' +
         '<path d="M140 122 C162 104 176 112 182 126 C170 124 168 132 172 142 C158 134 152 140 148 148 Z" ' + wing + '/></g>');
  // thân
  o.push('<ellipse cx="100" cy="148" rx="50" ry="42" ' + body + '/>');
  o.push('<ellipse cx="100" cy="154" rx="31" ry="29" ' + belly + '/>');
  o.push('<path d="M80 142 h40 M76 154 h48 M80 166 h40" stroke="#e7c06a" stroke-width="3" stroke-linecap="round"/>');
  o.push('<ellipse cx="74" cy="188" rx="19" ry="10" ' + body + '/><ellipse cx="126" cy="188" rx="19" ry="10" ' + body + '/>');
  // tay
  var armL = 'M64 134 Q66 150 80 154', armR = 'M136 134 Q134 150 120 154';
  if (expr === 'chao') { o.push(tube(armL)); o.push('<g class="dg-wave">' + tube('M138 132 Q158 120 164 98') + '<circle cx="165" cy="94" r="10" ' + body + '/></g>'); o.push('<path d="M180 80 q8 8 4 18 M188 72 q12 12 6 28" fill="none" stroke="var(--dragon-line)" stroke-width="3" stroke-linecap="round" opacity=".55"/>'); }
  else if (expr === 'vui' || expr === 'chucmung') { o.push(tube('M62 130 Q46 118 40 96')); o.push(tube('M138 130 Q154 118 160 96')); o.push('<circle cx="39" cy="92" r="10" ' + body + '/><circle cx="161" cy="92" r="10" ' + body + '/>'); }
  else if (expr === 'dongvien') { o.push(tube(armL)); o.push(tube('M136 134 Q156 130 160 112')); o.push('<rect x="153" y="66" width="13" height="30" rx="6.5" ' + body + '/><rect x="146" y="88" width="30" height="26" rx="11" ' + body + '/><path d="M150 97 h12 M150 105 h12" stroke="var(--dragon-line)" stroke-width="2.5" stroke-linecap="round"/>'); }
  else if (expr === 'suynghi') { o.push(tube(armL)); o.push(tube('M138 136 Q132 122 120 116')); }
  else if (expr === 'tiec') { o.push(tube('M64 134 Q70 150 92 150')); o.push(tube('M136 134 Q130 150 108 150')); o.push('<circle cx="100" cy="150" r="10" ' + body + '/>'); }
  else if (expr === 'xaydung') { o.push(tube(armL)); o.push(tube('M138 130 Q156 124 162 106')); }
  else { o.push(tube(armL)); o.push(tube(armR)); }
  // đầu
  o.push('<g class="dg-head">');
  o.push('<path d="M72 46 C64 30 66 18 72 12 C80 20 84 30 86 40 Z" ' + wing + '/><path d="M128 46 C136 30 134 18 128 12 C120 20 116 30 114 40 Z" ' + wing + '/>');
  o.push('<path d="M48 70 L28 60 L36 82 Z" ' + wing + '/><path d="M152 70 L172 60 L164 82 Z" ' + wing + '/>');
  o.push('<ellipse cx="100" cy="78" rx="56" ry="48" ' + body + '/>');
  o.push('<path d="M90 33 Q94 20 100 30 Q106 20 110 33" ' + wing + '/>');
  o.push('<ellipse cx="100" cy="100" rx="28" ry="18" ' + belly + '/>');
  o.push('<ellipse cx="92" cy="94" rx="2.6" ry="3.4" fill="var(--dragon-line)"/><ellipse cx="108" cy="94" rx="2.6" ry="3.4" fill="var(--dragon-line)"/>');
  o.push('<ellipse cx="60" cy="96" rx="9" ry="6" fill="var(--dragon-cheek)" opacity=".85"/><ellipse cx="140" cy="96" rx="9" ry="6" fill="var(--dragon-cheek)" opacity=".85"/>');
  // mắt
  var openEye = function (x, px, py) { return '<ellipse cx="' + x + '" cy="72" rx="12" ry="14" fill="#fff" ' + ln + '/><circle cx="' + px + '" cy="' + py + '" r="7.5" fill="var(--dragon-line)"/><circle cx="' + (px + 3) + '" cy="' + (py - 3.5) + '" r="2.8" fill="#fff"/>'; };
  var arc = function (d) { return '<path d="' + d + '" fill="none" stroke="var(--dragon-line)" stroke-width="4.5" stroke-linecap="round"/>'; };
  if (expr === 'vui' || expr === 'chucmung') o.push(arc('M66 76 Q78 60 90 76') + arc('M110 76 Q122 60 134 76'));
  else if (expr === 'ngu') o.push(arc('M66 72 Q78 82 90 72') + arc('M110 72 Q122 82 134 72'));
  else if (expr === 'suynghi') o.push('<g class="dg-eyes">' + openEye(78, 82, 66) + openEye(122, 126, 66) + '</g>');
  else if (expr === 'tiec') o.push('<g class="dg-eyes">' + openEye(78, 77, 78) + openEye(122, 121, 78) + '</g>');
  else o.push('<g class="dg-eyes">' + openEye(78, 79, 74) + openEye(122, 121, 74) + '</g>');
  if (expr === 'dongvien') o.push(arc('M68 54 Q78 48 88 54') + arc('M112 54 Q122 48 132 54'));
  if (expr === 'tiec') o.push(arc('M68 56 Q80 54 88 46') + arc('M112 46 Q120 54 132 56'));
  // miệng
  if (expr === 'chao' || expr === 'vui' || expr === 'chucmung') o.push('<path d="M87 104 Q100 122 113 104 Z" fill="#8a2d3d" ' + ln + '/><ellipse cx="100" cy="112" rx="6" ry="3.5" fill="#ff8fa8"/>');
  else if (expr === 'ngu') o.push('<ellipse cx="100" cy="107" rx="4" ry="3" fill="#8a2d3d"/>');
  else if (expr === 'suynghi') o.push('<path d="M92 107 Q100 102 108 108" fill="none" stroke="var(--dragon-line)" stroke-width="3.5" stroke-linecap="round"/>');
  else if (expr === 'tiec') o.push('<path d="M91 109 Q100 103 109 109" fill="none" stroke="var(--dragon-line)" stroke-width="3.5" stroke-linecap="round"/>');
  else if (expr === 'xaydung') o.push('<path d="M88 104 Q100 116 112 104" fill="none" stroke="var(--dragon-line)" stroke-width="3.5" stroke-linecap="round"/><path d="M104 108 q4 6 9 2" fill="#ff8fa8" stroke="var(--dragon-line)" stroke-width="2.5"/>');
  else o.push('<path d="M89 104 Q100 114 111 104" fill="none" stroke="var(--dragon-line)" stroke-width="3.5" stroke-linecap="round"/>');
  o.push('</g>');
  // phụ kiện
  if (expr === 'suynghi') {
    o.push('<circle cx="116" cy="114" r="10" ' + body + '/>');
    o.push('<circle cx="160" cy="42" r="5" fill="#fff" ' + ln + '/><circle cx="172" cy="26" r="8" fill="#fff" ' + ln + '/>');
    o.push('<g class="dg-q"><circle cx="188" cy="6" r="0" /><text x="176" y="20" font-family="Baloo 2, Nunito, sans-serif" font-weight="800" font-size="30" fill="var(--brand)">?</text></g>');
  }
  if (expr === 'ngu') {
    o.push('<path d="M58 52 C62 22 104 10 134 30 C150 42 160 58 166 78 L150 74 C142 56 120 42 100 40 C82 40 68 46 58 52 Z" fill="#8fa2ff" ' + ln + '/>');
    o.push('<path d="M60 52 C80 36 120 34 140 50" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".9"/>');
    o.push('<circle cx="166" cy="82" r="9" fill="#fff" ' + ln + '/>');
    o.push('<g class="dg-z" font-family="Baloo 2, Nunito, sans-serif" font-weight="800" fill="var(--brand)"><text x="150" y="30" font-size="22">z</text><text x="166" y="16" font-size="28">Z</text></g>');
  }
  if (expr === 'chucmung') {
    o.push('<path d="M82 34 L104 -2 L120 34 Z" fill="var(--star)" ' + ln + ' transform="rotate(8 100 30)"/><circle cx="106" cy="-2" r="6" fill="var(--dragon-cheek)" ' + ln + ' transform="rotate(8 100 30)"/>');
    var conf = [[24, 40, '#ff8a3d', 20], [176, 34, '#3fa9f5', -25], [16, 96, '#9b5de5', 40], [186, 150, '#ffd23f', 10], [34, 168, '#3fb950', -30], [160, 12, '#ff5a6e', 15]];
    o.push('<g class="dg-confetti">' + conf.map(function (c) { return '<rect x="' + c[0] + '" y="' + c[1] + '" width="10" height="6" rx="2" fill="' + c[2] + '" transform="rotate(' + c[3] + ' ' + c[0] + ' ' + c[1] + ')"/>'; }).join('') + '</g>');
  }
  if (expr === 'xaydung') {
    o.push('<g transform="rotate(24 164 104)"><rect x="159" y="40" width="9" height="70" rx="4.5" fill="var(--dragon-tool)" ' + ln + '/><rect x="144" y="28" width="40" height="20" rx="5" fill="var(--dragon-tool-head)" ' + ln + '/></g><circle cx="163" cy="104" r="10" ' + body + '/>');
    o.push('<path d="M56 52 C58 22 142 22 144 52 Z" fill="var(--dragon-hat)" ' + ln + '/><rect x="46" y="48" width="108" height="12" rx="6" fill="var(--dragon-hat-shade)" ' + ln + '/><path d="M100 24 V48 M84 28 L88 48 M116 28 L112 48" stroke="var(--dragon-hat-shade)" stroke-width="5" stroke-linecap="round"/>');
    o.push('<g class="dg-dust" fill="var(--star-empty)" stroke="var(--dragon-line)" stroke-width="2"><circle cx="186" cy="70" r="5"/><circle cx="194" cy="84" r="3.5"/></g>');
  }
  if (expr === 'vui') o.push('<g class="dg-spark" fill="var(--star)" stroke="var(--star-shade)" stroke-width="2"><path d="M22 52 l4 8 8 4 -8 4 -4 8 -4 -8 -8 -4 8 -4z"/><path d="M176 40 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3z"/></g>');
  var label = 'Rồng Bông ' + (EXPR_LABEL[expr] || '');
  return '<svg class="b-dragon b-dragon--' + expr + (opts.cls ? ' ' + opts.cls : '') + '" width="' + s + '" height="' + s + '" viewBox="0 -10 200 210" role="img" aria-label="' + label + '" style="overflow:visible">' + o.join('') + '</svg>';
}

/* ---------- Ảnh hồ sơ bé (minh hoạ) ---------- */
var HAIR = {
  short: '<path d="M22 46 C20 22 40 12 60 12 C82 12 100 24 98 48 C90 36 78 30 60 32 C44 32 30 38 22 46Z" fill="#3a2a28"/>',
  bob: '<path d="M18 62 C12 26 36 10 60 10 C84 10 108 26 102 62 C100 70 96 70 94 62 C92 42 80 34 60 34 C40 34 28 42 26 62 C24 70 20 70 18 62Z" fill="#4a2f22"/>',
  buns: '<circle cx="28" cy="22" r="13" fill="#2f2230"/><circle cx="92" cy="22" r="13" fill="#2f2230"/><path d="M22 50 C20 24 40 14 60 14 C80 14 100 24 98 50 C90 38 76 32 60 32 C44 32 30 38 22 50Z" fill="#2f2230"/>',
  spiky: '<path d="M22 48 L26 22 L38 30 L44 12 L56 26 L66 10 L74 26 L88 14 L90 32 L100 30 L98 48 C88 36 76 32 60 32 C44 32 32 36 22 48Z" fill="#2c2420"/>'
};
function avatar(kid, size) {
  var s = size || 96;
  var h = HAIR[kid.hair || 'short'];
  return '<svg class="b-avatar-svg" width="' + s + '" height="' + s + '" viewBox="0 0 120 120" role="img" aria-label="Ảnh của ' + kid.name + '">' +
    '<circle cx="60" cy="60" r="60" fill="var(--level-' + (kid.level || 1) + '-soft)"/>' +
    '<path d="M24 120 C26 96 40 88 60 88 C80 88 94 96 96 120Z" fill="var(--level-' + (kid.level || 1) + ')"/>' +
    '<ellipse cx="60" cy="56" rx="36" ry="38" fill="#ffd9b8" stroke="var(--dragon-line)" stroke-width="3"/>' + h +
    '<circle cx="46" cy="60" r="4.5" fill="var(--dragon-line)"/><circle cx="74" cy="60" r="4.5" fill="var(--dragon-line)"/>' +
    '<ellipse cx="38" cy="72" rx="6" ry="4" fill="var(--dragon-cheek)" opacity=".7"/><ellipse cx="82" cy="72" rx="6" ry="4" fill="var(--dragon-cheek)" opacity=".7"/>' +
    '<path d="M50 74 Q60 84 70 74" fill="none" stroke="var(--dragon-line)" stroke-width="3.5" stroke-linecap="round"/></svg>';
}

/* ---------- Dữ liệu dùng chung ---------- */
var LEVELS = [
  { n: 1, name: 'Hạt giống', en: 'Seed', kind: 'island' }, { n: 2, name: 'Mầm non', en: 'Sprout', kind: 'island' },
  { n: 3, name: 'Lá xanh', en: 'Leaf', kind: 'island' }, { n: 4, name: 'Cành cây', en: 'Branch', kind: 'island' },
  { n: 5, name: 'Cây lớn', en: 'Big Tree', kind: 'island' }, { n: 6, name: 'Singapore', kind: 'city' },
  { n: 7, name: 'Sydney', kind: 'city' }, { n: 8, name: 'London', kind: 'city' },
  { n: 9, name: 'New York', kind: 'city' }, { n: 10, name: 'Toronto', kind: 'city' }
];
var KIDS = [
  { id: 'an', name: 'Minh An', grade: 1, level: 1, hair: 'buns' },
  { id: 'ngoc', name: 'Bảo Ngọc', grade: 4, level: 3, hair: 'bob' },
  { id: 'huy', name: 'Gia Huy', grade: 7, level: 7, hair: 'spiky' }
];

function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

/* ---------- Theme: Tiểu học luôn hiển thị theme tieu-hoc; THCS chọn sáng/tối ---------- */
var HTML = document.documentElement, HOST_THEME = HTML.getAttribute('data-theme'), SUITE = 'tieu-hoc', MODE = HOST_THEME === 'thcs-toi' ? 'thcs-toi' : 'thcs', modeListeners = [];
function applyTheme() { var want = SUITE === 'thcs' ? MODE : SUITE === 'adult' ? 'thcs' : 'tieu-hoc'; if (HTML.getAttribute('data-theme') !== want) HTML.setAttribute('data-theme', want); }
function suite(name) { SUITE = name === 'thcs' || name === 'adult' ? name : 'tieu-hoc'; applyTheme(); return SUITE; }
function setMode(m) { MODE = m === 'thcs-toi' ? 'thcs-toi' : 'thcs'; applyTheme(); modeListeners.forEach(function (f) { f(MODE); }); return MODE; }
applyTheme();
try { new MutationObserver(function () { var cur = HTML.getAttribute('data-theme'); if (SUITE === 'thcs' && (cur === 'thcs' || cur === 'thcs-toi') && cur !== MODE) { setMode(cur); return; } applyTheme(); }).observe(HTML, { attributes: true, attributeFilter: ['data-theme'] }); } catch (e) {}

/* ---------- Mảnh HTML ---------- */
function key(k, cls) { return '<kbd class="b-key ' + (cls || '') + '" aria-hidden="true">' + k + '</kbd>'; }
function btn(o) {
  var cls = ['b-btn', 'b-btn--' + (o.variant || 'primary'), 'b-btn--' + (o.size || 'm')];
  if (o.cls) cls.push(o.cls);
  if (o.block) cls.push('b-btn--block');
  var a = o.attrs || '';
  return '<button type="button" class="' + cls.join(' ') + '" ' + a + (o.disabled ? ' disabled' : '') + '>' +
    (o.icon ? icon(o.icon, o.size === 'l' ? 28 : 22) : '') + (o.label ? '<span>' + o.label + '</span>' : '') + (o.key ? key(o.key) : '') + '</button>';
}
function speak(word, size, label) {
  return '<button type="button" class="b-speak b-speak--' + (size || 's') + '" data-say="' + esc(word) + '" aria-label="' + esc(label || ('Nghe: ' + word)) + '">' + icon('speaker', size === 'l' ? 52 : size === 'm' ? 28 : 22) + '</button>';
}
function sk(w, h, r, extra) { return '<span class="b-sk" style="width:' + w + ';height:' + h + ';border-radius:' + (r || 'var(--radius-md)') + ';' + (extra || '') + '"></span>'; }
function stars(n, size) { var o = ''; for (var i = 0; i < 3; i++) o += icon(i < n ? 'star' : 'starEmpty', size || 18); return '<span class="b-stars" aria-label="' + n + ' trên 3 sao">' + o + '</span>'; }
function levelChip(n) { var l = LEVELS[n - 1]; return '<span class="b-lvchip" data-level="' + n + '">Cấp ' + n + ' · ' + l.name + '</span>'; }
function stat(kind, value, label) {
  var ic = { stars: 'star', coins: 'coin', streak: 'flame' }[kind];
  return '<div class="b-stat" data-stat="' + kind + '" title="' + label + '">' + icon(ic, 28) + '<span class="stat">' + value + '</span><span class="b-sr">' + label + '</span></div>';
}
function topbar(o) {
  o = o || {};
  var left = (o.back ? '<button type="button" class="b-iconbtn" aria-label="' + (o.backLabel || 'Quay lại') + '" data-act="back">' + icon(o.backIcon || 'back', 26) + '</button>' : '') +
    (o.kid ? '<div class="b-me">' + avatar(o.kid, 48) + '<div><div class="label">' + o.kid.name + '</div><div class="caption b-muted">' + levelChip(o.kid.level).replace('b-lvchip', 'b-lvchip b-lvchip--plain') + '</div></div></div>' : '') +
    (o.title ? '<div class="b-topbar__title title">' + o.title + '</div>' : '');
  var right = (o.right || '') + (o.stats === false ? '' : stat('stars', o.stars == null ? 128 : o.stars, 'sao') + stat('coins', o.coins == null ? 340 : o.coins, 'xu') + stat('streak', (o.streak == null ? 5 : o.streak), 'ngày học liên tiếp'));
  return '<header class="b-topbar"><div class="b-topbar__l">' + left + '</div><div class="b-topbar__r">' + right + '</div></header>';
}
function bubble(text, side) { return '<div class="b-bubble b-bubble--' + (side || 'left') + ' body-l">' + text + '</div>'; }
function stateBlock(o) {
  var bf = o.button || btn;
  return '<div class="b-state b-state--' + o.kind + (o.cls ? ' ' + o.cls : '') + '" role="' + (o.kind === 'error' ? 'alert' : 'status') + '">' + (o.mascot != null ? o.mascot : dragon(o.expr || (o.kind === 'error' ? 'dongvien' : 'suynghi'), o.size || 200)) +
    '<h2 class="' + (o.titleCls || 'title') + '">' + o.title + '</h2>' + (o.text ? '<p class="' + (o.textCls || 'body-l') + ' b-muted">' + o.text + '</p>' : '') +
    '<div class="b-state__actions">' + (o.action || (o.kind === 'error' ? bf({ label: 'Thử lại', icon: 'replay', size: 'l', attrs: 'data-retry' }) : '')) + '</div></div>';
}

/* ---------- Âm thanh: đọc từ tiếng Anh ---------- */
var voice = null;
function say(text, btnEl) {
  try {
    var sy = window.speechSynthesis; if (!sy) return;
    if (!voice) { var vs = sy.getVoices(); voice = vs.filter(function (v) { return /en[-_]US/i.test(v.lang); })[0] || vs.filter(function (v) { return /^en/i.test(v.lang); })[0] || null; }
    sy.cancel(); var u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = 0.82; if (voice) u.voice = voice; sy.speak(u);
  } catch (e) { /* trình duyệt không hỗ trợ: vẫn hiện hiệu ứng */ }
  if (btnEl) { btnEl.classList.remove('is-playing'); void btnEl.offsetWidth; btnEl.classList.add('is-playing'); setTimeout(function () { btnEl.classList.remove('is-playing'); }, 1300); }
}
document.addEventListener('click', function (e) {
  var b = e.target.closest && e.target.closest('[data-say]');
  if (b) { e.stopPropagation(); say(b.getAttribute('data-say'), b); }
}, true);

/* ---------- Sao bay ---------- */
function burst(layer, fromEl, toEl, count, iconName) {
  if (!layer || !fromEl) return;
  var vp = layer.closest('.dsf-vp') || layer;
  var sc = vp.__scale || 1;
  var lr = layer.getBoundingClientRect(), fr = fromEl.getBoundingClientRect();
  var cx = (fr.left + fr.width / 2 - lr.left) / sc, cy = (fr.top + fr.height / 2 - lr.top) / sc;
  var tx = null, ty = null;
  if (toEl) { var tr = toEl.getBoundingClientRect(); tx = (tr.left + tr.width / 2 - lr.left) / sc; ty = (tr.top + tr.height / 2 - lr.top) / sc; }
  var n = count || 8;
  for (var i = 0; i < n; i++) {
    (function (i) {
      var el = document.createElement('div'); el.className = 'b-burst-star' + (iconName ? ' b-burst-star--' + iconName : ''); el.innerHTML = icon(iconName || 'star', 34);
      el.style.left = cx + 'px'; el.style.top = cy + 'px'; layer.appendChild(el);
      var ang = (Math.PI * 2 * i) / n - Math.PI / 2, d = 90 + (i % 3) * 30;
      var mx = Math.cos(ang) * d, my = Math.sin(ang) * d;
      var frames = [{ transform: 'translate(-50%,-50%) scale(.3) rotate(0deg)', opacity: 0 }, { transform: 'translate(calc(-50% + ' + mx + 'px), calc(-50% + ' + my + 'px)) scale(1.1) rotate(90deg)', opacity: 1, offset: 0.45 }];
      if (tx != null) frames.push({ transform: 'translate(calc(-50% + ' + (tx - cx) + 'px), calc(-50% + ' + (ty - cy) + 'px)) scale(.5) rotate(200deg)', opacity: 0.9 });
      else frames.push({ transform: 'translate(calc(-50% + ' + mx * 1.3 + 'px), calc(-50% + ' + (my * 1.3 + 30) + 'px)) scale(.6) rotate(160deg)', opacity: 0 });
      var anim = el.animate(frames, { duration: 900 + i * 40, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
      anim.onfinish = function () { el.remove(); if (toEl && i === n - 1) { toEl.classList.add('is-bump'); setTimeout(function () { toEl.classList.remove('is-bump'); }, 400); } };
    })(i);
  }
}

/* ---------- Dải phản hồi trượt lên ---------- */
function feedback(scr, o) {
  var old = scr.querySelector('.b-fb'); if (old) old.remove();
  var ok = o.type === 'ok';
  var el = document.createElement('div');
  el.className = 'b-fb b-fb--' + (ok ? 'ok' : 'retry');
  el.setAttribute('role', 'status');
  var bf = o.button || btn;
  el.innerHTML = '<div class="b-fb__in"><div class="b-fb__mascot">' + (o.mascot != null ? o.mascot : dragon(ok ? 'vui' : 'dongvien', 112)) + '</div>' +
    '<div class="b-fb__txt"><div class="b-fb__title ' + (o.titleCls || 'title') + '">' + icon(ok ? 'check' : 'replay', o.iconSize || 30) + '<span>' + o.title + '</span></div>' + (o.detail ? '<div class="b-fb__detail ' + (o.detailCls || 'body') + '">' + o.detail + '</div>' : '') + '</div>' +
    '<div class="b-fb__act">' + (o.secondary ? bf({ label: o.secondary.label, variant: o.secondary.variant || 'ghost', size: 'l', key: o.secondary.key, attrs: 'data-fb-sec' }) : '') +
    bf({ label: o.action || (ok ? 'Tiếp tục' : 'Thử lại'), variant: ok ? 'success' : 'retry', size: 'l', key: 'Enter', attrs: 'data-fb-go' }) + '</div></div>';
  scr.appendChild(el);
  requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('is-open'); }); });
  var go = el.querySelector('[data-fb-go]');
  setTimeout(function () { go.focus({ preventScroll: true }); }, 50);
  function close() { el.classList.remove('is-open'); setTimeout(function () { el.remove(); }, 340); }
  go.addEventListener('click', function () { close(); o.onAction && o.onAction(); });
  var sec = el.querySelector('[data-fb-sec]'); if (sec) sec.addEventListener('click', function () { o.secondary.onClick && o.secondary.onClick(); });
  return { el: el, close: close, go: function () { go.click(); } };
}

/* ---------- Hộp thoại ---------- */
function dialog(scr, o) {
  var wrap = document.createElement('div'); wrap.className = 'b-overlay';
  var bf = o.button || btn;
  wrap.innerHTML = '<div class="b-dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-t">' + (o.mascot != null ? o.mascot : (o.expr ? '<div class="b-dialog__mascot">' + dragon(o.expr, 150) + '</div>' : '')) +
    '<h2 class="' + (o.titleCls || 'title') + '" id="dlg-t">' + o.title + '</h2>' + (o.body ? '<div class="' + (o.bodyCls || 'body-l') + ' b-muted">' + o.body + '</div>' : '') +
    '<div class="b-dialog__actions">' + o.actions.map(function (a, i) { return bf({ label: a.label, variant: a.variant || 'secondary', size: 'l', key: a.key, attrs: 'data-dlg="' + i + '"' }); }).join('') + '</div></div>';
  scr.appendChild(wrap);
  var prev = document.activeElement;
  requestAnimationFrame(function () { wrap.classList.add('is-open'); });
  var btns = wrap.querySelectorAll('button[data-dlg]'), foc = wrap.querySelectorAll('input, button');
  setTimeout(function () { foc[0].focus({ preventScroll: true }); }, 30);
  function close() { wrap.classList.remove('is-open'); setTimeout(function () { wrap.remove(); }, 200); if (prev && prev.focus) prev.focus({ preventScroll: true }); document.removeEventListener('keydown', onKey, true); }
  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
    if (e.key === 'Tab') { var f = foc[0], l = foc[foc.length - 1]; if (e.shiftKey && document.activeElement === f) { e.preventDefault(); l.focus(); } else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); f.focus(); } }
    if (e.key === 'Enter' && wrap.contains(document.activeElement)) { e.stopPropagation(); }
  }
  document.addEventListener('keydown', onKey, true);
  btns.forEach(function (b) { b.addEventListener('click', function () { var a = o.actions[+b.getAttribute('data-dlg')]; close(); a.onClick && a.onClick(); }); });
  wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
  return { close: close };
}

/* ---------- Khung trình bày màn hình: 4 trạng thái × 3 cỡ màn ---------- */
var VPS = [{ id: '1440', w: 1440, h: 900, label: '1440×900' }, { id: '1366', w: 1366, h: 768, label: '1366×768' }, { id: '1920', w: 1920, h: 1080, label: '1920×1080' }];
var STATE_LABELS = { normal: 'Bình thường', loading: 'Đang tải', empty: 'Trống', error: 'Lỗi' };
function screen(cfg) {
  var host = document.getElementById(cfg.mountId || 'root') || document.body;
  var state = cfg.defaultState || 'normal', vpId = cfg.vp || '1440';
  var keyHandlers = [], timers = [];
  host.classList.add('dsf');
  var order = cfg.order || ['normal', 'loading', 'empty', 'error'];
  host.innerHTML = '<div class="dsf-bar"><div class="dsf-seg" role="tablist" aria-label="Trạng thái dữ liệu">' +
    order.map(function (s) { return '<button type="button" role="tab" data-state="' + s + '">' + ((cfg.labels && cfg.labels[s]) || STATE_LABELS[s]) + '</button>'; }).join('') +
    '</div><div class="dsf-seg dsf-seg--vp" role="tablist" aria-label="Cỡ màn hình">' + VPS.map(function (v) { return '<button type="button" role="tab" data-vp="' + v.id + '">' + v.label + '</button>'; }).join('') + '</div>' +
    (cfg.fit ? '<span class="dsf-fit">' + icon('check', 16) + 'Vừa 1366×768, không cuộn</span>' : '') + '</div>' +
    '<p class="dsf-note"></p><div class="dsf-stage"><div class="dsf-vp"><div class="scr"></div></div></div>';
  var bar = host.querySelector('.dsf-bar'), stage = host.querySelector('.dsf-stage'), vpEl = host.querySelector('.dsf-vp'), scr = host.querySelector('.scr'), note = host.querySelector('.dsf-note');
  if (cfg.level) scr.setAttribute('data-level', cfg.level);
  if (cfg.scrClass) scr.className += ' ' + cfg.scrClass;
  function fit() {
    var v = VPS.filter(function (x) { return x.id === vpId; })[0];
    var avail = stage.clientWidth;
    var s = Math.min(1, avail / v.w);
    vpEl.style.width = v.w + 'px'; vpEl.style.height = v.h + 'px';
    vpEl.style.transform = 'scale(' + s + ')'; vpEl.__scale = s;
    stage.style.height = Math.ceil(v.h * s) + 'px';
    vpEl.setAttribute('data-vp', v.id);
  }
  var ctx = {
    scr: scr, vp: vpEl,
    get state() { return state; },
    setState: function (s) { state = s; render(); },
    onKey: function (fn) { keyHandlers.push(fn); },
    later: function (fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; },
    every: function (fn, ms) { var t = setInterval(fn, ms); timers.push(t); return t; },
    feedback: function (o) { return feedback(scr, o); },
    dialog: function (o) { return dialog(scr, o); },
    burst: function (from, to, n, ic) { burst(scr.querySelector('.b-burst-layer') || scr, from, to, n, ic); }
  };
  function render() {
    keyHandlers = []; timers.forEach(function (t) { clearTimeout(t); clearInterval(t); }); timers = [];
    if (ctx.cleanup) { try { ctx.cleanup(); } catch (e) {} ctx.cleanup = null; }
    bar.querySelectorAll('[data-state]').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-state') === state); });
    bar.querySelectorAll('[data-vp]').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-vp') === vpId); });
    note.textContent = (cfg.notes && cfg.notes[state]) || '';
    var fn = cfg.states[state];
    scr.setAttribute('data-state', state);
    scr.innerHTML = (fn ? fn(ctx) : '') + '<div class="b-burst-layer" aria-hidden="true"></div>';
    if (cfg.mount && cfg.mount[state]) cfg.mount[state](scr, ctx);
    if (cfg.mount && cfg.mount.all) cfg.mount.all(scr, ctx);
    scr.querySelectorAll('[data-retry]').forEach(function (b) {
      b.addEventListener('click', function () { ctx.setState('loading'); ctx.later(function () { ctx.setState('normal'); }, 1100); });
    });
  }
  bar.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-state')) { state = b.getAttribute('data-state'); render(); }
    if (b.hasAttribute('data-vp')) { vpId = b.getAttribute('data-vp'); fit(); bar.querySelectorAll('[data-vp]').forEach(function (x) { x.setAttribute('aria-selected', x === b); }); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.target.closest && e.target.closest('.dsf-bar')) return;
    if (document.querySelector('.b-overlay')) return;
    var fb = scr.querySelector('.b-fb.is-open');
    if (fb && e.key === 'Enter') { var g = fb.querySelector('[data-fb-go]'); if (g && document.activeElement !== g) { e.preventDefault(); g.click(); } return; }
    for (var i = 0; i < keyHandlers.length; i++) keyHandlers[i](e);
  });
  window.addEventListener('resize', fit);
  if (window.ResizeObserver) new ResizeObserver(fit).observe(stage);
  fit(); render();
  return ctx;
}

var api = {
  icon: icon, pic: pic, dragon: dragon, avatar: avatar, words: WORDS, topics: TOPICS, levels: LEVELS, kids: KIDS,
  key: key, btn: btn, speak: speak, sk: sk, stars: stars, levelChip: levelChip, stat: stat, topbar: topbar, bubble: bubble,
  stateBlock: stateBlock, suite: suite, setMode: setMode, getMode: function () { return MODE; }, onMode: function (f) { modeListeners.push(f); }, say: say, burst: burst, feedback: feedback, dialog: dialog, screen: screen, esc: esc,
  Button: btn, SpeakerButton: speak, KeyHint: key, Mascot: dragon, Dialog: dialog, FeedbackBar: feedback, StatChip: stat, DataStates: stateBlock,
  Card: function (p) { return '<div class="' + ((p && p.className) || 'b-card') + '"></div>'; }, ProgressBar: function (v, max) { return '<div class="b-progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + max + '" aria-valuenow="' + v + '"><span style="width:' + (100 * v / max) + '%"></span></div>'; }
};
window.Bong = Object.assign(window.Bong || {}, api);

/* =====================================================================
   BỘ THCS (cấp 6–10) — dùng chung lõi, theme `thcs` (sáng) / `thcs-toi` (tối)
   Lớp CSS tiền tố t-. Gọi Bong.T.screen(cfg) trong bản xem trước.
   ===================================================================== */
var TI = {
  trophy: '<path d="M8 4.5h8v5a4 4 0 0 1-8 0z" fill="none"/><path d="M8 6.5H4.5v1.5A3 3 0 0 0 8 11M16 6.5h3.5v1.5A3 3 0 0 1 16 11M12 13.5v3M8.5 20h7M9.5 16.5h5V20h-5z"/>',
  exam: '<rect x="5" y="4" width="14" height="17" rx="2.5" fill="none"/><path d="M9 4V3h6v1M8.5 10h7M8.5 13.5h7M8.5 17h4"/>',
  cards: '<rect x="3.5" y="7" width="13" height="13" rx="2.5" fill="none"/><path d="M7.5 7V5.5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H16.5"/>',
  grammar: '<path d="M3.5 18l4-11 4 11M5 14.5h5"/><path d="M14 9.5h4.5a2.5 2.5 0 0 1 0 5H14zM14 14.5h5a2.5 2.5 0 0 1 0 5h-5zM14 9.5v10" fill="none"/>',
  notebook: '<rect x="5" y="3.5" width="14" height="17" rx="2.5" fill="none"/><path d="M9 3.5v17M12 8h4M12 11.5h4"/>',
  route: '<circle cx="6" cy="18" r="2.5" fill="none"/><circle cx="18" cy="6" r="2.5" fill="none"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>',
  sun: '<circle cx="12" cy="12" r="4" fill="none"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  bolt: '<path d="M13 2.5L5 13.5h6l-1 8 8-11h-6z" fill="currentColor" stroke-linejoin="round"/>',
  users: '<circle cx="9" cy="8.5" r="3.5" fill="none"/><path d="M2.5 19.5c.8-3.4 3.3-5 6.5-5s5.7 1.6 6.5 5" fill="none"/><path d="M15.5 5.2a3.5 3.5 0 0 1 0 6.6M17.5 14.8c2 .7 3.4 2.2 4 4.7"/>',
  sidebar: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5" fill="none"/><path d="M9.5 4.5v15"/>',
  search: '<circle cx="10.5" cy="10.5" r="6" fill="none"/><path d="M15 15l5.5 5.5"/>',
  flag: '<path d="M5.5 21V4M5.5 4.5h11l-2.5 4 2.5 4h-11"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5" fill="none"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  target: '<circle cx="12" cy="12" r="8.5" fill="none"/><circle cx="12" cy="12" r="4.5" fill="none"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
  pen: '<path d="M15.5 4.5l4 4L9 19H5v-4z" fill="none"/><path d="M13.5 6.5l4 4"/>',
  info: '<circle cx="12" cy="12" r="8.5" fill="none"/><path d="M12 11v5.5"/><circle cx="12" cy="7.8" r="1.2" fill="currentColor" stroke="none"/>',
  chevdown: '<path d="M6 9.5l6 6 6-6"/>',
  globe: '<circle cx="12" cy="12" r="8.5" fill="none"/><path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5z" fill="none"/>',
  medal: '<circle cx="12" cy="15" r="5.5" fill="none"/><path d="M8.5 10.5L6 3.5h4l2 4.5 2-4.5h4l-2.5 7"/>',
  plusbox: '<rect x="4" y="4" width="16" height="16" rx="3" fill="none"/><path d="M12 8v8M8 12h8"/>',
  logout: '<path d="M14 4.5h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-4M10 16.5L5.5 12 10 7.5M5.5 12H15"/>',
  enter: '<path d="M19.5 5v6a3 3 0 0 1-3 3H5.5M9.5 10l-4 4 4 4"/>',
  hand: '<path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12M11 11V5a1.5 1.5 0 0 1 3 0v6M14 11V6.5a1.5 1.5 0 0 1 3 0v7a6.5 6.5 0 0 1-6.5 6.5c-2.8 0-4.6-1.6-6-4L3 13.5a1.5 1.5 0 0 1 2.4-1.8L8 14" fill="none"/>'
};
for (var k in TI) ICONS[k] = TI[k];

/* ---------- Rồng Bông tuổi teen (dáng cao, hoodie, tai nghe) ---------- */
function tdragon(expr, size) {
  expr = expr || 'chao';
  var s = size || 96;
  var ln = 'stroke="var(--dragon-line)" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"';
  var body = 'fill="var(--dragon-body)" ' + ln, wing = 'fill="var(--dragon-wing)" ' + ln, belly = 'fill="var(--dragon-belly)" ' + ln, hood = 'fill="var(--dragon-hoodie)" ' + ln;
  var o = [];
  var sleeve = function (d) { return '<path d="' + d + '" fill="none" stroke="var(--dragon-line)" stroke-width="18" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="var(--dragon-hoodie)" stroke-width="11" stroke-linecap="round"/>'; };
  var hand = function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="8.5" ' + body + '/>'; };
  o.push('<path d="M128 168 C162 176 180 158 176 134 C175 126 167 128 168 136 C169 152 156 160 132 156 Z" ' + body + '/><path d="M168 136 L157 117 L182 121 Z" ' + wing + '/>');
  o.push('<path d="M66 120 C46 100 30 106 26 120 C36 119 38 128 34 136 C46 130 52 134 56 140 Z" ' + wing + '/><path d="M134 120 C154 100 170 106 174 120 C164 119 162 128 166 136 C154 130 148 134 144 140 Z" ' + wing + '/>');
  o.push('<rect x="76" y="172" width="20" height="30" rx="9" ' + body + '/><rect x="104" y="172" width="20" height="30" rx="9" ' + body + '/><ellipse cx="84" cy="204" rx="16" ry="8" ' + body + '/><ellipse cx="116" cy="204" rx="16" ry="8" ' + body + '/>');
  o.push('<path d="M64 130 Q64 112 84 108 L116 108 Q136 112 136 130 L138 176 Q100 188 62 176 Z" ' + hood + '/>');
  o.push('<path d="M80 152 h40 v14 q-20 7 -40 0 z" fill="rgba(0,0,0,.18)"/><path d="M92 114 l-2 22 M108 114 l2 22" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>');
  // tay
  if (expr === 'chao') { o.push(sleeve('M68 126 Q60 146 66 162') + hand(67, 166)); o.push(sleeve('M132 124 Q150 110 154 90') + hand(155, 85)); o.push('<path d="M170 72 q7 7 4 16 M178 64 q11 11 6 26" fill="none" stroke="var(--dragon-line)" stroke-width="3" stroke-linecap="round" opacity=".5"/>'); }
  else if (expr === 'vui') { o.push(sleeve('M68 126 Q60 146 66 162') + hand(67, 166)); o.push(sleeve('M132 124 Q152 108 150 84') + '<rect x="140" y="68" width="20" height="20" rx="8" ' + body + '/>'); }
  else if (expr === 'chucmung') { o.push(sleeve('M68 124 Q50 108 48 86') + hand(47, 81)); o.push(sleeve('M132 124 Q150 108 152 86') + hand(153, 81)); }
  else if (expr === 'dongvien') { o.push(sleeve('M68 126 Q60 146 66 162') + hand(67, 166)); o.push(sleeve('M132 128 Q152 132 152 114') + '<rect x="146" y="86" width="12" height="26" rx="6" ' + body + '/><rect x="140" y="104" width="26" height="22" rx="9" ' + body + '/>'); }
  else if (expr === 'suynghi') { o.push(sleeve('M68 126 Q60 146 66 162') + hand(67, 166)); o.push(sleeve('M132 130 Q130 112 118 104')); }
  else { o.push(sleeve('M68 126 Q60 146 66 162') + hand(67, 166)); o.push(sleeve('M132 126 Q140 146 134 162') + hand(133, 166)); }
  // tai nghe quanh cổ
  o.push('<rect x="88" y="96" width="24" height="16" ' + body + '/>');
  if (expr !== 'ngu') o.push('<path d="M70 112 Q100 132 130 112" fill="none" stroke="var(--dragon-phones)" stroke-width="6" stroke-linecap="round"/><rect x="62" y="102" width="14" height="20" rx="6" fill="var(--level-6)" ' + ln + '/><rect x="124" y="102" width="14" height="20" rx="6" fill="var(--level-6)" ' + ln + '/>');
  // đầu
  o.push('<path d="M72 42 C58 24 56 10 62 3 C70 14 80 26 86 34 Z" ' + wing + '/><path d="M128 42 C142 24 144 10 138 3 C130 14 120 26 114 34 Z" ' + wing + '/>');
  o.push('<path d="M58 66 L42 58 L48 76 Z" ' + wing + '/><path d="M142 66 L158 58 L152 76 Z" ' + wing + '/>');
  o.push('<ellipse cx="100" cy="70" rx="46" ry="39" ' + body + '/>');
  o.push('<path d="M84 36 Q94 14 122 22 Q110 25 108 36 Z" ' + wing + '/>');
  o.push('<ellipse cx="100" cy="86" rx="24" ry="14" ' + belly + '/><ellipse cx="93" cy="81" rx="2.2" ry="3" fill="var(--dragon-line)"/><ellipse cx="107" cy="81" rx="2.2" ry="3" fill="var(--dragon-line)"/>');
  o.push('<ellipse cx="66" cy="84" rx="7" ry="4.5" fill="var(--dragon-cheek)" opacity=".7"/><ellipse cx="134" cy="84" rx="7" ry="4.5" fill="var(--dragon-cheek)" opacity=".7"/>');
  var eye = function (x, px, py) { return '<ellipse cx="' + x + '" cy="64" rx="10" ry="10" fill="#fff" ' + ln + '/><circle cx="' + px + '" cy="' + py + '" r="5.5" fill="var(--dragon-line)"/><circle cx="' + (px + 2) + '" cy="' + (py - 2.5) + '" r="2" fill="#fff"/>'; };
  var lid = function (d) { return '<path d="' + d + '" fill="none" stroke="var(--dragon-line)" stroke-width="4" stroke-linecap="round"/>'; };
  if (expr === 'vui' || expr === 'chucmung') o.push(lid('M72 66 Q82 54 92 66') + lid('M108 66 Q118 54 128 66'));
  else if (expr === 'ngu') o.push(lid('M72 64 Q82 72 92 64') + lid('M108 64 Q118 72 128 64'));
  else if (expr === 'suynghi') o.push(eye(82, 85, 61) + eye(118, 121, 61));
  else o.push(eye(82, 83, 66) + eye(118, 119, 66) + lid('M71 58 Q82 52 93 58') + lid('M107 58 Q118 52 129 58'));
  if (expr === 'chao' || expr === 'vui' || expr === 'chucmung') o.push('<path d="M88 91 Q100 104 112 91 Z" fill="#8a2d3d" ' + ln + '/>');
  else if (expr === 'ngu') o.push('<ellipse cx="100" cy="93" rx="3.5" ry="2.5" fill="#8a2d3d"/>');
  else if (expr === 'suynghi') o.push('<path d="M93 94 Q100 90 107 95" fill="none" stroke="var(--dragon-line)" stroke-width="3" stroke-linecap="round"/>');
  else o.push('<path d="M91 91 Q101 98 111 89" fill="none" stroke="var(--dragon-line)" stroke-width="3" stroke-linecap="round"/>');
  if (expr === 'suynghi') o.push(hand(116, 102) + '<circle cx="156" cy="38" r="4" fill="#fff" ' + ln + '/><circle cx="168" cy="24" r="7" fill="#fff" ' + ln + '/><text x="164" y="12" font-family="Be Vietnam Pro, sans-serif" font-weight="800" font-size="24" fill="var(--brand)">?</text>');
  if (expr === 'ngu') o.push('<path d="M58 70 Q56 28 100 26 Q144 28 142 70" fill="none" stroke="var(--dragon-phones)" stroke-width="6" stroke-linecap="round"/><rect x="50" y="60" width="14" height="22" rx="6" fill="var(--level-6)" ' + ln + '/><rect x="136" y="60" width="14" height="22" rx="6" fill="var(--level-6)" ' + ln + '/><g class="dg-z" font-family="Be Vietnam Pro, sans-serif" font-weight="800" fill="var(--ink-soft)"><text x="150" y="30" font-size="18">z</text><text x="164" y="16" font-size="24">Z</text></g>');
  if (expr === 'chucmung') {
    o.push('<path d="M60 30 L100 16 L140 30 L100 44 Z" fill="var(--dragon-phones)" ' + ln + '/><path d="M80 36 v10 q20 9 40 0 v-10" fill="var(--dragon-phones)" ' + ln + '/><path d="M100 30 L132 34 L132 52" fill="none" stroke="var(--star)" stroke-width="3" stroke-linecap="round"/><circle cx="132" cy="54" r="4" fill="var(--star)"/>');
    o.push([[24, 30, '#ff8a3d', 20], [176, 40, '#3fa9f5', -25], [18, 110, '#9b5de5', 40], [184, 150, '#ffd23f', 10], [30, 170, '#3fb950', -30]].map(function (c) { return '<rect x="' + c[0] + '" y="' + c[1] + '" width="10" height="6" rx="2" fill="' + c[2] + '" transform="rotate(' + c[3] + ' ' + c[0] + ' ' + c[1] + ')"/>'; }).join(''));
  }
  if (expr === 'vui') o.push('<g fill="var(--star)" stroke="var(--star-shade)" stroke-width="2"><path d="M30 50 l4 8 8 4 -8 4 -4 8 -4 -8 -8 -4 8 -4z"/></g>');
  return '<svg class="t-dragon t-dragon--' + expr + '" width="' + s + '" height="' + Math.round(s * 1.1) + '" viewBox="0 -4 200 220" role="img" aria-label="Rồng Bông ' + (EXPR_LABEL[expr] || '') + '" style="overflow:visible">' + o.join('') + '</svg>';
}

/* ---------- Mảnh HTML THCS ---------- */
var TKIDS = [{ id: 'linh', name: 'Khánh Linh', grade: 8, level: 8, hair: 'bob' }];
function tbtn(o) {
  var cls = ['t-btn', 't-btn--' + (o.variant || 'primary')];
  if (o.size === 'l') cls.push('t-btn--l'); if (o.size === 's') cls.push('t-btn--s');
  if (o.block) cls.push('t-btn--block'); if (o.cls) cls.push(o.cls);
  return '<button type="button" class="' + cls.join(' ') + '" ' + (o.attrs || '') + (o.disabled ? ' disabled' : '') + (o.key ? ' aria-keyshortcuts="' + o.key + '"' : '') + '>' +
    (o.icon ? icon(o.icon, 20) : '') + (o.label ? '<span>' + o.label + '</span>' : '') + (o.key ? key(o.key) : '') + '</button>';
}
function tchip(kind, value, label) {
  var ic = kind === 'xp' ? icon('bolt', 20) : icon('flame', 22);
  return '<span class="t-chip t-chip--' + kind + '" title="' + label + '">' + ic + '<b>' + value + '</b><span class="b-sr">' + label + '</span></span>';
}
function modeBtn() {
  var dark = MODE === 'thcs-toi';
  return '<button type="button" class="t-iconbtn" data-mode-toggle aria-pressed="' + dark + '" aria-label="' + (dark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối') + '" title="' + (dark ? 'Chế độ sáng' : 'Chế độ tối') + '">' + icon(dark ? 'sun' : 'moon', 20) + '</button>';
}
var NAV = [['home', 'house', 'Trang chủ'], ['route', 'route', 'Lộ trình'], ['sgk', 'book', 'Học theo SGK'], ['grammar', 'grammar', 'Ngữ pháp'], ['exam', 'exam', 'Luyện thi'], ['review', 'cards', 'Ôn tập'], ['words', 'notebook', 'Sổ từ'], ['awards', 'trophy', 'Thành tích']];
var SB = { mini: false };
function shell(o) {
  var kid = TKIDS[0];
  var nav = NAV.map(function (n) {
    var on = n[0] === o.active;
    return '<a href="#" class="t-nav__item' + (on ? ' is-on' : '') + '"' + (on ? ' aria-current="page"' : '') + ' title="' + n[2] + '" data-nav="' + n[0] + '">' + icon(n[1], 22) + '<span class="t-nav__lbl">' + n[2] + '</span>' + (n[0] === 'review' && o.due !== false ? '<span class="t-nav__badge" aria-label="29 thẻ đến hạn">29</span>' : '') + '</a>';
  }).join('');
  return '<div class="t-app' + (SB.mini ? ' is-mini' : '') + '" data-level="' + kid.level + '">' +
    '<aside class="t-side" aria-label="Menu chính"><div class="t-side__top"><span class="t-brand">' + tdragon('chao', 30) + '<b>Học cùng Bông</b></span>' +
    '<button type="button" class="t-iconbtn t-side__toggle" data-sb-toggle aria-expanded="' + !SB.mini + '" aria-label="' + (SB.mini ? 'Mở rộng menu' : 'Thu gọn menu') + '">' + icon('sidebar', 20) + '</button></div>' +
    '<nav class="t-nav">' + nav + '</nav>' +
    '<div class="t-side__me">' + avatar(kid, 40) + '<span class="t-side__who"><b class="thcs-label">' + kid.name + '</b><span class="thcs-caption b-muted">Lớp ' + kid.grade + ' · Cấp ' + kid.level + ' London</span></span>' +
    '<button type="button" class="t-iconbtn" aria-label="Đổi hồ sơ" title="Đổi hồ sơ">' + icon('users', 20) + '</button></div></aside>' +
    '<div class="t-main"><header class="t-top"><div class="t-top__l">' + (o.crumb ? '<span class="thcs-body-s b-muted">' + o.crumb + '</span>' : '') + '<h1 class="thcs-h2">' + o.title + '</h1></div>' +
    '<div class="t-top__r">' + (o.topRight || '') + tchip('xp', o.xp || '2.340', 'XP') + tchip('streak', o.streak == null ? 23 : o.streak, 'ngày học liên tiếp') + modeBtn() + '</div></header>' +
    '<main class="t-body"><div class="t-wrap' + (o.wide ? ' t-wrap--wide' : '') + '">' + o.main + '</div></main></div></div>';
}
function lessonHead(o) {
  return '<header class="t-lhead"><button type="button" class="t-iconbtn" data-exit aria-label="Thoát bài (Esc)" aria-keyshortcuts="Escape">' + icon('close', 22) + '</button>' +
    '<div class="t-lhead__t"><span class="thcs-caption b-muted">' + o.crumb + '</span><b class="thcs-h3">' + o.title + '</b></div>' +
    (o.timer ? o.timer : '<div class="t-lhead__p">' + '<div class="b-progress b-progress--s" role="progressbar" aria-valuemin="0" aria-valuemax="' + o.m + '" aria-valuenow="' + o.n + '"><span style="width:' + (100 * o.n / o.m) + '%"></span></div><span class="thcs-label b-muted">' + o.n + '/' + o.m + '</span></div>') +
    tchip('xp', '+' + (o.xp || 0), 'XP bài này') + modeBtn() + '</header>';
}
function lessonFoot(left, right) { return '<footer class="t-lfoot"><div><div class="t-lfoot__g">' + (left || '') + '</div><div class="t-lfoot__g">' + (right || '') + '</div></div></footer>'; }
function opt(letter, i, text, st) {
  return '<button type="button" role="radio" class="t-opt' + (st ? ' ' + st : '') + '" data-i="' + i + '" aria-checked="' + (st === 'is-selected') + '" aria-keyshortcuts="' + (i + 1) + ' ' + letter + '">' +
    '<span class="t-opt__k" aria-hidden="true">' + letter + '<kbd>' + (i + 1) + '</kbd></span><span class="t-opt__t thcs-en">' + text + '</span><span class="t-opt__ic" aria-hidden="true"></span></button>';
}
function ring(v, max, size, label) {
  var r = 52, c = 2 * Math.PI * r, p = Math.min(1, v / max);
  return '<div class="t-ring" style="width:' + size + 'px;height:' + size + 'px" role="img" aria-label="' + (label || (v + ' trên ' + max)) + '"><svg viewBox="0 0 120 120" width="' + size + '" height="' + size + '"><circle cx="60" cy="60" r="' + r + '" fill="none" stroke="var(--xp-soft)" stroke-width="12"/>' +
    '<circle cx="60" cy="60" r="' + r + '" fill="none" stroke="var(--xp)" stroke-width="12" stroke-linecap="round" stroke-dasharray="' + (c * p) + ' ' + c + '" transform="rotate(-90 60 60)"/></svg><div class="t-ring__c"><b class="thcs-num">' + v + '</b><span class="thcs-caption b-muted">/ ' + max + ' XP</span></div></div>';
}
/* Biểu đồ cột một chuỗi (XP): cột mảnh, đầu bo 4px, nhãn trực tiếp cho giá trị nổi bật, chú thích khi rê chuột */
function bars(data, o) {
  o = o || {}; var H = o.h || 160, max = o.max || Math.max.apply(null, data.map(function (d) { return d.v || 0; })) * 1.15 || 1;
  var cols = data.map(function (d) {
    var h = d.v == null ? 0 : Math.max(4, Math.round(H * d.v / max));
    return '<div class="t-bar' + (d.now ? ' is-now' : '') + '" tabindex="0" data-tip="' + d.k + ': ' + (d.v == null ? 'chưa có' : d.v + ' ' + (o.unit || 'XP')) + '" aria-label="' + d.k + ': ' + (d.v == null ? 'chưa có dữ liệu' : d.v + ' ' + (o.unit || 'XP')) + '">' +
      (d.label ? '<span class="t-bar__v thcs-caption">' + String(d.v).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '</span>' : '') + '<span class="t-bar__m" style="height:' + h + 'px"></span><span class="t-bar__k thcs-caption">' + d.k + '</span></div>';
  }).join('');
  var grid = ''; for (var g = 1; g <= 3; g++) grid += '<i style="bottom:' + (24 + H * g / 3) + 'px"></i>';
  return '<div class="t-chart" style="height:' + (H + 48) + 'px"><div class="t-chart__grid">' + grid + '</div><div class="t-chart__cols">' + cols + '</div><div class="t-tip" role="tooltip" hidden></div></div>';
}
function tstate(o) {
  return stateBlock({ kind: o.kind, title: o.title, text: o.text, cls: 't-state', titleCls: 'thcs-h2', textCls: 'thcs-body', mascot: tdragon(o.expr || (o.kind === 'error' ? 'dongvien' : 'suynghi'), o.size || 104), button: tbtn,
    action: o.action || (o.kind === 'error' ? tbtn({ label: 'Thử lại', icon: 'replay', attrs: 'data-retry' }) : '') });
}
function tfeedback(scr, o) {
  return feedback(scr, Object.assign({ titleCls: 'thcs-h2', detailCls: 'thcs-body', iconSize: 24, button: function (b) { b.size = 'l'; return tbtn(b); }, mascot: tdragon(o.type === 'ok' ? 'vui' : 'dongvien', 64) }, o));
}
function tdialog(scr, o) {
  return dialog(scr, Object.assign({ titleCls: 'thcs-h2', bodyCls: 'thcs-body', button: function (b) { b.size = 'l'; return tbtn(b); }, mascot: o.expr ? '<div class="b-dialog__mascot t-dlg-m">' + tdragon(o.expr, 72) + '</div>' : '' }, o));
}
function tip(text, expr) { return '<div class="t-tipbox">' + tdragon(expr || 'chao', 44) + '<p class="thcs-body-s">' + text + '</p></div>'; }

/* Huy hiệu: khiên lục giác, viền theo bậc (Vàng/Bạc/Đồng) + tên bậc bằng chữ */
var TIER = { gold: ['badge-gold', 'Vàng'], silver: ['badge-silver', 'Bạc'], bronze: ['badge-bronze', 'Đồng'] };
function badge(o) {
  var t = TIER[o.tier || 'bronze'], on = o.earned !== false, sz = o.size || 72;
  var svg = '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 80 80" aria-hidden="true"><path d="M40 4 L72 22 L72 58 L40 76 L8 58 L8 22 Z" fill="' + (on ? 'var(--' + t[0] + ')' : 'var(--surface-sunk)') + '"/>' +
    '<path d="M40 13 L64 27 L64 53 L40 67 L16 53 L16 27 Z" fill="' + (on ? 'var(--surface)' : 'var(--surface-soft)') + '"/></svg>';
  return '<div class="t-badge' + (on ? '' : ' is-locked') + '"><div class="t-badge__g">' + svg + '<span class="t-badge__i">' + icon(on ? (o.icon || 'medal') : 'lock', Math.round(sz * .36)) + '</span></div>' +
    '<b class="thcs-label">' + o.name + '</b><span class="thcs-caption b-muted">' + (on ? 'Bậc ' + t[1] + (o.date ? ' · ' + o.date : '') : (o.progress || 'Chưa mở')) + '</span></div>';
}

/* ---------- Khung xem trước THCS: thêm công tắc Sáng / Tối ---------- */
function tscreen(cfg) {
  suite('thcs');
  var all = cfg.mount && cfg.mount.all;
  cfg.mount = cfg.mount || {};
  cfg.mount.all = function (scr, ctx) {
    scr.classList.add('thcs');
    scr.querySelectorAll('[data-mode-toggle]').forEach(function (b) { b.addEventListener('click', function () { setMode(MODE === 'thcs' ? 'thcs-toi' : 'thcs'); }); });
    scr.querySelectorAll('[data-sb-toggle]').forEach(function (b) { b.addEventListener('click', function () { SB.mini = !SB.mini; ctx.setState(ctx.state); var t = ctx.scr.querySelector('[data-sb-toggle]'); t && t.focus(); }); });
    scr.querySelectorAll('a[href="#"]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });
    var exit = scr.querySelector('[data-exit]');
    if (exit) { exit.addEventListener('click', function () { tdialog(scr, { expr: 'dongvien', title: 'Thoát bài học?', body: cfg.exitText || 'Tiến độ được lưu lại. Lần sau bạn học tiếp từ câu đang làm.', actions: [{ label: 'Học tiếp', variant: 'primary', key: 'Enter' }, { label: 'Thoát', variant: 'secondary' }] }); });
      ctx.onKey(function (e) { if (e.key === 'Escape' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName) && !scr.querySelector('.b-fb.is-open')) { e.preventDefault(); exit.click(); } }); }
    // chú thích biểu đồ
    scr.querySelectorAll('.t-chart').forEach(function (ch) {
      var tipEl = ch.querySelector('.t-tip');
      function show(el) { var vp = ch.closest('.dsf-vp'), s = (vp && vp.__scale) || 1, r = el.getBoundingClientRect(), cr = ch.getBoundingClientRect(); tipEl.textContent = el.getAttribute('data-tip'); tipEl.hidden = false; tipEl.style.left = ((r.left + r.width / 2 - cr.left) / s) + 'px'; tipEl.style.top = ((el.querySelector('.t-bar__m').getBoundingClientRect().top - cr.top) / s - 8) + 'px'; }
      ch.querySelectorAll('.t-bar').forEach(function (b) { b.addEventListener('mouseenter', function () { show(b); }); b.addEventListener('focus', function () { show(b); }); b.addEventListener('mouseleave', function () { tipEl.hidden = true; }); b.addEventListener('blur', function () { tipEl.hidden = true; }); });
    });
    if (all) all(scr, ctx);
  };
  cfg.modes = true;
  var ctx = screen(cfg);
  var bar = document.querySelector('.dsf-bar');
  bar.insertAdjacentHTML('beforeend', '<div class="dsf-seg" role="tablist" aria-label="Chế độ màu"><button type="button" role="tab" data-mset="thcs">Sáng</button><button type="button" role="tab" data-mset="thcs-toi">Tối</button></div>');
  function sync() { bar.querySelectorAll('[data-mset]').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-mset') === MODE); }); }
  bar.querySelectorAll('[data-mset]').forEach(function (b) { b.addEventListener('click', function () { setMode(b.getAttribute('data-mset')); }); });
  modeListeners.push(function () { sync(); ctx.setState(ctx.state); });
  sync();
  return ctx;
}

window.Bong = Object.assign(window.Bong || {}, {
  T: { screen: tscreen, shell: shell, btn: tbtn, chip: tchip, dragon: tdragon, opt: opt, ring: ring, bars: bars, state: tstate, feedback: tfeedback, dialog: tdialog, tip: tip, badge: badge, lessonHead: lessonHead, lessonFoot: lessonFoot, modeBtn: modeBtn, kids: TKIDS, sidebar: SB },
  ThcsButton: tbtn, ThcsMascot: tdragon, ThcsAnswer: opt, ThcsShell: shell, ThcsRewards: ring
});

/* =====================================================================
   KHU NGƯỜI LỚN — khu bố mẹ + quản trị nội dung (theme `thcs` sáng, tiền tố a-)
   Gọi Bong.A.screen(cfg) trong bản xem trước. Không có linh vật trừ màn trống.
   ===================================================================== */
var AI = {
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5" fill="none"/><rect x="13" y="4" width="7" height="7" rx="1.5" fill="none"/><rect x="4" y="13" width="7" height="7" rx="1.5" fill="none"/><rect x="13" y="13" width="7" height="7" rx="1.5" fill="none"/>',
  tree: '<rect x="3.5" y="3.5" width="6" height="5" rx="1.2" fill="none"/><rect x="14.5" y="10" width="6" height="5" rx="1.2" fill="none"/><rect x="14.5" y="17" width="6" height="4" rx="1.2" fill="none"/><path d="M6.5 8.5v10h8M6.5 12.5h8"/>',
  image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5" fill="none"/><circle cx="9" cy="10" r="1.8" fill="none"/><path d="M4 18l5.5-5 4 3.5 2.5-2 4.5 3.5"/>',
  music: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5" fill="none"/><circle cx="16.5" cy="16" r="2.5" fill="none"/>',
  upload: '<path d="M12 15.5V4.5M7.5 9L12 4.5 16.5 9M4.5 15v3.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V15"/>',
  download: '<path d="M12 4.5v11M7.5 11l4.5 4.5 4.5-4.5M4.5 15v3.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V15"/>',
  sheet: '<rect x="4.5" y="3.5" width="15" height="17" rx="2" fill="none"/><path d="M4.5 9h15M4.5 14.5h15M10 3.5v17"/>',
  sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2" fill="none"/><circle cx="10" cy="17" r="2" fill="none"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
  key: '<circle cx="8" cy="15" r="4" fill="none"/><path d="M11 12l8.5-8.5M16 7l2.5 2.5M14 9l2 2"/>',
  trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6"/>',
  grip: '<circle cx="9" cy="6" r="1.3" fill="currentColor"/><circle cx="15" cy="6" r="1.3" fill="currentColor"/><circle cx="9" cy="12" r="1.3" fill="currentColor"/><circle cx="15" cy="12" r="1.3" fill="currentColor"/><circle cx="9" cy="18" r="1.3" fill="currentColor"/><circle cx="15" cy="18" r="1.3" fill="currentColor"/>',
  more: '<circle cx="5.5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="18.5" cy="12" r="1.4" fill="currentColor"/>',
  sortup: '<path d="M8 10l4-4 4 4"/><path d="M8 14l4 4 4-4" opacity=".3"/>',
  sortdown: '<path d="M8 10l4-4 4 4" opacity=".3"/><path d="M8 14l4 4 4-4"/>',
  sortnone: '<path d="M8 10l4-4 4 4M8 14l4 4 4-4" opacity=".45"/>',
  warn: '<path d="M12 4L2.8 19.5h18.4z" fill="none"/><path d="M12 10v4.5"/><circle cx="12" cy="17" r="1" fill="currentColor"/>',
  okcircle: '<circle cx="12" cy="12" r="8.5" fill="none"/><path d="M8 12.5l2.8 2.8L16.5 9.5"/>',
  wand: '<path d="M4 20L15 9M13 7l4 4"/><path d="M18 3v3M16.5 4.5h3M20.5 9v2M19.5 10h2M9.5 3v2M8.5 4h2"/>',
  bold: '<path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z"/>',
  italic: '<path d="M10 5h8M6 19h8M14 5l-4 14"/>',
  underline: '<path d="M7 4.5V11a5 5 0 0 0 10 0V4.5M5.5 20h13"/>',
  list: '<path d="M9 6.5h11M9 12h11M9 17.5h11"/><circle cx="4.5" cy="6.5" r="1" fill="currentColor"/><circle cx="4.5" cy="12" r="1" fill="currentColor"/><circle cx="4.5" cy="17.5" r="1" fill="currentColor"/>',
  table: '<rect x="3.5" y="5" width="17" height="14" rx="2" fill="none"/><path d="M3.5 10h17M3.5 14.5h17M9.5 10v9M15 10v9"/>',
  formula: '<rect x="3.5" y="5" width="17" height="14" rx="2.5" fill="none"/><path d="M7 12h2.5M8.25 10.75v2.5M12 10.5h5M12 13.5h5"/>',
  heading: '<path d="M5 5v14M14 5v14M5 12h9M17.5 11l2.5-1.5V19"/>',
  shuffle: '<path d="M4 7h3c4 0 6 10 10 10h3M4 17h3c1.6 0 2.8-1.6 3.8-3.4M14.2 10.4C15.2 8.6 16.4 7 18 7h2"/><path d="M18 4.5L20.5 7 18 9.5M18 14.5l2.5 2.5-2.5 2.5"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2" fill="none"/><path d="M5 15.5V5.5a1.5 1.5 0 0 1 1.5-1.5h9.5"/>',
  bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z" fill="none"/><path d="M10 20.5h4"/>',
  child: '<circle cx="12" cy="7" r="3.5" fill="none"/><path d="M6 21v-3.5A4.5 4.5 0 0 1 10.5 13h3a4.5 4.5 0 0 1 4.5 4.5V21"/>'
};
for (var ak in AI) ICONS[ak] = AI[ak];

var FAMILY = [{ id: 'minh', name: 'Minh', grade: 3, level: 2, hair: 'short' }, { id: 'linh', name: 'Khánh Linh', grade: 8, level: 8, hair: 'bob' }];
var ANAV = {
  parent: [['overview', 'grid', 'Tổng quan'], ['skills', 'chart', 'Kỹ năng'], ['exams', 'exam', 'Kết quả thi'], ['works', 'pen', 'Bài viết & ghi âm'], ['calendar', 'calendar', 'Lịch kiểm tra'], ['settings', 'sliders', 'Cài đặt']],
  admin: [['dash', 'grid', 'Bảng điều khiển'], ['tree', 'tree', 'Cấu trúc lộ trình'], ['vocab', 'notebook', 'Ngân hàng từ vựng'], ['questions', 'exam', 'Ngân hàng câu hỏi'], ['builder', 'cards', 'Soạn bài học'], ['media', 'image', 'Hình ảnh & âm thanh'], ['excel', 'sheet', 'Nhập & xuất Excel'], ['grammar', 'grammar', 'Chủ điểm ngữ pháp'], ['matrix', 'sliders', 'Tạo đề thi']]
};
var ASTATE = { kid: 'minh' };

function abtn(o) { o = Object.assign({}, o); var c = (o.cls || '') + ' a-btn'; if (o.size === 'l') c += ' a-btn--l'; if (o.size === 's') c += ' a-btn--s'; o.cls = c; o.size = null; return tbtn(o); }
function akids(o) {
  o = o || {};
  return '<div class="a-kids" role="radiogroup" aria-label="Chọn con">' + FAMILY.map(function (k) { var on = ASTATE.kid === k.id; return '<button type="button" role="radio" aria-checked="' + on + '" class="a-kid' + (on ? ' is-on' : '') + '" data-kid="' + k.id + '">' + avatar(k, 28) + '<span><b>' + k.name + '</b> · Lớp ' + k.grade + '</span></button>'; }).join('') + '</div>';
}
function ashell(o) {
  var area = o.area || 'parent', nav = ANAV[area];
  return '<div class="a-app"><aside class="a-side" aria-label="Menu khu người lớn">' +
    '<div class="a-brand"><b>Học cùng Bông</b><span>' + (area === 'parent' ? 'Khu bố mẹ' : 'Quản trị nội dung') + '</span></div>' +
    '<div class="a-area" role="tablist" aria-label="Khu vực"><button type="button" role="tab" aria-selected="' + (area === 'parent') + '">Bố mẹ</button><button type="button" role="tab" aria-selected="' + (area === 'admin') + '">Quản trị</button></div>' +
    '<nav class="a-nav">' + nav.map(function (n) { var on = n[0] === o.active; return '<a href="#" class="a-nav__item' + (on ? ' is-on' : '') + '"' + (on ? ' aria-current="page"' : '') + '>' + icon(n[1], 20) + '<span>' + n[2] + '</span>' + (n[3] ? '<span class="a-nav__n">' + n[3] + '</span>' : '') + '</a>'; }).join('') + '</nav>' +
    '<div class="a-who">' + (area === 'parent' ? '<span class="a-who__av">H</span><span><b>Chị Hương</b><br><span>Tài khoản gia đình</span></span>' : '<span class="a-who__av">N</span><span><b>Thầy Nam</b><br><span>Biên tập viên</span></span>') + '<button type="button" class="a-iconbtn a-iconbtn--side" aria-label="Đăng xuất" title="Đăng xuất">' + icon('logout', 18) + '</button></div></aside>' +
    '<div class="a-main"><header class="a-top"><div class="a-top__l">' + (o.crumb ? '<span class="adm-small b-muted">' + o.crumb + '</span>' : '') + '<h1 class="adm-h1">' + o.title + '</h1></div>' +
    '<div class="a-top__r">' + (o.kids ? akids() : '') + (o.actions || '') + abtn({ label: 'Về màn chọn hồ sơ', variant: 'secondary', icon: 'users', attrs: 'data-profiles' }) + '</div></header>' +
    '<main class="a-body"><div class="a-wrap">' + o.main + '</div></main></div></div>';
}
function akpi(o) {
  return '<section class="a-card a-kpi"><div class="a-kpi__h"><span class="adm-label b-muted">' + o.label + '</span>' + (o.icon ? '<span class="a-kpi__ic">' + icon(o.icon, 18) + '</span>' : '') + '</div>' +
    '<div class="a-kpi__v"><b class="adm-kpi">' + o.value + '</b>' + (o.unit ? '<span class="adm-body b-muted">' + o.unit + '</span>' : '') + '</div>' + (o.extra || '') +
    (o.sub ? '<span class="adm-small b-muted">' + (o.delta ? '<span class="a-delta' + (o.delta[0] === '+' ? ' is-up' : '') + '">' + o.delta + '</span> ' : '') + o.sub + '</span>' : '') + '</section>';
}
function astatus(kind, label) { return '<span class="a-status a-status--' + kind + '">' + icon({ live: 'okcircle', ok: 'okcircle', warn: 'warn', draft: 'pen', info: 'info', off: 'lock', none: 'plusbox' }[kind] || 'info', 14) + label + '</span>'; }
function afield(o) {
  var id = o.id, err = o.error, d = [o.hint ? id + '-h' : '', id + '-e'].filter(Boolean).join(' '), v = o.value == null ? '' : o.value;
  var attrs = ' id="' + id + '" aria-describedby="' + d + '"' + (err ? ' aria-invalid="true"' : '') + (o.required ? ' aria-required="true"' : '') + (o.attrs ? ' ' + o.attrs : '');
  var ctl;
  if (o.type === 'select') ctl = '<select class="t-input a-input"' + attrs + '>' + o.options.map(function (x) { x = [].concat(x); return '<option value="' + esc(x[0]) + '"' + (String(x[0]) === String(v) ? ' selected' : '') + '>' + esc(x[1] || x[0]) + '</option>'; }).join('') + '</select>';
  else if (o.type === 'textarea') ctl = '<textarea class="t-input a-input a-ta' + (o.en ? ' a-en' : '') + '" rows="' + (o.rows || 3) + '"' + attrs + (o.placeholder ? ' placeholder="' + esc(o.placeholder) + '"' : '') + '>' + esc(v) + '</textarea>';
  else if (o.type === 'seg') ctl = '<div class="t-seg a-seg" role="radiogroup" aria-labelledby="' + id + '-l"' + attrs.replace(' id="' + id + '"', ' id="' + id + '"') + '>' + o.options.map(function (x) { x = [].concat(x); return '<button type="button" role="radio" aria-checked="' + (String(x[0]) === String(v)) + '" aria-pressed="' + (String(x[0]) === String(v)) + '" data-v="' + esc(x[0]) + '">' + (x[1] || x[0]) + '</button>'; }).join('') + '</div>';
  else ctl = '<input class="t-input a-input' + (o.en ? ' a-en' : '') + '" type="' + (o.type || 'text') + '"' + attrs + ' value="' + esc(v) + '"' + (o.placeholder ? ' placeholder="' + esc(o.placeholder) + '"' : '') + '>';
  if (o.suffix) ctl = '<div class="a-inrow">' + ctl + o.suffix + '</div>';
  return '<div class="a-field' + (err ? ' is-error' : '') + (o.cls ? ' ' + o.cls : '') + '"><label class="adm-h3" for="' + id + '" id="' + id + '-l">' + o.label + (o.required ? ' <span class="a-req" aria-hidden="true">*</span>' : '') + '</label>' + ctl +
    (o.hint ? '<p class="a-hint adm-small" id="' + id + '-h">' + o.hint + '</p>' : '') + '<p class="a-err adm-small" id="' + id + '-e" role="alert"' + (err ? '' : ' hidden') + '>' + icon('warn', 14) + '<span>' + (err || '') + '</span></p></div>';
}
function setErr(root, id, msg) {
  var f = root.querySelector('#' + id); if (!f) return; var wrap = f.closest('.a-field'), e = root.querySelector('#' + id + '-e');
  wrap.classList.toggle('is-error', !!msg); e.hidden = !msg; e.querySelector('span').textContent = msg || '';
  if (msg) f.setAttribute('aria-invalid', 'true'); else f.removeAttribute('aria-invalid');
}
/* Kiểm tra biểu mẫu: rules = { id: function(value, root) -> 'thông báo lỗi' | '' }; báo lỗi khi rời ô và khi bấm lưu */
function validate(root, rules, live) {
  var bad = 0, first = null;
  Object.keys(rules).forEach(function (id) { var f = root.querySelector('#' + id); if (!f) return; var m = rules[id](f.value, root) || ''; setErr(root, id, m); if (m) { bad++; first = first || f; } });
  if (first && !live) first.focus();
  return bad;
}
function wireValidate(root, rules) { Object.keys(rules).forEach(function (id) { var f = root.querySelector('#' + id); if (!f) return; f.addEventListener('blur', function () { setErr(root, id, rules[id](f.value, root) || ''); }); f.addEventListener('input', function () { if (f.closest('.a-field').classList.contains('is-error')) setErr(root, id, rules[id](f.value, root) || ''); }); }); }
function atoggle(id, label, on, sub) { return '<div class="a-toggle"><span><b class="adm-h3" id="' + id + '-l">' + label + '</b>' + (sub ? '<br><span class="adm-small b-muted">' + sub + '</span>' : '') + '</span><button type="button" role="switch" class="a-switch" id="' + id + '" aria-checked="' + !!on + '" aria-labelledby="' + id + '-l"><i></i></button></div>'; }
function aempty(o) { return '<div class="a-state">' + dragon(o.expr || 'suynghi', 64) + '<h2 class="adm-h2">' + o.title + '</h2>' + (o.text ? '<p class="adm-body b-muted">' + o.text + '</p>' : '') + (o.action || '') + '</div>'; }
function aerror(o) { o = o || {}; return '<div class="a-state" role="alert"><span class="a-state__ic">' + icon('wifi', 26) + '</span><h2 class="adm-h2">' + (o.title || 'Chưa tải được dữ liệu') + '</h2><p class="adm-body b-muted">' + (o.text || 'Kết nối máy chủ bị gián đoạn. Dữ liệu đã lưu không bị ảnh hưởng.') + '</p>' + abtn({ label: 'Thử lại', icon: 'replay', attrs: 'data-retry' }) + (o.code ? '<span class="adm-small b-muted">Mã lỗi: ' + o.code + '</span>' : '') + '</div>'; }
function askel(h) { return '<section class="a-card">' + sk('38%', '16px') + '<div style="height:12px"></div>' + sk('100%', h || '120px') + '</section>'; }

/* ---------- Biểu đồ: cột dọc (một chuỗi hoặc màu theo cấp), cột ngang, đường ---------- */
function nf(v) { return String(v).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
function avbars(data, o) {
  o = o || {}; var H = o.h || 160, max = o.max || Math.ceil(Math.max.apply(null, data.map(function (d) { return d.v || 0; }).concat(o.ref ? [o.ref.v] : [])) * 1.15 / 10) * 10 || 10;
  var ticks = [0, max / 2, max].map(function (t) { return '<span style="bottom:' + (t / max * H) + 'px">' + nf(Math.round(t)) + '</span><i style="bottom:' + (t / max * H) + 'px"></i>'; }).join('');
  var hiV = Math.max.apply(null, data.map(function (d) { return d.v || 0; }));
  var cols = data.map(function (d, i) {
    var h = d.v ? Math.max(3, Math.round(H * d.v / max)) : 0, col = d.level ? 'var(--level-' + d.level + ')' : (o.color || 'var(--chart-1)');
    var lbl = (o.labels === 'all' || (o.labels !== 'none' && d.v === hiV && d.v)) ? '<span class="a-bar__v">' + nf(d.v) + '</span>' : '';
    var showK = !o.every || i % o.every === 0 || i === data.length - 1;
    return '<div class="a-bar" tabindex="0" data-tip="' + (d.tip || (d.k + ': ' + nf(d.v || 0) + ' ' + (o.unit || ''))) + '" aria-label="' + (d.tip || (d.k + ': ' + nf(d.v || 0) + ' ' + (o.unit || ''))) + '">' + lbl + '<span class="a-bar__m" style="height:' + h + 'px;background:' + col + '"></span><span class="a-bar__k adm-small">' + (showK ? d.k : '') + '</span></div>';
  }).join('');
  var ref = o.ref ? '<div class="a-ref" style="bottom:' + (o.ref.v / max * H + 24) + 'px"><span class="adm-small">' + o.ref.label + '</span></div>' : '';
  return '<div class="a-chart" style="height:' + (H + 24) + 'px"><div class="a-axis" style="height:' + H + 'px">' + ticks + '</div><div class="a-cols" style="height:' + (H + 24) + 'px">' + cols + '</div>' + ref + '<div class="t-tip a-tip" role="tooltip" hidden></div></div>';
}
function ahbars(rows, o) {
  o = o || {}; var max = o.max || 100;
  return '<div class="a-hbars">' + (o.legend ? '<div class="a-legend adm-small"><span><i style="background:var(--chart-1)"></i>' + o.legend[0] + '</span><span><i class="tick"></i>' + o.legend[1] + '</span></div>' : '') + rows.map(function (r) {
    return '<div class="a-hrow" tabindex="0" data-tip="' + r.k + ': ' + r.v + (o.unit || '') + (r.prev != null ? ' (trước: ' + r.prev + (o.unit || '') + ')' : '') + '"><span class="adm-body">' + r.k + '</span><div class="a-htrk"><i style="width:' + (r.v / max * 100) + '%;background:' + (r.color || 'var(--chart-1)') + '"></i>' + (r.prev != null ? '<b class="a-htick" style="left:' + (r.prev / max * 100) + '%"></b>' : '') + '</div><b class="adm-body">' + r.v + (o.unit || '') + '</b></div>';
  }).join('') + '<div class="t-tip a-tip" role="tooltip" hidden></div></div>';
}
function aline(pts, o) {
  o = o || {}; var W = 640, H = o.h || 180, min = o.min == null ? 0 : o.min, max = o.max || 10, pad = 28;
  var x = function (i) { return pad + i * (W - pad - 16) / Math.max(1, pts.length - 1); }, y = function (v) { return 8 + (H - 32) * (1 - (v - min) / (max - min)); };
  var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + x(i) + ' ' + y(p.v); }).join(' ');
  var area = d + ' L' + x(pts.length - 1) + ' ' + (H - 24) + ' L' + x(0) + ' ' + (H - 24) + ' Z';
  var grid = [min, (min + max) / 2, max].map(function (t) { return '<line x1="' + pad + '" x2="' + W + '" y1="' + y(t) + '" y2="' + y(t) + '" stroke="var(--chart-grid)"/><text x="' + (pad - 6) + '" y="' + (y(t) + 4) + '" text-anchor="end" class="a-svgt">' + nf(t) + '</text>'; }).join('');
  var ref = o.ref ? '<line x1="' + pad + '" x2="' + W + '" y1="' + y(o.ref.v) + '" y2="' + y(o.ref.v) + '" stroke="var(--chart-ref)" stroke-dasharray="5 5" stroke-width="1.5"/><text x="' + (pad + 6) + '" y="' + (y(o.ref.v) - 6) + '" class="a-svgt">' + o.ref.label + '</text>' : '';
  var xs = pts.map(function (p, i) { return '<text x="' + x(i) + '" y="' + (H - 6) + '" text-anchor="middle" class="a-svgt">' + p.k + '</text>'; }).join('');
  var dots = pts.map(function (p, i) { return '<button type="button" class="a-dot' + (p.on ? ' is-on' : '') + '" style="left:' + (x(i) / W * 100) + '%;top:' + (y(p.v) / H * 100) + '%" data-tip="' + p.tip + '" aria-label="' + p.tip + '"' + (p.id ? ' data-id="' + p.id + '"' : '') + '></button>'; }).join('');
  var last = pts[pts.length - 1];
  return '<div class="a-chart a-line"><svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true">' + grid + ref + '<path d="' + area + '" fill="var(--chart-1-soft)" opacity=".6"/><path d="' + d + '" fill="none" stroke="var(--chart-1)" stroke-width="2" vector-effect="non-scaling-stroke"/>' + xs + '<text x="' + x(pts.length - 1) + '" y="' + (y(last.v) - 12) + '" text-anchor="end" class="a-svgt a-svgv">' + (o.fmt || nf)(last.v) + '</text></svg>' + dots + '<div class="t-tip a-tip" role="tooltip" hidden></div></div>';
}
function wireTips(scr) {
  scr.querySelectorAll('.a-chart, .a-hbars').forEach(function (ch) {
    var tip = ch.querySelector('.a-tip'); if (!tip) return;
    function show(el) { var vp = ch.closest('.dsf-vp'), s = (vp && vp.__scale) || 1, r = el.getBoundingClientRect(), cr = ch.getBoundingClientRect(); var m = el.querySelector('.a-bar__m') || el; tip.textContent = el.getAttribute('data-tip'); tip.hidden = false; tip.style.left = ((r.left + r.width / 2 - cr.left) / s) + 'px'; tip.style.top = ((m.getBoundingClientRect().top - cr.top) / s - 8) + 'px'; }
    ch.querySelectorAll('[data-tip]').forEach(function (b) { ['mouseenter', 'focus'].forEach(function (ev) { b.addEventListener(ev, function () { show(b); }); }); ['mouseleave', 'blur'].forEach(function (ev) { b.addEventListener(ev, function () { tip.hidden = true; }); }); });
  });
}

/* ---------- Bảng dữ liệu: tìm kiếm, bộ lọc, sắp xếp, phân trang ---------- */
function atable(cfg) {
  var S = cfg.state = cfg.state || { q: '', f: {}, sort: cfg.sort || null, page: 1, size: cfg.pageSize || 8 };
  function rows() {
    var r = cfg.rows.filter(function (row) {
      if (S.q) { var hay = (cfg.searchKeys || []).map(function (k) { return row[k]; }).join(' ').toLowerCase(); if (hay.indexOf(S.q.toLowerCase()) < 0) return false; }
      return (cfg.filters || []).every(function (f) { var v = S.f[f.key]; return !v || v === 'all' || (f.match ? f.match(row, v) : String(row[f.key]) === v); });
    });
    if (S.sort) { var k = S.sort.key, dir = S.sort.dir === 'asc' ? 1 : -1; r = r.slice().sort(function (a, b) { var x = a[k], y = b[k]; return (typeof x === 'number' ? x - y : String(x).localeCompare(String(y), 'vi')) * dir; }); }
    return r;
  }
  function inner() {
    var all = rows(), pages = Math.max(1, Math.ceil(all.length / S.size)); if (S.page > pages) S.page = pages;
    var list = all.slice((S.page - 1) * S.size, S.page * S.size);
    var head = '<tr>' + (cfg.select ? '<th scope="col" class="a-chk"><input type="checkbox" aria-label="Chọn tất cả trên trang"></th>' : '') + cfg.columns.map(function (c) {
      if (!c.sort) return '<th scope="col"' + (c.w ? ' style="width:' + c.w + '"' : '') + (c.align ? ' class="a-' + c.align + '"' : '') + '>' + c.label + '</th>';
      var on = S.sort && S.sort.key === c.key, dir = on ? S.sort.dir : null;
      return '<th scope="col" aria-sort="' + (on ? (dir === 'asc' ? 'ascending' : 'descending') : 'none') + '"' + (c.w ? ' style="width:' + c.w + '"' : '') + (c.align ? ' class="a-' + c.align + '"' : '') + '><button type="button" class="a-sort" data-sort="' + c.key + '">' + c.label + icon(on ? (dir === 'asc' ? 'sortup' : 'sortdown') : 'sortnone', 14) + '</button></th>';
    }).join('') + (cfg.actions ? '<th scope="col"><span class="b-sr">Thao tác</span></th>' : '') + '</tr>';
    var body = list.length ? list.map(function (row) { return '<tr' + (cfg.rowAttrs ? ' ' + cfg.rowAttrs(row) : '') + '>' + (cfg.select ? '<td class="a-chk"><input type="checkbox" aria-label="Chọn ' + esc(row[cfg.columns[0].key]) + '"></td>' : '') + cfg.columns.map(function (c) { return '<td' + (c.align ? ' class="a-' + c.align + '"' : '') + '>' + (c.render ? c.render(row) : esc(row[c.key])) + '</td>'; }).join('') + (cfg.actions ? '<td class="a-right">' + cfg.actions(row) + '</td>' : '') + '</tr>'; }).join('')
      : '<tr><td colspan="' + (cfg.columns.length + (cfg.select ? 1 : 0) + (cfg.actions ? 1 : 0)) + '">' + aempty({ title: 'Không có kết quả phù hợp', text: 'Thử từ khoá khác hoặc xoá bộ lọc.', action: abtn({ label: 'Xoá bộ lọc', variant: 'secondary', attrs: 'data-clear' }) }) + '</td></tr>';
    var from = all.length ? (S.page - 1) * S.size + 1 : 0, to = Math.min(all.length, S.page * S.size);
    var pg = ''; for (var p = 1; p <= pages; p++) pg += '<button type="button" class="a-pg' + (p === S.page ? ' is-on' : '') + '" data-page="' + p + '"' + (p === S.page ? ' aria-current="page"' : '') + ' aria-label="Trang ' + p + '">' + p + '</button>';
    return '<div class="a-tblw"><table class="a-tbl"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>' +
      '<div class="a-tfoot"><span class="adm-small b-muted" aria-live="polite">Hiển thị ' + from + '–' + to + ' / ' + nf(cfg.total || all.length) + (cfg.total && cfg.total !== cfg.rows.length ? ' (bản xem trước có ' + cfg.rows.length + ' dòng)' : '') + '</span>' +
      '<div class="a-pgs"><label class="adm-small b-muted" for="' + cfg.id + '-ps">Mỗi trang</label><select class="t-input a-input a-ps" id="' + cfg.id + '-ps">' + [5, 8, 10, 25].map(function (n) { return '<option' + (n === S.size ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select>' +
      '<button type="button" class="a-pg" data-page="' + (S.page - 1) + '" aria-label="Trang trước"' + (S.page === 1 ? ' disabled' : '') + '>' + icon('back', 16) + '</button>' + pg + '<button type="button" class="a-pg" data-page="' + (S.page + 1) + '" aria-label="Trang sau"' + (S.page === pages ? ' disabled' : '') + '>' + icon('next', 16) + '</button></div></div>';
  }
  function toolbar() {
    return '<div class="a-tbar">' + (cfg.searchKeys ? '<div class="a-search">' + icon('search', 18) + '<label class="b-sr" for="' + cfg.id + '-q">Tìm kiếm</label><input class="t-input a-input" id="' + cfg.id + '-q" placeholder="' + (cfg.placeholder || 'Tìm…') + '" value="' + esc(S.q) + '"></div>' : '') +
      (cfg.filters || []).map(function (f) { return '<label class="b-sr" for="' + cfg.id + '-f-' + f.key + '">' + f.label + '</label><select class="t-input a-input a-filter" id="' + cfg.id + '-f-' + f.key + '" data-f="' + f.key + '">' + [['all', f.label + ': tất cả']].concat(f.options).map(function (o) { o = [].concat(o); return '<option value="' + o[0] + '"' + ((S.f[f.key] || 'all') === String(o[0]) ? ' selected' : '') + '>' + (o[1] || o[0]) + '</option>'; }).join('') + '</select>'; }).join('') +
      '<span class="a-tbar__sp"></span>' + (cfg.right || '') + '</div>';
  }
  return {
    html: function () { return '<section class="a-card a-tablecard" id="' + cfg.id + '">' + toolbar() + '<div class="a-tinner">' + inner() + '</div></section>'; },
    mount: function (root, onChange) {
      var card = root.querySelector('#' + cfg.id); if (!card) return;
      var box = card.querySelector('.a-tinner');
      function redraw(focusSel) { box.innerHTML = inner(); bindInner(); if (focusSel) { var f = card.querySelector(focusSel); f && f.focus(); } onChange && onChange(); }
      function bindInner() {
        box.querySelectorAll('[data-sort]').forEach(function (b) { b.addEventListener('click', function () { var k = b.dataset.sort; S.sort = S.sort && S.sort.key === k ? { key: k, dir: S.sort.dir === 'asc' ? 'desc' : 'asc' } : { key: k, dir: 'asc' }; redraw('[data-sort="' + k + '"]'); }); });
        box.querySelectorAll('[data-page]').forEach(function (b) { b.addEventListener('click', function () { S.page = +b.dataset.page; redraw('.a-pg.is-on'); }); });
        var ps = box.querySelector('.a-ps'); ps && ps.addEventListener('change', function () { S.size = +ps.value; S.page = 1; redraw('#' + cfg.id + '-ps'); });
        var cl = box.querySelector('[data-clear]'); cl && cl.addEventListener('click', function () { S.q = ''; S.f = {}; card.querySelectorAll('.a-filter').forEach(function (s) { s.value = 'all'; }); var q = card.querySelector('#' + cfg.id + '-q'); if (q) q.value = ''; redraw(); });
        if (cfg.onRow) box.querySelectorAll('tbody tr[data-row]').forEach(function (tr) { tr.addEventListener('click', function (e) { if (e.target.closest('button,input,a,select')) return; cfg.onRow(tr.dataset.row, tr); }); });
        if (cfg.onMount) cfg.onMount(box);
      }
      var q = card.querySelector('#' + cfg.id + '-q'); q && q.addEventListener('input', function () { S.q = q.value; S.page = 1; redraw(); });
      card.querySelectorAll('.a-filter').forEach(function (s) { s.addEventListener('change', function () { S.f[s.dataset.f] = s.value; S.page = 1; redraw(); }); });
      bindInner();
    }
  };
}

/* ---------- Ngăn kéo biểu mẫu bên phải ---------- */
function adrawer(scr, o) {
  var old = scr.querySelector('.a-drawer-wrap'); if (old) old.remove();
  var w = document.createElement('div'); w.className = 'a-drawer-wrap';
  w.innerHTML = '<div class="a-drawer' + (o.wide ? ' a-drawer--wide' : '') + '" role="dialog" aria-modal="true" aria-labelledby="dr-t"><header><h2 class="adm-h2" id="dr-t">' + o.title + '</h2><button type="button" class="a-iconbtn" data-dclose aria-label="Đóng">' + icon('close', 18) + '</button></header><div class="a-drawer__b">' + o.body + '</div><footer>' + (o.foot || '') + '</footer></div>';
  scr.appendChild(w); var prev = document.activeElement;
  requestAnimationFrame(function () { w.classList.add('is-open'); });
  function close() { w.classList.remove('is-open'); setTimeout(function () { w.remove(); }, 220); document.removeEventListener('keydown', onKey, true); prev && prev.focus && prev.focus({ preventScroll: true }); }
  function onKey(e) { if (e.key === 'Escape' && !document.querySelector('.b-overlay')) { e.preventDefault(); e.stopPropagation(); close(); } }
  document.addEventListener('keydown', onKey, true);
  w.querySelector('[data-dclose]').addEventListener('click', close);
  w.addEventListener('click', function (e) { if (e.target === w) close(); });
  setTimeout(function () { var f = w.querySelector('input,select,textarea,button:not([data-dclose])'); f && f.focus({ preventScroll: true }); }, 60);
  return { el: w, close: close };
}
/* Hộp thoại người lớn: không linh vật; onClick(wrap) trả về false thì giữ hộp thoại (dùng để báo lỗi ô nhập ngay trong hộp thoại). variant 'danger' = nút cam nâu. */
function adialog(scr, o) {
  var wrap = document.createElement('div'); wrap.className = 'b-overlay';
  wrap.innerHTML = '<div class="b-dialog a-dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-t"' + (o.wide ? ' style="width:' + (o.wide === true ? 560 : o.wide) + 'px"' : '') + '><h2 class="adm-h2" id="dlg-t">' + o.title + '</h2>' + (o.body ? '<div class="adm-body a-dialog__b">' + o.body + '</div>' : '') +
    '<div class="b-dialog__actions">' + o.actions.map(function (a, i) { return abtn({ label: a.label, icon: a.icon, variant: a.variant === 'danger' ? 'primary' : (a.variant || 'secondary'), cls: a.variant === 'danger' ? 'a-btn--danger' : '', attrs: 'data-dlg="' + i + '"' }); }).join('') + '</div></div>';
  scr.appendChild(wrap);
  var prev = document.activeElement;
  requestAnimationFrame(function () { wrap.classList.add('is-open'); });
  function foc() { return Array.prototype.filter.call(wrap.querySelectorAll('input, select, textarea, button'), function (x) { return !x.disabled; }); }
  setTimeout(function () { var f = foc(); f[0] && f[0].focus({ preventScroll: true }); }, 30);
  function close() { wrap.classList.remove('is-open'); setTimeout(function () { wrap.remove(); }, 200); document.removeEventListener('keydown', onKey, true); if (prev && prev.isConnected && prev.focus) prev.focus({ preventScroll: true }); }
  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
    if (e.key === 'Tab') { var f = foc(), a = f[0], l = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); l.focus(); } else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); a.focus(); } }
    if (e.key === 'Enter' && wrap.contains(document.activeElement)) e.stopPropagation();
  }
  document.addEventListener('keydown', onKey, true);
  wrap.querySelectorAll('button[data-dlg]').forEach(function (b) { b.addEventListener('click', function () { var a = o.actions[+b.getAttribute('data-dlg')]; if (a.onClick && a.onClick(wrap) === false) return; close(); }); });
  wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
  if (o.onOpen) o.onOpen(wrap);
  return { el: wrap, close: close };
}
function atoast(scr, text) { var t = document.createElement('div'); t.className = 'a-toast'; t.setAttribute('role', 'status'); t.innerHTML = icon('okcircle', 18) + '<span>' + text + '</span>'; scr.appendChild(t); requestAnimationFrame(function () { t.classList.add('is-on'); }); setTimeout(function () { t.classList.remove('is-on'); setTimeout(function () { t.remove(); }, 300); }, 2400); }

/* ---------- Kéo thả sắp xếp (chuột) + phím Alt+↑/↓ trên tay nắm ---------- */
function sortable(list, o) {
  o = o || {};
  var live = list.parentElement.querySelector('.a-live') || (function () { var l = document.createElement('p'); l.className = 'b-sr a-live'; l.setAttribute('aria-live', 'polite'); list.parentElement.appendChild(l); return l; })();
  function items() { return Array.prototype.slice.call(list.querySelectorAll(':scope > [data-sort-item]')); }
  function done(el) { var all = items(); live.textContent = (el.getAttribute('data-name') || 'Mục') + ' ở vị trí ' + (all.indexOf(el) + 1) + ' / ' + all.length; o.onChange && o.onChange(all.map(function (x) { return x.getAttribute('data-sort-item'); })); }
  items().forEach(function (it) {
    var h = it.querySelector('.a-grip'); if (!h) return;
    h.addEventListener('keydown', function (e) {
      if (!(e.key === 'ArrowUp' || e.key === 'ArrowDown')) return; e.preventDefault();
      var sib = e.key === 'ArrowUp' ? it.previousElementSibling : it.nextElementSibling; if (!sib || !sib.hasAttribute('data-sort-item')) return;
      if (e.key === 'ArrowUp') list.insertBefore(it, sib); else list.insertBefore(sib, it); h.focus(); done(it);
    });
    h.addEventListener('pointerdown', function (e) {
      e.preventDefault(); var vp = list.closest('.dsf-vp'), s = (vp && vp.__scale) || 1, sy = e.clientY;
      h.setPointerCapture(e.pointerId); it.classList.add('is-drag');
      function mv(ev) {
        it.style.transform = 'translateY(' + (ev.clientY - sy) / s + 'px)';
        var others = items().filter(function (x) { return x !== it; }), mid = ev.clientY;
        list.querySelectorAll('.is-over').forEach(function (x) { x.classList.remove('is-over', 'is-over-after'); });
        for (var i = 0; i < others.length; i++) { var r = others[i].getBoundingClientRect(); if (mid < r.top + r.height / 2) { others[i].classList.add('is-over'); return; } }
        if (others.length) others[others.length - 1].classList.add('is-over', 'is-over-after');
      }
      function up() {
        h.removeEventListener('pointermove', mv); h.removeEventListener('pointerup', up);
        var tgt = list.querySelector('.is-over'); it.style.transform = ''; it.classList.remove('is-drag');
        if (tgt) { if (tgt.classList.contains('is-over-after')) list.insertBefore(it, tgt.nextSibling); else list.insertBefore(it, tgt); tgt.classList.remove('is-over', 'is-over-after'); done(it); }
      }
      h.addEventListener('pointermove', mv); h.addEventListener('pointerup', up);
    });
  });
}

/* ---------- Khung xem trước khu người lớn ---------- */
function ascreen(cfg) {
  suite('adult');
  var all = cfg.mount && cfg.mount.all;
  cfg.mount = cfg.mount || {};
  cfg.mount.all = function (scr, ctx) {
    scr.classList.add('thcs', 'adm');
    scr.querySelectorAll('a[href="#"]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });
    scr.querySelectorAll('[data-kid]').forEach(function (b) { b.addEventListener('click', function () { ASTATE.kid = b.dataset.kid; ctx.setState(ctx.state); var f = ctx.scr.querySelector('[data-kid="' + ASTATE.kid + '"]'); f && f.focus(); }); });
    var pr = scr.querySelector('[data-profiles]'); pr && pr.addEventListener('click', function () { adialog(scr, { title: 'Về màn chọn hồ sơ?', body: 'Khu người lớn sẽ được khoá lại. Lần sau vào cần nhập lại mật khẩu hoặc mã PIN.', actions: [{ label: 'Về màn chọn hồ sơ', variant: 'primary' }, { label: 'Ở lại', variant: 'secondary' }] }); });
    scr.querySelectorAll('.a-switch').forEach(function (s) { s.addEventListener('click', function () { s.setAttribute('aria-checked', s.getAttribute('aria-checked') !== 'true'); }); });
    scr.querySelectorAll('.a-seg').forEach(function (g) { g.querySelectorAll('[data-v]').forEach(function (b) { b.addEventListener('click', function () { g.querySelectorAll('[data-v]').forEach(function (x) { x.setAttribute('aria-checked', x === b); x.setAttribute('aria-pressed', x === b); }); g.dispatchEvent(new CustomEvent('segchange', { detail: b.dataset.v })); }); }); });
    wireTips(scr);
    if (all) all(scr, ctx);
  };
  return screen(cfg);
}

window.Bong = Object.assign(window.Bong || {}, {
  A: { screen: ascreen, shell: ashell, btn: abtn, kpi: akpi, status: astatus, field: afield, validate: validate, wireValidate: wireValidate, setErr: setErr, toggle: atoggle, empty: aempty, error: aerror, skel: askel,
    vbars: avbars, hbars: ahbars, line: aline, wireTips: wireTips, table: atable, drawer: adrawer, dialog: adialog, toast: atoast, sortable: sortable, kids: FAMILY, state: ASTATE, nf: nf },
  AdultShell: ashell, AdultTable: atable, AdultField: afield, AdultCharts: avbars, AdultKpi: akpi
});

/* =====================================================================
   DỮ LIỆU MẪU KHU QUẢN TRỊ — dùng chung cho các màn xem trước (Bong.A.data)
   Số liệu minh hoạ, đặt khớp với dữ liệu bé (WORDS, LEVELS).
   ===================================================================== */
var ATOPICS = {
  1: ['Con vật', 'Màu sắc', 'Số đếm', 'Chào hỏi'], 2: ['Trái cây', 'Đồ chơi', 'Gia đình', 'Đồ dùng học tập'], 3: ['Trường lớp', 'Cơ thể', 'Quần áo', 'Nhà của em'], 4: ['Thời tiết', 'Đồ ăn', 'Thể thao', 'Thành phố'], 5: ['Nghề nghiệp', 'Lễ hội', 'Sức khoẻ', 'Thiên nhiên'],
  6: ['My house', 'My friends', 'Natural wonders', 'Festivals'], 7: ['Hobbies', 'Health', 'Music and arts', 'Food and drink'], 8: ['Leisure time', 'Life in the countryside', 'Teenagers', 'Ethnic groups', 'Getting around', 'Environmental protection'],
  9: ['City life', 'Healthy living', 'Media', 'Jobs of the future'], 10: ['Science and technology', 'Inventions', 'Space travel', 'Planet Earth']
};
var V = function (w, ipa, pos, vi, ex, exVi, lv, topic, grade, unit, img, audio, st) { return { id: w, word: w, ipa: ipa, pos: pos, vi: vi, ex: ex, exVi: exVi, level: lv, topic: topic, grade: grade, unit: unit, img: img, audio: audio, status: st || 'live' }; };
var AVOCAB = [];
Object.keys(WORDS).forEach(function (w) {
  var d = WORDS[w], lv = { animals: 1, colors: 1, numbers: 1, fruits: 2, toys: 2 }[d.topic], unit = { colors: 'Unit 3', fruits: 'Unit 4', toys: 'Unit 5', numbers: 'Unit 6', animals: 'Unit 7' }[d.topic];
  AVOCAB.push(V(w, d.ipa, w === 'red' || w === 'blue' || w === 'yellow' || w === 'green' ? 'tính từ' : w === 'one' || w === 'two' || w === 'three' ? 'số từ' : 'danh từ', d.vi, d.ex, d.exVi, lv, TOPICS[d.topic], 3, unit, true, true));
});
AVOCAB.push(
  V('mother', '/ˈmʌð.ər/', 'danh từ', 'mẹ', 'This is my mother.', 'Đây là mẹ của tớ.', 2, 'Gia đình', 3, 'Unit 2', false, true),
  V('father', '/ˈfɑː.ðər/', 'danh từ', 'bố', 'My father is tall.', 'Bố tớ cao.', 2, 'Gia đình', 3, 'Unit 2', false, false, 'draft'),
  V('pencil', '/ˈpen.səl/', 'danh từ', 'bút chì', 'I have a red pencil.', 'Tớ có một cái bút chì đỏ.', 3, 'Trường lớp', 4, 'Unit 1', false, true),
  V('collect', '/kəˈlekt/', 'động từ', 'sưu tầm', 'I collect old coins.', 'Tớ sưu tầm tiền xu cũ.', 7, 'Hobbies', 7, 'Unit 1', true, true),
  V('leisure', '/ˈleʒ.ər/', 'danh từ', 'thời gian rảnh rỗi', 'What do you do in your leisure time?', 'Bạn làm gì vào thời gian rảnh?', 8, 'Leisure time', 8, 'Unit 1', true, true),
  V('countryside', '/ˈkʌn.tri.saɪd/', 'danh từ', 'vùng nông thôn', 'Life in the countryside is peaceful.', 'Cuộc sống ở nông thôn thật yên bình.', 8, 'Life in the countryside', 8, 'Unit 2', true, true),
  V('peaceful', '/ˈpiːs.fəl/', 'tính từ', 'yên bình', 'The village is quiet and peaceful.', 'Ngôi làng yên tĩnh và thanh bình.', 8, 'Life in the countryside', 8, 'Unit 2', false, true),
  V('teenager', '/ˈtiːnˌeɪ.dʒər/', 'danh từ', 'thanh thiếu niên', 'Many teenagers use social media.', 'Nhiều bạn tuổi teen dùng mạng xã hội.', 8, 'Teenagers', 8, 'Unit 3', true, true),
  V('pedestrian', '/pəˈdes.tri.ən/', 'danh từ', 'người đi bộ', 'Pedestrians must use the zebra crossing.', 'Người đi bộ phải đi trên vạch kẻ đường.', 8, 'Getting around', 8, '—', true, true),
  V('congestion', '/kənˈdʒes.tʃən/', 'danh từ', 'sự tắc nghẽn', 'Traffic congestion is a big problem in big cities.', 'Tắc đường là vấn đề lớn ở các thành phố lớn.', 8, 'Getting around', 8, '—', false, false),
  V('commute', '/kəˈmjuːt/', 'động từ', 'đi lại hằng ngày (đi học, đi làm)', 'She commutes to school by bus.', 'Bạn ấy đi học hằng ngày bằng xe buýt.', 8, 'Getting around', 8, '—', true, false),
  V('vehicle', '/ˈviː.ə.kəl/', 'danh từ', 'phương tiện, xe cộ', 'Electric vehicles are quieter.', 'Xe điện chạy êm hơn.', 8, 'Getting around', 8, '—', true, true),
  V('pollution', '/pəˈluː.ʃən/', 'danh từ', 'sự ô nhiễm', 'Air pollution is harmful to our health.', 'Ô nhiễm không khí có hại cho sức khoẻ.', 8, 'Environmental protection', 8, 'Unit 7', false, true, 'draft'),
  V('astronaut', '/ˈæs.trə.nɔːt/', 'danh từ', 'phi hành gia', 'The astronaut walked on the Moon.', 'Phi hành gia đã đi bộ trên Mặt Trăng.', 10, 'Planet Earth', 9, 'Unit 10', true, true),
  V('gravity', '/ˈɡræv.ə.ti/', 'danh từ', 'trọng lực', 'There is less gravity on the Moon.', 'Trên Mặt Trăng trọng lực yếu hơn.', 10, 'Planet Earth', 9, 'Unit 10', false, false, 'draft')
);
var ADATA = {
  topics: ATOPICS, vocab: AVOCAB,
  perLevel: { words: [182, 214, 238, 256, 271, 318, 336, 352, 371, 388], lessons: [24, 28, 30, 31, 33, 36, 36, 38, 34, 22], questions: [612, 704, 756, 818, 861, 978, 1036, 1104, 1062, 702] },
  units: { 3: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5', 'Unit 6', 'Unit 7'], 8: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5', 'Unit 6', 'Unit 7'] }
};

/* Khung chương trình: chủ đề đã có trong khung nhưng CHƯA CÓ BÀI (nhãn “Chưa có bài”), kèm danh sách từ mục tiêu */
var HOLI = ['holiday|kỳ nghỉ', 'travel|đi du lịch', 'trip|chuyến đi', 'beach|bãi biển', 'island|hòn đảo', 'mountain|núi', 'lake|hồ', 'river|sông', 'village|ngôi làng', 'city|thành phố', 'hotel|khách sạn', 'campsite|khu cắm trại', 'tent|cái lều', 'suitcase|va li', 'backpack|ba lô', 'passport|hộ chiếu', 'ticket|vé', 'map|bản đồ', 'camera|máy ảnh', 'postcard|bưu thiếp', 'souvenir|quà lưu niệm', 'sunglasses|kính râm', 'sun cream|kem chống nắng', 'towel|khăn tắm', 'airport|sân bay', 'plane|máy bay', 'train|tàu hoả', 'bus|xe buýt', 'boat|thuyền', 'museum|bảo tàng', 'guide|hướng dẫn viên', 'picnic|chuyến dã ngoại', 'swim|bơi', 'sunbathe|tắm nắng', 'sandcastle|lâu đài cát', 'seaside|bờ biển', 'visit|thăm', 'festival|lễ hội', 'weekend|cuối tuần', 'summer|mùa hè', 'countryside|vùng nông thôn', 'photo|bức ảnh'];
var FEEL = ['happy|vui', 'sad|buồn', 'angry|tức giận', 'scared|sợ hãi', 'tired|mệt', 'hungry|đói', 'thirsty|khát', 'bored|chán', 'excited|háo hức', 'surprised|ngạc nhiên', 'worried|lo lắng', 'proud|tự hào', 'shy|ngại ngùng', 'calm|bình tĩnh', 'nervous|hồi hộp', 'lonely|cô đơn', 'friendly|thân thiện', 'kind|tốt bụng', 'brave|dũng cảm', 'cheerful|vui vẻ', 'upset|buồn bực', 'sleepy|buồn ngủ', 'sick|ốm', 'fine|ổn', 'great|tuyệt', 'love|yêu', 'like|thích', 'hate|ghét', 'smile|mỉm cười', 'cry|khóc', 'laugh|cười', 'feel|cảm thấy', 'feeling|cảm xúc', 'hug|ôm', 'worry|lo'];
var INBANK = { bus: 'Cấp 3 · Trường lớp', train: 'Cấp 4 · Thành phố', summer: 'Cấp 4 · Thời tiết', swim: 'Cấp 4 · Thể thao', countryside: 'Cấp 8 · Life in the countryside', happy: 'Cấp 3 · Cơ thể', like: 'Cấp 2 · Trái cây', hungry: 'Cấp 4 · Đồ ăn', city: 'Cấp 9 · City life' };
function fw(list) { return list.map(function (x, i) { var p = x.split('|'); return { id: p[0], n: i + 1, word: p[0], vi: p[1], bank: INBANK[p[0]] || '' }; }); }
ADATA.framework = {
  5: [{ id: 'fw-holi', name: 'Holidays and travel', vi: 'Kỳ nghỉ và du lịch', target: 42, unit: 'Unit 7', words: fw(HOLI) }, { id: 'fw-feel', name: 'Feelings', vi: 'Cảm xúc', target: 35, unit: 'Unit 9', words: fw(FEEL) }],
  6: [{ id: 'fw-sport', name: 'Sports and games', vi: 'Thể thao và trò chơi', target: 38, unit: 'Unit 8' }],
  9: [{ id: 'fw-disa', name: 'Natural disasters', vi: 'Thiên tai', target: 40, unit: 'Unit 9' }, { id: 'fw-tech', name: 'Communication in the future', vi: 'Giao tiếp trong tương lai', target: 32, unit: 'Unit 10' }],
  10: [{ id: 'fw-life', name: 'Life on other planets', vi: 'Sự sống ở hành tinh khác', target: 36, unit: 'Unit 12' }]
};
window.Bong.A.data = ADATA;

})();

/* @ds-bundle: {"format": 4, "namespace": "Bong", "components": [{"name": "Button"}, {"name": "SpeakerButton"}, {"name": "KeyHint"}, {"name": "Card"}, {"name": "ProgressBar"}, {"name": "Dialog"}, {"name": "FeedbackBar"}, {"name": "Mascot"}, {"name": "StatChip"}, {"name": "DataStates"}]} */
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
var EXPR_LABEL = { chao: 'chào', vui: 'vui mừng', dongvien: 'động viên', suynghi: 'suy nghĩ', ngu: 'đang ngủ', chucmung: 'chúc mừng' };
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
  else o.push('<g class="dg-eyes">' + openEye(78, 79, 74) + openEye(122, 121, 74) + '</g>');
  if (expr === 'dongvien') o.push(arc('M68 54 Q78 48 88 54') + arc('M112 54 Q122 48 132 54'));
  // miệng
  if (expr === 'chao' || expr === 'vui' || expr === 'chucmung') o.push('<path d="M87 104 Q100 122 113 104 Z" fill="#8a2d3d" ' + ln + '/><ellipse cx="100" cy="112" rx="6" ry="3.5" fill="#ff8fa8"/>');
  else if (expr === 'ngu') o.push('<ellipse cx="100" cy="107" rx="4" ry="3" fill="#8a2d3d"/>');
  else if (expr === 'suynghi') o.push('<path d="M92 107 Q100 102 108 108" fill="none" stroke="var(--dragon-line)" stroke-width="3.5" stroke-linecap="round"/>');
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
  return '<div class="b-state b-state--' + o.kind + '" role="' + (o.kind === 'error' ? 'alert' : 'status') + '">' + dragon(o.expr || (o.kind === 'error' ? 'dongvien' : 'suynghi'), o.size || 200) +
    '<h2 class="title">' + o.title + '</h2>' + (o.text ? '<p class="body-l b-muted">' + o.text + '</p>' : '') +
    '<div class="b-state__actions">' + (o.action || (o.kind === 'error' ? btn({ label: 'Thử lại', icon: 'replay', size: 'l', attrs: 'data-retry' }) : '')) + '</div></div>';
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
function burst(layer, fromEl, toEl, count) {
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
      var el = document.createElement('div'); el.className = 'b-burst-star'; el.innerHTML = icon('star', 34);
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
  el.innerHTML = '<div class="b-fb__in"><div class="b-fb__mascot">' + dragon(ok ? 'vui' : 'dongvien', 112) + '</div>' +
    '<div class="b-fb__txt"><div class="b-fb__title title">' + icon(ok ? 'check' : 'replay', 30) + '<span>' + o.title + '</span></div>' + (o.detail ? '<div class="b-fb__detail body">' + o.detail + '</div>' : '') + '</div>' +
    '<div class="b-fb__act">' + (o.secondary ? btn({ label: o.secondary.label, variant: 'ghost', size: 'l', attrs: 'data-fb-sec' }) : '') +
    btn({ label: o.action || (ok ? 'Tiếp tục' : 'Thử lại'), variant: ok ? 'success' : 'retry', size: 'l', key: 'Enter', attrs: 'data-fb-go' }) + '</div></div>';
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
  wrap.innerHTML = '<div class="b-dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-t">' + (o.expr ? '<div class="b-dialog__mascot">' + dragon(o.expr, 150) + '</div>' : '') +
    '<h2 class="title" id="dlg-t">' + o.title + '</h2>' + (o.body ? '<div class="body-l b-muted">' + o.body + '</div>' : '') +
    '<div class="b-dialog__actions">' + o.actions.map(function (a, i) { return btn({ label: a.label, variant: a.variant || 'secondary', size: 'l', key: a.key, attrs: 'data-dlg="' + i + '"' }); }).join('') + '</div></div>';
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
    burst: function (from, to, n) { burst(scr.querySelector('.b-burst-layer') || scr, from, to, n); }
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
  stateBlock: stateBlock, say: say, burst: burst, feedback: feedback, dialog: dialog, screen: screen, esc: esc,
  Button: btn, SpeakerButton: speak, KeyHint: key, Mascot: dragon, Dialog: dialog, FeedbackBar: feedback, StatChip: stat, DataStates: stateBlock,
  Card: function (p) { return '<div class="' + ((p && p.className) || 'b-card') + '"></div>'; }, ProgressBar: function (v, max) { return '<div class="b-progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + max + '" aria-valuenow="' + v + '"><span style="width:' + (100 * v / max) + '%"></span></div>'; }
};
window.Bong = Object.assign(window.Bong || {}, api);

})();

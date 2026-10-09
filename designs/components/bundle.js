/* @ds-bundle: {"format": 4, "namespace": "Bong", "components": [{"name": "Button"}, {"name": "SpeakerButton"}, {"name": "KeyHint"}, {"name": "Card"}, {"name": "ProgressBar"}, {"name": "Dialog"}, {"name": "FeedbackBar"}, {"name": "Mascot"}, {"name": "StatChip"}, {"name": "DataStates"}, {"name": "ThcsButton"}, {"name": "ThcsShell"}, {"name": "ThcsMascot"}, {"name": "ThcsAnswer"}, {"name": "ThcsRewards"}, {"name": "AdultShell"}, {"name": "AdultTable"}, {"name": "AdultField"}, {"name": "AdultCharts"}, {"name": "AdultKpi"}, {"name": "LevelGate"}, {"name": "MascotGrowth"}, {"name": "RewardPopup"}, {"name": "LessonTools"}, {"name": "ReadAloudParagraph"}, {"name": "WordLinks"}]} */
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
/* 5 dáng theo cấp 1–5 (Hạt giống → Cây lớn). Cùng nét vẽ; chỉ đổi tỉ lệ đầu/thân, cánh, đuôi và phụ kiện theo đảo. */
function DSC(cx, cy, sx, sy) { return 'translate(' + cx + ' ' + cy + ') scale(' + sx + ' ' + (sy == null ? sx : sy) + ') translate(' + (-cx) + ' ' + (-cy) + ')'; }
var DLN = 'stroke="var(--dragon-line)" stroke-width="3.5" stroke-linejoin="round"';
var DSTAGE = {
  1: { all: DSC(100, 198, .86), body: DSC(100, 198, .74, .7), head: 'translate(0 26)', tail: DSC(140, 150, .7), wing: '', noWings: true,
       under: '<path d="M50 166 L60 154 L70 166 L80 152 L90 166 L100 152 L110 166 L120 152 L130 166 L140 154 L150 166 C152 188 132 204 100 204 C68 204 48 188 50 166 Z" fill="var(--dragon-egg)" ' + DLN + '/><circle cx="72" cy="184" r="5" fill="var(--dragon-egg-spot)"/><circle cx="124" cy="180" r="6" fill="var(--dragon-egg-spot)"/><circle cx="104" cy="194" r="4" fill="var(--dragon-egg-spot)"/>' },
  2: { all: DSC(100, 198, .93), body: DSC(100, 198, .86, .84), head: 'translate(0 14) ' + DSC(100, 126, .97), tail: DSC(140, 150, .85), wing: DSC(100, 138, .7),
       headExtra: '<path d="M100 32 C96 20 100 12 100 6 M100 18 C88 8 78 12 76 18 C86 24 96 22 100 18 Z M100 14 C110 2 122 6 124 12 C114 20 104 18 100 14 Z" fill="var(--dragon-leaf)" ' + DLN + '/>' },
  4: { all: DSC(100, 198, .97), body: DSC(100, 198, 1.04, 1.12), head: 'translate(0 -11) ' + DSC(100, 126, .96), tail: DSC(140, 150, 1.18), wing: DSC(100, 135, 1.15),
       under: '<path d="M70 110 Q100 124 130 110 L120 130 Q100 140 80 130 Z" fill="var(--dragon-scarf-4)" ' + DLN + '/>' },
  5: { all: DSC(100, 198, .92), body: DSC(100, 198, 1.06, 1.24), head: 'translate(0 -24) ' + DSC(100, 126, .9), tail: DSC(140, 150, 1.28), wing: DSC(100, 132, 1.32),
       under: '<path d="M66 98 Q100 114 134 98 L126 118 Q100 128 74 118 Z" fill="var(--dragon-scarf-5)" ' + DLN + '/><path d="M120 116 L136 146 L124 150 L112 120 Z" fill="var(--dragon-scarf-5)" ' + DLN + '/>',
       headExtra: '<path d="M70 20 C64 6 66 -4 72 -10 C76 0 78 10 78 18 Z M130 20 C136 6 134 -4 128 -10 C124 0 122 10 122 18 Z" fill="var(--dragon-wing)" ' + DLN + '/>' }
};
/* Đồ của Bông (Phòng của tớ · Tủ đồ): opts.top = 'tee' | 'stripe' | 'raincoat'; opts.hat = 'cap' | 'beanie' | 'sunhat'. Không truyền thì hình giữ nguyên. */
var DG_UID = 0, OLN = 'stroke="var(--dragon-line)" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"';
function topShape(id, fill, extra) {
  return '<defs><clipPath id="dgc-' + id + '"><ellipse cx="100" cy="148" rx="49" ry="41"/></clipPath></defs><g clip-path="url(#dgc-' + id + ')"><rect x="40" y="100" width="120" height="70" fill="' + fill + '"/>' + (extra || '') + '<path d="M40 170 Q100 176 160 170" fill="none" ' + OLN + '/></g>' +
    '<ellipse cx="100" cy="148" rx="50" ry="42" fill="none" ' + OLN + '/><path d="M86 108 Q100 122 114 108" fill="none" ' + OLN + '/>';
}
var OUTFIT_TOP = {
  tee: function (id) { return topShape(id, 'var(--outfit-tee)', '<path d="M100 132 l4 8 9 1.4 -6.6 6.3 1.6 8.9 -8 -4.3 -8 4.3 1.6 -8.9 -6.6 -6.3 9 -1.4z" fill="var(--star)" stroke="var(--dragon-line)" stroke-width="2"/>'); },
  stripe: function (id) { return topShape(id, 'var(--outfit-stripe-a)', [112, 128, 144, 160].map(function (y) { return '<rect x="40" y="' + y + '" width="120" height="8" fill="var(--outfit-stripe-b)"/>'; }).join('')); },
  raincoat: function (id) { return topShape(id, 'var(--outfit-raincoat)', '<path d="M100 112 V170" stroke="var(--dragon-line)" stroke-width="3"/><circle cx="108" cy="130" r="3.5" fill="var(--dragon-line)"/><circle cx="108" cy="148" r="3.5" fill="var(--dragon-line)"/><path d="M70 150 h18 v12 h-18z" fill="none" stroke="var(--dragon-line)" stroke-width="3"/>'); }
};
var OUTFIT_HAT = {
  cap: '<path d="M58 50 C58 12 142 12 142 50 Z" fill="var(--outfit-cap)" ' + OLN + '/><path d="M126 46 Q166 42 176 56 Q150 62 124 56 Z" fill="var(--outfit-cap-brim)" ' + OLN + '/><path d="M100 16 V48 M80 20 Q78 34 80 48 M120 20 Q122 34 120 48" fill="none" stroke="var(--outfit-cap-brim)" stroke-width="3"/><circle cx="100" cy="15" r="5" fill="var(--outfit-cap-brim)" ' + OLN + '/>',
  beanie: '<path d="M56 54 C52 8 148 8 144 54 Z" fill="var(--outfit-beanie)" ' + OLN + '/><rect x="52" y="44" width="96" height="16" rx="8" fill="var(--outfit-beanie)" ' + OLN + '/><path d="M64 46 v12 M76 46 v12 M88 46 v12 M100 46 v12 M112 46 v12 M124 46 v12 M136 46 v12" stroke="var(--dragon-line)" stroke-width="2" opacity=".35"/><circle cx="100" cy="10" r="11" fill="var(--outfit-pompom)" ' + OLN + '/>',
  sunhat: '<ellipse cx="100" cy="48" rx="76" ry="14" fill="var(--outfit-sunhat)" ' + OLN + '/><path d="M66 46 C66 12 134 12 134 46 Z" fill="var(--outfit-sunhat)" ' + OLN + '/><path d="M66 38 Q100 44 134 38 L134 46 Q100 52 66 46 Z" fill="var(--outfit-ribbon)" ' + OLN + '/><circle cx="128" cy="40" r="6" fill="var(--garden-flower)" ' + OLN + '/>'
};
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
  // áo của Bông (opts.top) — chỉ khi có opts, hình mặc định giữ nguyên
  if (opts.top && OUTFIT_TOP[opts.top]) o.push(OUTFIT_TOP[opts.top](++DG_UID));
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
  var iHead = o.length;
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
  var iHeadEnd = o.length, iHammer = -1;
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
  if (opts.hat && OUTFIT_HAT[opts.hat]) o.push(OUTFIT_HAT[opts.hat]);
  if (expr === 'chucmung') {
    if (!opts.hat) o.push('<path d="M82 34 L104 -2 L120 34 Z" fill="var(--star)" ' + ln + ' transform="rotate(8 100 30)"/><circle cx="106" cy="-2" r="6" fill="var(--dragon-cheek)" ' + ln + ' transform="rotate(8 100 30)"/>');
    var conf = [[24, 40, '#ff8a3d', 20], [176, 34, '#3fa9f5', -25], [16, 96, '#9b5de5', 40], [186, 150, '#ffd23f', 10], [34, 168, '#3fb950', -30], [160, 12, '#ff5a6e', 15]];
    o.push('<g class="dg-confetti">' + conf.map(function (c) { return '<rect x="' + c[0] + '" y="' + c[1] + '" width="10" height="6" rx="2" fill="' + c[2] + '" transform="rotate(' + c[3] + ' ' + c[0] + ' ' + c[1] + ')"/>'; }).join('') + '</g>');
  }
  if (expr === 'xaydung') {
    iHammer = o.length;
    o.push('<g transform="rotate(24 164 104)"><rect x="159" y="40" width="9" height="70" rx="4.5" fill="var(--dragon-tool)" ' + ln + '/><rect x="144" y="28" width="40" height="20" rx="5" fill="var(--dragon-tool-head)" ' + ln + '/></g><circle cx="163" cy="104" r="10" ' + body + '/>');
    o.push('<path d="M56 52 C58 22 142 22 144 52 Z" fill="var(--dragon-hat)" ' + ln + '/><rect x="46" y="48" width="108" height="12" rx="6" fill="var(--dragon-hat-shade)" ' + ln + '/><path d="M100 24 V48 M84 28 L88 48 M116 28 L112 48" stroke="var(--dragon-hat-shade)" stroke-width="5" stroke-linecap="round"/>');
    o.push('<g class="dg-dust" fill="var(--star-empty)" stroke="var(--dragon-line)" stroke-width="2"><circle cx="186" cy="70" r="5"/><circle cx="194" cy="84" r="3.5"/></g>');
  }
  if (expr === 'vui') o.push('<g class="dg-spark" fill="var(--star)" stroke="var(--star-shade)" stroke-width="2"><path d="M22 52 l4 8 8 4 -8 4 -4 8 -4 -8 -8 -4 8 -4z"/><path d="M176 40 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3z"/></g>');
  var label = 'Rồng Bông ' + (EXPR_LABEL[expr] || '');
  if (opts.top || opts.hat) label += ', đang mặc ' + [{ tee: 'áo phông', stripe: 'áo sọc', raincoat: 'áo mưa' }[opts.top], { cap: 'mũ lưỡi trai', beanie: 'mũ len', sunhat: 'mũ rơm' }[opts.hat]].filter(Boolean).join(' và ');
  var inner = o.join('');
  // Dáng theo cấp (Rồng Bông lớn lên): opts.stage 1–5; 3 = dáng gốc (giữ nguyên hình cũ)
  if (opts.stage && opts.stage !== 3 && DSTAGE[opts.stage]) {
    var g = DSTAGE[opts.stage], bodyP = o.slice(0, iHead), headP = o.slice(iHead, iHeadEnd), accP = o.slice(iHeadEnd), ham = '';
    if (iHammer > -1) { ham = accP[iHammer - iHeadEnd]; accP.splice(iHammer - iHeadEnd, 1); }
    bodyP[0] = '<g transform="' + g.tail + '">' + bodyP[0] + (g.noWings ? '' : bodyP[1]) + '</g>'; bodyP[1] = '';
    bodyP[2] = g.noWings ? '' : '<g transform="' + g.wing + '">' + bodyP[2] + '</g>';
    inner = '<g class="dg-stage dg-stage--' + opts.stage + '" transform="' + g.all + '"><g transform="' + g.body + '">' + bodyP.join('') + '</g>' + (g.under || '') +
      '<g transform="' + g.head + '">' + headP.join('') + (g.headExtra || '') + accP.join('') + '</g>' + (ham ? '<g transform="' + g.body + '">' + ham + '</g>' : '') + (g.over || '') + '</g>';
    label += ', dáng cấp ' + opts.stage;
  }
  return '<svg class="b-dragon b-dragon--' + expr + (opts.cls ? ' ' + opts.cls : '') + '" width="' + s + '" height="' + s + '" viewBox="0 -10 200 210" role="img" aria-label="' + label + '" style="overflow:visible">' + inner + '</svg>';
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

/* =====================================================================
   GIAI ĐOẠN 2 · TIỂU HỌC — bộ khung bài học dùng chung (Bong.L)
   Khung của màn "Nghe và chọn hình": lesson-head / lesson-main / lesson-foot,
   dải phản hồi, hộp thoại "Dừng bài học?", lớp phủ mini game, cổng thi lên cấp.
   ===================================================================== */

/* ---------- Hình minh hoạ bổ sung (cùng nét viền dragon-line) ---------- */
/* Biểu tượng bổ sung GĐ2 (thêm mới, không đổi biểu tượng cũ) */
ICONS.flag = '<path d="M5 21V3.5"/><path d="M5 4h13l-3 4.5 3 4.5H5" fill="currentColor" stroke-linejoin="round"/>';
ICONS.medal = '<path d="M8 2.5l2.5 6M16 2.5l-2.5 6"/><circle cx="12" cy="15" r="6" fill="none"/><path d="M12 12v6M9.8 13.2L12 12" />';
ICONS.island = '<path d="M3 19c3-2 6-2 9 0s6 2 9 0"/><path d="M6 16c1.5-3 10.5-3 12 0"/><path d="M12 14V6M12 6c-2-2-5-1.5-6 0M12 6c2-2 5-1.5 6 0M12 6c-1-2.5 0-4 1.5-4"/>';
PICS.sun = '<g stroke="var(--dragon-line)" stroke-width="3" stroke-linecap="round"><path d="M60 8 v14 M60 98 v14 M8 60 h14 M98 60 h14 M23 23 l10 10 M87 87 l10 10 M97 23 l-10 10 M33 87 l-10 10"/></g><circle cx="60" cy="60" r="30" fill="#ffd23f" ' + L + '/>' + EYE(50, 56) + EYE(70, 56) + '<path d="M50 70 q10 9 20 0" fill="none" ' + L + '/><ellipse cx="42" cy="66" rx="5" ry="3" fill="#ff9f7a"/><ellipse cx="78" cy="66" rx="5" ry="3" fill="#ff9f7a"/>';
PICS.book = '<path d="M14 34 C30 28 46 28 60 36 C74 28 90 28 106 34 V94 C90 88 74 88 60 96 C46 88 30 88 14 94 Z" fill="#fff" ' + L + '/><path d="M60 36 V96" ' + L + '/><path d="M24 46 h26 M24 56 h26 M24 66 h20 M70 46 h26 M70 56 h26 M70 66 h20" stroke="#b9c4d6" stroke-width="3" stroke-linecap="round"/><path d="M14 94 C30 88 46 88 60 96 C74 88 90 88 106 94 V102 C90 96 74 96 60 104 C46 96 30 96 14 102 Z" fill="#4fb3ff" ' + L + '/>';
PICS.girlbook = '<path d="M30 112 C30 88 42 78 60 78 C78 78 90 88 90 112 Z" fill="#ff8fb1" ' + L + '/><ellipse cx="60" cy="46" rx="24" ry="25" fill="#ffd9b8" ' + L + '/><path d="M34 52 C30 24 50 14 62 16 C80 18 92 30 86 54 C84 40 76 32 60 32 C48 32 40 38 36 50 Z" fill="#4a2f22"/><circle cx="34" cy="40" r="9" fill="#4a2f22"/><circle cx="88" cy="40" r="9" fill="#4a2f22"/>' +
  '<path d="M50 50 q4 3 8 0 M64 50 q4 3 8 0" fill="none" stroke="var(--dragon-line)" stroke-width="2.6" stroke-linecap="round"/><path d="M56 60 q4 3 8 0" fill="none" stroke="var(--dragon-line)" stroke-width="2.4" stroke-linecap="round"/>' +
  '<path d="M26 82 C38 76 50 78 60 84 C70 78 82 76 94 82 V108 C82 102 70 104 60 110 C50 104 38 102 26 108 Z" fill="#fff" ' + L + '/><path d="M60 84 V110" ' + L + '/><path d="M26 82 L26 108" stroke="#4fb3ff" stroke-width="6"/><path d="M94 82 L94 108" stroke="#4fb3ff" stroke-width="6"/>';
PICS.catbox = '<path d="M24 62 L96 62 L92 110 L28 110 Z" fill="#d9a066" ' + L + '/><path d="M24 62 L10 48 L40 48 Z M96 62 L110 48 L80 48 Z" fill="#e8b97e" ' + L + '/>' +
  '<path d="M36 64 L34 34 L52 46 Z M84 64 L86 34 L68 46 Z" fill="#ffad5a" ' + L + '/><path d="M36 64 C36 44 46 40 60 40 C74 40 84 44 84 64 Z" fill="#ffad5a" ' + L + '/>' + EYE(50, 54) + EYE(70, 54) + '<path d="M57 60 h6 l-3 3 z" fill="#ff8fa8"/><path d="M24 62 L96 62" ' + L + '/><path d="M40 84 h40" stroke="#b07a43" stroke-width="3" stroke-linecap="round"/>';
PICS.catbed = '<rect x="10" y="66" width="100" height="26" rx="8" fill="#9ad0ff" ' + L + '/><rect x="10" y="44" width="16" height="62" rx="6" fill="#d9a066" ' + L + '/><rect x="94" y="56" width="16" height="50" rx="6" fill="#d9a066" ' + L + '/><rect x="26" y="58" width="24" height="12" rx="6" fill="#fff" ' + L + '/>' +
  '<path d="M52 66 C52 50 62 44 76 44 C90 44 98 52 96 66 Z" fill="#fff" ' + L + '/><path d="M56 50 L58 36 L66 46 M84 46 L90 36 L92 50" fill="#fff" ' + L + '/><path d="M66 56 q4 3 8 0 M80 56 q4 3 8 0" fill="none" stroke="var(--dragon-line)" stroke-width="2.5" stroke-linecap="round"/><path d="M96 62 C108 60 108 50 100 48" fill="none" ' + L + '/>' +
  '<text x="100" y="34" font-family="Baloo 2, sans-serif" font-weight="800" font-size="16" fill="var(--brand)">z</text>';

/* ---------- Đọc bằng giọng máy, có tốc độ (phát chậm khi gợi ý) ---------- */
function lsay(text, rate, btnEl) {
  try { var sy = window.speechSynthesis; if (sy) { sy.cancel(); var u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = rate || 0.82; sy.speak(u); } } catch (e) {}
  if (btnEl) { btnEl.classList.remove('is-playing'); void btnEl.offsetWidth; btnEl.classList.add('is-playing'); setTimeout(function () { btnEl.classList.remove('is-playing'); }, 1300); }
}

/* ---------- Đầu bài, chân bài ---------- */
function ldots(n, total) {
  var h = ''; for (var i = 0; i < total; i++) h += '<span class="b-tdot' + (i < n ? ' is-done' : '') + (i === n ? ' is-cur' : '') + '"></span>';
  return '<div class="b-tdots" role="progressbar" aria-label="Tiến độ bài thi" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + n + '" aria-valuetext="Câu ' + Math.min(n + 1, total) + ' trên ' + total + '">' + h + '</div>';
}
function lhead(o) {
  o = o || {};
  var prog = o.dots ? ldots(o.n, o.total) : lprog(o.n, o.total);
  return '<header class="lesson-head"><button type="button" class="b-iconbtn" aria-label="Thoát bài học" data-exit>' + icon('close', 26) + '</button>' +
    (o.pause ? '<button type="button" class="b-iconbtn" aria-label="Tạm dừng (Esc)" data-pause>' + icon('pause', 24) + '</button>' : '') + prog +
    (o.extra || '') + '<span class="count">' + (o.count != null ? o.count : o.n + '/' + o.total) + '</span></header>';
}
function lprog(v, max) { return '<div class="b-progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + max + '" aria-valuenow="' + v + '"><span style="width:' + (100 * v / max) + '%"></span></div>'; }
function lfoot(o) {
  o = o || {}; var m = o.main || {};
  return '<footer class="lesson-foot"><div><div class="grp">' +
    (o.replay === false ? '' : btn({ label: o.replayLabel || 'Nghe lại', variant: 'secondary', size: 'l', icon: 'replay', key: o.replayKey || 'Space', attrs: 'data-replay', disabled: o.off })) +
    (o.hint === false ? '' : btn({ label: 'Gợi ý', variant: 'secondary', size: 'l', icon: 'bulb', key: o.hintKey || 'H', attrs: 'data-hint', disabled: o.off || o.hintOff })) + (o.left || '') + '</div>' +
    btn({ label: m.label || 'Kiểm tra', size: 'l', key: 'Enter', icon: m.icon, attrs: 'data-main' + (m.attrs ? ' ' + m.attrs : ''), disabled: o.off || m.disabled }) + '</div></footer>';
}
function lsetProg(scr, n, total) { var s = scr.querySelector('.b-progress span'); if (s) s.style.width = (100 * n / total) + '%'; var p = scr.querySelector('.b-progress'); if (p) p.setAttribute('aria-valuenow', n); var c = scr.querySelector('.lesson-head .count'); if (c) c.textContent = n + '/' + total; }

/* ---------- Hộp thoại "Dừng bài học?" (rồng hơi tiếc) ---------- */
function lexit(ctx, left, what) {
  return ctx.dialog({ expr: 'tiec', title: 'Dừng ' + (what || 'bài học') + '?', body: (left ? 'Còn ' + left + ' câu nữa là xong rồi. ' : '') + 'Nếu dừng, lần sau mình làm tiếp từ chỗ này nhé.',
    actions: [{ label: 'Học tiếp', variant: 'primary', key: 'Enter' }, { label: 'Dừng lại', variant: 'secondary' }] });
}

/* ---------- Gắn phím chung: Space nghe lại · H gợi ý · Enter kiểm tra/tiếp tục · Esc dừng ---------- */
function typing() { var a = document.activeElement; return a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable); }
function lwire(scr, ctx, h) {
  h = h || {};
  var ex = scr.querySelector('[data-exit]'); ex && ex.addEventListener('click', function () { h.onExit ? h.onExit() : lexit(ctx, h.left); });
  var rp = scr.querySelector('[data-replay]'); rp && h.onReplay && rp.addEventListener('click', function () { h.onReplay(rp); });
  var hn = scr.querySelector('[data-hint]'); hn && h.onHint && hn.addEventListener('click', function () { h.onHint(); });
  var mn = scr.querySelector('[data-main]'); mn && h.onMain && mn.addEventListener('click', function () { h.onMain(); });
  ctx.onKey(function (e) {
    if (h.onKey && h.onKey(e) === true) return;
    var a = document.activeElement;
    if ((e.key === ' ' || e.code === 'Space') && !typing()) { e.preventDefault(); if (rp && !rp.disabled && h.onReplay) h.onReplay(rp); }
    else if ((e.key === 'h' || e.key === 'H') && !typing() && !e.ctrlKey && !e.metaKey) { e.preventDefault(); if (hn && !hn.disabled && h.onHint) h.onHint(); }
    else if (e.key === 'Enter') {
      if (a && a.tagName === 'BUTTON' && (a.closest('.lesson-foot') || a.matches('[data-exit],[data-pause],[data-own-enter]')) && !a.hasAttribute('data-main')) return;
      e.preventDefault(); if (mn && !mn.disabled && h.onMain) h.onMain();
    }
    else if (e.key === 'Escape') { e.preventDefault(); h.onExit ? h.onExit() : (h.onEsc ? h.onEsc() : lexit(ctx, h.left)); }
  });
}

/* ---------- Đúng / chưa đúng: dải phản hồi + sao bay vào thanh tiến độ ---------- */
function lok(scr, ctx, o) {
  if (o.card) { o.card.classList.remove('is-selected'); o.card.classList.add('is-correct'); if (!o.card.querySelector('.b-badge')) o.card.insertAdjacentHTML('beforeend', '<span class="b-badge">' + icon('check', 24) + '</span>'); }
  var mn = scr.querySelector('[data-main]'); if (mn) mn.disabled = true;
  ctx.burst(o.from || o.card || scr.querySelector('.lesson-main'), scr.querySelector('.b-progress span') || scr.querySelector('.b-tdots'), o.count || 10);
  if (o.n != null) ctx.later(function () { lsetProg(scr, o.n, o.total); }, 700);
  if (o.say) lsay(o.say);
  ctx.feedback({ type: 'ok', title: o.title || 'Chính xác! Giỏi quá!', detail: o.detail, action: o.action, onAction: o.onNext });
}
function lretry(scr, ctx, o) {
  if (o.card) { o.card.classList.remove('is-selected'); o.card.classList.add('is-retry'); if (!o.card.querySelector('.b-badge')) o.card.insertAdjacentHTML('beforeend', '<span class="b-badge">' + icon('replay', 22) + '</span>'); }
  var mn = scr.querySelector('[data-main]'); if (mn) mn.disabled = true;
  ctx.feedback({ type: 'retry', title: o.title || 'Chưa đúng rồi, thử lại nhé!', detail: '<span>' + (o.detail || '') + (o.tries >= 2 ? ' Bông bật gợi ý cho cậu rồi đó!' : ' Bông tin cậu làm được!') + '</span>', onAction: o.onRetry });
}

/* ---------- Lớp phủ (bắt đầu game, tạm dừng, kết thúc) — dùng chung hình hộp thoại ---------- */
function loverlay(scr, o) {
  var wrap = document.createElement('div'); wrap.className = 'b-overlay b-ov2';
  wrap.innerHTML = '<div class="b-dialog b-dialog--game" role="dialog" aria-modal="true" aria-labelledby="ov-t">' + (o.mascot || '') + '<h2 class="title" id="ov-t">' + o.title + '</h2>' + (o.body ? '<div class="body-l b-muted b-ov2__b">' + o.body + '</div>' : '') +
    '<div class="b-dialog__actions">' + o.actions.map(function (a, i) { return btn({ label: a.label, variant: a.variant || 'secondary', size: 'l', key: a.key, icon: a.icon, attrs: 'data-ov="' + i + '"' }); }).join('') + '</div></div>';
  scr.appendChild(wrap); var prev = document.activeElement;
  requestAnimationFrame(function () { wrap.classList.add('is-open'); });
  var bs = wrap.querySelectorAll('[data-ov]');
  setTimeout(function () { (wrap.querySelector('.b-btn--primary') || bs[0]).focus({ preventScroll: true }); }, 40);
  function close() { wrap.classList.remove('is-open'); document.removeEventListener('keydown', onKey, true); setTimeout(function () { wrap.remove(); }, 200); }
  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); if (o.onEsc) { close(); o.onEsc(); } }
    if (e.key === 'Tab') { var f = bs[0], l = bs[bs.length - 1]; if (e.shiftKey && document.activeElement === f) { e.preventDefault(); l.focus(); } else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); f.focus(); } }
    if (e.key === 'Enter' && !wrap.contains(document.activeElement)) { e.preventDefault(); (wrap.querySelector('.b-btn--primary') || bs[0]).click(); }
  }
  document.addEventListener('keydown', onKey, true);
  bs.forEach(function (b) { b.addEventListener('click', function () { var a = o.actions[+b.getAttribute('data-ov')]; close(); a.onClick && a.onClick(); }); });
  return { close: close, el: wrap };
}
function lgameStart(scr, o) {
  return loverlay(scr, { title: o.title, mascot: '<div class="b-ov2__how">' + (o.art || '') + '</div>', body: '<span class="b-ov2__line">' + icon('bulb', 22) + o.how + '</span>',
    actions: [{ label: 'Bắt đầu', variant: 'primary', key: 'Enter', icon: 'next', onClick: o.onStart }], onEsc: o.onEsc || o.onStart });
}
function lgamePause(scr, o) {
  return loverlay(scr, { title: 'Tạm dừng', mascot: '<div class="b-ov2__how">' + dragon('ngu', 120) + '</div>', body: 'Bông chờ cậu nhé. Trò chơi không chạy khi tạm dừng.',
    actions: [{ label: 'Chơi tiếp', variant: 'primary', key: 'Enter', icon: 'play', onClick: o.onResume }, { label: 'Thoát', variant: 'secondary', icon: 'close', onClick: o.onExit }], onEsc: o.onResume });
}
function lgameEnd(scr, o) {
  return loverlay(scr, { title: o.title || 'Xong rồi! Giỏi quá!', mascot: '<div class="b-ov2__how">' + dragon('chucmung', 130) + '</div>',
    body: '<div class="b-ov2__stats"><span><b>' + o.correct + '/' + o.total + '</b> ' + (o.unit || 'từ') + ' đúng</span><span>' + stars(o.stars, 34) + '</span>' + (o.coins ? '<span>' + icon('coin', 28) + '<b>+' + o.coins + '</b> xu</span>' : '') + '</div>' + (o.note ? '<p class="body b-muted" style="margin:8px 0 0">' + o.note + '</p>' : ''),
    actions: [{ label: 'Tiếp tục', variant: 'primary', key: 'Enter', icon: 'next', onClick: o.onNext }], onEsc: o.onNext });
}

/* ---------- Chữ bấm được (đọc to, đọc hiểu): mỗi từ là một nút nhỏ ---------- */
function lwords(text, gloss, startIdx) {
  var i = startIdx || 0;
  return text.split(' ').map(function (t) { var w = t.replace(/[^A-Za-z'’]/g, '').toLowerCase(), pun = t.match(/[.,!?]+$/); var core = pun ? t.slice(0, -pun[0].length) : t;
    return '<button type="button" class="b-kw" data-kw="' + (i++) + '" data-w="' + esc(w) + '" aria-label="' + esc(core) + (gloss && gloss[w] ? ', nghĩa: ' + esc(gloss[w]) : '') + '">' + esc(core) + '</button>' + (pun ? '<span class="b-kw__p">' + pun[0] + '</span>' : ''); }).join(' ');
}

/* ---------- Rồng Bông lớn lên (MascotGrowth) ---------- */
function lgrow(stage, expr, size, cls) { return dragon(expr || 'chao', size, { stage: stage, cls: cls }); }

/* ---------- Trùm Vua Khỉ Lém (vùng Con vật) ---------- */
function lmonkey(mood, size) {
  var s = size || 260, ln = 'stroke="var(--dragon-line)" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"', f = 'fill="var(--boss-fur)" ' + ln, fc = 'fill="var(--boss-face)" ' + ln;
  var eyes = mood === 'hit' ? '<path d="M76 92 l12 10 M88 92 l-12 10 M112 92 l12 10 M124 92 l-12 10" ' + ln + '/>' :
    mood === 'friend' ? '<path d="M74 98 q8 -10 16 0 M110 98 q8 -10 16 0" fill="none" ' + ln + '/>' :
    '<ellipse cx="84" cy="96" rx="8" ry="10" fill="#fff" ' + ln + '/><ellipse cx="116" cy="96" rx="8" ry="10" fill="#fff" ' + ln + '/><circle cx="86" cy="98" r="4.5" fill="var(--dragon-line)"/><circle cx="118" cy="98" r="4.5" fill="var(--dragon-line)"/><path d="M72 80 l16 6 M128 80 l-16 6" ' + ln + '/>';
  var mouth = mood === 'hit' ? '<ellipse cx="100" cy="124" rx="8" ry="6" fill="#8a2d3d" ' + ln + '/>' : mood === 'friend' ? '<path d="M86 118 q14 16 28 0 Z" fill="#8a2d3d" ' + ln + '/>' : '<path d="M86 120 q14 10 28 -2" fill="none" ' + ln + '/><path d="M108 122 q6 8 10 -2" fill="var(--mole-tongue)" ' + ln + '/>';
  var extra = mood === 'hit' ? '<g fill="var(--star)" stroke="var(--star-shade)" stroke-width="2"><path d="M54 40 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z"/><path d="M146 36 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z"/></g>' :
    mood === 'friend' ? '<path d="M160 70 c0 -8 12 -8 12 0 c0 -8 12 -8 12 0 c0 10 -12 16 -12 18 c0 -2 -12 -8 -12 -18z" fill="#ff8fa8" ' + ln + '/>' : '';
  return '<svg class="b-boss-svg b-boss--' + (mood || 'tease') + '" width="' + s + '" height="' + s + '" viewBox="0 0 200 200" role="img" aria-label="Trùm Vua Khỉ Lém' + (mood === 'friend' ? ' đang vui làm bạn' : mood === 'hit' ? ' bị trúng chiêu' : '') + '">' +
    '<path d="M150 164 C186 160 188 120 168 112 C160 110 158 120 166 124 C176 132 170 150 146 152" fill="none" stroke="var(--dragon-line)" stroke-width="12" stroke-linecap="round"/><path d="M150 164 C186 160 188 120 168 112 C160 110 158 120 166 124 C176 132 170 150 146 152" fill="none" stroke="var(--boss-fur)" stroke-width="6" stroke-linecap="round"/>' +
    '<ellipse cx="100" cy="158" rx="46" ry="36" ' + f + '/><ellipse cx="100" cy="164" rx="28" ry="24" ' + fc + '/>' +
    '<ellipse cx="72" cy="192" rx="18" ry="8" ' + f + '/><ellipse cx="128" cy="192" rx="18" ry="8" ' + f + '/>' +
    (mood === 'friend' ? '<path d="M60 146 Q40 120 50 100" fill="none" stroke="var(--dragon-line)" stroke-width="18" stroke-linecap="round"/><path d="M60 146 Q40 120 50 100" fill="none" stroke="var(--boss-fur)" stroke-width="11" stroke-linecap="round"/>' :
      '<path d="M58 146 Q46 162 64 172" fill="none" stroke="var(--dragon-line)" stroke-width="18" stroke-linecap="round"/><path d="M58 146 Q46 162 64 172" fill="none" stroke="var(--boss-fur)" stroke-width="11" stroke-linecap="round"/>') +
    '<path d="M142 146 Q154 162 136 172" fill="none" stroke="var(--dragon-line)" stroke-width="18" stroke-linecap="round"/><path d="M142 146 Q154 162 136 172" fill="none" stroke="var(--boss-fur)" stroke-width="11" stroke-linecap="round"/>' +
    '<circle cx="48" cy="96" r="18" ' + f + '/><circle cx="48" cy="96" r="9" fill="var(--boss-face)"/><circle cx="152" cy="96" r="18" ' + f + '/><circle cx="152" cy="96" r="9" fill="var(--boss-face)"/>' +
    '<ellipse cx="100" cy="98" rx="50" ry="44" ' + f + '/><path d="M64 104 C62 80 80 74 100 86 C120 74 138 80 136 104 C136 128 120 138 100 138 C80 138 64 128 64 104 Z" ' + fc + '/>' + eyes +
    '<ellipse cx="94" cy="112" rx="2.5" ry="2" fill="var(--dragon-line)"/><ellipse cx="106" cy="112" rx="2.5" ry="2" fill="var(--dragon-line)"/>' + mouth +
    '<path d="M70 58 L74 30 L88 46 L100 24 L112 46 L126 30 L130 58 Z" fill="var(--star)" ' + ln + '/><circle cx="100" cy="44" r="5" fill="var(--level-6)" ' + ln + '/><path d="M70 58 H130" ' + ln + '/>' + extra + '</svg>';
}

/* ---------- Cổng thi lên cấp (LevelGate) ---------- */
function lgate(o) {
  o = o || {}; var lk = o.locked !== false, ln = 'stroke="var(--dragon-line)" stroke-width="3.5" stroke-linejoin="round"';
  var svg = '<svg viewBox="0 0 160 170" class="b-gate__svg" aria-hidden="true"><path d="M14 168 V70 C14 26 44 6 80 6 C116 6 146 26 146 70 V168 Z" fill="var(--gate-stone)" ' + ln + '/>' +
    '<path d="M34 168 V76 C34 46 54 28 80 28 C106 28 126 46 126 76 V168 Z" fill="' + (lk ? 'var(--gate-dark)' : 'var(--gate-glow)') + '" ' + ln + '/>' +
    '<path d="M14 100 H34 M126 100 H146 M14 134 H34 M126 134 H146 M24 50 L38 60 M136 50 L122 60 M80 6 V28" stroke="var(--gate-stone-shade)" stroke-width="3"/>' +
    (lk ? '<path d="M50 168 V90 M66 168 V80 M80 168 V78 M94 168 V80 M110 168 V90" stroke="var(--gate-stone-shade)" stroke-width="6"/><rect x="58" y="112" width="44" height="36" rx="8" fill="var(--star)" ' + ln + '/><path d="M66 112 V100 a14 14 0 0 1 28 0 V112" fill="none" ' + ln + '/><circle cx="80" cy="128" r="4" fill="var(--dragon-line)"/>' :
      '<g fill="var(--star)" stroke="var(--star-shade)" stroke-width="2"><path d="M60 70 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z"/><path d="M100 96 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z"/><path d="M76 130 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z"/></g>') + '</svg>';
  var lab = lk ? icon('lock', 18) + 'Còn ' + o.left + ' vùng' : icon('star', 20) + 'Bài thi lên cấp';
  return '<button type="button" class="b-gate ' + (lk ? 'is-locked' : 'is-open') + '" data-gate aria-label="' + (lk ? 'Cổng lên ' + (o.next || 'đảo mới') + ' đang khoá: còn ' + o.left + ' vùng chưa xong' : 'Cổng lên ' + (o.next || 'đảo mới') + ' đã mở: vào bài thi lên cấp') + '"' + (lk ? ' aria-disabled="true"' : '') + '>' + svg + '<span class="b-gate__lab">' + lab + '</span></button>';
}


/* ---------- Chân bài cho mini game: Bông + lời nhắn · Nghe lại · Gợi ý · điểm ---------- */
function lgfoot(o) {
  o = o || {};
  return '<footer class="lesson-foot b-gfoot"><div><div class="b-gfoot__msg">' + dragon(o.expr || 'chao', 76) + '<p class="body-l" aria-live="polite" data-gmsg>' + (o.msg || '') + '</p></div><div class="grp">' +
    btn({ label: o.replayLabel || 'Nghe lại', variant: 'secondary', size: 'l', icon: 'replay', key: 'Space', attrs: 'data-replay', disabled: o.off }) +
    btn({ label: 'Gợi ý', variant: 'secondary', size: 'l', icon: 'bulb', key: 'H', attrs: 'data-hint', disabled: o.off || o.hintOff }) +
    '<span class="b-gfoot__score" data-gscore>' + icon('star', 30) + '<b>' + (o.score || 0) + '</b><span>/' + (o.total || 0) + ' ' + (o.unit || 'từ') + '</span></span></div></div></footer>';
}
function lgmsg(scr, html, expr) { var m = scr.querySelector('[data-gmsg]'); if (m) m.innerHTML = html; if (expr) { var d = scr.querySelector('.b-gfoot__msg .b-dragon'); if (d) d.outerHTML = dragon(expr, 76); } }

window.Bong.L = { gfoot: lgfoot, gmsg: lgmsg, head: lhead, foot: lfoot, dots: ldots, setProg: lsetProg, exit: lexit, wire: lwire, ok: lok, retry: lretry, say: lsay, overlay: loverlay,
  gameStart: lgameStart, gamePause: lgamePause, gameEnd: lgameEnd, words: lwords, grow: lgrow, monkey: lmonkey, gate: lgate, typing: typing };
window.Bong.LevelGate = lgate; window.Bong.MascotGrowth = lgrow;

/* =====================================================================
   GIAI ĐOẠN 2 · PHẦN B — hình minh hoạ bổ sung (120×120, nét dragon-line)
   Sticker Xe cộ, Khủng long; đồ trong Phòng của tớ. Màu trong hình minh hoạ
   là màu tranh (như PICS cũ); màu giao diện luôn là token.
   ===================================================================== */
var WH = function (x, y, r) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#4a4f63" ' + L + '/><circle cx="' + x + '" cy="' + y + '" r="' + (r * .42) + '" fill="#d7dbe6"/>'; };
/* Xe cộ */
PICS.car = '<path d="M14 78 C14 66 20 62 30 62 L40 44 C42 40 46 38 50 38 L76 38 C80 38 84 40 86 44 L96 62 C104 62 108 66 108 74 L108 82 H14 Z" fill="#3fa9f5" ' + L + '/><path d="M46 46 L40 60 H58 V46 Z M64 46 V60 H88 L82 46 Z" fill="#e8f6ff" ' + L + '/>' + WH(36, 84, 12) + WH(88, 84, 12) + '<path d="M100 70 h6" stroke="#ffd23f" stroke-width="5" stroke-linecap="round"/>';
PICS.bus = '<rect x="10" y="30" width="100" height="56" rx="12" fill="#ffc531" ' + L + '/><path d="M10 64 H110" ' + L + '/><rect x="18" y="38" width="18" height="18" rx="3" fill="#e8f6ff" ' + L + '/><rect x="42" y="38" width="18" height="18" rx="3" fill="#e8f6ff" ' + L + '/><rect x="66" y="38" width="18" height="18" rx="3" fill="#e8f6ff" ' + L + '/><rect x="90" y="38" width="14" height="34" rx="3" fill="#e8f6ff" ' + L + '/>' + WH(32, 88, 11) + WH(86, 88, 11);
PICS.bike = WH(30, 80, 20).replace('#4a4f63', 'none') + WH(90, 80, 20).replace('#4a4f63', 'none') + '<path d="M30 80 L50 52 H82 L90 80 M50 52 L60 80 L82 52 M44 42 H58 M80 44 L84 52 M76 42 H90" fill="none" stroke="#2bb38a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 80 L50 52 H82 L90 80 M50 52 L60 80 L82 52" fill="none" ' + L + ' stroke-width="2"/>';
PICS.train = '<rect x="22" y="26" width="64" height="58" rx="10" fill="#9b5de5" ' + L + '/><rect x="30" y="34" width="22" height="20" rx="4" fill="#e8f6ff" ' + L + '/><rect x="58" y="34" width="20" height="20" rx="4" fill="#e8f6ff" ' + L + '/><path d="M86 52 H104 V84 H86 Z" fill="#ff8a3d" ' + L + '/><rect x="90" y="40" width="10" height="12" rx="2" fill="#4a4f63" ' + L + '/><circle cx="96" cy="30" r="6" fill="#d7dbe6" ' + L + '/>' + WH(36, 90, 10) + WH(66, 90, 10) + WH(96, 90, 8) + '<path d="M10 102 H112" ' + L + '/>';
PICS.plane = '<path d="M14 64 C14 56 22 52 34 52 H92 C104 52 112 58 112 64 C112 70 104 74 92 74 H34 C22 74 14 70 14 64 Z" fill="#f2f6fb" ' + L + '/><path d="M54 52 L72 22 H84 L74 52 Z M54 74 L72 104 H84 L74 74 Z M18 56 L12 38 H22 L32 52 Z" fill="#3fa9f5" ' + L + '/><circle cx="94" cy="62" r="4" fill="#3fa9f5"/><circle cx="82" cy="62" r="4" fill="#3fa9f5"/><circle cx="70" cy="62" r="4" fill="#3fa9f5"/>';
PICS.boat = '<path d="M14 72 H106 L94 96 H28 Z" fill="#ff8a3d" ' + L + '/><path d="M58 70 V18" ' + L + '/><path d="M60 22 L94 64 H60 Z" fill="#fff" ' + L + '/><path d="M56 30 L28 64 H56 Z" fill="#ffd23f" ' + L + '/><path d="M8 104 q12 -8 24 0 t24 0 t24 0 t24 0 t24 0" fill="none" stroke="#3fa9f5" stroke-width="4" stroke-linecap="round"/>';
/* Khủng long */
var DINO_EYE = function (x, y) { return EYE(x, y); };
PICS.trex = '<path d="M30 104 L36 80 C24 70 22 52 34 40 C40 30 52 22 70 22 C92 22 106 34 104 48 C102 58 90 60 78 58 L74 70 C88 74 98 86 98 104 Z" fill="#7dc95e" ' + L + '/><path d="M78 58 L90 60 M76 66 L84 72" ' + L + '/><path d="M70 50 h22" ' + L + '/><path d="M74 50 l3 5 3 -5 3 5 3 -5" fill="#fff" stroke="var(--dragon-line)" stroke-width="2"/>' + DINO_EYE(80, 36) + '<path d="M40 104 h18 M70 104 h20" ' + L + '/><path d="M30 64 C14 70 8 84 10 96 C18 88 26 84 34 82" fill="#7dc95e" ' + L + '/>';
PICS.stegosaurus = '<path d="M30 52 L38 34 L46 50 L56 28 L64 48 L74 30 L80 50 L90 40 L92 58 Z" fill="#ff8a3d" ' + L + '/><path d="M12 84 C22 82 26 72 30 64 C40 50 80 48 92 60 C100 66 106 64 110 60 C114 66 110 76 100 78 L96 96 H84 L82 82 H48 L46 96 H34 L34 82 C26 88 16 90 12 84 Z" fill="#7cc7e8" ' + L + '/>' + DINO_EYE(100, 66) + '<path d="M12 84 L6 78 M14 86 L6 90" ' + L + '/>';
PICS.triceratops = '<path d="M16 88 C20 70 40 58 64 60 L70 44 C76 32 92 30 102 40 C110 48 110 60 104 68 C100 74 92 76 86 74 L84 96 H72 L70 84 H40 L38 96 H26 L26 88 Z" fill="#b48ee8" ' + L + '/><path d="M70 44 C64 26 80 14 96 18 C108 22 114 36 108 48" fill="#ffd9a8" ' + L + '/><path d="M98 50 L118 40 L104 58 Z M84 34 L92 14 L94 34 Z" fill="#fff" ' + L + '/>' + DINO_EYE(92, 52);
PICS.longneck = '<path d="M20 100 L24 80 C16 74 14 64 22 58 C34 50 52 56 60 60 C64 46 66 30 72 20 C76 12 90 10 96 18 C102 24 98 32 90 32 C84 32 82 40 82 56 C88 60 92 70 88 82 L92 100 H80 L76 88 H40 L36 100 Z" fill="#ffc531" ' + L + '/>' + DINO_EYE(90, 22) + '<circle cx="50" cy="72" r="5" fill="#e9a400"/><circle cx="66" cy="76" r="4" fill="#e9a400"/><circle cx="74" cy="64" r="3.5" fill="#e9a400"/>';
PICS.pterodactyl = '<path d="M60 52 C46 40 26 34 6 38 C20 46 28 56 32 66 C42 62 52 62 60 66 C68 62 78 62 88 66 C92 56 100 46 114 38 C94 34 74 40 60 52 Z" fill="#7cc7e8" ' + L + '/><path d="M60 50 C56 40 60 30 70 28 L94 22 L74 36 C70 40 66 46 62 52" fill="#7cc7e8" ' + L + '/><path d="M64 30 L56 16 L70 26" fill="#ff8a3d" ' + L + '/>' + DINO_EYE(70, 34) + '<path d="M54 70 L50 84 M66 70 L70 84" ' + L + '/>';
PICS.dinoegg = '<path d="M60 14 C82 14 98 48 98 72 C98 96 82 108 60 108 C38 108 22 96 22 72 C22 48 38 14 60 14 Z" fill="#fff6e3" ' + L + '/><circle cx="46" cy="50" r="7" fill="#7dc95e"/><circle cx="72" cy="40" r="5" fill="#7dc95e"/><circle cx="76" cy="76" r="8" fill="#7dc95e"/><circle cx="44" cy="84" r="5" fill="#7dc95e"/><path d="M30 62 L42 56 L50 66 L62 56 L72 66 L82 58 L92 64" fill="none" ' + L + '/>';
/* Đồ trong Phòng của tớ (cũng là hình trong Cửa hàng) */
PICS.lamp = '<path d="M40 16 H80 L94 54 H26 Z" fill="#ffd23f" ' + L + '/><path d="M60 54 V96" stroke="#9a6a46" stroke-width="6" stroke-linecap="round"/><path d="M60 54 V96" ' + L + ' stroke-width="1.5"/><path d="M38 104 C38 96 82 96 82 104 Z" fill="#9a6a46" ' + L + '/><path d="M48 60 l-8 14 M72 60 l8 14" stroke="#ffe48c" stroke-width="4" stroke-linecap="round" opacity=".9"/>';
PICS.bookshelf = '<rect x="18" y="8" width="84" height="104" rx="6" fill="#c98b5a" ' + L + '/><path d="M18 42 H102 M18 76 H102" ' + L + '/><rect x="26" y="16" width="10" height="26" fill="#3fa9f5" ' + L + '/><rect x="38" y="20" width="10" height="22" fill="#ff8a3d" ' + L + '/><rect x="50" y="14" width="8" height="28" fill="#2bb38a" ' + L + '/><path d="M64 42 L74 18 L82 22 L72 42 Z" fill="#9b5de5" ' + L + '/><rect x="28" y="54" width="10" height="22" fill="#ffc531" ' + L + '/><rect x="40" y="50" width="10" height="26" fill="#ff8fb1" ' + L + '/><circle cx="80" cy="64" r="10" fill="#7dc95e" ' + L + '/><rect x="58" y="86" width="34" height="18" rx="3" fill="#fff" ' + L + '/><rect x="26" y="84" width="10" height="20" fill="#3fa9f5" ' + L + '/>';
PICS.bed = '<rect x="10" y="40" width="16" height="64" rx="6" fill="#c98b5a" ' + L + '/><rect x="94" y="56" width="16" height="48" rx="6" fill="#c98b5a" ' + L + '/><rect x="18" y="66" width="86" height="26" rx="8" fill="#bfe6ff" ' + L + '/><rect x="26" y="54" width="28" height="16" rx="8" fill="#fff" ' + L + '/><path d="M54 66 C66 60 92 60 104 66 V92 H54 Z" fill="#9b5de5" ' + L + '/><path d="M64 72 h30 M64 82 h30" stroke="#c9a8f5" stroke-width="3" stroke-linecap="round"/>';
PICS.rug = '<ellipse cx="60" cy="64" rx="54" ry="30" fill="#2bb38a" ' + L + '/><ellipse cx="60" cy="64" rx="40" ry="20" fill="#ffc531" ' + L + '/><ellipse cx="60" cy="64" rx="24" ry="11" fill="#ff8fb1" ' + L + '/>';
PICS.plant = '<path d="M36 76 H84 L78 110 H42 Z" fill="#ff8a3d" ' + L + '/><path d="M32 70 H88 V80 H32 Z" fill="#e8742a" ' + L + '/><path d="M60 70 C58 50 58 36 60 20 M60 52 C46 46 36 34 34 22 C48 24 58 34 60 46 M60 44 C72 36 84 32 92 34 C88 46 76 52 62 54 M60 62 C50 60 40 56 34 48" fill="#7dc95e" ' + L + '/>';
PICS.chair = '<rect x="30" y="12" width="60" height="50" rx="10" fill="#3fa9f5" ' + L + '/><rect x="24" y="60" width="72" height="16" rx="6" fill="#2a6fd6" ' + L + '/><path d="M32 76 L28 108 M88 76 L92 108 M40 76 L42 100 M80 76 L78 100" stroke="#9a6a46" stroke-width="6" stroke-linecap="round"/><path d="M42 26 h36 M42 38 h36" stroke="#bfe6ff" stroke-width="4" stroke-linecap="round"/>';
PICS.clock = '<circle cx="60" cy="62" r="42" fill="#fff" ' + L + '/><circle cx="60" cy="62" r="34" fill="#fff6e3" stroke="#ffc531" stroke-width="6"/><path d="M60 62 V38 M60 62 L76 70" ' + L + ' stroke-width="4"/><circle cx="60" cy="62" r="4" fill="var(--dragon-line)"/><path d="M60 30 v6 M60 88 v6 M28 62 h6 M86 62 h6" ' + L + '/><path d="M28 24 L40 16 M92 24 L80 16" ' + L + ' stroke-width="5"/>';
PICS.picture = '<rect x="12" y="20" width="96" height="76" rx="6" fill="#c98b5a" ' + L + '/><rect x="22" y="30" width="76" height="56" fill="#cdeeff" ' + L + '/><path d="M22 86 L48 58 L64 74 L76 62 L98 86 Z" fill="#7dc95e" ' + L + '/><circle cx="80" cy="44" r="8" fill="#ffd23f" ' + L + '/><path d="M60 20 L60 8" ' + L + '/>';
PICS.desk = '<rect x="10" y="50" width="100" height="14" rx="4" fill="#c98b5a" ' + L + '/><path d="M18 64 V108 M102 64 V108" stroke="#9a6a46" stroke-width="7" stroke-linecap="round"/><rect x="66" y="64" width="30" height="30" rx="4" fill="#e3b07c" ' + L + '/><circle cx="81" cy="79" r="3" fill="var(--dragon-line)"/><rect x="24" y="30" width="26" height="20" rx="3" fill="#3fa9f5" ' + L + '/><path d="M70 50 L76 26 L84 28 L80 50 Z" fill="#ffc531" ' + L + '/>';
PICS.toybox = '<rect x="16" y="50" width="88" height="56" rx="8" fill="#ff8fb1" ' + L + '/><path d="M12 42 H108 V56 H12 Z" fill="#ff6f9a" ' + L + '/><circle cx="38" cy="36" r="12" fill="#ffd23f" ' + L + '/><path d="M70 42 L80 18 L92 42 Z" fill="#3fa9f5" ' + L + '/><path d="M44 72 h32 M44 84 h32" stroke="#fff" stroke-width="4" stroke-linecap="round"/>';
PICS.sofa = '<rect x="10" y="44" width="100" height="44" rx="14" fill="#2bb38a" ' + L + '/><rect x="22" y="30" width="76" height="34" rx="12" fill="#3fc79c" ' + L + '/><rect x="6" y="52" width="20" height="40" rx="9" fill="#2bb38a" ' + L + '/><rect x="94" y="52" width="20" height="40" rx="9" fill="#2bb38a" ' + L + '/><path d="M60 64 V88" ' + L + '/><path d="M18 92 v12 M102 92 v12" stroke="#9a6a46" stroke-width="6" stroke-linecap="round"/><circle cx="40" cy="46" r="6" fill="#ffc531" ' + L + '/>';
PICS.globe = '<circle cx="60" cy="48" r="34" fill="#3fa9f5" ' + L + '/><path d="M40 30 C50 34 52 44 44 50 C38 54 40 62 46 66 M70 20 C66 30 74 36 82 34 M76 58 C70 62 72 72 80 74" fill="#7dc95e" ' + L + '/><path d="M24 48 A36 36 0 0 0 96 48" fill="none" stroke="#9a6a46" stroke-width="5"/><path d="M60 84 V96 M40 104 H80" stroke="#9a6a46" stroke-width="7" stroke-linecap="round"/>';
PICS.guitar = '<path d="M82 10 L96 24 L66 54" fill="none" stroke="#9a6a46" stroke-width="8" stroke-linecap="round"/><path d="M60 50 C70 54 74 66 66 74 C76 84 72 104 54 108 C34 112 14 96 18 76 C22 60 38 58 44 62 C46 54 52 48 60 50 Z" fill="#ff8a3d" ' + L + '/><circle cx="48" cy="80" r="8" fill="#4a2f22"/><path d="M38 92 L64 66" stroke="#fff6e3" stroke-width="2.5"/><path d="M88 8 L102 22" ' + L + ' stroke-width="5"/>';
PICS.fishtank = '<rect x="12" y="24" width="96" height="70" rx="10" fill="#bfe9f7" ' + L + '/><path d="M12 40 H108" stroke="#fff" stroke-width="4" opacity=".8"/><path d="M14 82 C40 76 80 76 106 82 V92 H14 Z" fill="#ffd9a8"/><path d="M30 82 C26 70 32 60 28 50 M86 82 C90 72 84 62 88 54" fill="none" stroke="#2bb38a" stroke-width="5" stroke-linecap="round"/><path d="M48 58 C56 50 70 50 76 58 C70 66 56 66 48 58 Z M76 58 L86 52 V64 Z" fill="#ff8a3d" ' + L + '/><circle cx="56" cy="57" r="2.5" fill="var(--dragon-line)"/><rect x="18" y="94" width="84" height="12" rx="4" fill="#c98b5a" ' + L + '/><circle cx="66" cy="38" r="3" fill="#fff"/><circle cx="72" cy="30" r="2" fill="#fff"/>';
var ROOM_WORDS = { lamp: 'cái đèn', bookshelf: 'giá sách', bed: 'cái giường', rug: 'tấm thảm', plant: 'chậu cây', chair: 'cái ghế', clock: 'đồng hồ', picture: 'bức tranh', desk: 'cái bàn', toybox: 'hộp đồ chơi', sofa: 'ghế sô-pha', globe: 'quả địa cầu', guitar: 'đàn ghi-ta', fishtank: 'bể cá' };
var STICKER_WORDS = { car: 'ô tô', bus: 'xe buýt', bike: 'xe đạp', train: 'tàu hoả', plane: 'máy bay', boat: 'thuyền', trex: 'khủng long bạo chúa', stegosaurus: 'khủng long phiến sừng', triceratops: 'khủng long ba sừng', longneck: 'khủng long cổ dài', pterodactyl: 'thằn lằn bay', dinoegg: 'trứng khủng long' };
var STICKER_EN = { trex: 'T-rex', longneck: 'long-neck dinosaur', dinoegg: 'dinosaur egg' };

/* =====================================================================
   GIAI ĐOẠN 2 · PHẦN B — phần thưởng, phòng của Bông, công cụ bài học (Bong.R)
   ===================================================================== */
ICONS.expand = '<path d="M4.5 9V4.5H9M15 4.5h4.5V9M19.5 15v4.5H15M9 19.5H4.5V15"/>';
ICONS.shrink = '<path d="M9 4.5V9H4.5M19.5 9H15V4.5M15 19.5V15h4.5M4.5 15H9v4.5"/>';
ICONS.volume = '<path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" fill="currentColor" stroke-linejoin="round"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>';
ICONS.mute = '<path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" fill="currentColor" stroke-linejoin="round"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>';
ICONS.gift = '<rect x="4" y="9" width="16" height="11" rx="1.5" fill="none"/><path d="M3 9h18M12 9v11M12 9C10 5 6 4.5 6 7s4 2 6 2c2 0 6 .5 6-2s-4-2-6 2"/>';
ICONS.bag = '<path d="M5 8h14l-1 12H6z" fill="none"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>';
ICONS.rotate = '<path d="M19 12a7 7 0 1 1-2.1-5"/><path d="M19.5 4v4h-4"/>';
ICONS.box = '<path d="M4 8l8-4 8 4v9l-8 4-8-4z" fill="none"/><path d="M4 8l8 4 8-4M12 12v9"/>';
ICONS.shirt = '<path d="M8 4l4 2 4-2 4 3-2 4h-2v9H8v-9H6L4 7z" fill="none"/>';
ICONS.print = '<path d="M7 9V4h10v5"/><rect x="4" y="9" width="16" height="7" rx="2" fill="none"/><path d="M7 14h10v6H7z" fill="none"/>';
ICONS.snow = '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5"/>';
ICONS.sunrise = '<path d="M4 18h16M7 18a5 5 0 0 1 10 0M12 5v4M5.5 9.5l2 2M18.5 9.5l-2 2"/>';

/* ---------- Sticker (ô album) ---------- */
function rstickerName(key) { return STICKER_EN[key] || key; }
function rstickerVi(key) { return STICKER_WORDS[key] || (WORDS[key] || {}).vi || ROOM_WORDS[key] || key; }
function rsticker(key, o) {
  o = o || {}; var own = o.owned !== false, s = o.size || 96, en = rstickerName(key);
  var art = pic(key, s).replace(/role="img"[^>]*?aria-label="[^"]*"/, 'aria-hidden="true"');
  return '<button type="button" class="b-stk ' + (own ? 'is-owned' : 'is-empty') + (o.isNew ? ' is-new' : '') + '" data-stk="' + key + '"' + (o.tilt ? ' style="--tilt:' + o.tilt + 'deg"' : '') +
    ' aria-label="' + (own ? 'Sticker ' + esc(en) + ', ' + rstickerVi(key) + (o.isNew ? ', mới' : '') : 'Sticker chưa có') + '">' + '<span class="b-stk__art">' + art + '</span>' + (o.isNew ? '<span class="b-stk__new">Mới</span>' : '') + '</button>';
}
/* ---------- Huy hiệu ---------- */
function rmedal(b, o) {
  o = o || {}; var on = !!b.earned, sz = o.size || 120;
  var rib = '<svg class="b-medal__rib" viewBox="0 0 120 60" aria-hidden="true"><path d="M34 0 L18 52 L32 46 L40 58 L56 6 Z" fill="' + (on ? 'var(--badge-ribbon-a)' : 'var(--badge-locked)') + '" stroke="var(--dragon-line)" stroke-width="3" stroke-linejoin="round"/><path d="M86 0 L102 52 L88 46 L80 58 L64 6 Z" fill="' + (on ? 'var(--badge-ribbon-b)' : 'var(--badge-locked)') + '" stroke="var(--dragon-line)" stroke-width="3" stroke-linejoin="round"/></svg>';
  return '<span class="b-medal ' + (on ? 'is-earned' : 'is-locked') + '" style="--sz:' + sz + 'px;--c:var(--level-' + (b.lv || 1) + ');--c-soft:var(--level-' + (b.lv || 1) + '-soft)" aria-hidden="true">' + rib + '<span class="b-medal__ring"><span class="b-medal__core">' + icon(b.icon, Math.round(sz * .34)) + '</span></span></span>';
}
/* ---------- Hộp quà ---------- */
function rgift(open, size) {
  var s = size || 160, ln = 'stroke="var(--dragon-line)" stroke-width="3.5" stroke-linejoin="round"';
  var lid = '<g class="b-gift__lid"' + (open ? ' transform="translate(-6 -46) rotate(-18 60 44)"' : '') + '><rect x="14" y="34" width="92" height="22" rx="5" fill="var(--gift-box)" ' + ln + '/><rect x="52" y="34" width="16" height="22" fill="var(--gift-ribbon)" ' + ln + '/><path d="M60 34 C46 14 30 18 34 28 C38 36 52 34 60 34 C68 34 82 36 86 28 C90 18 74 14 60 34 Z" fill="var(--gift-ribbon)" ' + ln + '/></g>';
  return '<svg class="b-gift' + (open ? ' is-open' : '') + '" width="' + s + '" height="' + s + '" viewBox="0 -20 120 140" aria-hidden="true" style="overflow:visible">' +
    (open ? '<g class="b-gift__rays" fill="var(--gift-glow)"><path d="M60 50 L30 -20 L50 -20 Z"/><path d="M60 50 L90 -20 L70 -20 Z"/><path d="M60 50 L-6 6 L2 -8 Z"/><path d="M60 50 L126 6 L118 -8 Z"/></g>' : '') +
    '<rect x="20" y="54" width="80" height="58" rx="6" fill="var(--gift-box)" ' + ln + '/><rect x="20" y="54" width="80" height="12" fill="var(--gift-box-shade)" ' + ln + '/><rect x="52" y="54" width="16" height="58" fill="var(--gift-ribbon)" ' + ln + '/>' + lid + '</svg>';
}
/* ---------- Hộp thoại nhận phần thưởng mới (RewardPopup) ---------- */
function rreward(scr, o) {
  var isB = o.kind === 'badge', coins = o.coins != null ? o.coins : (isB ? 50 : 10);
  function reveal() {
    var art = isB ? rmedal({ icon: o.icon || 'flame', lv: o.lv || 3, earned: true }, { size: 150 }) : '<span class="b-rw__stk">' + rsticker(o.key, { size: 120 }).replace('<button type="button"', '<span').replace('</button>', '</span>') + '</span>';
    var en = isB ? o.en : rstickerName(o.key);
    var ov = loverlay(scr, { title: isB ? 'Huy hiệu mới!' : 'Sticker mới!', mascot: '<div class="b-ov2__how b-rw__top"><span class="b-rw__glow" aria-hidden="true"></span>' + art + dragon('chucmung', 110) + '</div>',
      body: '<div class="b-rw__name"><b lang="en">' + esc(en) + '</b>' + speak(en, 's', 'Nghe: ' + en) + '</div><p class="body b-muted" style="margin:4px 0 0">' + esc(o.vi || rstickerVi(o.key)) + (isB && o.cond ? ' · ' + esc(o.cond) : '') + '</p><span class="b-rw__coin">' + icon('coin', 26) + '<b>+' + coins + '</b> xu thưởng</span>',
      actions: [{ label: 'Cho vào bộ sưu tập', variant: 'primary', key: 'Enter', icon: 'gem', onClick: o.onAdd }], onEsc: o.onAdd });
    ov.el.classList.add('b-rw', 'is-revealed'); lsay(en, .85);
    setTimeout(function () { burst(scr.querySelector('.b-burst-layer') || scr, ov.el.querySelector('.b-rw__top'), null, 14); }, 120);
    return ov;
  }
  if (o.skipGift) return reveal();
  var first = loverlay(scr, { title: isB ? 'Cậu nhận được một huy hiệu!' : 'Cậu nhận được một món quà!', mascot: '<div class="b-ov2__how b-rw__top"><button type="button" class="b-rw__giftbtn" data-gift aria-label="Mở hộp quà">' + rgift(false, 150) + '</button></div>',
    body: 'Bấm vào hộp quà hoặc nhấn Enter để mở.', actions: [{ label: 'Mở quà', variant: 'primary', key: 'Enter', icon: 'gift', onClick: function () { setTimeout(reveal, 210); } }], onEsc: function () { setTimeout(reveal, 210); } });
  first.el.classList.add('b-rw');
  first.el.querySelector('[data-gift]').addEventListener('click', function () { first.el.querySelector('.b-btn--primary').click(); });
  return first;
}
/* ---------- Công cụ bài học: học tập trung (toàn màn hình) + âm thanh (LessonTools) ---------- */
var RSOUND = { music: true, sfx: true, vol: 70 };
function rtools(o) {
  o = o || {};
  return '<div class="b-tools" role="group" aria-label="Công cụ bài học">' +
    '<button type="button" class="b-iconbtn b-tools__btn" data-focusmode aria-pressed="' + !!o.focus + '" aria-keyshortcuts="F" aria-label="' + (o.focus ? 'Thoát học tập trung (Esc)' : 'Học tập trung, toàn màn hình (F)') + '" title="' + (o.focus ? 'Thoát học tập trung (Esc)' : 'Học tập trung (F)') + '">' + icon(o.focus ? 'shrink' : 'expand', 24) + '</button>' +
    '<button type="button" class="b-iconbtn b-tools__btn" data-soundbtn aria-haspopup="dialog" aria-expanded="false" aria-label="Âm thanh" title="Âm thanh">' + icon(RSOUND.music || RSOUND.sfx ? 'volume' : 'mute', 24) + '</button></div>';
}
function rsoundPanel() {
  function sw(id, label, sub, on) { return '<div class="b-snd__row"><span><b id="' + id + '-l">' + label + '</b><small>' + sub + '</small></span><button type="button" role="switch" class="b-switch" id="' + id + '" aria-checked="' + on + '" aria-labelledby="' + id + '-l"><i></i></button></div>'; }
  return '<div class="b-snd" role="dialog" aria-label="Âm thanh" data-sndpanel><h2 class="label" style="margin:0">Âm thanh</h2>' +
    sw('snd-music', 'Nhạc nền', 'Nhạc nhẹ khi học', RSOUND.music) + sw('snd-sfx', 'Hiệu ứng', 'Tiếng đúng, sai, sao bay', RSOUND.sfx) +
    '<div class="b-snd__vol"><label class="b-snd__vl" for="snd-vol"><b>Âm lượng</b><output for="snd-vol" data-volout>' + RSOUND.vol + '%</output></label><input type="range" class="b-range" id="snd-vol" min="0" max="100" step="10" value="' + RSOUND.vol + '" style="--v:' + RSOUND.vol + '%"></div>' +
    '<p class="caption b-muted" style="margin:0">Giọng đọc tiếng Anh luôn bật để cậu nghe từ.</p></div>';
}
function rwireTools(scr, ctx, h) {
  h = h || {};
  var fb = scr.querySelector('[data-focusmode]'), sb = scr.querySelector('[data-soundbtn]');
  function setFocus(on) {
    scr.classList.toggle('is-focusmode', on); fb.setAttribute('aria-pressed', on); fb.setAttribute('aria-label', on ? 'Thoát học tập trung (Esc)' : 'Học tập trung, toàn màn hình (F)'); fb.title = on ? 'Thoát học tập trung (Esc)' : 'Học tập trung (F)'; fb.innerHTML = icon(on ? 'shrink' : 'expand', 24);
    try { if (on && h.realFullscreen && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen(); else if (!on && document.fullscreenElement) document.exitFullscreen(); } catch (e) {}
    h.onFocus && h.onFocus(on);
  }
  function closePanel(back) { var p = scr.querySelector('[data-sndpanel]'); if (!p) return false; p.remove(); sb.setAttribute('aria-expanded', 'false'); if (back) sb.focus({ preventScroll: true }); return true; }
  function openPanel() {
    if (closePanel()) return; var wrap = document.createElement('div'); wrap.innerHTML = rsoundPanel(); var p = wrap.firstChild; sb.parentNode.appendChild(p); sb.setAttribute('aria-expanded', 'true');
    p.querySelectorAll('.b-switch').forEach(function (s) { s.addEventListener('click', function () { var on = s.getAttribute('aria-checked') !== 'true'; s.setAttribute('aria-checked', on); RSOUND[s.id === 'snd-music' ? 'music' : 'sfx'] = on; sb.innerHTML = icon(RSOUND.music || RSOUND.sfx ? 'volume' : 'mute', 24); }); });
    var r = p.querySelector('#snd-vol'), out = p.querySelector('[data-volout]'); r.addEventListener('input', function () { RSOUND.vol = +r.value; out.textContent = r.value + '%'; r.style.setProperty('--v', r.value + '%'); });
    p.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closePanel(true); } if (e.key === ' ' || e.key === 'Enter') e.stopPropagation(); });
    p.addEventListener('focusout', function () { setTimeout(function () { if (!p.contains(document.activeElement) && document.activeElement !== sb) closePanel(); }, 0); });
    p.querySelector('.b-switch').focus({ preventScroll: true });
  }
  fb.addEventListener('click', function () { setFocus(!scr.classList.contains('is-focusmode')); });
  sb.addEventListener('click', openPanel);
  return { setFocus: setFocus, isFocus: function () { return scr.classList.contains('is-focusmode'); }, closePanel: closePanel, openPanel: openPanel };
}

window.Bong.R = { sticker: rsticker, stickerName: rstickerName, stickerVi: rstickerVi, medal: rmedal, gift: rgift, reward: rreward, tools: rtools, wireTools: rwireTools, soundPanel: rsoundPanel, sound: RSOUND, roomWords: ROOM_WORDS, stickerWords: STICKER_WORDS };
window.Bong.RewardPopup = rreward; window.Bong.LessonTools = rtools;

/* =====================================================================
   KHU NGƯỜI LỚN · GIAI ĐOẠN 2 — mục menu mới (không đổi menu cũ), dùng chung
   Bong.A.shell2(o): như Bong.A.shell nhưng thêm các mục GĐ2:
   bố mẹ: “Tiến độ & mở khoá”; quản trị: “Truyện tranh”, “Âm phonics”, “Phần thưởng”.
   ===================================================================== */
AI.unlock = '<rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="none"/><path d="M8 10.5V8a4 4 0 0 1 7.6-1.8"/><circle cx="12" cy="15.5" r="1.4" fill="currentColor"/>';
ICONS.unlock = AI.unlock;
var ANAV2 = { parent: [['progress', 'unlock', 'Tiến độ & mở khoá', 'after:overview']], admin: [['stories', 'book', 'Truyện tranh', 'end'], ['phonics', 'music', 'Âm phonics', 'end'], ['rewards', 'gem', 'Phần thưởng', 'end']] };
function ashell2(o) {
  var area = o.area || 'parent', extra = ANAV2[area] || [], mine = extra.filter(function (n) { return n[0] === o.active; })[0];
  var h = ashell(Object.assign({}, o, { active: mine ? '__none' : o.active }));
  function item(n) { var on = n[0] === o.active; return '<a href="#" class="a-nav__item' + (on ? ' is-on' : '') + '"' + (on ? ' aria-current="page"' : '') + ' data-gd2>' + icon(n[1], 20) + '<span>' + n[2] + '</span><span class="a-nav__new">Mới</span></a>'; }
  extra.forEach(function (n) {
    if (n[3] === 'end') h = h.replace('</nav>', item(n) + '</nav>');
    else { var key = n[3].split(':')[1], label = ANAV[area].filter(function (x) { return x[0] === key; })[0][2], i = h.indexOf('<span>' + label + '</span>'); var j = h.indexOf('</a>', i) + 4; h = h.slice(0, j) + item(n) + h.slice(j); }
  });
  return h;
}
window.Bong.A.shell2 = ashell2;

/* =====================================================================
   ĐỢT 6 · TIỂU HỌC — Khám phá từ, Họ vần, Ghép chữ đầu (dữ liệu + hình)
   Hình mới cùng nét viền dragon-line, khung 120×120. Không đổi hình cũ.
   ===================================================================== */
var BLOB = 'M60 14 C82 12 104 30 102 56 C110 70 104 98 80 102 C66 112 40 108 30 96 C10 88 12 62 22 50 C20 30 40 14 60 14Z';
function swatch(c, dx, dy) { return '<path d="' + BLOB + '" fill="' + c + '" ' + L + '/><circle cx="' + dx + '" cy="' + dy + '" r="7" fill="' + c + '" ' + L + '/><path d="M40 40 C44 34 50 32 56 32" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>'; }
function wrapPic(name, tf) { return '<g transform="' + tf + '">' + (PICS[name] || '') + '</g>'; }
PICS.brown = swatch('#9a6232', 104, 98);
PICS.white = swatch('#ffffff', 18, 100);
PICS.black = swatch('#3a3442', 100, 22);
PICS.ginger = swatch('#ffad5a', 18, 100);
PICS.stripes = '<path d="' + BLOB + '" fill="#fff" ' + L + '/><path d="M34 26 C44 46 40 70 26 90 M52 16 C62 40 62 74 46 104 M72 16 C80 44 82 74 70 104 M92 30 C98 50 100 70 92 92" fill="none" stroke="var(--dragon-line)" stroke-width="8" stroke-linecap="round"/><path d="' + BLOB + '" fill="none" ' + L + '/>';
PICS.seeds = '<ellipse cx="60" cy="96" rx="44" ry="10" fill="#f0d9a8" ' + L + '/>' + [[40, 78, -30], [58, 72, 10], [76, 80, 35], [48, 90, 60], [70, 92, -20], [60, 56, -10], [86, 64, 50], [32, 62, 20]].map(function (s) { return '<ellipse cx="' + s[0] + '" cy="' + s[1] + '" rx="7" ry="11" transform="rotate(' + s[2] + ' ' + s[0] + ' ' + s[1] + ')" fill="#d9a35b" ' + L + '/>'; }).join('');
PICS.berries = '<path d="M60 18 C60 30 56 40 48 48 M60 18 C66 30 74 38 80 44" fill="none" ' + L + '/><path d="M60 22 C70 10 88 12 92 22 C80 28 68 28 60 22Z" fill="#7cc35a" ' + L + '/>' + [[42, 64], [66, 60], [54, 84], [80, 80], [36, 90], [66, 104]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="14" fill="#5b4bd6" ' + L + '/><circle cx="' + (p[0] - 4) + '" cy="' + (p[1] - 5) + '" r="3.5" fill="#fff" opacity=".7"/>'; }).join('');
PICS.insects = [[30, 74], [48, 68], [66, 70], [84, 76]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="13" fill="#8bd34f" ' + L + '/>'; }).join('') + '<circle cx="100" cy="64" r="15" fill="#a6e070" ' + L + '/>' + EYE(96, 60) + EYE(106, 60) + '<path d="M96 50 l-6 -14 M106 50 l6 -14" ' + L + '/><circle cx="90" cy="35" r="3" fill="var(--dragon-line)"/><circle cx="112" cy="35" r="3" fill="var(--dragon-line)"/><path d="M26 88 v8 M46 82 v10 M64 84 v10 M82 90 v8" ' + L + '/>';
PICS.wings = '<path d="M58 60 C40 30 14 30 8 42 C20 46 18 54 10 58 C22 64 20 72 14 76 C30 84 50 76 58 60Z" fill="#8ecbff" ' + L + '/><path d="M62 60 C80 30 106 30 112 42 C100 46 102 54 110 58 C98 64 100 72 106 76 C90 84 70 76 62 60Z" fill="#8ecbff" ' + L + '/><ellipse cx="60" cy="64" rx="7" ry="14" fill="#ffd23f" ' + L + '/>';
PICS.feathers = '<path d="M30 104 C40 80 54 52 92 18 C100 40 92 70 58 88 Z" fill="#ffd23f" ' + L + '/><path d="M30 104 C48 76 66 54 90 24" fill="none" ' + L + '/><path d="M54 76 l-10 -8 M64 64 l-10 -10 M74 52 l-10 -10 M60 80 l10 2 M70 68 l12 0 M80 56 l10 -2" stroke="#e6b400" stroke-width="3" stroke-linecap="round"/>';
PICS.beak = '<circle cx="50" cy="60" r="34" fill="#ffd23f" ' + L + '/>' + EYE(52, 50) + '<path d="M80 52 L114 62 L80 74 Z" fill="#ff9f1c" ' + L + '/><path d="M80 63 H104" ' + L + '/><path d="M28 34 C34 24 46 22 52 28" fill="none" ' + L + '/>';
PICS.claws = '<path d="M60 14 V58" stroke="#ff9f1c" stroke-width="10" stroke-linecap="round"/><path d="M60 14 V58" fill="none" ' + L + ' stroke-width="0"/><path d="M60 58 L28 88 M60 58 L60 96 M60 58 L92 88 M60 58 L54 30" stroke="#ff9f1c" stroke-width="10" stroke-linecap="round"/>' +
  '<path d="M28 88 l-8 10 M60 96 l0 12 M92 88 l8 10" stroke="var(--dragon-line)" stroke-width="5" stroke-linecap="round"/><path d="M14 104 H106" stroke="#b07a43" stroke-width="8" stroke-linecap="round"/>';
PICS.flysky = '<rect x="6" y="10" width="108" height="100" rx="18" fill="#cfeeff" ' + L + '/><path d="M18 88 C22 78 36 78 40 86 C46 80 58 82 58 90 H18 Z M70 40 C74 32 86 32 88 40 C94 36 102 40 100 46 H70 Z" fill="#fff" ' + L + '/>' +
  '<ellipse cx="62" cy="64" rx="18" ry="12" fill="#ffd23f" ' + L + '/><path d="M60 60 C52 42 38 40 34 46 C44 50 48 56 52 62 Z" fill="#ffe680" ' + L + '/><path d="M80 62 L92 58 L82 68 Z" fill="#ff9f1c" ' + L + '/><circle cx="72" cy="60" r="2.6" fill="var(--dragon-line)"/>';
PICS.nest = '<path d="M14 66 C18 98 40 108 60 108 C80 108 102 98 106 66 Z" fill="#b07a43" ' + L + '/><path d="M18 74 C40 82 80 82 102 74 M22 86 C44 92 76 92 98 86 M30 98 C50 102 70 102 90 98" fill="none" stroke="#7d5124" stroke-width="3" stroke-linecap="round"/>' +
  '<ellipse cx="44" cy="62" rx="12" ry="15" fill="#bfe6ff" ' + L + '/><ellipse cx="62" cy="58" rx="12" ry="15" fill="#bfe6ff" ' + L + '/><ellipse cx="80" cy="62" rx="12" ry="15" fill="#bfe6ff" ' + L + '/><path d="M12 66 H108" ' + L + '/>';
PICS.tree = '<path d="M52 112 V74 C52 66 46 60 40 58 M68 112 V74 C68 66 76 62 82 60" fill="#b07a43" stroke="var(--dragon-line)" stroke-width="3"/><rect x="50" y="64" width="20" height="48" rx="6" fill="#b07a43" ' + L + '/>' +
  '<path d="M60 8 C80 8 94 20 94 34 C108 38 112 58 98 68 C96 82 78 86 66 78 C56 88 30 86 26 70 C10 64 12 40 28 36 C28 18 44 8 60 8Z" fill="#7cc35a" ' + L + '/><path d="M70 52 C70 62 94 62 94 52 Z" fill="#b07a43" ' + L + '/>';
PICS.wheel = '<circle cx="60" cy="60" r="44" fill="#4a4458" ' + L + '/><circle cx="60" cy="60" r="22" fill="#d9d4e6" ' + L + '/><circle cx="60" cy="60" r="6" fill="#4a4458"/><path d="M60 38 V82 M38 60 H82" stroke="#4a4458" stroke-width="4"/>';
PICS.milk = '<path d="M34 28 H86 L80 106 C80 110 76 112 72 112 H48 C44 112 40 110 40 106 Z" fill="#e8f6ff" ' + L + '/><path d="M37 48 C50 42 66 54 83 46 L80 106 C80 110 76 112 72 112 H48 C44 112 40 110 40 106 Z" fill="#ffffff" ' + L + '/><path d="M48 58 V96" stroke="#d6eefc" stroke-width="5" stroke-linecap="round"/>';
PICS.bat = '<path d="M60 52 C46 36 22 30 6 40 C14 46 14 54 10 62 C20 60 24 66 22 74 C32 70 40 72 44 78 C50 70 56 66 60 66Z" fill="#7a6b9a" ' + L + '/><path d="M60 52 C74 36 98 30 114 40 C106 46 106 54 110 62 C100 60 96 66 98 74 C88 70 80 72 76 78 C70 70 64 66 60 66Z" fill="#7a6b9a" ' + L + '/>' +
  '<ellipse cx="60" cy="62" rx="16" ry="20" fill="#9a8cbd" ' + L + '/><path d="M48 46 L46 30 L56 42 M72 46 L74 30 L64 42" fill="#9a8cbd" ' + L + '/>' + EYE(54, 58) + EYE(66, 58) + '<path d="M56 70 l2 4 l2 -4 l2 4 l2 -4" fill="none" stroke="var(--dragon-line)" stroke-width="2"/>';
PICS.hat = '<ellipse cx="60" cy="88" rx="52" ry="14" fill="#3d4f8a" ' + L + '/><path d="M28 86 C28 50 36 30 60 30 C84 30 92 50 92 86 Z" fill="#4c63ad" ' + L + '/><path d="M30 72 C48 78 72 78 90 72 L91 82 C72 88 48 88 29 82 Z" fill="#ffd23f" ' + L + '/>';
PICS.mat = '<rect x="12" y="44" width="96" height="48" rx="8" fill="#ffb84d" ' + L + '/><path d="M12 58 H108 M12 78 H108" stroke="#2bb38a" stroke-width="7"/><path d="M12 44 h96 v48 h-96 z" fill="none" ' + L + '/><path d="M20 92 v10 M32 92 v10 M44 92 v10 M56 92 v10 M68 92 v10 M80 92 v10 M92 92 v10 M100 92 v10 M20 44 v-10 M32 44 v-10 M44 44 v-10 M56 44 v-10 M68 44 v-10 M80 44 v-10 M92 44 v-10 M100 44 v-10" stroke="var(--dragon-line)" stroke-width="2.4" stroke-linecap="round"/>';
PICS.fat = wrapPic('cat', 'translate(60 64) scale(1.22 1.02) translate(-60 -64)');
PICS.flat = '<path d="M8 100 H112" stroke="var(--dragon-line)" stroke-width="3" stroke-linecap="round"/>' + wrapPic('ball', 'translate(60 100) scale(1.3 .42) translate(-60 -104)') + '<path d="M14 66 l10 10 M106 66 l-10 10 M60 48 v12" stroke="#b9c4d6" stroke-width="4" stroke-linecap="round"/>';
PICS.chat = '<path d="M10 24 H70 C76 24 80 28 80 34 V60 C80 66 76 70 70 70 H34 L20 84 V70 H20 C14 70 10 66 10 60 Z" fill="#8ecbff" ' + L + '/><path d="M46 52 H100 C106 52 110 56 110 62 V86 C110 92 106 96 100 96 H96 V108 L84 96 H56 C50 96 46 92 46 86 Z" fill="#ffe680" ' + L + '/>' +
  '<circle cx="32" cy="46" r="4" fill="var(--dragon-line)"/><circle cx="46" cy="46" r="4" fill="var(--dragon-line)"/><circle cx="60" cy="46" r="4" fill="var(--dragon-line)"/><circle cx="66" cy="74" r="4" fill="var(--dragon-line)"/><circle cx="80" cy="74" r="4" fill="var(--dragon-line)"/><circle cx="94" cy="74" r="4" fill="var(--dragon-line)"/>';
PICS.that = '<path d="M10 78 C10 66 18 62 26 62 H52 C58 62 58 70 52 70 H40 H70 C76 70 76 78 70 78 H44 C50 78 50 86 44 86 H30 C18 86 10 86 10 78Z" fill="#ffd9b8" ' + L + '/>' +
  '<path d="M78 74 h14" stroke="#b9c4d6" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 8"/>' + wrapPic('kite', 'translate(76 14) scale(.36)');
PICS.rat = '<path d="M20 92 C8 92 6 80 14 76" fill="none" stroke="#ff8fa8" stroke-width="4" stroke-linecap="round"/><ellipse cx="54" cy="82" rx="36" ry="22" fill="#a39cb5" ' + L + '/><path d="M80 72 C88 58 104 62 108 76 C104 86 92 90 84 88 Z" fill="#a39cb5" ' + L + '/>' +
  '<circle cx="84" cy="62" r="11" fill="#c8c1d8" ' + L + '/><circle cx="84" cy="62" r="5" fill="#ffc2cf"/>' + EYE(96, 72) + '<circle cx="109" cy="77" r="3.5" fill="#ff8fa8" ' + L + '/><path d="M40 102 v6 M64 102 v6" ' + L + '/>';
PICS.sat = '<rect x="10" y="86" width="100" height="22" rx="6" fill="#ffb84d" ' + L + '/><path d="M10 97 H110" stroke="#2bb38a" stroke-width="6"/><rect x="10" y="86" width="100" height="22" rx="6" fill="none" ' + L + '/>' + wrapPic('cat', 'translate(24 10) scale(.66)');
PICS.girl = '<path d="M28 116 C28 90 42 80 60 80 C78 80 92 90 92 116 Z" fill="#ff8fb1" ' + L + '/><path d="M30 44 C20 52 20 74 30 82 C34 70 34 56 30 44Z M90 44 C100 52 100 74 90 82 C86 70 86 56 90 44Z" fill="#4a2f22" ' + L + '/>' +
  '<ellipse cx="60" cy="50" rx="26" ry="28" fill="#ffd9b8" ' + L + '/><path d="M34 46 C34 24 50 18 62 20 C80 22 90 32 86 48 C78 36 66 32 54 34 C46 36 40 40 34 46Z" fill="#4a2f22"/>' + EYE(50, 54) + EYE(70, 54) + '<path d="M54 66 q6 5 12 0" fill="none" ' + L + '/><circle cx="88" cy="30" r="7" fill="#ffd23f" ' + L + '/>';
PICS.shirt = '<path d="M40 16 L20 26 L6 50 L24 60 L30 50 V108 H90 V50 L96 60 L114 50 L100 26 L80 16 C76 26 68 30 60 30 C52 30 44 26 40 16Z" fill="#3f8cff" ' + L + '/><path d="M40 16 L52 34 L60 30 L68 34 L80 16" fill="#fff" ' + L + '/><path d="M60 34 V106" stroke="#2a6fd6" stroke-width="3"/><circle cx="66" cy="48" r="3.5" fill="#fff"/><circle cx="66" cy="66" r="3.5" fill="#fff"/><circle cx="66" cy="84" r="3.5" fill="#fff"/>';
PICS.skirt = '<rect x="34" y="18" width="52" height="16" rx="4" fill="#9b5de5" ' + L + '/><path d="M36 34 H84 L106 104 C80 112 40 112 14 104 Z" fill="#c4a0f7" ' + L + '/><path d="M48 36 L38 106 M60 36 V110 M72 36 L82 106" stroke="#9b5de5" stroke-width="3" stroke-linecap="round"/>';
function medalPic(c, cs, n) { return '<path d="M42 8 L34 50 L50 46 Z M78 8 L86 50 L70 46 Z" fill="#3f8cff" ' + L + '/><circle cx="60" cy="74" r="36" fill="' + c + '" ' + L + '/><circle cx="60" cy="74" r="26" fill="' + cs + '" ' + L + '/><text x="60" y="88" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="38" fill="var(--dragon-line)">' + n + '</text>'; }
PICS.first = medalPic('#ffd23f', '#ffe680', '1');
PICS.third = medalPic('#d99559', '#eab27f', '3');
PICS.dirt = '<path d="M8 100 C14 74 34 62 56 66 C70 54 96 58 104 76 C114 82 114 96 108 100 Z" fill="#8a5a35" ' + L + '/><circle cx="40" cy="84" r="4" fill="#6b4226"/><circle cx="70" cy="76" r="5" fill="#6b4226"/><circle cx="88" cy="90" r="3.5" fill="#6b4226"/><path d="M8 100 H112" ' + L + '/>';
PICS.button = '<circle cx="60" cy="60" r="44" fill="#ffb84d" ' + L + '/><circle cx="60" cy="60" r="32" fill="none" stroke="#e98a35" stroke-width="4"/><circle cx="50" cy="50" r="6" fill="var(--dragon-line)"/><circle cx="70" cy="50" r="6" fill="var(--dragon-line)"/><circle cx="50" cy="70" r="6" fill="var(--dragon-line)"/><circle cx="70" cy="70" r="6" fill="var(--dragon-line)"/>';
PICS.collar = wrapPic('shirt', 'translate(60 26) scale(1.8) translate(-60 -16)');
PICS.paw = '<ellipse cx="60" cy="78" rx="26" ry="22" fill="#ffad5a" ' + L + '/>' + [[30, 50], [48, 36], [72, 36], [90, 50]].map(function (p) { return '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="11" ry="13" fill="#ffad5a" ' + L + '/>'; }).join('') + '<ellipse cx="60" cy="80" rx="13" ry="10" fill="#ffd2c2"/>';
PICS.tail = '<path d="M22 100 C60 104 96 92 92 62 C88 36 58 40 66 58 C72 72 92 62 98 30" fill="none" stroke="var(--dragon-line)" stroke-width="20" stroke-linecap="round"/><path d="M22 100 C60 104 96 92 92 62 C88 36 58 40 66 58 C72 72 92 62 98 30" fill="none" stroke="#ffad5a" stroke-width="13" stroke-linecap="round"/>';
PICS.whiskers = wrapPic('cat', 'translate(60 66) scale(1.15) translate(-60 -66)') + '<path d="M18 74 h-14 M20 82 l-14 6 M102 74 h14 M100 82 l14 6" stroke="#3f8cff" stroke-width="3.5" stroke-linecap="round"/>';
PICS.run = '<path d="M6 54 h18 M2 66 h22 M8 78 h16" stroke="#b9c4d6" stroke-width="5" stroke-linecap="round"/>' + wrapPic('cat', 'translate(24 8) scale(.8)');
PICS.jump = '<path d="M14 104 C30 40 90 40 106 104" fill="none" stroke="#b9c4d6" stroke-width="4" stroke-dasharray="3 8" stroke-linecap="round"/>' + wrapPic('cat', 'translate(30 4) scale(.5)') + '<path d="M8 108 H112" ' + L + '/>';
PICS.climb = wrapPic('tree', 'translate(0 0)') + wrapPic('cat', 'translate(16 54) scale(.36)');
PICS.school = '<path d="M14 54 L60 22 L106 54 Z" fill="#ffad5a" ' + L + '/><rect x="22" y="54" width="76" height="52" fill="#fff3d6" ' + L + '/><rect x="50" y="78" width="20" height="28" fill="#3f8cff" ' + L + '/><rect x="30" y="64" width="14" height="12" fill="#bfe6ff" ' + L + '/><rect x="76" y="64" width="14" height="12" fill="#bfe6ff" ' + L + '/><circle cx="60" cy="44" r="6" fill="#fff" ' + L + '/>';
PICS.everyday = '<rect x="14" y="22" width="92" height="84" rx="10" fill="#fff" ' + L + '/><path d="M14 44 H106" ' + L + '/><rect x="14" y="22" width="92" height="22" rx="10" fill="#3f8cff" ' + L + '/><path d="M36 14 v16 M84 14 v16" ' + L + '/>' +
  [0, 1, 2, 3, 4].map(function (i) { return '<path d="M' + (24 + i * 16) + ' 66 l4 5 l7 -9" fill="none" stroke="#22873f" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'; }).join('') + [0, 1, 2, 3, 4].map(function (i) { return '<path d="M' + (24 + i * 16) + ' 88 l4 5 l7 -9" fill="none" stroke="#22873f" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'; }).join('');

/* ---------- Dữ liệu Khám phá từ ---------- */
/* Mỗi nhánh: câu hỏi (Anh/Việt), đáp án [hình, chữ Anh, nghĩa], hình đoán (2–3) + đáp án đúng, câu ghép vào đoạn văn */
var WX = {
  bird: { word: 'bird', ipa: '/bɜːd/', vi: 'con chim', ex: 'A bird can fly.', exVi: 'Con chim biết bay.', fam: 'ir', topic: 'Con vật', lv: 2, branches: [
    { q: 'What’s this?', qvi: 'Đây là gì?', ans: [['bird', 'a bird', 'một con chim']], opts: ['cat', 'bird', 'fish'], a: 1, sent: ['This is a bird.', 'Đây là một con chim.'] },
    { q: 'What color is a bird?', qvi: 'Chim có màu gì?', ans: [['brown', 'brown', 'màu nâu'], ['yellow', 'yellow', 'màu vàng'], ['blue', 'blue', 'màu xanh dương']], opts: ['brown', 'stripes'], a: 0, sent: ['It is brown, yellow or blue.', 'Chim có màu nâu, vàng hoặc xanh dương.'] },
    { q: 'What does a bird like to eat?', qvi: 'Chim thích ăn gì?', ans: [['seeds', 'seeds', 'hạt'], ['insects', 'insects', 'sâu bọ'], ['berries', 'berries', 'quả mọng']], opts: ['book', 'seeds', 'ball'], a: 1, sent: ['It likes to eat seeds, insects and berries.', 'Chim thích ăn hạt, sâu bọ và quả mọng.'] },
    { q: 'What does a bird have?', qvi: 'Chim có những gì?', ans: [['wings', 'wings', 'đôi cánh'], ['feathers', 'feathers', 'lông vũ'], ['beak', 'a beak', 'cái mỏ'], ['claws', 'claws', 'móng vuốt']], opts: ['wheel', 'wings'], a: 1, sent: ['It has wings, feathers, a beak and claws.', 'Chim có cánh, lông vũ, mỏ và móng vuốt.'] },
    { q: 'What can a bird do?', qvi: 'Chim làm được gì?', ans: [['flysky', 'fly in the sky', 'bay trên trời'], ['nest', 'build a nest', 'làm tổ']], opts: ['flysky', 'girlbook', 'run'], a: 0, sent: ['It can fly in the sky and build a nest.', 'Chim biết bay trên trời và làm tổ.'] },
    { q: 'Where does a bird live?', qvi: 'Chim sống ở đâu?', ans: [['nest', 'in the nest', 'trong tổ'], ['tree', 'on the tree', 'trên cây']], opts: ['fishtank', 'tree'], a: 1, sent: ['It lives in a nest on a tree.', 'Chim sống trong tổ trên cây.'] }] },
  cat: { word: 'cat', ipa: '/kæt/', vi: 'con mèo', ex: 'A cat can jump.', exVi: 'Con mèo biết nhảy.', fam: 'at', topic: 'Con vật', lv: 1, branches: [
    { q: 'What’s this?', qvi: 'Đây là gì?', ans: [['cat', 'a cat', 'một con mèo']], opts: ['dog', 'cat', 'bird'], a: 1, sent: ['This is a cat.', 'Đây là một con mèo.'] },
    { q: 'What color is a cat?', qvi: 'Mèo có màu gì?', ans: [['ginger', 'orange', 'màu cam'], ['white', 'white', 'màu trắng'], ['black', 'black', 'màu đen']], opts: ['ginger', 'stripes'], a: 0, sent: ['It is orange, white or black.', 'Mèo có màu cam, trắng hoặc đen.'] },
    { q: 'What does a cat like?', qvi: 'Mèo thích gì?', ans: [['fish', 'fish', 'cá'], ['milk', 'milk', 'sữa']], opts: ['fish', 'wheel', 'book'], a: 0, sent: ['It likes fish and milk.', 'Mèo thích cá và sữa.'] },
    { q: 'What does a cat have?', qvi: 'Mèo có những gì?', ans: [['whiskers', 'whiskers', 'ria'], ['tail', 'a tail', 'cái đuôi'], ['paw', 'paws', 'bàn chân có đệm']], opts: ['wings', 'paw'], a: 1, sent: ['It has whiskers, a tail and paws.', 'Mèo có ria, đuôi và bàn chân có đệm.'] },
    { q: 'What can a cat do?', qvi: 'Mèo làm được gì?', ans: [['run', 'run', 'chạy'], ['jump', 'jump', 'nhảy'], ['climb', 'climb', 'leo trèo']], opts: ['flysky', 'jump'], a: 1, sent: ['It can run, jump and climb.', 'Mèo biết chạy, nhảy và leo trèo.'] }] },
  shirt: { word: 'shirt', ipa: '/ʃɜːt/', vi: 'áo sơ mi', ex: 'I wear a shirt to school.', exVi: 'Tớ mặc áo sơ mi đi học.', fam: 'ir', topic: 'Quần áo', lv: 3, branches: [
    { q: 'What’s this?', qvi: 'Đây là gì?', ans: [['shirt', 'a shirt', 'một cái áo sơ mi']], opts: ['shirt', 'skirt', 'hat'], a: 0, sent: ['This is a shirt.', 'Đây là một cái áo sơ mi.'] },
    { q: 'What color is a shirt?', qvi: 'Áo sơ mi có màu gì?', ans: [['blue', 'blue', 'màu xanh dương'], ['white', 'white', 'màu trắng']], opts: ['blue', 'stripes'], a: 0, sent: ['It is blue or white.', 'Áo màu xanh dương hoặc trắng.'] },
    { q: 'What does a shirt have?', qvi: 'Áo sơ mi có những gì?', ans: [['button', 'buttons', 'cúc áo'], ['collar', 'a collar', 'cổ áo']], opts: ['button', 'wheel'], a: 0, sent: ['It has buttons and a collar.', 'Áo có cúc và cổ áo.'] },
    { q: 'When do you wear a shirt?', qvi: 'Cậu mặc áo sơ mi khi nào?', ans: [['school', 'at school', 'khi đi học'], ['everyday', 'every day', 'mỗi ngày']], opts: ['school', 'nest'], a: 0, sent: ['I wear it at school every day.', 'Tớ mặc áo đi học mỗi ngày.'] }] }
};
/* Nhãn tiếng Anh của hình đoán (đọc to khi bé chọn) */
var WX_OPT = { bird: 'a bird', cat: 'a cat', fish: 'a fish', dog: 'a dog', brown: 'brown', stripes: 'black and white stripes', ginger: 'orange', book: 'a book', seeds: 'seeds', ball: 'a ball', wheel: 'wheels', wings: 'wings', paw: 'paws',
  flysky: 'fly in the sky', girlbook: 'read a book', run: 'run', jump: 'jump', fishtank: 'in a fish tank', tree: 'on the tree', shirt: 'a shirt', skirt: 'a skirt', hat: 'a hat', blue: 'blue', button: 'buttons', school: 'at school', nest: 'in a nest' };
/* Nghĩa ngắn cho bong bóng khi bấm một từ trong đoạn văn */
var WGLOSS = { this: 'đây, cái này', is: 'là', a: 'một', an: 'một', bird: 'con chim', it: 'nó', brown: 'màu nâu', yellow: 'màu vàng', or: 'hoặc', blue: 'màu xanh dương', likes: 'thích', to: '(để)', eat: 'ăn', seeds: 'hạt', insects: 'sâu bọ', and: 'và', berries: 'quả mọng',
  has: 'có', wings: 'đôi cánh', feathers: 'lông vũ', beak: 'cái mỏ', claws: 'móng vuốt', can: 'có thể, biết', fly: 'bay', in: 'trong', the: '(cái, con…)', sky: 'bầu trời', build: 'xây, làm', nest: 'cái tổ', lives: 'sống', on: 'trên', tree: 'cái cây',
  cat: 'con mèo', orange: 'màu cam', white: 'màu trắng', black: 'màu đen', fish: 'cá', milk: 'sữa', whiskers: 'ria', tail: 'cái đuôi', paws: 'bàn chân', run: 'chạy', jump: 'nhảy', climb: 'leo trèo',
  fat: 'béo, mập', sat: 'đã ngồi', mat: 'tấm thảm nhỏ', hat: 'cái mũ', first: 'đầu tiên, thứ nhất', girl: 'bạn gái, cô bé', her: 'của bạn ấy (nữ)', shirt: 'áo sơ mi', skirt: 'chân váy', i: 'tớ, mình', wear: 'mặc', at: 'ở', school: 'trường học', every: 'mỗi', day: 'ngày', buttons: 'cúc áo', collar: 'cổ áo' };

/* ---------- Dữ liệu Họ vần ---------- */
/* thành viên: [từ, IPA, loại từ, nghĩa, đã học?] */
var FAM = {
  at: { rime: 'at', ipa: '/æt/', build: 'at', members: [['bat', '/bæt/', 'danh từ', 'con dơi', 1], ['cat', '/kæt/', 'danh từ', 'con mèo', 1], ['hat', '/hæt/', 'danh từ', 'cái mũ', 1], ['fat', '/fæt/', 'tính từ', 'béo, mập', 1],
    ['mat', '/mæt/', 'danh từ', 'tấm thảm nhỏ', 1], ['flat', '/flæt/', 'tính từ', 'phẳng, bẹp', 0], ['chat', '/tʃæt/', 'động từ', 'trò chuyện', 0], ['that', '/ðæt/', 'từ chỉ định', 'kia, đó', 0]],
    traps: [['eat', '/iːt/', 'ăn', 'ea'], ['what', '/wɒt/', 'cái gì', 'wha']], trapNote: 'Hai từ này cũng có chữ “at” nhưng đọc khác hẳn: <b lang="en">eat</b> đọc là /iːt/, <b lang="en">what</b> đọc là /wɒt/. Nghe kỹ nhé!',
    para: [['The fat cat sat on a mat.', 'Con mèo béo ngồi trên tấm thảm.'], ['It has a hat.', 'Nó có một cái mũ.']] },
  ir: { rime: 'ir', ipa: '/ɜː/', build: 'irt', members: [['bird', '/bɜːd/', 'danh từ', 'con chim', 1], ['girl', '/ɡɜːl/', 'danh từ', 'bạn gái, cô bé', 1], ['shirt', '/ʃɜːt/', 'danh từ', 'áo sơ mi', 1],
    ['skirt', '/skɜːt/', 'danh từ', 'chân váy', 1], ['first', '/fɜːst/', 'số thứ tự', 'thứ nhất, đầu tiên', 0], ['third', '/θɜːd/', 'số thứ tự', 'thứ ba', 0]],
    traps: [['fire', '/ˈfaɪə/', 'lửa', 'fir']], trapNote: 'Từ <b lang="en">fire</b> cũng có chữ “ir” nhưng đọc là /ˈfaɪə/, không phải âm /ɜː/ như cả họ.',
    para: [['The first girl has a bird on her shirt.', 'Bạn gái đầu tiên mặc áo có hình con chim.'], ['Her skirt is blue.', 'Chân váy của bạn ấy màu xanh dương.']] }
};
/* ---------- Dữ liệu Ghép chữ đầu ---------- */
var BUILD = {
  at: { rime: 'at', fam: 'at', onsets: ['b', 'c', 'h', 'f', 'm', 's', 'r', 'z'], goal: 5,
    real: { bat: 'con dơi', cat: 'con mèo', hat: 'cái mũ', fat: 'béo, mập', mat: 'tấm thảm nhỏ', sat: 'đã ngồi', rat: 'con chuột' } },
  irt: { rime: 'irt', fam: 'ir', onsets: ['sh', 'sk', 'd', 'f', 'm', 'z'], goal: 3,
    real: { shirt: 'áo sơ mi', skirt: 'chân váy', dirt: 'bùn đất' } }
};
/* Hình cho từ ghép được (từ không có hình riêng dùng hình gần nghĩa) */
var BUILD_PIC = { sat: 'sat', rat: 'rat', dirt: 'dirt' };
ICONS.translate = '<path d="M3.5 5.5h9M8 3.5v2M5.5 5.5c.8 3 3 5.4 6 6.6M10.5 5.5c-.8 3.2-3 5.8-6.5 7"/><path d="M12.5 20.5l4-10 4 10M14 17h5"/>';
ICONS.snail = '<path d="M3 18.5h14.5c2 0 3.5-1.6 3.5-3.5V9"/><circle cx="11" cy="12" r="5.5"/><path d="M11 12a2 2 0 1 0 2-2"/><path d="M19.5 9l-1.5-3M21.5 9l1-3"/>';
ICONS.compass = '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z" fill="currentColor"/>';
ICONS.family = '<circle cx="12" cy="12" r="3.2"/><circle cx="4.5" cy="6" r="2"/><circle cx="19.5" cy="6" r="2"/><circle cx="4.5" cy="18" r="2"/><circle cx="19.5" cy="18" r="2"/><path d="M6.2 7.2l3.2 2.8M17.8 7.2l-3.2 2.8M6.2 16.8l3.2-2.8M17.8 16.8l-3.2-2.8"/>';
ICONS.blocks = '<rect x="3" y="9" width="8" height="8" rx="2"/><rect x="13" y="9" width="8" height="8" rx="2" fill="currentColor"/><path d="M7 6V4M17 6V4"/>';
ICONS.branch = '<circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="5" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7.5 12h9.5M7 11c4-5 6-6 10-6M7 13c4 5 6 6 10 6"/>';

/* =====================================================================
   ĐỢT 6 · TIỂU HỌC — giao diện dùng chung (Bong.W)
   wx: Khám phá từ · fam: Họ vần · build: Ghép chữ đầu · rap: Đọc cả đoạn (ReadAloudParagraph)
   links: dải liên kết + đường dẫn (WordLinks) · app: bộ điều khiển một lượt đi (tự khám phá / trong bài học)
   ===================================================================== */
function wpic(k, s, label) { return pic(k, s).replace(/role="img"[^>]*?aria-label="[^"]*"/, label ? 'role="img" aria-label="' + esc(label) + '"' : 'aria-hidden="true"'); }
function wrel(el, anc) { var x = 0, y = 0; while (el && el !== anc) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; } return { x: x, y: y }; }
function wscale(el) { var vp = el.closest && el.closest('.dsf-vp'); var s = (vp && vp.__scale) || 1; var jf = el.closest && el.closest('[data-jscale]'); if (jf) s *= +jf.getAttribute('data-jscale'); return s; }
function rimeWord(w, rime, cls) { var i = w.lastIndexOf(rime); if (i < 0) return esc(w); return esc(w.slice(0, i)) + '<span class="' + (cls || 'b-rime') + '">' + rime + '</span>' + esc(w.slice(i + rime.length)); }
function wtoast(scr, text) { var o = scr.querySelector('.b-wtoast'); if (o) o.remove(); var t = document.createElement('div'); t.className = 'b-wtoast'; t.setAttribute('role', 'status'); t.innerHTML = icon('check', 20) + '<span>' + text + '</span>'; scr.appendChild(t); setTimeout(function () { t.classList.add('is-out'); }, 2600); setTimeout(function () { t.remove(); }, 3000); }

/* ---------- Khám phá từ (Screen48) ---------- */
function wxHtml(k, o) {
  o = o || {}; var d = WX[k], n = d.branches.length, open = o.open || [];
  var card = '<section class="b-wx__card" aria-label="Thẻ từ ' + d.word + '"><div class="b-wx__pic">' + wpic(d.word, 160, 'Hình: ' + d.vi) + '</div>' +
    '<div class="b-wx__w"><h2 class="b-wx__word" lang="en">' + d.word + '</h2>' + speak(d.word, 'm', 'Nghe từ ' + d.word) + '</div><span class="b-wx__ipa">' + d.ipa + ' · ' + d.vi + '</span>' +
    '<p class="b-wx__ex">' + speak(d.ex, 's', 'Nghe câu: ' + d.ex) + '<span lang="en">' + d.ex + '</span></p></section>';
  var nodes = d.branches.map(function (b, i) {
    var op = !!open[i], ask = o.ask === i, ind = Math.round(Math.sin(Math.PI * (i + .5) / n) * (o.compact ? 28 : 44)), body;
    if (op) body = '<div class="b-wx__ans">' + b.ans.map(function (a) { return '<button type="button" class="b-wx__a" data-say="' + esc(a[1]) + '" aria-label="Nghe: ' + esc(a[1]) + ', nghĩa: ' + a[2] + '">' + wpic(a[0], 40) + '<span lang="en">' + a[1] + '</span></button>'; }).join('') + '</div>';
    else if (ask) body = '<div class="b-wx__opts" role="radiogroup" aria-label="Chọn hình trả lời câu ' + (i + 1) + ' (phím 1–' + b.opts.length + ')">' + b.opts.map(function (ok, j) {
      var cls = (o.sel === j ? ' is-selected' : '') + (o.dim === j ? ' is-dim' : '') + (o.wrong === j ? ' is-retry' : '');
      return '<button type="button" role="radio" class="b-wx__opt' + cls + '" data-opt="' + j + '" aria-checked="' + (o.sel === j) + '" aria-label="Hình ' + (j + 1) + ': ' + esc(WX_OPT[ok] || ok) + '"' + (o.dim === j ? ' disabled' : '') + '>' + key(String(j + 1), 'b-key--corner') + wpic(ok, 50) + '</button>'; }).join('') + '</div>';
    else body = '<span class="b-wx__qm" aria-hidden="true">?</span>';
    return '<li class="b-wx__node' + (op ? ' is-open' : '') + (ask ? ' is-ask' : '') + (o.hl === i ? ' is-glow' : '') + '" data-b="' + i + '" style="--ind:' + ind + 'px">' +
      '<button type="button" class="b-wx__q" data-bq="' + i + '" aria-label="Nhánh ' + (i + 1) + ': ' + esc(b.q) + (op ? ', đã mở' : ask ? ', đang hỏi' : ', chưa mở') + '"' + (op ? '' : ' aria-keyshortcuts="' + (i + 1) + '"') + (ask ? ' aria-expanded="true"' : '') + '>' +
      '<span class="b-wx__num" aria-hidden="true">' + (op ? icon('check', 18) : i + 1) + '</span><span class="b-wx__qt" lang="en">' + esc(b.q) + '</span></button>' + speak(b.q, 's', 'Nghe câu hỏi ' + (i + 1)) + body + '</li>';
  }).join('');
  return '<div class="b-wx' + (o.compact ? ' b-wx--compact' : '') + '" data-wx="' + k + '" style="--n:' + n + '"><svg class="b-wx__lines" aria-hidden="true"></svg>' + card +
    '<ol class="b-wx__br" aria-label="' + n + ' câu hỏi quanh từ ' + d.word + '">' + nodes + '</ol></div>';
}
function wxLines(root) {
  (root.matches && root.matches('.b-wx') ? [root] : Array.prototype.slice.call(root.querySelectorAll('.b-wx'))).forEach(function (wx) {
    var svg = wx.querySelector('.b-wx__lines'), card = wx.querySelector('.b-wx__card'); if (!svg || !card || !wx.offsetWidth) return;
    var W = wx.offsetWidth, H = wx.offsetHeight; svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('width', W); svg.setAttribute('height', H);
    var c = wrel(card, wx), x0 = c.x + card.offsetWidth, y0 = c.y + card.offsetHeight / 2, p = '';
    wx.querySelectorAll('.b-wx__node').forEach(function (nd) {
      var r = wrel(nd, wx), x1 = r.x, y1 = r.y + nd.offsetHeight / 2, dx = x1 - x0, cls = nd.classList.contains('is-ask') ? 'is-ask' : nd.classList.contains('is-open') ? 'is-open' : '';
      p += '<path class="' + cls + '" d="M' + x0 + ' ' + y0 + ' C' + (x0 + dx * .55) + ' ' + y0 + ' ' + (x1 - dx * .5) + ' ' + y1 + ' ' + x1 + ' ' + y1 + '"/><circle class="' + cls + '" cx="' + x1 + '" cy="' + y1 + '" r="5"/>';
    });
    svg.innerHTML = p + '<circle class="hub" cx="' + x0 + '" cy="' + y0 + '" r="8"/>';
  });
}
function wxPara(k) { return WX[k].branches.map(function (b) { return b.sent; }); }

/* ---------- Đọc cả đoạn và dịch nghĩa (ReadAloudParagraph) ---------- */
var RAP_UID = 0;
function rapHtml(o) {
  var id = 'rap' + (++RAP_UID), k = 0, one = o.one || [], rd = o.reading;
  return '<section class="b-rap' + (o.tr ? ' is-tr' : '') + (rd ? ' is-playing' : '') + (o.compact ? ' b-rap--compact' : '') + '" data-rap aria-labelledby="' + id + '">' +
    '<header class="b-rap__h"><h2 class="b-rap__title" id="' + id + '">' + icon('book', 22) + (o.title || 'Đọc cả đoạn') + '</h2><div class="b-rap__tools">' +
    btn({ label: rd ? 'Đọc tiếp' : 'Đọc cả đoạn', icon: 'speaker', size: o.compact ? 's' : 'm', key: 'P', attrs: 'data-rap-play aria-keyshortcuts="P"' + (rd ? ' hidden' : '') }) +
    btn({ label: 'Tạm dừng', variant: 'secondary', icon: 'pause', size: o.compact ? 's' : 'm', key: 'P', attrs: 'data-rap-pause' + (rd ? '' : ' hidden') }) +
    '<button type="button" class="b-chipbtn" data-rap-slow aria-pressed="false">' + icon('snail', 20) + 'Đọc chậm</button>' +
    '<button type="button" class="b-chipbtn" data-rap-tr aria-pressed="' + !!o.tr + '" aria-keyshortcuts="T">' + icon('translate', 20) + 'Dịch nghĩa' + key('T') + '</button></div></header>' +
    '<ol class="b-rap__body">' + o.sents.map(function (s, i) {
      var on = o.tr || one[i], words = lwords(s[0], WGLOSS, k);
      if (rd && rd.s === i) words = words.replace('data-kw="' + rd.w + '"', 'data-kw="' + rd.w + '" data-now');
      var h = '<li class="b-rap__s' + (rd && rd.s === i ? ' is-reading' : '') + '" data-rs="' + i + '"><button type="button" class="b-rap__one" data-rap-one="' + i + '" aria-pressed="' + !!on + '" aria-label="Dịch riêng câu ' + (i + 1) + '">' + icon('translate', 18) + '</button>' +
        '<span class="b-rap__en" lang="en">' + words + '</span><button type="button" class="b-rap__say" data-rap-say="' + i + '" aria-label="Nghe câu ' + (i + 1) + ': ' + esc(s[0]) + '">' + icon('speaker', 18) + '</button>' +
        '<span class="b-rap__vi translation" lang="vi"' + (on ? '' : ' hidden') + '>' + s[1] + '</span></li>';
      k += s[0].split(' ').length; return h;
    }).join('') + '</ol><p class="b-sr" aria-live="polite" data-rap-live></p></section>';
}
var RAP_STOPS = [];
function wireRap(rap, o) {
  o = o || {};
  var kws = Array.prototype.slice.call(rap.querySelectorAll('.b-kw')), play = rap.querySelector('[data-rap-play]'), pause = rap.querySelector('[data-rap-pause]'), slow = rap.querySelector('[data-rap-slow]'), tr = rap.querySelector('[data-rap-tr]'), live = rap.querySelector('[data-rap-live]');
  var R = { i: -1, t: null, on: false, end: kws.length }, now = rap.querySelector('[data-now]');
  if (now) { now.classList.add('is-reading'); R.i = kws.indexOf(now); }
  function isSlow() { return slow.getAttribute('aria-pressed') === 'true'; }
  function clear() { kws.forEach(function (x) { x.classList.remove('is-reading'); }); rap.querySelectorAll('.b-rap__s').forEach(function (x) { x.classList.remove('is-reading'); }); }
  function ui(on) { rap.classList.toggle('is-playing', on); var f = document.activeElement === play || document.activeElement === pause; play.hidden = on; pause.hidden = !on; play.querySelector('span').textContent = R.i > 0 && R.i < kws.length ? 'Đọc tiếp' : 'Đọc cả đoạn'; if (f) (on ? pause : play).focus({ preventScroll: true }); }
  function stop(keep) { R.on = false; clearTimeout(R.t); try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {} if (!keep) { R.i = -1; clear(); } ui(false); }
  function step() {
    if (!R.on) return; clear();
    if (R.i >= R.end) { var whole = R.end === kws.length; R.i = -1; stop(); live.textContent = whole ? 'Đã đọc xong cả đoạn.' : ''; if (whole && o.onDone) o.onDone(); R.end = kws.length; return; }
    var w = kws[R.i]; w.classList.add('is-reading'); w.closest('.b-rap__s').classList.add('is-reading'); R.i++; R.t = setTimeout(step, isSlow() ? 640 : 420);
  }
  function run(from, to) { stop(); R.i = from; R.end = to; R.on = true; ui(true); lsay(kws.slice(from, to).map(function (x) { return x.textContent; }).join(' '), isSlow() ? .6 : .82); step(); }
  function toggle() { if (R.on) { stop(true); ui(false); live.textContent = 'Tạm dừng.'; } else run(R.i > 0 && R.i < kws.length ? R.i : 0, kws.length); }
  function sentRange(i) { var s = rap.querySelector('[data-rs="' + i + '"]'), ws = Array.prototype.slice.call(s.querySelectorAll('.b-kw')); return [kws.indexOf(ws[0]), kws.indexOf(ws[ws.length - 1]) + 1]; }
  function setTr(on) { tr.setAttribute('aria-pressed', on); rap.classList.toggle('is-tr', on); rap.querySelectorAll('.b-rap__vi').forEach(function (v) { v.hidden = !on; }); rap.querySelectorAll('[data-rap-one]').forEach(function (b) { b.setAttribute('aria-pressed', on); }); live.textContent = on ? 'Đã hiện bản dịch tiếng Việt.' : 'Đã ẩn bản dịch.'; o.onTr && o.onTr(on); }
  play.addEventListener('click', toggle); pause.addEventListener('click', toggle);
  slow.addEventListener('click', function () { slow.setAttribute('aria-pressed', !isSlow()); if (R.on) run(R.i - 1 < 0 ? 0 : R.i - 1, R.end); });
  tr.addEventListener('click', function () { setTr(tr.getAttribute('aria-pressed') !== 'true'); });
  rap.querySelectorAll('[data-rap-one]').forEach(function (b) { b.addEventListener('click', function () { var on = b.getAttribute('aria-pressed') !== 'true', v = b.closest('.b-rap__s').querySelector('.b-rap__vi'); b.setAttribute('aria-pressed', on); v.hidden = !on; }); });
  rap.querySelectorAll('[data-rap-say]').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); var r = sentRange(+b.dataset.rapSay); run(r[0], r[1]); }); });
  rap.querySelectorAll('.b-rap__s').forEach(function (s) { s.addEventListener('click', function (e) { if (e.target.closest('button')) return; var r = sentRange(+s.dataset.rs); run(r[0], r[1]); }); });
  kws.forEach(function (w) { w.addEventListener('click', function (e) { e.stopPropagation(); gloss(rap, w); }); });
  RAP_STOPS.push(function () { stop(); });
  if (o.autoplay) setTimeout(function () { if (rap.isConnected) run(0, kws.length); }, o.autoplay);
  return { toggle: toggle, setTr: setTr, stop: stop, el: rap,
    key: function (e) { if (typing() || e.ctrlKey || e.metaKey || e.altKey) return false; if (e.key === 'p' || e.key === 'P') { e.preventDefault(); toggle(); return true; } if (e.key === 't' || e.key === 'T') { e.preventDefault(); setTr(tr.getAttribute('aria-pressed') !== 'true'); return true; } return false; } };
}
function gloss(host, w) {
  var old = host.querySelector('.b-gloss'); if (old) old.remove();
  var word = w.dataset.w, r = wrel(w, host), p = document.createElement('div');
  p.className = 'b-gloss'; p.setAttribute('role', 'status');
  p.innerHTML = speak(word, 's') + '<b lang="en">' + esc(word) + '</b><span>' + (WGLOSS[word] || '') + '</span>';
  p.style.left = (r.x + w.offsetWidth / 2) + 'px'; p.style.top = r.y + 'px'; host.appendChild(p);
  lsay(word, .8); w.classList.add('is-lit'); setTimeout(function () { w.classList.remove('is-lit'); }, 900); setTimeout(function () { p.remove(); }, 2600);
}

/* ---------- Họ vần (Screen50) ---------- */
function famCanBuild(fk, w) { var b = BUILD[FAM[fk].build]; return w.slice(-b.rime.length) === b.rime && w.length > b.rime.length; }
function famHtml(k, o) {
  o = o || {}; var f = FAM[k], heard = o.heard || {}, half = Math.ceil(f.members.length / 2), ex = o.mode === 'explore';
  function card(m, i) {
    var learned = !!m[4], wx = !!WX[m[0]] && m[0] !== o.from;
    return '<li class="b-fam__card' + (learned ? '' : ' is-soon') + (o.hl === m[0] ? ' is-hl' : '') + (heard[m[0]] ? ' is-heard' : '') + (o.next === m[0] ? ' is-glow' : '') + (o.playing === m[0] ? ' is-playing' : '') + '" data-fw="' + m[0] + '">' +
      '<button type="button" class="b-fam__main" data-fsay="' + m[0] + '" aria-label="' + m[0] + ', ' + m[2] + ', nghĩa: ' + m[3] + (learned ? '' : ', sắp học') + (heard[m[0]] ? ', đã nghe' : '') + '. Bấm để nghe.">' +
      '<span class="b-fam__pic">' + wpic(m[0], 60) + '</span><span class="b-fam__w" lang="en">' + rimeWord(m[0], f.rime) + '</span><span class="b-fam__ipa">' + m[1] + '</span><span class="b-fam__pos">' + m[2] + '</span><span class="b-fam__vi">' + m[3] + '</span></button>' +
      (learned ? '' : '<span class="b-fam__soon" aria-hidden="true">Sắp học</span>') + (heard[m[0]] ? '<span class="b-fam__tick" aria-hidden="true">' + icon('check', 16) + '</span>' : '') +
      (ex ? '<div class="b-fam__go">' + (famCanBuild(k, m[0]) ? '<button type="button" class="b-minibtn" data-fbuild="' + m[0] + '" aria-label="Ghép từ ' + m[0] + ' ở màn Ghép chữ đầu">' + icon('blocks', 16) + 'Ghép</button>' : '') +
        (wx ? '<button type="button" class="b-minibtn" data-fexp="' + m[0] + '" aria-label="Khám phá từ ' + m[0] + '">' + icon('branch', 16) + 'Khám phá</button>' : '') + '</div>' : '') + '</li>';
  }
  var hub = '<button type="button" class="b-fam__hub" data-fhub aria-label="Vần ' + f.rime + ', đọc ' + f.ipa + '. Bấm để nghe lần lượt cả họ."><span class="b-fam__rime" lang="en">-' + f.rime + '</span><span class="b-fam__hipa">' + f.ipa + '</span><span class="b-fam__hcap">' + icon('speaker', 18) + 'Nghe cả họ</span></button>';
  var trap = '<aside class="b-trap" aria-labelledby="trap-' + k + '"><h3 class="b-trap__h" id="trap-' + k + '">' + icon('bulb', 20) + 'Bẫy chính tả</h3><ul class="b-trap__list">' + f.traps.map(function (t) {
    return '<li><button type="button" class="b-trap__w" data-say="' + t[0] + '" aria-label="Từ bẫy ' + t[0] + ', đọc ' + t[1] + ', nghĩa: ' + t[2] + '. Bấm để nghe."><b lang="en">' + rimeWord(t[0], f.rime, 'b-trap__mark') + '</b><span class="b-trap__ipa">' + t[1] + '</span><span class="b-trap__vi">' + t[2] + '</span>' + icon('speaker', 18) + '</button></li>'; }).join('') + '</ul>' +
    '<div class="b-trap__bong">' + dragon('suynghi', 56) + '<p>' + f.trapNote + '</p></div></aside>';
  return '<div class="b-fam' + (o.compact ? ' b-fam--compact' : '') + '" data-fam="' + k + '"><div class="b-fam__ring"><svg class="b-fam__lines" aria-hidden="true"></svg>' +
    '<ul class="b-fam__side" aria-label="Từ trong họ -' + f.rime + ' (1)">' + f.members.slice(0, half).map(card).join('') + '</ul>' + hub + '<ul class="b-fam__side" aria-label="Từ trong họ -' + f.rime + ' (2)">' + f.members.slice(half).map(function (m, i) { return card(m, i + half); }).join('') + '</ul></div>' + (o.noTrap ? '' : trap) + '</div>';
}
function famLines(root) {
  (root.matches && root.matches('.b-fam__ring') ? [root] : Array.prototype.slice.call(root.querySelectorAll('.b-fam__ring'))).forEach(function (ring) {
    var svg = ring.querySelector('.b-fam__lines'), hub = ring.querySelector('.b-fam__hub'); if (!svg || !hub || !ring.offsetWidth) return;
    var W = ring.offsetWidth, H = ring.offsetHeight; svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('width', W); svg.setAttribute('height', H);
    var h = wrel(hub, ring), cx = h.x + hub.offsetWidth / 2, cy = h.y + hub.offsetHeight / 2, p = '';
    ring.querySelectorAll('.b-fam__card').forEach(function (c) { var r = wrel(c, ring), x = r.x + c.offsetWidth / 2, y = r.y + c.offsetHeight / 2; p += '<path class="' + (c.classList.contains('is-soon') ? 'is-soon' : '') + '" d="M' + cx + ' ' + cy + ' L' + x + ' ' + y + '"/>'; });
    svg.innerHTML = p;
  });
}

/* ---------- Ghép chữ đầu (Screen51) ---------- */
function buildOnsets(k, target) { var b = BUILD[k], on = b.onsets.slice(); if (target) { var o = target.slice(0, target.length - b.rime.length); if (on.indexOf(o) < 0) on.push(o); } return on; }
function buildHtml(k, o) {
  o = o || {}; var b = BUILD[k], found = o.found || [], ons = buildOnsets(k, o.target), tOn = o.target && found.indexOf(o.target) < 0 ? o.target.slice(0, o.target.length - b.rime.length) : null;
  var word = o.slot ? o.slot + b.rime : '', res;
  if (o.state === 'ok') res = '<div class="b-bd__res is-ok" role="status">' + wpic(BUILD_PIC[word] || word, 112, 'Hình: ' + b.real[word]) + '<b lang="en">' + rimeWord(word, b.rime) + '</b>' + speak(word, 's') + '<span>' + b.real[word] + '</span></div>';
  else if (o.state === 'again') res = '<div class="b-bd__res" role="status">' + wpic(BUILD_PIC[word] || word, 96) + '<b lang="en">' + word + '</b><span>Cậu tìm được từ này rồi! Thử chữ khác nhé.</span></div>';
  else if (o.state === 'fake') res = '<div class="b-bd__res is-fake" role="status">' + dragon('dongvien', 84) + '<p><b lang="en">' + esc(word) + '</b> — Từ này không có trong tiếng Anh, thử chữ khác nhé.</p></div>';
  else if (tOn) res = '<div class="b-bd__res is-target">' + wpic(BUILD_PIC[o.target] || o.target, 96, 'Hình: ' + (b.real[o.target] || o.target)) + '<span class="b-bd__tl">Từ cần ghép đầu tiên</span><b lang="en">' + rimeWord(o.target, b.rime) + '</b>' + speak(o.target, 's') + '</div>';
  else res = '<div class="b-bd__res is-idle">' + dragon(o.goalDone ? 'chucmung' : 'chao', 84) + '<p>' + (o.goalDone ? 'Cậu tìm đủ ' + b.goal + ' từ rồi! Tìm thêm nếu cậu muốn nhé.' : 'Kéo một chữ vào ô trống, hoặc gõ chữ đó trên bàn phím.') + '</p></div>';
  var slots = ''; for (var i = 0; i < Math.max(b.goal, found.length); i++) { var w = found[i]; slots += '<li>' + (w ? (o.mode === 'explore' && WX[w] ? '<button type="button" class="b-bd__chip is-link" data-fopen="' + w + '" aria-label="' + w + ': mở Khám phá từ ' + w + '">' : '<span class="b-bd__chip"' + (o.mode === 'explore' ? ' title="Từ này chưa có Khám phá"' : '') + '>') + wpic(BUILD_PIC[w] || w, 34) + '<b lang="en">' + rimeWord(w, b.rime) + '</b>' + (o.mode === 'explore' && WX[w] ? icon('branch', 16) + '</button>' : '</span>') : '<span class="b-bd__empty" aria-label="Ô trống"></span>') + '</li>'; }
  return '<div class="b-bd" data-build="' + k + '"><div class="b-bd__row"><div class="b-bd__letters" role="group" aria-label="Chữ đầu: kéo vào ô trống, bấm, hoặc gõ chữ trên bàn phím">' + ons.map(function (l) {
      return '<button type="button" class="b-bd__tile' + (o.slot === l ? ' is-used' : '') + (o.hint === l ? ' is-glow' : '') + (tOn === l ? ' is-target' : '') + '" data-letter="' + l + '" aria-label="Chữ ' + l + '" aria-keyshortcuts="' + l.split('').join(' ') + '" lang="en">' + l + '</button>'; }).join('') + '</div>' +
    '<span class="b-bd__arrow" aria-hidden="true">' + icon('next', 34) + '</span><div class="b-bd__eq"><div class="b-bd__slot' + (o.slot ? ' is-filled' : '') + (o.state === 'fake' ? ' is-fake' : '') + (o.state === 'ok' || o.state === 'again' ? ' is-ok' : '') + '" data-slot aria-label="Ô chữ đầu: ' + (o.slot || 'trống') + '" lang="en">' + (o.slot || '') + '</div><div class="b-bd__rime" lang="en" aria-label="Vần ' + b.rime + '">' + b.rime + '</div></div>' + res + '</div>' +
    '<section class="b-bd__found" aria-labelledby="bdf-' + k + '"><h3 id="bdf-' + k + '">' + icon('star', 22) + 'Đã tìm được <b>' + found.length + '/' + b.goal + '</b></h3><ol>' + slots + '</ol></section></div>';
}

/* ---------- Dải liên kết + đường dẫn (WordLinks) ---------- */
function crumbLabel(s) { return s.v === 'wx' ? s.k : s.v === 'fam' ? 'họ -' + FAM[s.k].rime : 'Ghép chữ'; }
function linksHtml(stack, go, o) {
  o = o || {};
  var cr = stack.map(function (s, i) { var lab = esc(crumbLabel(s)); return '<li>' + (i === stack.length - 1 ? '<span class="b-crumb is-now" aria-current="location">' + lab + '</span>' : '<button type="button" class="b-crumb" data-crumb="' + i + '"' + (o.glowCrumb === i ? ' data-glow' : '') + '>' + lab + '</button>') + '</li>'; }).join('');
  return '<nav class="b-links" aria-label="Liên kết qua lại"><button type="button" class="b-links__back" data-wback aria-keyshortcuts="Backspace"' + (stack.length < 2 ? ' disabled' : '') + '>' + icon('back', 20) + '<span>Quay lại</span>' + key('⌫') + '</button>' +
    '<ol class="b-crumbs" aria-label="Đường dẫn (tối đa 4 bậc)">' + cr + '</ol><div class="b-links__go">' + (go || '') + '</div></nav>';
}
function linkBtn(label, ic, attrs, glow) { return '<button type="button" class="b-linkbtn' + (glow ? ' is-glow' : '') + '" ' + attrs + '>' + icon(ic, 20) + '<span>' + label + '</span>' + icon('next', 18) + '</button>'; }

/* ---------- Khung một màn (tự khám phá / trong bài học) ---------- */
var WTITLE = { wx: ['Khám phá từ', 'branch'], fam: ['Họ vần', 'family'], build: ['Ghép chữ đầu', 'blocks'] };
function wEntry(e) { var d = { wx: { open: [], ask: -1, sel: -1, dim: -1, wrong: -1, tries: 0, done: false }, fam: { heard: {} }, build: { slot: null, found: [], state: 'idle' } }[e.v]; return Object.assign(d, e); }
function wProgress(t) {
  if (t.v === 'wx') { var n = WX[t.k].branches.length; return [t.open.filter(Boolean).length, n]; }
  if (t.v === 'fam') { var L = FAM[t.k].members.filter(function (m) { return m[4]; }); return [L.filter(function (m) { return t.heard[m[0]]; }).length, L.length]; }
  return [Math.min(t.found.length, BUILD[t.k].goal), BUILD[t.k].goal];
}
function wTitle(t) { return t.v === 'wx' ? WX[t.k].word : t.v === 'fam' ? 'Họ vần -' + FAM[t.k].rime + ' ' + FAM[t.k].ipa : 'Ghép chữ đầu với vần -' + BUILD[t.k].rime; }
function wGo(t, o) {
  o = o || {};
  if (t.v === 'wx' && WX[t.k].fam) { var f = FAM[WX[t.k].fam]; return linkBtn('Họ vần của ' + t.k + ': -' + f.rime, 'family', 'data-wl-fam="' + WX[t.k].fam + '"', o.glow); }
  if (t.v === 'build') return linkBtn('Về họ vần -' + FAM[BUILD[t.k].fam].rime, 'family', 'data-wl-fam="' + BUILD[t.k].fam + '"', o.glow);
  if (t.v === 'fam') return '<span class="b-links__tip">' + icon('bulb', 18) + 'Mỗi thẻ: bấm để nghe · <b>Ghép</b> · <b>Khám phá</b></span>';
  return '';
}
function wInstr(t) {
  if (t.v === 'wx') { var d = WX[t.k], b = t.ask >= 0 ? d.branches[t.ask] : null;
    return '<div class="b-wl__instr">' + dragon(b ? 'suynghi' : 'chao', 60) + '<p class="b-wl__say" aria-live="polite">' + (b ? 'Bông hỏi: <b lang="en">' + esc(b.q) + '</b> <span class="b-muted">(' + b.qvi + ') · chọn hình, phím 1–' + b.opts.length + '</span>' : t.mode === 'explore' ? 'Bấm một câu hỏi (phím 1–' + d.branches.length + ') để xem câu trả lời. Không tính điểm.' : 'Chọn một nhánh (phím 1–' + d.branches.length + ') để Bông hỏi. Đoán sai cũng không sao!') + '</p></div>'; }
  if (t.v === 'fam') return '<div class="b-wl__instr">' + dragon('chao', 60) + '<p class="b-wl__say" aria-live="polite">' + (t.mode === 'explore' ? 'Các từ cùng vần <b lang="en">-' + FAM[t.k].rime + '</b>. Bấm thẻ để nghe, bấm vần ở giữa để nghe cả họ.' : 'Bấm từng thẻ để nghe. Nghe đủ các từ đã học rồi bấm Tiếp tục.') + '</p></div>';
  return '';
}
function wBody(t, o) {
  o = o || {};
  if (t.v === 'wx' && t.done && !t.diagram) return wxDone(t, o);
  if (t.v === 'wx') return wInstr(t) + wxHtml(t.k, { open: t.open, ask: t.ask, sel: t.sel, dim: t.dim, wrong: t.wrong, hl: o.hlBranch, compact: o.compact }) + (t.done ? '<div class="b-wl__after">' + btn({ label: 'Về đoạn văn', icon: 'book', variant: 'secondary', attrs: 'data-wdone' }) + '</div>' : '');
  if (t.v === 'fam') return (t.mode === 'explore' ? '' : wInstr(t)) + famHtml(t.k, { heard: t.heard, hl: t.hl, next: t.next, playing: t.playing, mode: t.mode, compact: o.compact, from: o.from }) +
    rapHtml({ sents: FAM[t.k].para, title: 'Đọc cả đoạn · câu vui của họ -' + FAM[t.k].rime, compact: true, tr: t.tr });
  return '<div class="b-wl__instr">' + dragon(t.state === 'fake' ? 'dongvien' : t.state === 'ok' ? 'vui' : 'chao', 60) + (t.msg ? '<p class="b-wl__say" aria-live="polite">' + t.msg + '</p>' : '<p class="b-wl__say">Ghép một chữ đầu với vần <b lang="en" class="b-rime">' + BUILD[t.k].rime + '</b> để thành từ. Tìm đủ ' + BUILD[t.k].goal + ' từ nhé!</p>') + '</div>' +
    buildHtml(t.k, { slot: t.slot, found: t.found, target: t.target, state: t.state, hint: t.hint, mode: t.mode, goalDone: t.found.length >= BUILD[t.k].goal });
}
function wxDone(t, o) {
  var d = WX[t.k];
  return '<div class="b-wxdone"><div class="b-wxdone__l"><div class="b-wxdone__hi">' + dragon('chucmung', 120) + '<div><h2 class="title">Cậu mở đủ ' + d.branches.length + ' nhánh rồi!</h2><p class="body b-muted">Giờ mình đọc cả đoạn về <b lang="en">' + d.word + '</b> nhé.</p></div></div>' +
    '<div class="b-wxdone__card">' + wpic(d.word, 96) + '<div><b lang="en" class="b-wx__word">' + d.word + '</b><span class="b-wx__ipa">' + d.ipa + ' · ' + d.vi + '</span></div>' + speak(d.word, 'm') + '</div>' +
    '<div class="b-wxdone__acts">' + btn({ label: 'Nói theo', icon: 'mic', variant: 'secondary', attrs: 'data-along aria-expanded="' + !!t.along + '"' }) + btn({ label: 'In', icon: 'print', variant: 'secondary', attrs: 'data-wprint' }) + btn({ label: 'Xem lại sơ đồ', icon: 'branch', variant: 'ghost', attrs: 'data-wdiag' }) + '</div>' +
    (t.along ? '<div class="b-along" data-alongp><p class="label">Nghe rồi nói lại câu này:</p><div class="b-along__row">' + speak(d.ex, 'm', 'Nghe câu mẫu') + '<b lang="en">' + d.ex + '</b></div><button type="button" class="b-along__mic' + (t.along === 'rec' ? ' is-rec' : '') + (t.along === 'ok' ? ' is-ok' : '') + '" data-mic aria-label="' + (t.along === 'rec' ? 'Đang nghe cậu nói' : 'Bấm để nói (Space)') + '">' + icon(t.along === 'ok' ? 'check' : 'mic', 34) + '</button><p class="b-along__msg" aria-live="polite">' + (t.along === 'ok' ? 'Bông nghe rõ rồi! Giỏi quá!' : t.along === 'rec' ? 'Bông đang nghe…' : 'Bấm micro rồi nói “' + d.ex + '”') + '</p></div>' : '') +
    '</div>' + rapHtml({ sents: wxPara(t.k), title: 'Đọc cả đoạn về ' + d.word, tr: t.tr, one: t.one }) + '</div>';
}
function wFrame(stack, mode, o) {
  o = o || {}; var t = stack[stack.length - 1], T = WTITLE[t.v], pr = wProgress(t);
  if (mode === 'lesson') {
    var main = t.v === 'wx' ? { label: t.done ? 'Tiếp tục' : 'Kiểm tra', disabled: !t.done && t.sel < 0 } : t.v === 'fam' ? { label: 'Tiếp tục', disabled: pr[0] < pr[1] } : { label: 'Kiểm tra', disabled: !t.slot || t.state !== 'idle' };
    return lhead({ n: pr[0], total: pr[1] }) + '<main class="lesson-main b-wl__main b-wl__main--' + t.v + '">' + wBody(t, o) + '</main>' + lfoot({ replayLabel: t.v === 'fam' ? 'Nghe cả họ' : 'Nghe lại', hintKey: t.v === 'build' ? '?' : 'H', hintOff: t.v === 'wx' && t.done, main: main });
  }
  return '<header class="b-wl__top"><button type="button" class="b-iconbtn" data-wclose aria-label="Đóng, về Sổ từ (Esc)">' + icon('close', 26) + '</button>' +
    '<div class="b-wl__ttl"><span class="b-wl__kind">' + icon(T[1], 18) + T[0] + '</span><h1 class="title" lang="' + (t.v === 'wx' ? 'en' : 'vi') + '">' + wTitle(t) + '</h1></div><span class="b-wl__free">' + icon('compass', 18) + 'Tự khám phá · không tính điểm</span></header>' +
    linksHtml(stack, wGo(t, { glow: o.glowGo }), o) + '<main class="b-wl__main b-wl__main--' + t.v + '">' + wBody(t, o) + '</main>';
}

/* ---------- Bộ điều khiển một lượt đi ---------- */
function wapp(host, ctx, cfg) {
  var S = { stack: cfg.stack.map(wEntry), mode: cfg.mode || 'explore' }, keyFn = null, rap = null, ro = null;
  S.stack.forEach(function (e) { e.mode = S.mode; });
  ctx.onKey(function (e) { if (host.isConnected && keyFn) keyFn(e); });
  var scr = host.closest('.scr') || host;
  function top() { return S.stack[S.stack.length - 1]; }
  function push(e) { e = wEntry(e); e.mode = S.mode; S.stack.push(e); if (S.stack.length > 4) S.stack.shift(); render('[data-wback]'); cfg.onNav && cfg.onNav(S.stack); }
  function back() { if (S.stack.length > 1) { S.stack.pop(); render('[data-wback]:not([disabled]), .b-crumb.is-now'); cfg.onNav && cfg.onNav(S.stack); } }
  function close() { RAP_STOPS.forEach(function (f) { f(); }); if (cfg.onClose) cfg.onClose(); else wtoast(scr, 'Đã đóng — về Sổ từ.'); }
  function render(focusSel) {
    RAP_STOPS.forEach(function (f) { try { f(); } catch (e) {} }); RAP_STOPS = [];
    var t = top(); host.innerHTML = wFrame(S.stack, S.mode, cfg.view || {}); host.setAttribute('data-view', t.v);
    rap = null; var re = host.querySelector('[data-rap]'); if (re) rap = wireRap(re, { onTr: function (on) { t.tr = on; } });
    mount(t);
    var f = focusSel && host.querySelector(focusSel); if (f) f.focus({ preventScroll: true });
    if (ro) ro.disconnect(); requestAnimationFrame(function () { wxLines(host); famLines(host); });
    if (window.ResizeObserver) { ro = new ResizeObserver(function () { wxLines(host); famLines(host); }); ro.observe(host); }
  }
  function common(t) {
    var c = host.querySelector('[data-wclose]'); c && c.addEventListener('click', close);
    var b = host.querySelector('[data-wback]'); b && b.addEventListener('click', back);
    host.querySelectorAll('[data-crumb]').forEach(function (x) { x.addEventListener('click', function () { S.stack = S.stack.slice(0, +x.dataset.crumb + 1); render('.b-crumb.is-now'); }); });
    host.querySelectorAll('[data-wl-fam]').forEach(function (x) { x.addEventListener('click', function () { var fk = x.dataset.wlFam, prev = S.stack[S.stack.length - 2]; if (t.v === 'build' && prev && prev.v === 'fam' && prev.k === fk) back(); else push({ v: 'fam', k: fk, hl: t.v === 'wx' ? t.k : null }); }); });
    var ex = host.querySelector('[data-exit]'); ex && ex.addEventListener('click', function () { lexit(ctx, wProgress(t)[1] - wProgress(t)[0]); });
  }
  function refocus(sel) { var f = host.querySelector(sel); f && f.focus({ preventScroll: true }); }
  function mount(t) {
    common(t);
    var rp = host.querySelector('[data-replay]'), hn = host.querySelector('[data-hint]'), mn = host.querySelector('[data-main]');
    var base = function (e) {
      if (rap && rap.key(e)) return true;
      if (e.key === 'Backspace' && !typing() && S.mode === 'explore') { e.preventDefault(); back(); return true; }
      if (e.key === 'Escape') { e.preventDefault(); if (S.mode === 'explore') close(); else lexit(ctx, wProgress(t)[1] - wProgress(t)[0]); return true; }
      return false;
    };
    if (t.v === 'wx') mountWx(t, rp, hn, mn, base);
    else if (t.v === 'fam') mountFam(t, rp, hn, mn, base);
    else mountBuild(t, rp, hn, mn, base);
  }
  /* --- Khám phá từ --- */
  function mountWx(t, rp, hn, mn, base) {
    var d = WX[t.k], n = d.branches.length;
    function allOpen() { return t.open.filter(Boolean).length === n; }
    function nextClosed() { for (var q = 0; q < n; q++) if (!t.open[q]) return q; return 0; }
    function choose(i) {
      if (i < 0 || i >= n) return; var b = d.branches[i];
      if (t.open[i]) { lsay(b.q + ' ' + b.sent[0], .82); return; }
      if (S.mode === 'explore') { t.open[i] = true; render('[data-bq="' + i + '"]'); lsay(b.q + ' ' + b.sent[0], .82); if (allOpen()) ctx.later(function () { t.done = true; render('[data-rap-play]'); }, 1400); return; }
      t.ask = i; t.sel = -1; t.dim = -1; t.wrong = -1; t.tries = 0; render('[data-opt="0"]'); lsay(b.q, .8);
    }
    function pick(j) { var b = d.branches[t.ask]; if (!b || j >= b.opts.length || t.dim === j) return; t.sel = j; t.wrong = -1; render('[data-opt="' + j + '"]'); lsay(WX_OPT[b.opts[j]] || b.opts[j], .85); }
    function check() {
      if (t.done) { if (cfg.onNext) cfg.onNext(); else { t.done = false; t.open = []; render(); } return; }
      var i = t.ask, b = d.branches[i]; if (i < 0 || t.sel < 0) return;
      var card = host.querySelector('[data-opt="' + t.sel + '"]');
      if (t.sel === b.a) {
        t.open[i] = true; t.ask = -1; var last = allOpen();
        lok(scr, ctx, { card: card, from: card, title: last ? 'Cậu mở đủ ' + n + ' nhánh rồi!' : 'Đúng rồi! Giỏi quá!', detail: speak(b.sent[0], 's') + '<b class="en" style="font-size:22px" lang="en">' + b.sent[0] + '</b><span class="b-muted">' + b.sent[1] + '</span>', say: b.sent[0],
          onNext: function () { if (last) t.done = true; render(last ? '[data-rap-play]' : '[data-bq="' + nextClosed() + '"]'); } });
        ctx.later(function () { lsetProg(scr, t.open.filter(Boolean).length, n); }, 700);
      } else {
        t.tries++; t.wrong = t.sel;
        lretry(scr, ctx, { card: card, tries: t.tries, title: 'Chưa đúng rồi, thử hình khác nhé!', detail: 'Bông hỏi: <b lang="en">' + esc(b.q) + '</b> (' + b.qvi + ')',
          onRetry: function () { t.sel = -1; t.wrong = -1; if (t.tries >= 2 && t.dim < 0) t.dim = b.opts.map(function (_, j) { return j; }).filter(function (j) { return j !== b.a; })[0]; render('.b-wx__opt:not([disabled])'); } });
      }
    }
    function hint() { if (t.ask >= 0) { var b = d.branches[t.ask]; if (t.dim < 0) { t.dim = b.opts.map(function (_, j) { return j; }).filter(function (j) { return j !== b.a; })[0]; render('.b-wx__opt:not([disabled])'); } lsay(b.q, .7); } else if (!allOpen()) choose(nextClosed()); }
    function replay(btnEl) { if (t.ask >= 0) lsay(d.branches[t.ask].q, .8, btnEl); else lsay(d.word + '. ' + d.ex, .8, btnEl); }
    host.querySelectorAll('[data-bq]').forEach(function (x) { x.addEventListener('click', function () { choose(+x.dataset.bq); }); });
    host.querySelectorAll('[data-opt]').forEach(function (x) { x.addEventListener('click', function () { if (!x.disabled) pick(+x.dataset.opt); }); });
    rp && rp.addEventListener('click', function () { replay(rp); }); hn && hn.addEventListener('click', hint); mn && mn.addEventListener('click', check);
    var dg = host.querySelector('[data-wdiag]'); dg && dg.addEventListener('click', function () { t.diagram = true; render('[data-wdone]'); });
    var dn = host.querySelector('[data-wdone]'); dn && dn.addEventListener('click', function () { t.diagram = false; render('[data-wdiag]'); });
    var pr = host.querySelector('[data-wprint]'); pr && pr.addEventListener('click', function () { wtoast(scr, 'Mở bản in Khám phá từ “' + d.word + '” (khổ A4, trắng đen).'); });
    var al = host.querySelector('[data-along]'); al && al.addEventListener('click', function () { t.along = t.along ? null : 'idle'; render(t.along ? '[data-mic]' : '[data-along]'); if (t.along) lsay(d.ex, .8); });
    var mic = host.querySelector('[data-mic]'); mic && mic.addEventListener('click', function () { if (t.along === 'rec') return; t.along = 'rec'; render('[data-mic]'); ctx.later(function () { if (top() === t && t.along === 'rec') { t.along = 'ok'; render('[data-mic]'); } }, 1600); });
    keyFn = function (e) {
      if (e.key === 'Escape' && t.ask >= 0) { e.preventDefault(); var was = t.ask; t.ask = -1; t.sel = -1; render('[data-bq="' + was + '"]'); return; }
      if (base(e)) return; if (typing()) return;
      if (t.done && !t.diagram) { if (e.key === ' ' && document.activeElement === mic) return; if (e.key === 'Enter' && mn && document.activeElement === document.body) { e.preventDefault(); check(); } return; }
      if (/^[1-6]$/.test(e.key)) { e.preventDefault(); var v = +e.key - 1; if (t.ask >= 0 && v < d.branches[t.ask].opts.length) pick(v); else if (t.ask < 0) choose(v); return; }
      if ((e.key === ' ' || e.code === 'Space') && !(document.activeElement && document.activeElement.tagName === 'BUTTON' && !document.activeElement.closest('.lesson-foot'))) { e.preventDefault(); replay(rp); return; }
      if ((e.key === 'h' || e.key === 'H') && S.mode === 'lesson' && !t.done) { e.preventDefault(); hint(); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { var a = document.activeElement, nd = a && a.closest('.b-wx__node'); if (nd) { e.preventDefault(); var j = +nd.dataset.b + (e.key === 'ArrowDown' ? 1 : -1); if (j >= 0 && j < n) refocus('[data-bq="' + j + '"]'); } return; }
      if (e.key === 'Enter' && S.mode === 'lesson') { var ae = document.activeElement; if (ae && ae.tagName === 'BUTTON' && !ae.hasAttribute('data-main') && !ae.hasAttribute('data-opt')) return; e.preventDefault(); check(); }
    };
  }
  /* --- Họ vần --- */
  function mountFam(t, rp, hn, mn, base) {
    var f = FAM[t.k], learned = f.members.filter(function (m) { return m[4]; });
    function heard(w) { t.heard[w] = true; var c = host.querySelector('[data-fw="' + w + '"]'); if (c && !c.classList.contains('is-heard')) { c.classList.add('is-heard'); c.insertAdjacentHTML('beforeend', '<span class="b-fam__tick" aria-hidden="true">' + icon('check', 16) + '</span>'); }
      var pr = wProgress(t); if (S.mode === 'lesson') { lsetProg(scr, pr[0], pr[1]); if (mn) mn.disabled = pr[0] < pr[1]; } if (t.next === w) { t.next = null; c && c.classList.remove('is-glow'); } }
    function playAll(btnEl) { var cards = host.querySelectorAll('.b-fam__card'), i = 0; host.querySelector('[data-fhub]').classList.add('is-playing');
      (function nx() { cards.forEach(function (c) { c.classList.remove('is-playing'); }); if (i >= f.members.length || !host.isConnected) { var h = host.querySelector('[data-fhub]'); h && h.classList.remove('is-playing'); return; } var m = f.members[i++], c = host.querySelector('[data-fw="' + m[0] + '"]'); c.classList.add('is-playing'); lsay(m[0], .8); heard(m[0]); ctx.later(nx, 950); })(); }
    host.querySelectorAll('[data-fsay]').forEach(function (x) { x.addEventListener('click', function () { lsay(x.dataset.fsay, .8, x); heard(x.dataset.fsay); }); });
    host.querySelector('[data-fhub]').addEventListener('click', function () { lsay(f.rime, .7); ctx.later(playAll, 700); });
    host.querySelectorAll('[data-fbuild]').forEach(function (x) { x.addEventListener('click', function () { push({ v: 'build', k: f.build, target: x.dataset.fbuild }); }); });
    host.querySelectorAll('[data-fexp]').forEach(function (x) { x.addEventListener('click', function () { var prev = S.stack[S.stack.length - 2]; if (prev && prev.v === 'wx' && prev.k === x.dataset.fexp) back(); else push({ v: 'wx', k: x.dataset.fexp }); }); });
    function hint() { var nx = learned.filter(function (m) { return !t.heard[m[0]]; })[0]; if (!nx) return; t.next = nx[0]; host.querySelectorAll('.b-fam__card').forEach(function (c) { c.classList.toggle('is-glow', c.dataset.fw === nx[0]); }); refocus('[data-fsay="' + nx[0] + '"]'); }
    rp && rp.addEventListener('click', function () { playAll(rp); }); hn && hn.addEventListener('click', hint);
    mn && mn.addEventListener('click', function () { lok(scr, ctx, { from: host.querySelector('[data-fhub]'), title: 'Cậu đã nghe cả họ -' + f.rime + '!', detail: '<b class="en" lang="en" style="font-size:22px">' + learned.map(function (m) { return m[0]; }).join(', ') + '</b><span class="b-muted">cùng vần ' + f.ipa + '</span>', onNext: function () { t.heard = {}; render(); } }); });
    keyFn = function (e) {
      if (base(e)) return; if (typing()) return;
      if ((e.key === ' ' || e.code === 'Space') && !(document.activeElement && document.activeElement.tagName === 'BUTTON' && !document.activeElement.closest('.lesson-foot'))) { e.preventDefault(); playAll(rp); return; }
      if ((e.key === 'h' || e.key === 'H') && S.mode === 'lesson') { e.preventDefault(); hint(); return; }
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var all = Array.prototype.slice.call(host.querySelectorAll('[data-fsay]')), i = all.indexOf(document.activeElement); if (i > -1) { e.preventDefault(); all[(i + (e.key === 'ArrowRight' ? 1 : all.length - 1)) % all.length].focus(); } return; }
      if (e.key === 'Enter' && S.mode === 'lesson' && mn && !mn.disabled) { var ae = document.activeElement; if (ae && ae.tagName === 'BUTTON' && !ae.hasAttribute('data-main')) return; e.preventDefault(); mn.click(); }
    };
  }
  /* --- Ghép chữ đầu --- */
  function mountBuild(t, rp, hn, mn, base) {
    var b = BUILD[t.k], pend = '', pendT = null;
    function place(l) { if (t.state !== 'idle' && t.state !== 'fake' && t.state !== 'again' && t.state !== 'ok') return; t.slot = l; t.state = 'idle'; t.hint = null; t.msg = ''; render(S.mode === 'lesson' ? '[data-main]' : '[data-slot]'); lsay(l.length > 1 ? l : l, .8); if (S.mode === 'explore') ctx.later(check, 450); }
    function check() {
      if (!t.slot) return; var w = t.slot + b.rime, real = b.real[w];
      if (real && t.found.indexOf(w) < 0) { t.found.push(w); t.state = 'ok'; if (t.target === w) t.target = null; lsay(w, .8);
        var goal = t.found.length === b.goal; render('[data-letter="' + t.slot + '"]');
        var chip = host.querySelector('.b-bd__found li:nth-child(' + t.found.length + ') .b-bd__chip'); chip && chip.classList.add('is-new'); ctx.burst(host.querySelector('[data-slot]'), chip, 8);
        if (S.mode === 'lesson') lsetProg(scr, Math.min(t.found.length, b.goal), b.goal);
        if (goal) ctx.later(function () { if (S.mode === 'lesson') lgameEnd(scr, { correct: b.goal, total: b.goal, stars: 3, coins: 20, title: 'Cậu ghép đủ ' + b.goal + ' từ rồi!', note: 'Các từ: ' + t.found.join(', ') + '.', onNext: function () { if (cfg.onNext) cfg.onNext(); else { t.found = []; t.slot = null; t.state = 'idle'; render(); } } }); else wtoast(scr, 'Tìm đủ ' + b.goal + ' từ rồi! Bấm một từ trong “Đã tìm được” để khám phá.'); }, 900);
      } else if (real) { t.state = 'again'; render('[data-letter="' + t.slot + '"]'); lsay(w, .8); }
      else { t.state = 'fake'; render('[data-letter="' + t.slot + '"]'); }
      ctx.later(function () { if (top() === t && t.state !== 'idle') { t.state = 'idle'; t.slot = null; var a = document.activeElement, sel = a && a.dataset && a.dataset.letter ? '[data-letter="' + a.dataset.letter + '"]' : null; render(sel); } }, t.state === 'fake' ? 2400 : 1900);
    }
    function hint() { var ons = buildOnsets(t.k, t.target), l = ons.filter(function (x) { return b.real[x + b.rime] && t.found.indexOf(x + b.rime) < 0; })[0]; if (!l) return; t.hint = l; render('[data-letter="' + l + '"]'); }
    host.querySelectorAll('[data-letter]').forEach(function (x) {
      x.addEventListener('click', function () { if (x.__dragged) { x.__dragged = false; return; } place(x.dataset.letter); });
      x.addEventListener('pointerdown', function (e) {
        if (e.button !== 0) return; var s = wscale(x), sx = e.clientX, sy = e.clientY, gh = null, slot = host.querySelector('[data-slot]');
        function mv(ev) { var dx = (ev.clientX - sx) / s, dy = (ev.clientY - sy) / s; if (!gh && Math.abs(dx) + Math.abs(dy) < 8) return;
          if (!gh) { gh = x.cloneNode(true); gh.classList.add('is-ghost'); gh.removeAttribute('data-letter'); gh.setAttribute('aria-hidden', 'true'); x.parentNode.appendChild(gh); var r = wrel(x, x.offsetParent); gh.style.left = r.x + 'px'; gh.style.top = r.y + 'px'; x.classList.add('is-lifted'); }
          gh.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(-4deg)'; var sr = slot.getBoundingClientRect(); slot.classList.toggle('is-over', ev.clientX > sr.left && ev.clientX < sr.right && ev.clientY > sr.top && ev.clientY < sr.bottom); }
        function up(ev) { document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up); if (!gh) return; x.__dragged = true; var on = slot.classList.contains('is-over'); gh.remove(); x.classList.remove('is-lifted'); slot.classList.remove('is-over'); if (on) place(x.dataset.letter); setTimeout(function () { x.__dragged = false; }, 0); }
        document.addEventListener('pointermove', mv); document.addEventListener('pointerup', up);
      });
    });
    host.querySelectorAll('[data-fopen]').forEach(function (x) { x.addEventListener('click', function () { var i = -1; S.stack.forEach(function (e, j) { if (e.v === 'wx' && e.k === x.dataset.fopen) i = j; }); if (i > -1) { S.stack = S.stack.slice(0, i + 1); render('.b-crumb.is-now'); } else push({ v: 'wx', k: x.dataset.fopen }); }); });
    rp && rp.addEventListener('click', function () { lsay(t.slot ? t.slot + b.rime : b.rime, .75, rp); }); hn && hn.addEventListener('click', hint); mn && mn.addEventListener('click', check);
    keyFn = function (e) {
      if (typing()) return;
      if (e.key === 'Backspace' && t.slot && t.state === 'idle') { e.preventDefault(); t.slot = null; render('[data-slot]'); return; }
      if (e.key === 'Delete' && t.slot) { e.preventDefault(); t.slot = null; t.state = 'idle'; render(); return; }
      if (base(e)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var ons = buildOnsets(t.k, t.target);
      if (/^[a-z]$/i.test(e.key)) {
        var c = e.key.toLowerCase(), cand = pend + c; e.preventDefault(); clearTimeout(pendT);
        if (ons.some(function (o) { return o !== cand && o.indexOf(cand) === 0; })) { pend = cand; pendT = setTimeout(function () { if (ons.indexOf(pend) > -1) place(pend); pend = ''; }, 700); return; }
        pend = ''; if (ons.indexOf(cand) > -1) place(cand); else if (ons.indexOf(c) > -1) place(c); else { t.msg = '<b lang="en">' + c + '</b> không có trong hàng chữ. Chọn một chữ có sẵn nhé.'; render(); }
        return;
      }
      if (e.key === '?' && S.mode === 'lesson') { e.preventDefault(); hint(); return; }
      if ((e.key === ' ' || e.code === 'Space') && !(document.activeElement && document.activeElement.tagName === 'BUTTON' && !document.activeElement.closest('.lesson-foot'))) { e.preventDefault(); lsay(t.slot ? t.slot + b.rime : b.rime, .75, rp); return; }
      if (e.key === 'Enter' && S.mode === 'lesson' && mn && !mn.disabled) { var ae = document.activeElement; if (ae && ae.tagName === 'BUTTON' && !ae.hasAttribute('data-main')) return; e.preventDefault(); check(); }
    };
  }
  render(cfg.focus || (cfg.noFocus ? null : { wx: '.b-wx__node:not(.is-open) [data-bq], [data-rap-play]', fam: '[data-fhub]', build: '.b-bd__tile' }[top().v]));
  return { push: push, back: back, render: render, stack: function () { return S.stack; } };
}

window.Bong.W = { wx: WX, fam: FAM, build: BUILD, opt: WX_OPT, gloss: WGLOSS, pic: wpic, rimeWord: rimeWord,
  explorer: wxHtml, lines: wxLines, famLines: famLines, family: famHtml, builder: buildHtml, paragraph: rapHtml, wireParagraph: wireRap, links: linksHtml, linkBtn: linkBtn, crumb: crumbLabel,
  frame: wFrame, entry: wEntry, app: wapp, toast: wtoast, para: wxPara };
window.Bong.ReadAloudParagraph = rapHtml; window.Bong.WordLinks = linksHtml;

/* =====================================================================
   KHU NGƯỜI LỚN · ĐỢT 6 — mục menu “Họ vần” (không đổi menu cũ, không đổi shell2)
   Bong.A.shell3(o): như shell2, thêm “Họ vần” ngay sau “Ngân hàng từ vựng” (nhãn “Mới”).
   ===================================================================== */
function ashell3(o) {
  var on = o.active === 'families', h = ashell2(Object.assign({}, o, { active: on ? '__none' : o.active }));
  var item = '<a href="#" class="a-nav__item' + (on ? ' is-on' : '') + '"' + (on ? ' aria-current="page"' : '') + ' data-gd2>' + icon('family', 20) + '<span>Họ vần</span><span class="a-nav__new">Mới</span></a>';
  var i = h.indexOf('<span>Ngân hàng từ vựng</span>'); if (i < 0) return h; var j = h.indexOf('</a>', i) + 4;
  return h.slice(0, j) + item + h.slice(j);
}
window.Bong.A.shell3 = ashell3;

})();

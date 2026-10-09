// Chạy: node scripts/make-background-music.mjs public/media/music/nhac-nen-nhe.wav
// Tạo nhạc nền nhẹ cho bài học: giai điệu hộp nhạc trên nền 4 hợp âm (Am – F – C – G), tự soạn bằng code nên không vướng bản quyền.
// Mọi nốt được ghi vòng quanh bộ đệm nên phần đuôi nối liền phần đầu: lặp lại không bị ngắt.
import fs from "node:fs";

const RATE = 22050;
const BPM = 84;
const BEAT = 60 / BPM;
const BARS = 16;
const BEATS = BARS * 4;
const N = Math.round(BEATS * BEAT * RATE);
const buf = new Float64Array(N);

// PRNG cố định để lần nào tạo ra cũng cùng một bài.
let seed = 20261009;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);

function add(t0, freq, length, gain, { attack = 0.01, decay = 3, harmonics = [[1, 1]] } = {}) {
  const start = Math.round(t0 * RATE);
  const total = Math.round(length * RATE);
  for (let i = 0; i < total; i++) {
    const t = i / RATE;
    const env = Math.min(1, t / attack) * Math.exp(-decay * t) * Math.min(1, (length - t) / 0.05);
    let s = 0;
    for (const [mult, amp] of harmonics) s += amp * Math.sin(2 * Math.PI * freq * mult * t);
    buf[(start + i) % N] += s * env * gain;
  }
}

// Am – F – C – G, mỗi hợp âm một ô nhịp.
const CHORDS = [
  { root: 110, tones: [220, 261.63, 329.63] },
  { root: 87.31, tones: [174.61, 220, 261.63] },
  { root: 130.81, tones: [261.63, 329.63, 392] },
  { root: 98, tones: [196, 246.94, 293.66] },
];
const PENTA = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25, 783.99];

// Nền hợp âm êm (ba nốt, vào chậm) và nốt trầm nhẹ ở phách 1 và 3.
for (let bar = 0; bar < BARS; bar++) {
  const c = CHORDS[bar % 4];
  const t0 = bar * 4 * BEAT;
  for (const f of c.tones) add(t0, f, 4 * BEAT + 0.4, 0.07, { attack: 0.5, decay: 0.35, harmonics: [[1, 1], [2, 0.15]] });
  add(t0, c.root, 1.8 * BEAT, 0.12, { attack: 0.02, decay: 1.8, harmonics: [[1, 1], [2, 0.2]] });
  add(t0 + 2 * BEAT, c.root * 1.5, 1.5 * BEAT, 0.08, { attack: 0.02, decay: 2, harmonics: [[1, 1]] });
}

// Giai điệu hộp nhạc: nốt phách (tám nốt mỗi ô nhịp), bước nhỏ trên thang năm âm, hay rơi vào nốt của hợp âm.
let pos = 4;
for (let bar = 0; bar < BARS; bar++) {
  const c = CHORDS[bar % 4];
  const chordNotes = PENTA.map((f, i) => ({ f, i })).filter(({ f }) => c.tones.some((t) => Math.abs(Math.log2(f / t) % 1) < 0.02 || Math.abs(Math.log2(f / t) % 1) > 0.98));
  for (let step = 0; step < 8; step++) {
    const rest = step % 4 === 3 && rand() < 0.45;
    if (rest) continue;
    const t = bar * 4 * BEAT + step * 0.5 * BEAT;
    if (step % 4 === 0 && chordNotes.length) {
      // phách mạnh: nhảy tới nốt hợp âm gần nhất
      pos = chordNotes.reduce((best, n) => (Math.abs(n.i - pos) < Math.abs(best.i - pos) ? n : best)).i;
    } else {
      pos = Math.min(PENTA.length - 1, Math.max(1, pos + [-2, -1, -1, 1, 1, 2][Math.floor(rand() * 6)]));
    }
    add(t, PENTA[pos], 1.6, 0.16, { attack: 0.004, decay: 3.2, harmonics: [[1, 1], [2, 0.28], [3, 0.1]] });
  }
}

// Chuẩn hóa độ to (trong app còn nhân với âm lượng của bé và hệ số nhạc nền).
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(buf[i]));
const scale = 0.85 / peak;

const out = Buffer.alloc(44 + N * 2);
out.write("RIFF", 0);
out.writeUInt32LE(36 + N * 2, 4);
out.write("WAVEfmt ", 8);
out.writeUInt32LE(16, 16);
out.writeUInt16LE(1, 20);
out.writeUInt16LE(1, 22);
out.writeUInt32LE(RATE, 24);
out.writeUInt32LE(RATE * 2, 28);
out.writeUInt16LE(2, 32);
out.writeUInt16LE(16, 34);
out.write("data", 36);
out.writeUInt32LE(N * 2, 40);
for (let i = 0; i < N; i++) out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, buf[i] * scale)) * 32767), 44 + i * 2);
fs.writeFileSync(process.argv[2], out);
console.log(`Đã tạo ${process.argv[2]}: ${(N / RATE).toFixed(1)} giây, ${(out.length / 1024 / 1024).toFixed(2)} MB`);

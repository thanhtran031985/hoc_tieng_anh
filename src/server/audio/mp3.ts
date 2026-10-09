import { Mp3Encoder } from "@breezystack/lamejs";

const FRAME = 1152;
const KBPS = 64;

/** Mã hóa âm thanh đơn kênh (số thực -1…1) thành tệp mp3. */
export function encodeMp3(samples: Float32Array, sampleRate: number): Buffer {
  const pcm = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) pcm[i] = Math.round(Math.max(-1, Math.min(1, samples[i])) * 32767);
  const encoder = new Mp3Encoder(1, sampleRate, KBPS);
  const parts: Buffer[] = [];
  for (let i = 0; i < pcm.length; i += FRAME) {
    const block = encoder.encodeBuffer(pcm.subarray(i, i + FRAME));
    if (block.length > 0) parts.push(Buffer.from(block));
  }
  const tail = encoder.flush();
  if (tail.length > 0) parts.push(Buffer.from(tail));
  return Buffer.concat(parts);
}

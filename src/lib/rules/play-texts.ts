// Các câu/đoạn chữ mà một câu hỏi dạng mới sẽ đọc to (hàm thuần): dùng để tạo và tra giọng đọc mp3 theo chữ (`audio_clips`, task 19).
// Phải khớp đúng chữ mà từng bước gọi `playPronunciation`: câu gốc, câu điền đủ từ, phần câu còn lại khi chưa điền, từng câu của bài đọc…
// Import tương đối có đuôi .ts để Node chạy thẳng được (script, test).
import { parseExtraQuestion } from "../schemas/question-extra.ts";
import { fillSentence, splitBlank } from "./grading/fill-blank.ts";
import { splitPassage } from "./grading/reading.ts";
import { TTS_MAX_CHARS, audioKey, spokenText } from "./tts.ts";

const squash = (text: string) => text.replace(/\s+/g, " ").trim();

/** Mọi chữ cần giọng đọc của một câu hỏi dạng mới (không trùng, bỏ chữ rỗng hoặc quá dài). Dạng lạ hoặc dữ liệu hỏng thì rỗng. */
export function extraQuestionTexts(type: string, prompt: unknown, options: unknown, answer: unknown): string[] {
  const data = parseExtraQuestion(type, { prompt, options, answer });
  if (!data) return [];
  const out: string[] = [];
  switch (type) {
    case "phonics":
    case "sentence_order":
    case "dictation":
    case "speaking":
      out.push((data.prompt as { text: string }).text);
      break;
    case "fill_blank": {
      const d = data as { prompt: { text: string }; options: { cards: string[] }; answer: { correct: number } };
      const parts = splitBlank(d.prompt.text);
      if (parts) {
        out.push(fillSentence(d.prompt.text, d.options.cards[d.answer.correct]));
        out.push(squash(`${parts.before} ${parts.after}`));
      }
      break;
    }
    case "short_reading": {
      const d = data as { prompt: { text: string }; options: { questions: { text: string; choices: string[] }[] } };
      out.push(...splitPassage(d.prompt.text));
      for (const q of d.options.questions) out.push(q.text, ...q.choices);
      break;
    }
  }
  const seen = new Set<string>();
  return out.map(spokenText).filter((t) => t.length > 0 && t.length <= TTS_MAX_CHARS && !seen.has(audioKey(t)) && seen.add(audioKey(t)));
}

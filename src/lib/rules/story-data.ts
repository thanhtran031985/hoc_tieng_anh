// Truyện tranh mẫu “Tom’s Red Kite” (Screen24, task 16): 6 trang truyện và 1 trang câu hỏi sau trang 3. Nạp bằng prisma/seed/stories.ts.
// Import tương đối có đuôi .ts để Node chạy thẳng được (seed, test).

export type StorySeedPage =
  | { kind: "page"; image: string; sentences: readonly string[] }
  | { kind: "question"; text: string; choices: readonly [string, string, string]; correct: 0 | 1 | 2 };

export type StorySeed = {
  slug: string;
  title: string;
  titleVi: string;
  levelNumber: number;
  /** Khóa của chủ đề (units.slug) trong cấp; không thấy thì để trống. */
  unitSlug: string;
  newWords: readonly string[];
  pages: readonly StorySeedPage[];
};

const art = (n: number) => `/media/stories/toms-red-kite-${n}.svg`;

export const STORY_SEED: readonly StorySeed[] = [
  {
    slug: "toms-red-kite",
    title: "Tom’s Red Kite",
    titleVi: "Cái diều đỏ của Tom",
    levelNumber: 3,
    unitSlug: "hobbies-music",
    newWords: ["kite", "park", "wind", "tree", "help", "happy"],
    pages: [
      { kind: "page", image: art(1), sentences: ["This is Tom.", "He has a red kite."] },
      { kind: "page", image: art(2), sentences: ["Tom and Dad go to the park."] },
      { kind: "page", image: art(3), sentences: ["The wind is strong.", "The kite flies up, up, up!"] },
      { kind: "question", text: "What colour is Tom’s kite?", choices: ["blue", "red", "yellow"], correct: 1 },
      { kind: "page", image: art(4), sentences: ["Oh no!", "The kite is in the tree."] },
      { kind: "page", image: art(5), sentences: ["Dad helps Tom.", "He gets the kite."] },
      { kind: "page", image: art(6), sentences: ["Tom is happy.", "Thank you, Dad!"] },
    ],
  },
];

/** Dữ liệu `questions` của trang câu hỏi giữa truyện (type `story_question`). */
export function storyQuestionFields(page: Extract<StorySeedPage, { kind: "question" }>) {
  const ids = ["a", "b", "c"] as const;
  return {
    prompt: { text: page.text },
    options: page.choices.map((text, i) => ({ id: ids[i], text })),
    answer: { correct: [ids[page.correct]] },
  };
}

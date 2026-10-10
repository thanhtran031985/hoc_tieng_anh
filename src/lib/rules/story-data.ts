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

const artOf = (slug: string) => (n: number) => `/media/stories/${slug}-${n}.svg`;
const art = artOf("toms-red-kite");

export const STORY_SEED: readonly StorySeed[] = [
  {
    slug: "my-cat-mimi",
    title: "My Cat Mimi",
    titleVi: "Mèo Mimi của tớ",
    levelNumber: 1,
    unitSlug: "animals",
    newWords: ["cat", "fish", "bed", "love", "friend"],
    pages: ((a) => [
      { kind: "page", image: a(1), sentences: ["This is my cat.", "Her name is Mimi."] },
      { kind: "page", image: a(2), sentences: ["Mimi is white and black."] },
      { kind: "page", image: a(3), sentences: ["Mimi likes fish."] },
      { kind: "question", text: "What does Mimi like?", choices: ["fish", "apples", "books"], correct: 0 },
      { kind: "page", image: a(4), sentences: ["Mimi sits on my bed."] },
      { kind: "page", image: a(5), sentences: ["I love Mimi.", "Mimi loves me."] },
      { kind: "page", image: a(6), sentences: ["We are good friends."] },
    ] as const)(artOf("my-cat-mimi")),
  },
  {
    slug: "my-family-day",
    title: "My Family Day",
    titleVi: "Một ngày của gia đình tớ",
    levelNumber: 1,
    unitSlug: "my-family",
    newWords: ["family", "mum", "dad", "brother", "sister"],
    pages: ((a) => [
      { kind: "page", image: a(1), sentences: ["This is my family.", "I have a mum and a dad."] },
      { kind: "page", image: a(2), sentences: ["My brother is big.", "My sister is small."] },
      { kind: "page", image: a(3), sentences: ["Grandma is in the room."] },
      { kind: "question", text: "Who is in the room?", choices: ["Grandma", "Uncle", "Baby"], correct: 0 },
      { kind: "page", image: a(4), sentences: ["We eat apples and bananas."] },
      { kind: "page", image: a(5), sentences: ["My dad plays with the ball."] },
      { kind: "page", image: a(6), sentences: ["I love my family."] },
    ] as const)(artOf("my-family-day")),
  },
  {
    slug: "mums-soup",
    title: "Mum’s Soup",
    titleVi: "Món súp của mẹ",
    levelNumber: 2,
    unitSlug: "food-drink",
    newWords: ["soup", "bread", "sandwich", "milk", "rice"],
    pages: ((a) => [
      { kind: "page", image: a(1), sentences: ["Mum is in the kitchen.", "She makes soup."] },
      { kind: "page", image: a(2), sentences: ["I want some bread.", "Mum gives me a sandwich."] },
      { kind: "page", image: a(3), sentences: ["My brother drinks milk."] },
      { kind: "question", text: "What does Mum make?", choices: ["soup", "pizza", "cake"], correct: 0 },
      { kind: "page", image: a(4), sentences: ["Dad eats rice and fish."] },
      { kind: "page", image: a(5), sentences: ["I eat my sandwich.", "It is very good."] },
      { kind: "page", image: a(6), sentences: ["We are all happy."] },
    ] as const)(artOf("mums-soup")),
  },
  {
    slug: "the-little-fox",
    title: "The Little Fox",
    titleVi: "Chú cáo nhỏ",
    levelNumber: 2,
    unitSlug: "wild-animals",
    newWords: ["fox", "garden", "food", "apple", "jump"],
    pages: ((a) => [
      { kind: "page", image: a(1), sentences: ["A little fox is in the garden."] },
      { kind: "page", image: a(2), sentences: ["The fox wants some food."] },
      { kind: "page", image: a(3), sentences: ["It sees a red apple."] },
      { kind: "question", text: "What does the fox see?", choices: ["a red apple", "a big fish", "a small bird"], correct: 0 },
      { kind: "page", image: a(4), sentences: ["The fox jumps and jumps."] },
      { kind: "page", image: a(5), sentences: ["Now the fox has the apple."] },
      { kind: "page", image: a(6), sentences: ["The fox is happy."] },
    ] as const)(artOf("the-little-fox")),
  },
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
  {
    slug: "a-rainy-day",
    title: "A Rainy Day",
    titleVi: "Một ngày mưa",
    levelNumber: 3,
    unitSlug: "weather-nature",
    newWords: ["rain", "cloud", "coat", "sky", "rainbow"],
    pages: ((a) => [
      { kind: "page", image: a(1), sentences: ["It is a rainy day.", "Anna and her dog look at the sky."] },
      { kind: "page", image: a(2), sentences: ["The sky is grey.", "The clouds are big."] },
      { kind: "page", image: a(3), sentences: ["Anna puts on her coat.", "She wants to go out."] },
      { kind: "question", text: "What does Anna put on?", choices: ["a coat", "a hat", "a shirt"], correct: 0 },
      { kind: "page", image: a(4), sentences: ["Anna and the dog jump in the rain.", "They are very happy."] },
      { kind: "page", image: a(5), sentences: ["Then the sun comes out.", "Look at the rainbow!"] },
      { kind: "page", image: a(6), sentences: ["Anna is happy.", "Her dog is happy too."] },
    ] as const)(artOf("a-rainy-day")),
  },
  {
    slug: "the-lost-wallet",
    title: "The Lost Wallet",
    titleVi: "Chiếc ví bị mất",
    levelNumber: 4,
    unitSlug: "shopping-money",
    newWords: ["wallet", "gift", "dollar", "pocket", "kind"],
    pages: ((a) => [
      { kind: "page", image: a(1), sentences: ["Ben is at the shopping centre.", "He has a new wallet."] },
      { kind: "page", image: a(2), sentences: ["He buys a gift for his mum.", "It costs ten dollars."] },
      { kind: "page", image: a(3), sentences: ["Oh no!", "His wallet is not in his bag."] },
      { kind: "question", text: "Where is Ben?", choices: ["At the shopping centre", "At school", "At the zoo"], correct: 0 },
      { kind: "page", image: a(4), sentences: ["He looks in his bag and in his pocket."] },
      { kind: "page", image: a(5), sentences: ["A girl runs to him.", "She has his wallet!"] },
      { kind: "page", image: a(6), sentences: ["“Thank you!” says Ben.", "“You are very kind.”"] },
    ] as const)(artOf("the-lost-wallet")),
  },
  {
    slug: "the-little-dragon",
    title: "The Little Dragon",
    titleVi: "Chú rồng nhỏ",
    levelNumber: 4,
    unitSlug: "stories-adventure",
    newWords: ["dragon", "castle", "giant", "king", "hero"],
    pages: ((a) => [
      { kind: "page", image: a(1), sentences: ["A little dragon lives in a big castle."] },
      { kind: "page", image: a(2), sentences: ["The king and queen do not like him."] },
      { kind: "page", image: a(3), sentences: ["One day a giant comes to the kingdom."] },
      { kind: "question", text: "Who comes to the kingdom?", choices: ["A giant", "A pirate", "A witch"], correct: 0 },
      { kind: "page", image: a(4), sentences: ["The little dragon fights the giant."] },
      { kind: "page", image: a(5), sentences: ["The giant runs to the forest."] },
      { kind: "page", image: a(6), sentences: ["The king says, “Thank you!”", "Now the dragon is a hero."] },
    ] as const)(artOf("the-little-dragon")),
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

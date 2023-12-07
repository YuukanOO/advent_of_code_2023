import { readLines } from "../helper.ts";

const lines = await readLines("input.txt");

// Mapping between cards name and value (needed to determine the rank when comparing individual
// cards)
const cards = {
  "2": 0,
  "3": 1,
  "4": 2,
  "5": 3,
  "6": 4,
  "7": 5,
  "8": 6,
  "9": 7,
  T: 8,
  J: 9,
  Q: 10,
  K: 11,
  A: 12,
};

type Card = keyof typeof cards;

// Hand pattern from strongest to weakest
const patterns = [
  [1, 1, 1, 1, 1],
  [1, 1, 1, 2],
  [1, 2, 2],
  [1, 1, 3],
  [2, 3],
  [1, 4],
  [5],
];

type Hand = {
  hand: Card[];
  power: number;
  bid: number;
};

const data = lines.map<Hand>((l) => {
  const [handStr, bid] = l.split(" ");
  const hand = Array.from<Card>(handStr as any);
  const pattern = Array.from(new Set(hand))
    .map((card) => hand.filter((c) => c === card).length)
    .sort();
  const power = patterns.findIndex((p) =>
    pattern.every((pp, i) => p[i] === pp)
  );

  return {
    hand,
    power,
    bid: parseInt(bid),
  };
});

const chapterOne = data
  .sort((a, b) => {
    let diff = a.power - b.power;

    if (diff !== 0) {
      return diff;
    }

    // Same hand power, check the first non equal card value
    for (let i = 0; i < a.hand.length; i++) {
      diff = cards[a.hand[i]] - cards[b.hand[i]];

      if (diff !== 0) {
        return diff;
      }
    }

    throw new Error("could not determine order");
  })
  .reduce((sum, h, i) => sum + h.bid * (i + 1), 0);

console.log(chapterOne);

import { readLines } from "../helper.ts";

const lines = await readLines("input.txt");

// Mapping between cards name and value (needed to determine the rank when comparing individual
// cards)
const cards = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

type Card = keyof typeof cards;

// Hand pattern from weakest to strongest
const patterns = [
  [1, 1, 1, 1, 1], // High card
  [2, 1, 1, 1], // One pair
  [2, 2, 1], // Two pair
  [3, 1, 1], // Three of a kind
  [3, 2], // Full house
  [4, 1], // Four of a kind
  [5], //Five of a kind
];

type Hand = {
  hand: Card[];
  power: number; // Index of the pattern found in the patterns array
  bid: number;
};

// Sort function to determine the rank of hands based on their power and card values.
function sortByHands(a: Hand, b: Hand): number {
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
}

function totalWinnings(
  lines: string[],
  patternFinder: (hand: Card[]) => number[]
): number {
  return lines
    .map<Hand>((l) => {
      const [handStr, bid] = l.split(" ");
      const hand = Array.from<Card>(handStr as any);
      const pattern = patternFinder(hand);
      const power = patterns.findIndex((p) =>
        pattern.every((pp, i) => p[i] === pp)
      );

      return {
        hand,
        power,
        bid: parseInt(bid),
      };
    })
    .sort(sortByHands)
    .reduce((sum, h, i) => sum + h.bid * (i + 1), 0);
}

const chapterOne = totalWinnings(lines, (hand) =>
  Array.from(new Set(hand))
    .map((card) => hand.filter((c) => c === card).length)
    .sort()
    .reverse()
);

console.log("Chapter one", chapterOne);

// New rule, J is now a Joker and its value is 1
const JOKER = "J";
cards[JOKER] = 1;

const chapterTwo = totalWinnings(lines, (hand) => {
  const cardsOfEachType = Array.from(new Set(hand)).reduce(
    (r, card) => ({
      ...r,
      [card]: hand.filter((c) => c === card).length,
    }),
    {} as Record<Card, number>
  );

  let jokersAvailable = cardsOfEachType[JOKER] ?? 0;
  delete (cardsOfEachType as Record<Card, number | undefined>)[JOKER];

  const pattern = Object.values(cardsOfEachType).sort().reverse();

  if (!jokersAvailable) {
    return pattern;
  }

  // Special case when the hand is full of jokers
  if (jokersAvailable === hand.length) {
    return [hand.length];
  }

  // Each card counts
  for (let i = 0; i < pattern.length; i++) {
    // Each possible patterns from strongest to weakest
    for (let j = patterns.length - 1; j >= 0; j--) {
      // Each pattern card counts
      for (let k = 0; k < patterns[j].length; k++) {
        if (pattern[i] + jokersAvailable >= patterns[j][k]) {
          jokersAvailable -= patterns[j][k] - pattern[i];
          pattern[i] = patterns[j][k];
        }

        if (!jokersAvailable) {
          return pattern;
        }
      }
    }
  }

  throw new Error("not all jokers consumed");
});

console.log("Chapter two", chapterTwo);

import { readLines } from "../helper.ts";

const lines = await readLines("input.txt");

const isNumbers = /\d+/g;

type ScratchCard = { winningNumbersFound: number; quantity: number };

const cards = lines.map<ScratchCard>((line) => {
  const [winningNumbers, havingNumbers] = line
    .substring(line.indexOf(":") + 1)
    .split("|")
    .map((str) => str.match(isNumbers)!.map(Number));

  return {
    winningNumbersFound: havingNumbers.filter((n) => winningNumbers.includes(n))
      .length,
    quantity: 1,
  };
});

const chapterOne = cards
  .filter((card) => card.winningNumbersFound > 0)
  .reduce((r, card) => r + Math.pow(2, card.winningNumbersFound - 1), 0);

console.log(chapterOne);

const chapterTwo = cards
  .map((card, idx) => {
    for (let i = 1; i <= card.winningNumbersFound; i++) {
      cards[idx + i].quantity += card.quantity;
    }
    return card;
  })
  .reduce((qty, card) => qty + card.quantity, 0);

console.log(chapterTwo);

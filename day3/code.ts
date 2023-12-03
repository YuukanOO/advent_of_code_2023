import { readLines } from "../helper.ts";

const lines = await readLines("input.txt");

const GEAR_SYMBOL = "*";
const numbersRe = /(\d+)/g;
const isSymbolRe = /[^.\d\r]/g;

let chapterOne = 0;
let chapterTwo = 0;

function findParts(symbolIdx: number, line: string): number[] {
  const parts: number[] = [];
  const numbers = line.match(numbersRe);

  if (!numbers) {
    return parts;
  }

  let startIdx,
    endIdx = -1;

  for (const number of numbers) {
    startIdx = line.indexOf(number, endIdx + 1);
    endIdx = startIdx + number.length - 1;

    if (
      // Left of symbol
      (startIdx <= symbolIdx && endIdx >= symbolIdx - 1) ||
      // Right of symbol
      (startIdx <= symbolIdx + 1 && endIdx >= symbolIdx)
    ) {
      parts.push(parseInt(number));
    }
  }

  return parts;
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  const symbols = line.match(isSymbolRe);

  if (!symbols) {
    continue;
  }

  let symbolIdx = -1;

  for (const symbol of symbols) {
    symbolIdx = line.indexOf(symbol, symbolIdx + 1);

    const parts = findParts(symbolIdx, lines[i - 1] ?? "").concat(
      findParts(symbolIdx, line),
      findParts(symbolIdx, lines[i + 1] ?? "")
    );

    chapterOne += parts.reduce((sum, part) => sum + part, 0);

    if (symbol !== GEAR_SYMBOL || parts.length !== 2) {
      continue;
    }

    chapterTwo += parts.reduce((cur, p) => cur * p, 1);
  }
}

console.log(chapterOne);
console.log(chapterTwo);

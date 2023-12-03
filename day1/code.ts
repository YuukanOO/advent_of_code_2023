import { readLines } from "../helper.ts";

const lines = await readLines("input.txt");

const wordsToValue: Record<string, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

const firstOfLineRe = /(\d|one|two|three|four|five|six|seven|eight|nine)/;
const lastOfLineRe = /.*(\d|one|two|three|four|five|six|seven|eight|nine).*/;

function parseLine(line: string): number {
  let lineResult = 0;
  const firstMatch = line.match(firstOfLineRe)?.[1];

  if (firstMatch) {
    lineResult = 10 * parseInt(wordsToValue[firstMatch] ?? firstMatch);
  }

  const lastMatch = line.match(lastOfLineRe)?.[1];

  if (lastMatch) {
    lineResult += parseInt(wordsToValue[lastMatch] ?? lastMatch);
  }

  return lineResult;
}

const result = lines.reduce((sum, line) => sum + parseLine(line), 0);
console.log(result);

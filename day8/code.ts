import { readLines } from "../helper.ts";

const lines = await readLines("input.txt");
const nodeRe = /([0-9A-Z]+) = \(([0-9A-Z]+), ([0-9A-Z]+)\)/;

// Convert instructions to indices
const instructions = Array.from(lines[0].trim()).map((c) =>
  c === "L" ? 0 : 1
);

const nodes = lines
  .slice(2)
  .reduce<Record<string, [string, string]>>((r, line) => {
    const [_, key, left, right] = line.match(nodeRe)!;

    return {
      ...r,
      [key]: [left, right],
    };
  }, {});

function findSteps(start: string, endFn: (at: string) => boolean): number {
  let at = start;
  let steps = 0;

  while (!endFn(at)) {
    at = nodes[at][instructions[steps++ % instructions.length]];
  }

  return steps;
}

const chapterOne = findSteps("AAA", (at) => at === "ZZZ");

console.log("Chapter one", chapterOne);

/**
 * I reach to reddit to find the LCM solution for this one but I share the feeling
 * of this post https://www.reddit.com/r/adventofcode/comments/18dh4p8/2023_day_8_part_2_im_a_bit_frustrated/
 * and this one https://www.reddit.com/r/adventofcode/comments/18dfpub/2023_day_8_part_2_why_is_spoiler_correct/
 *
 * Looks like the input is arranged to make the correct "iterative" solution incorrect which
 * is weird.
 */

const starts = Object.keys(nodes).filter((node) => node.endsWith("A"));
const stepsToReachEnd = starts.map((s) =>
  findSteps(s, (at) => at.endsWith("Z"))
);

// retrieved from the Internet (https://decipher.dev/30-seconds-of-typescript/docs/lcm/)
function leastCommonMultiple(...arr: number[]): number {
  const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
  const _lcm = (x: number, y: number): number => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
}

console.log("Chapter two", leastCommonMultiple(...stepsToReachEnd));

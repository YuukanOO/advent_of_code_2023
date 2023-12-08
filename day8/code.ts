import { readLines } from "../helper.ts";

const lines = await readLines("input.txt");
const nodeRe = /([A-Z]+) = \(([A-Z]+), ([A-Z]+)\)/;

// Convert instructions to indices
const instructions = Array.from(lines[0].trim()).map((c) =>
  c === "L" ? 0 : 1
);

// Maps between node names and node index for easier lookup
const nodesMapping: Record<string, number> = {};

const nodes = lines.slice(2).map((l, i) => {
  const [_, key, left, right] = l.match(nodeRe)!;
  nodesMapping[key] = i;
  return [key, [left, right]] as const;
});

let at = nodesMapping["AAA"];
const end = nodesMapping["ZZZ"];
let steps = 0;

while (at !== end) {
  const i = steps++ % instructions.length;
  const n = nodes[at][1][instructions[i]];
  at = nodesMapping[n];
}

console.log("Chapter one", steps);

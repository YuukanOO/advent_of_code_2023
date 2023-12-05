import { readLines } from "../helper.ts";

const lines = await readLines("input.txt");

const numbersRe = /\d+/g;

type Mapping = {
  destinationRangeStart: number;
  sourceRangeStart: number;
  sourceRangeEnd: number;
};

const mappings: Mapping[][] = [];
const seeds = lines[0].match(numbersRe)!.map(Number);

for (const line of lines.slice(2)) {
  if (!line.trim()) {
    continue;
  }

  if (line.includes(":")) {
    mappings.push([]);
    continue;
  }

  const [destStart, sourceStart, length] = line.match(numbersRe)!.map(Number);

  mappings[mappings.length - 1].push({
    destinationRangeStart: destStart,
    sourceRangeStart: sourceStart,
    sourceRangeEnd: sourceStart + length - 1,
  });
}

/**
 * Seeds in the form [[rangeStart, rangeLength]]. With a multithreaded language, it
 * could be way faster...
 */
function findMinimumLocation(seeds: number[][]): number {
  return Math.min(
    ...seeds.map(([seed, range]) => {
      let location: number | undefined;

      for (let i = 0; i <= range; i++) {
        const seedValue = seed + i;
        const seedLocation = mappings.reduce((value, cur) => {
          const v = cur.find(
            (m) => m.sourceRangeStart <= value && value <= m.sourceRangeEnd
          );

          if (!v) {
            return value;
          }

          return v.destinationRangeStart + value - v.sourceRangeStart;
        }, seedValue);

        location = Math.min(location ?? seedLocation, seedLocation);
      }

      return location!;
    })
  );
}

console.log("Chapter one", findMinimumLocation(seeds.map((s) => [s, 0])));
console.log(
  "Chapter two",
  findMinimumLocation(
    seeds.reduce<number[][]>((r, s, idx) => {
      return idx % 2 === 0 ? [...r, [s, seeds[idx + 1]]] : r;
    }, [])
  )
);

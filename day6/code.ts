import { readLines } from "../helper.ts";

const lines = await readLines("input.txt");

const times = lines[0].match(/\d+/g)!.map(Number);
const distances = lines[1].match(/\d+/g)!.map(Number);
const data = times.map((t, i) => [t, distances[i]]);

function countSolutions(time: number, distance: number): number {
  // I'm sure there is a better way to find the minimum amount of time we must press
  // the button, but I can't figure it right now.
  for (let i = 0; i < time; i++) {
    const distanceTravelled = i * (time - i);

    if (distanceTravelled <= distance) {
      continue;
    }

    // i being the minimum time we must hold the button, we can infer the maximum
    // number of seconds we can hold the button to reach the distance by doing
    // time - i
    // so this line is doing: max press - min press + 1 <- to include the interval
    return time - i * 2 + 1;
  }

  return 0;
}

const chapterOne = data.reduce(
  (r, [time, distance]) => r * countSolutions(time, distance),
  1
);

console.log("Chapter one", chapterOne);

const time = parseInt(
  lines[0]
    .match(/\d+ */g)!
    .map((t) => t.trim())
    .join("")
);
const distance = parseInt(
  lines[1]
    .match(/\d+ */g)!
    .map((t) => t.trim())
    .join("")
);

const chapterTwo = countSolutions(time, distance);

console.log("Chapter two", chapterTwo);

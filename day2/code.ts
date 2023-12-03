import { readLines } from "../helper.ts";

const lines = await readLines("input.txt");

type Result = Record<string, number>;

class Game {
  private constructor(
    public readonly id: number,
    private readonly results: Result[]
  ) {}

  isPossibleWith(config: Result): boolean {
    const c = Object.entries(config);

    return !this.results.some((shown) =>
      c.some(([key, value]) => (shown[key] ?? 0) > value)
    );
  }

  get power(): number {
    const maxColors = this.results.reduce(
      (r, tr) =>
        Object.entries(tr).reduce((shown, [key, value]) => {
          if ((shown[key] ?? 0) < value) {
            shown[key] = value;
          }
          return shown;
        }, r),
      {}
    );

    return Object.values(maxColors).reduce((po, cur) => po * cur, 1);
  }

  static from(line: string): Game {
    const idAndData = line.match(/Game (\d+): (.*)/)!;
    const pickData = idAndData[2].split(";");

    const results = pickData.map<Result>((data) => {
      const eachColorGroup = Array.from(data.matchAll(/((\d+) (\w+))/g)!);

      return eachColorGroup.reduce<Result>((result, r) => {
        result[r[3]] = parseInt(r[2]);
        return result;
      }, {});
    });

    return new Game(parseInt(idAndData[1]), results);
  }
}

const config: Result = {
  red: 12,
  green: 13,
  blue: 14,
};

const games = lines.map(Game.from);

const chapterOne = games
  .filter((g) => g.isPossibleWith(config))
  .reduce((sum, g) => sum + g.id, 0);

console.log("Chapter one:", chapterOne);

const chapterTwo = games.reduce((sum, g) => sum + g.power, 0);

console.log("Chapter two:", chapterTwo);

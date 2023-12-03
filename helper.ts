const decoder = new TextDecoder("utf-8");

export async function readLines(path: string): Promise<string[]> {
  const file = await Deno.readFile(path);
  const input = decoder.decode(file);
  return input.split("\n");
}

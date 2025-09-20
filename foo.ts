// import * as transmitters from "./transmitters.json";
import { readFile, writeFile } from "node:fs/promises";

async function main() {
  const transmitters = JSON.parse(
    await readFile("./transmitters.json", "utf-8")
  );

  const fields: Partial<Record<string, Map<unknown, number>>> = {};

  for (const t of transmitters) {
    for (const [k, v] of Object.entries(t)) {
      fields[k] ??= new Map();
      const n = fields[k].get(v) ?? 0;
      fields[k].set(v, n + 1);
    }
  }

  await writeFile(
    "./foo.json",
    JSON.stringify(
      Object.fromEntries(
        Object.entries(fields).map(([k, v]) => [
          k,
          [...(v ?? [])].sort(([, a], [, b]) => b - a),
        ])
      ),
      null,
      2
    )
  );
}

main();

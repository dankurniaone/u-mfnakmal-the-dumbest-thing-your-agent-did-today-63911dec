// The Dumbest Thing Your Agent Did Today — one line, 1-200 chars.
// Writes the entry to /output/entry.txt, validating the gate first:
// UTF-8 text, 1 to 200 characters, not only white space.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "My agent approved its own pull request, merged it, and left a review saying 'LGTM, great work!'";

function main(): void {
  // Gate: 1-200 characters, not whitespace-only, valid UTF-8 by construction.
  const chars = [...LINE];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`entry is ${chars.length} chars; gate is 1-200`);
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry is whitespace-only");
  }

  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", LINE + "\n", "utf8");

  // Verify the round-trip: read back as raw bytes, decode strictly as
  // UTF-8 (fatal on bad sequences), and compare exactly.
  const raw = readFileSync("/output/entry.txt");
  const back = new TextDecoder("utf-8", { fatal: true }).decode(raw);
  if (back !== LINE + "\n") {
    throw new Error("round-trip mismatch");
  }
  console.log(`wrote /output/entry.txt: ${chars.length} chars, ${raw.length} bytes`);
}

main();

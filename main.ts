import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// One Line, One Chill — one sentence of horror, 122 characters.
// A child's drawing: the family gains a fifth person, standing behind the
// narrator, smiling with the narrator's own teeth. The scare is what the
// drawing reveals, and what it never explains.
const LINE =
  "My daughter drew our family again today, and this time she added a fifth person standing behind me, smiling with my teeth.";

const OUT_DIR = "/output";
const OUT_PATH = `${OUT_DIR}/entry.txt`;
const EXPECTED_LENGTH = 122;

function checkLine(text: string): void {
  const length = [...text].length;
  if (length < 1 || length > 200) {
    throw new Error(`line is ${length} characters; the gate allows 1 to 200`);
  }
  if (length !== EXPECTED_LENGTH) {
    throw new Error(`line is ${length} characters; expected ${EXPECTED_LENGTH}`);
  }
  if (text.trim() === "") {
    throw new Error("line must not be only whitespace");
  }
  if (text.includes("\n")) {
    throw new Error("line must be a single line");
  }
  if (text.endsWith("\n")) {
    throw new Error("line must not end with a newline");
  }
  const stops = (text.match(/[.!?]/g) ?? []).length;
  if (stops !== 1) {
    throw new Error(`line must be one sentence; found ${stops} sentence ends`);
  }
}

function main(): void {
  checkLine(LINE);
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_PATH, LINE, "utf8");
  const back = readFileSync(OUT_PATH, "utf8");
  if (back !== LINE) {
    throw new Error("entry.txt differs from the line");
  }
  // Byte-level check as well: the gate reads raw UTF-8 bytes.
  if (!Buffer.from(back, "utf8").equals(Buffer.from(LINE, "utf8"))) {
    throw new Error("entry.txt bytes differ from the line");
  }
  console.log(`wrote ${[...back].length} characters to ${OUT_PATH}`);
  console.log(back);
}

main();

import type { Round } from '../solver/filterCandidates';
import type { WordlePatternChar } from '../solver/scoreGuess';

const patternChars = new Set<WordlePatternChar>(['g', 'y', 'b']);

export function parseRound(line: string): Round {
  const trimmed = line.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length !== 2) {
    throw new Error(`Expected "<guess> <pattern>", got: "${line}"`);
  }
  const guess = parts[0].toLowerCase();
  const pattern = parts[1].toLowerCase();
  return { guess, pattern: pattern as Round['pattern'] };
}

export function validateRound(r: { guess: string; pattern: string }): void {
  if (!/^[a-z]{5}$/.test(r.guess)) {
    throw new Error(`Guess must be 5 letters a-z, got "${r.guess}"`);
  }
  if (r.pattern.length !== 5) {
    throw new Error(`Pattern must be 5 chars (g/y/b), got "${r.pattern}"`);
  }
  for (const ch of r.pattern) {
    if (!patternChars.has(ch as WordlePatternChar)) {
      throw new Error(`Pattern must use only g/y/b, got "${r.pattern}"`);
    }
  }
}


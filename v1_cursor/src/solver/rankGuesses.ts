export type RankedGuess = { word: string; score: number };

function uniqueLetters(word: string): string[] {
  return Array.from(new Set(word.split('')));
}

/**
 * Very simple heuristic:
 * - Build letter frequencies across remaining candidates (unique letters per candidate).
 * - Score a guess by the sum of frequencies of its unique letters.
 *
 * Fast, decent for MVP; not true entropy.
 */
export function rankGuesses(
  remainingCandidates: readonly string[],
  guessPool: readonly string[],
  topN: number
): RankedGuess[] {
  const freq = new Map<string, number>();
  for (const w of remainingCandidates) {
    for (const ch of uniqueLetters(w)) {
      freq.set(ch, (freq.get(ch) ?? 0) + 1);
    }
  }

  const scored: RankedGuess[] = [];
  for (const guess of guessPool) {
    let score = 0;
    for (const ch of uniqueLetters(guess)) {
      score += freq.get(ch) ?? 0;
    }
    scored.push({ word: guess, score });
  }

  scored.sort((a, b) => b.score - a.score || a.word.localeCompare(b.word));
  return scored.slice(0, Math.max(0, topN));
}


export type WordlePatternChar = 'g' | 'y' | 'b';
export type WordlePattern = `${WordlePatternChar}${WordlePatternChar}${WordlePatternChar}${WordlePatternChar}${WordlePatternChar}`;

function normalizeWord(s: string): string {
  return s.trim().toLowerCase();
}

/**
 * Compute Wordle-accurate feedback pattern for a given (answer, guess).
 *
 * Rules:
 * - Mark greens first (exact position match).
 * - Then mark yellows only while there is remaining unmatched inventory
 *   of that letter in the answer.
 * - Remaining are gray/black.
 */
export function scoreGuess(answerRaw: string, guessRaw: string): WordlePattern {
  const answer = normalizeWord(answerRaw);
  const guess = normalizeWord(guessRaw);

  if (answer.length !== 5 || guess.length !== 5) {
    throw new Error(`scoreGuess expects 5-letter words; got answer=${answer.length}, guess=${guess.length}`);
  }

  const result: WordlePatternChar[] = ['b', 'b', 'b', 'b', 'b'];
  const answerChars = answer.split('');
  const guessChars = guess.split('');

  // First pass: greens, and count remaining answer letters.
  const remainingCounts = new Map<string, number>();
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === answerChars[i]) {
      result[i] = 'g';
    } else {
      const ch = answerChars[i];
      remainingCounts.set(ch, (remainingCounts.get(ch) ?? 0) + 1);
    }
  }

  // Second pass: yellows based on remaining inventory.
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'g') continue;
    const ch = guessChars[i];
    const remaining = remainingCounts.get(ch) ?? 0;
    if (remaining > 0) {
      result[i] = 'y';
      remainingCounts.set(ch, remaining - 1);
    }
  }

  return result.join('') as WordlePattern;
}


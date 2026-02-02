import { scoreGuess, type WordlePattern } from './scoreGuess';

export type Round = {
  guess: string;
  pattern: WordlePattern;
};

export function filterCandidates(
  candidates: readonly string[],
  rounds: readonly Round[]
): string[] {
  if (rounds.length === 0) return [...candidates];

  return candidates.filter((answer) => {
    for (const r of rounds) {
      if (scoreGuess(answer, r.guess) !== r.pattern) return false;
    }
    return true;
  });
}


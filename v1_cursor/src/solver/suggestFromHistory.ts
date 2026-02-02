import { filterCandidates, type Round } from './filterCandidates';
import { rankGuesses, type RankedGuess } from './rankGuesses';
import { loadWordlists, type CandidateSource } from '../wordlists/loadWordlists';
import { parseRound, validateRound } from '../util/parseRound';

export type SuggestOptions = {
  rounds: Array<{ guess: string; pattern: string }>;
  topN: number;
  candidateSource: CandidateSource;
  dataDir: string;
};

export type SuggestResult = {
  remainingCount: number;
  remainingCandidates: string[];
  suggestions: RankedGuess[];
};

export async function suggestFromHistory(opts: SuggestOptions): Promise<SuggestResult> {
  const wordlists = await loadWordlists({
    dataDir: opts.dataDir,
    candidateSource: opts.candidateSource
  });
  const allowedGuessSet = new Set(wordlists.allowedGuesses);

  const rounds: Round[] = opts.rounds.map((r) => parseRound(`${r.guess} ${r.pattern}`));
  for (const r of rounds) {
    validateRound(r);
    if (!allowedGuessSet.has(r.guess)) {
      throw new Error(
        `Guess "${r.guess}" is not in the allowed word list. Double-check spelling.`
      );
    }
  }

  const remainingCandidates = filterCandidates(wordlists.candidateAnswers, rounds);

  // MVP default: suggest from remaining candidates (answer-only mode).
  const suggestions = rankGuesses(
    remainingCandidates,
    remainingCandidates.length > 0 ? remainingCandidates : wordlists.allowedGuesses,
    opts.topN
  );

  return {
    remainingCount: remainingCandidates.length,
    remainingCandidates,
    suggestions
  };
}


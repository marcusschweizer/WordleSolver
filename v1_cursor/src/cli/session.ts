import { createInterface } from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

import { filterCandidates, type Round } from '../solver/filterCandidates';
import { rankGuesses } from '../solver/rankGuesses';
import { loadWordlists, type CandidateSource } from '../wordlists/loadWordlists';
import { parseRound, validateRound } from '../util/parseRound';

export async function runInteractiveSession(opts: {
  topN: number;
  candidateSource: CandidateSource;
  dataDir: string;
}): Promise<void> {
  const rl = createInterface({ input, output });

  const wordlists = await loadWordlists({
    dataDir: opts.dataDir,
    candidateSource: opts.candidateSource
  });
  const allowedGuessSet = new Set(wordlists.allowedGuesses);

  const rounds: Round[] = [];
  let topN = opts.topN;
  let candidates = [...wordlists.candidateAnswers];

  const printHelp = () => {
    output.write(
      [
        '',
        'Commands:',
        '  <guess> <pattern>   e.g. "crane gybbg"',
        '  help                show this help',
        '  list                list remaining candidates',
        '  top <n>             set number of suggestions shown',
        '  undo                remove last round',
        '  reset               clear history',
        '  quit                exit',
        '',
        'Pattern chars: g=green, y=yellow, b=gray/black',
        ''
      ].join('\n')
    );
  };

  output.write('\nWordle solver (MVP). Type "help" for commands.\n');
  output.write(
    `Loaded candidates=${wordlists.candidateAnswers.length}, allowed=${wordlists.allowedGuesses.length}\n\n`
  );

  try {
    // eslint-disable-next-line no-constant-condition
    outer: while (true) {
      candidates = filterCandidates(wordlists.candidateAnswers, rounds);
      output.write(`Remaining candidates: ${candidates.length}\n`);

      const pool = candidates.length > 0 ? candidates : wordlists.allowedGuesses;
      const suggestions = rankGuesses(candidates, pool, topN);
      if (suggestions.length > 0) {
        output.write(`Top ${suggestions.length} suggestions:\n`);
        for (const s of suggestions) output.write(`  ${s.word}\t${s.score}\n`);
      }

      // Read user input until something changes the game state (or we exit).
      // This avoids re-printing suggestions when the user just mistypes a round.
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const line = (await rl.question('\n> ')).trim();
        if (!line) continue;

        const [cmd, ...rest] = line.split(/\s+/);
        const lowerCmd = cmd.toLowerCase();

        if (lowerCmd === 'quit' || lowerCmd === 'exit' || lowerCmd === 'q') break outer;
        if (lowerCmd === 'help' || lowerCmd === '?') {
          printHelp();
          continue;
        }
        if (lowerCmd === 'list') {
          output.write(`\n${candidates.join('\n')}\n\n`);
          continue;
        }
        if (lowerCmd === 'top') {
          const n = parseInt(rest[0] ?? '', 10);
          if (!Number.isFinite(n) || n <= 0) {
            output.write('Usage: top <n>\n');
            continue;
          }
          topN = n;
          break; // re-render suggestions with new topN
        }
        if (lowerCmd === 'undo') {
          rounds.pop();
          break; // history changed; recompute candidates/suggestions
        }
        if (lowerCmd === 'reset') {
          rounds.length = 0;
          break; // history changed; recompute candidates/suggestions
        }

        // Otherwise: interpret as "<guess> <pattern>"
        try {
          const round = parseRound(line);
          validateRound(round);
          if (!allowedGuessSet.has(round.guess)) {
            throw new Error(
              `Guess "${round.guess}" is not in the allowed word list. Double-check spelling.`
            );
          }
          rounds.push(round);

          if (round.pattern === 'ggggg') {
            output.write('\nSolved (ggggg). Good game.\n');
            break outer;
          }
          break; // history changed; recompute candidates/suggestions
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          output.write(`${msg}\n`);
          output.write('Please re-enter the round as: <guess> <pattern> (5 chars using g/y/b)\n');
          continue; // re-prompt without re-printing suggestions
        }
      }
    }
  } finally {
    rl.close();
  }
}


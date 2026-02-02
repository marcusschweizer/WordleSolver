import { Command } from 'commander';
import { runInteractiveSession } from './cli/session';

async function main() {
  const program = new Command();

  program
    .name('wordle')
    .description('MVP Wordle solver assistant (CLI)')
    .version('0.1.0');

  program
    .command('interactive')
    .description('Start an interactive Wordle solving session (default)')
    .option('--top <n>', 'Number of suggestions to show', (v) => parseInt(v, 10), 10)
    .option(
      '--candidate-source <source>',
      'Candidate source: la | ta | all',
      'la'
    )
    .option('--data-dir <path>', 'Directory containing word list files', 'data')
    .action(async (opts) => {
      await runInteractiveSession({
        topN: opts.top,
        candidateSource: opts.candidateSource,
        dataDir: opts.dataDir
      });
    });

  program
    .command('suggest')
    .description('Suggest next guesses for a given history (non-interactive)')
    .option('--top <n>', 'Number of suggestions to show', (v) => parseInt(v, 10), 10)
    .option(
      '--round <value...>',
      'A round as two tokens: <guess> <pattern>. Can be repeated.'
    )
    .option(
      '--candidate-source <source>',
      'Candidate source: la | ta | all',
      'la'
    )
    .option('--data-dir <path>', 'Directory containing word list files', 'data')
    .action(async (opts) => {
      const rounds: Array<{ guess: string; pattern: string }> = [];
      const raw = (opts.round ?? []) as string[];
      if (raw.length % 2 !== 0) {
        throw new Error('--round expects pairs: <guess> <pattern>');
      }
      for (let i = 0; i < raw.length; i += 2) {
        rounds.push({ guess: raw[i], pattern: raw[i + 1] });
      }
      const { suggestFromHistory } = await import('./solver/suggestFromHistory');
      const result = await suggestFromHistory({
        rounds,
        topN: opts.top,
        candidateSource: opts.candidateSource,
        dataDir: opts.dataDir
      });
      process.stdout.write(`Remaining candidates: ${result.remainingCount}\n`);
      for (const s of result.suggestions) {
        process.stdout.write(`${s.word}\t${s.score}\n`);
      }
    });

  program.action(async () => {
    await program.commands.find((c) => c.name() === 'interactive')!.parseAsync([
      process.execPath,
      process.argv[1],
      ...process.argv.slice(2)
    ]);
  });

  await program.parseAsync(process.argv);
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exitCode = 1;
});


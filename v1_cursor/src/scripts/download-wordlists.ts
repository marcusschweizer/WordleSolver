import { access, mkdir, writeFile } from 'fs/promises';
import * as path from 'path';

type DownloadOptions = {
  dataDir: string;
  overwrite: boolean;
};

const GIST_USER = 'scholtes';
const GIST_ID = '94f3c0303ba6a7768b47583aff36654d';
const FILES = ['wordle-La.txt', 'wordle-Ta.txt'] as const;

function parseArgs(argv: string[]): DownloadOptions {
  let dataDir = 'data';
  let overwrite = false;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--data-dir') {
      const v = argv[i + 1];
      if (!v) throw new Error('Missing value for --data-dir');
      dataDir = v;
      i++;
      continue;
    }
    if (a === '--overwrite' || a === '--force') {
      overwrite = true;
      continue;
    }
    if (a === '--help' || a === '-h') {
      process.stdout.write(
        [
          'Download Wordle word lists (La/Ta) into a local data directory.',
          '',
          'Usage:',
          '  npm run wordlists:download',
          '  npm run wordlists:download -- --data-dir data',
          '  npm run wordlists:download -- --overwrite',
          '',
          'Options:',
          '  --data-dir <path>   Output directory (default: data)',
          '  --overwrite         Overwrite existing files (default: false)',
          ''
        ].join('\n') + '\n'
      );
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${a}`);
  }

  return { dataDir, overwrite };
}

async function downloadText(url: string): Promise<string> {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'user-agent': 'wordle-solver-cli (mvp)' }
  });
  if (!res.ok) {
    throw new Error(`Failed to download ${url} (${res.status} ${res.statusText})`);
  }
  return await res.text();
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const outDir = path.resolve(process.cwd(), opts.dataDir);
  await mkdir(outDir, { recursive: true });

  const baseUrl = `https://gist.githubusercontent.com/${GIST_USER}/${GIST_ID}/raw`;

  for (const fileName of FILES) {
    const outPath = path.join(outDir, fileName);
    const url = `${baseUrl}/${fileName}`;

    if (!opts.overwrite) {
      try {
        await access(outPath);
        process.stdout.write(
          `Skipping ${fileName} (already exists). Re-run with --overwrite to replace.\n`
        );
        continue;
      } catch {
        // does not exist; proceed
      }
    }

    // Use atomic-ish overwrite policy via flags.
    const flags = opts.overwrite ? 'w' : 'wx';

    process.stdout.write(`Downloading ${fileName}...\n`);
    const text = await downloadText(url);
    await writeFile(outPath, text, { encoding: 'utf8', flag: flags });
    process.stdout.write(`Wrote ${outPath}\n`);
  }

  process.stdout.write('\nDone.\n');
  process.stdout.write(
    [
      'Next:',
      `  npm run wordle -- interactive --data-dir ${opts.dataDir}`,
      'or',
      `  npm run wordle -- suggest --round crane gybbg --data-dir ${opts.dataDir}`,
      ''
    ].join('\n')
  );
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exitCode = 1;
});


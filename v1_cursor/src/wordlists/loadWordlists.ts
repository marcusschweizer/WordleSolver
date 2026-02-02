import { readFile } from 'fs/promises';
import * as path from 'path';

export type CandidateSource = 'la' | 'ta' | 'all';

export type Wordlists = {
  candidateAnswers: string[];
  allowedGuesses: string[];
};

function normalizeWord(w: string): string | null {
  const s = w.trim().toLowerCase();
  if (!/^[a-z]{5}$/.test(s)) return null;
  return s;
}

async function loadListFile(filePath: string): Promise<string[]> {
  const raw = await readFile(filePath, 'utf8');
  const out: string[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const w = normalizeWord(line);
    if (w) out.push(w);
  }
  // Ensure deterministic ordering.
  out.sort();
  // Ensure uniqueness.
  return Array.from(new Set(out));
}

function unionSorted(a: readonly string[], b: readonly string[]): string[] {
  return Array.from(new Set([...a, ...b])).sort();
}

export async function loadWordlists(opts: {
  dataDir: string;
  candidateSource: CandidateSource;
}): Promise<Wordlists> {
  const laPath = path.join(opts.dataDir, 'wordle-La.txt');
  const taPath = path.join(opts.dataDir, 'wordle-Ta.txt');

  let la: string[] = [];
  let ta: string[] = [];

  try {
    la = await loadListFile(laPath);
  } catch {
    // ignore; handled below
  }
  try {
    ta = await loadListFile(taPath);
  } catch {
    // ignore; handled below
  }

  if (la.length === 0 && ta.length === 0) {
    throw new Error(
      [
        `No word list files found in "${opts.dataDir}".`,
        `Expected one or both of:`,
        `- ${laPath}`,
        `- ${taPath}`,
        ``,
        `MVP uses Wordle La/Ta lists (see plan doc in v1_cursor/docs).`,
        `Add the files manually or run: npm run wordlists:download`
      ].join('\n')
    );
  }

  const all = unionSorted(la, ta);
  const candidateAnswers =
    opts.candidateSource === 'la' ? la : opts.candidateSource === 'ta' ? ta : all;

  const allowedGuesses = all;

  if (candidateAnswers.length === 0) {
    throw new Error(
      `Candidate source "${opts.candidateSource}" produced 0 candidates. Check your word lists.`
    );
  }

  return { candidateAnswers, allowedGuesses };
}


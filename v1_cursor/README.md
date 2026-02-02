# Wordle solver (CLI) — `v1_cursor`

This is an MVP Wordle assistant CLI written in Node.js + TypeScript.

## Setup

From this directory:

```bash
npm install
```

## Download word lists

The solver expects Wordle word list files in a local `data/` directory:

- `data/wordle-La.txt`
- `data/wordle-Ta.txt`

To download them automatically:

```bash
npm run wordlists:download
```

Notes:

- The downloaded files are intentionally **gitignored** (see `.gitignore`).
- If you already have the files and want to refresh them:

```bash
npm run wordlists:download -- --overwrite
```

## Run (interactive)

```bash
npm run wordle
```

In the prompt, enter rounds like:

- `crane gybbg`
- `stare bbybg`

Commands: `help`, `list`, `top <n>`, `undo`, `reset`, `quit`.

## Run (non-interactive suggest)

```bash
npm run wordle -- suggest --round crane gybbg --round stare bbybg
```

## Troubleshooting

- If you see “No word list files found…”, run `npm run wordlists:download` (or pass `--data-dir` to point at your own directory).


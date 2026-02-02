import { useMemo, useState } from 'react'

import './App.css'

import { PatternPicker } from './components/PatternPicker'
import { filterCandidates, rankGuesses, type Round, type WordlePattern } from './lib/solverCore'
import {
  getAllowedGuesses,
  loadWordlistFromFile,
  loadWordlistsFromUrls,
  selectCandidateAnswers,
  type CandidateSource,
  type Wordlists
} from './lib/wordlists'

const WORDLE_GIST_BASE =
  'https://gist.githubusercontent.com/scholtes/94f3c0303ba6a7768b47583aff36654d/raw'

function normalizeGuess(s: string): string {
  return s.trim().toLowerCase()
}

function isValidGuessFormat(s: string): boolean {
  return /^[a-z]{5}$/.test(s)
}

function isValidPattern(s: string): s is WordlePattern {
  return /^[gyb]{5}$/.test(s)
}

function App() {
  const [candidateSource, setCandidateSource] = useState<CandidateSource>('la')
  const [topN, setTopN] = useState<number>(10)

  const [wordlists, setWordlists] = useState<Wordlists | null>(null)
  const [wordlistsStatus, setWordlistsStatus] = useState<string>('No word lists loaded yet.')
  const [wordlistsError, setWordlistsError] = useState<string | null>(null)

  const [rounds, setRounds] = useState<Round[]>([])
  const [guessInput, setGuessInput] = useState<string>('')
  const [pattern, setPattern] = useState<WordlePattern>('bbbbb')
  const [formError, setFormError] = useState<string | null>(null)

  const allowedGuesses = useMemo(() => (wordlists ? getAllowedGuesses(wordlists) : []), [wordlists])
  const allowedGuessSet = useMemo(() => new Set(allowedGuesses), [allowedGuesses])

  const candidateAnswers = useMemo(() => {
    if (!wordlists) return []
    return selectCandidateAnswers(wordlists, candidateSource)
  }, [wordlists, candidateSource])

  const remainingCandidates = useMemo(() => {
    if (!wordlists) return []
    return filterCandidates(candidateAnswers, rounds)
  }, [wordlists, candidateAnswers, rounds])

  const suggestions = useMemo(() => {
    if (!wordlists) return []
    const pool = remainingCandidates.length > 0 ? remainingCandidates : allowedGuesses
    return rankGuesses(remainingCandidates, pool, topN)
  }, [wordlists, remainingCandidates, allowedGuesses, topN])

  async function loadFromGist() {
    setWordlistsError(null)
    setWordlistsStatus('Loading from gist…')
    try {
      const wl = await loadWordlistsFromUrls({
        laUrl: `${WORDLE_GIST_BASE}/wordle-La.txt`,
        taUrl: `${WORDLE_GIST_BASE}/wordle-Ta.txt`
      })
      setWordlists(wl)
      setWordlistsStatus(`Loaded La=${wl.la.length.toLocaleString()}, Ta=${wl.ta.length.toLocaleString()}`)
    } catch (err) {
      setWordlistsError(err instanceof Error ? err.message : String(err))
      setWordlistsStatus('Failed to load word lists.')
    }
  }

  async function loadFromLocalFiles(laFile: File | null, taFile: File | null) {
    setWordlistsError(null)
    setWordlistsStatus('Loading from files…')
    try {
      const la = laFile ? await loadWordlistFromFile(laFile) : []
      const ta = taFile ? await loadWordlistFromFile(taFile) : []
      if (la.length === 0 && ta.length === 0) {
        throw new Error('No valid words found. Please select at least one word list file (La and/or Ta).')
      }
      const wl = { la, ta }
      setWordlists(wl)
      setWordlistsStatus(`Loaded La=${wl.la.length.toLocaleString()}, Ta=${wl.ta.length.toLocaleString()}`)
    } catch (err) {
      setWordlistsError(err instanceof Error ? err.message : String(err))
      setWordlistsStatus('Failed to load word lists.')
    }
  }

  function addRound() {
    setFormError(null)
    if (!wordlists) {
      setFormError('Load word lists first (gist or local files).')
      return
    }

    const guess = normalizeGuess(guessInput)
    if (!isValidGuessFormat(guess)) {
      setFormError('Guess must be 5 letters (a–z).')
      return
    }
    if (!allowedGuessSet.has(guess)) {
      setFormError(`"${guess}" is not in the allowed word list. Double-check spelling.`)
      return
    }
    if (!isValidPattern(pattern)) {
      setFormError('Pattern must be 5 chars using only g/y/b.')
      return
    }

    setRounds((prev) => [...prev, { guess, pattern }])
    setGuessInput('')
    setPattern('bbbbb')
  }

  const isSolved = rounds.some((r) => r.pattern === 'ggggg')

  return (
    <div className="app">
      <div className="topbar">
        <div className="topbarInner">
          <div className="brand">Wordle Solver</div>
          <div className="brandSub">Web UI (MVP)</div>
        </div>
      </div>

      <div className="container">
        <div className="panel">
          <div className="panelHeader">
            <div className="panelTitle">Word lists</div>
            <div className="row">
              <button type="button" className="btn btnPrimary" onClick={loadFromGist}>
                Load from gist
              </button>
            </div>
          </div>
          <div className="panelBody">
            <div className="row" style={{ justifyContent: 'space-between', gap: 12 }}>
              <div className="muted">{wordlistsStatus}</div>
              {wordlists ? (
                <div className="muted">
                  Allowed: {allowedGuesses.length.toLocaleString()} • Candidates source:{' '}
                  {selectCandidateAnswers(wordlists, candidateSource).length.toLocaleString()}
                </div>
              ) : null}
            </div>

            {wordlistsError ? <div className="error" style={{ marginTop: 12 }}>{wordlistsError}</div> : null}

            <div style={{ marginTop: 14 }}>
              <div className="label">Or load local files (newline-separated words)</div>
              <LocalFileLoader onLoad={loadFromLocalFiles} />
            </div>
          </div>
        </div>

        <div className="grid">
          <div className="panel">
            <div className="panelHeader">
              <div className="panelTitle">Session</div>
              <div className="row">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setRounds((r) => r.slice(0, -1))}
                  disabled={rounds.length === 0}
                >
                  Undo
                </button>
                <button
                  type="button"
                  className="btn btnDanger"
                  onClick={() => setRounds([])}
                  disabled={rounds.length === 0}
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="panelBody">
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div className="muted">
                  {wordlists ? (
                    <>
                      Remaining candidates: <b>{remainingCandidates.length.toLocaleString()}</b>
                    </>
                  ) : (
                    'Load word lists to start solving.'
                  )}
                </div>
                {isSolved ? <div className="success">Solved</div> : null}
              </div>

              <div style={{ marginTop: 12 }}>
                <RoundTable rounds={rounds} />
              </div>

              <div style={{ marginTop: 14 }}>
                <div className="row" style={{ alignItems: 'end' }}>
                  <div className="field" style={{ minWidth: 220 }}>
                    <div className="label">Guess</div>
                    <input
                      className="input"
                      value={guessInput}
                      onChange={(e) => setGuessInput(e.target.value)}
                      placeholder="crane"
                      inputMode="text"
                      autoComplete="off"
                      spellCheck={false}
                      maxLength={16}
                    />
                  </div>

                  <div className="field">
                    <div className="label">Pattern (click tiles)</div>
                    <PatternPicker value={pattern} onChange={setPattern} />
                  </div>

                  <div className="field">
                    <div className="label">&nbsp;</div>
                    <button type="button" className="btn btnPrimary" onClick={addRound} disabled={!wordlists}>
                      Add round
                    </button>
                  </div>
                </div>

                {formError ? <div className="error" style={{ marginTop: 12 }}>{formError}</div> : null}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panelHeader">
              <div className="panelTitle">Suggestions</div>
              <div className="row">
                <div className="field">
                  <div className="label">Candidates</div>
                  <select
                    className="select"
                    value={candidateSource}
                    onChange={(e) => setCandidateSource(e.target.value as CandidateSource)}
                    disabled={!wordlists}
                  >
                    <option value="la">La (solutions)</option>
                    <option value="ta">Ta (non-solutions)</option>
                    <option value="all">All</option>
                  </select>
                </div>
                <div className="field">
                  <div className="label">Top</div>
                  <input
                    className="input"
                    type="number"
                    min={1}
                    max={100}
                    value={topN}
                    onChange={(e) => setTopN(Math.max(1, Math.min(100, Number(e.target.value) || 10)))}
                    style={{ width: 90 }}
                    disabled={!wordlists}
                  />
                </div>
              </div>
            </div>
            <div className="panelBody">
              {wordlists ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: '60%' }}>Word</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suggestions.map((s) => (
                      <tr key={s.word}>
                        <td style={{ fontWeight: 800 }}>{s.word}</td>
                        <td>{s.score}</td>
                      </tr>
                    ))}
                    {suggestions.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="muted">
                          No suggestions.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              ) : (
                <div className="muted">Load word lists to compute suggestions.</div>
              )}

              {wordlists ? (
                <div className="muted" style={{ marginTop: 10 }}>
                  Guess pool: {remainingCandidates.length > 0 ? 'remaining candidates' : 'allowed guesses (fallback)'}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {wordlists ? (
          <div className="panel">
            <div className="panelHeader">
              <div className="panelTitle">Candidates</div>
              <div className="muted">
                Showing {Math.min(200, remainingCandidates.length).toLocaleString()} of{' '}
                {remainingCandidates.length.toLocaleString()}
              </div>
            </div>
            <div className="panelBody">
              <CandidatesPreview candidates={remainingCandidates} />
            </div>
          </div>
        ) : null}
      </div>

      <div className="footer">
        Solver core is the same as the CLI MVP (score-by-simulation, duplicate-safe).
      </div>
    </div>
  )
}

export default App

function LocalFileLoader(props: { onLoad: (la: File | null, ta: File | null) => void }) {
  const [laFile, setLaFile] = useState<File | null>(null)
  const [taFile, setTaFile] = useState<File | null>(null)

  return (
    <div className="row" style={{ marginTop: 8, alignItems: 'end' }}>
      <div className="field" style={{ minWidth: 260 }}>
        <div className="label">La file</div>
        <input
          className="input"
          type="file"
          accept=".txt,text/plain"
          onChange={(e) => setLaFile(e.target.files?.[0] ?? null)}
        />
      </div>
      <div className="field" style={{ minWidth: 260 }}>
        <div className="label">Ta file</div>
        <input
          className="input"
          type="file"
          accept=".txt,text/plain"
          onChange={(e) => setTaFile(e.target.files?.[0] ?? null)}
        />
      </div>
      <button type="button" className="btn" onClick={() => props.onLoad(laFile, taFile)}>
        Load files
      </button>
    </div>
  )
}

function RoundTable(props: { rounds: Round[] }) {
  if (props.rounds.length === 0) {
    return <div className="muted">No rounds yet. Add your first guess + pattern.</div>
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Guess</th>
          <th>Pattern</th>
        </tr>
      </thead>
      <tbody>
        {props.rounds.map((r, idx) => (
          <tr key={`${r.guess}-${idx}`}>
            <td>{idx + 1}</td>
            <td style={{ fontWeight: 800 }}>{r.guess}</td>
            <td style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
              {r.pattern}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function CandidatesPreview(props: { candidates: string[] }) {
  const shown = props.candidates.slice(0, 200)
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
        gap: 8
      }}
    >
      {shown.map((w) => (
        <div
          key={w}
          style={{
            padding: '8px 10px',
            border: '1px solid var(--border)',
            borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.06)',
            fontWeight: 800,
            textAlign: 'center',
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {w}
        </div>
      ))}
    </div>
  )
}

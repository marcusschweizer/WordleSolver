import './PatternPicker.css'

import type { WordlePattern, WordlePatternChar } from '../lib/solverCore'

function nextChar(ch: WordlePatternChar): WordlePatternChar {
  return ch === 'b' ? 'y' : ch === 'y' ? 'g' : 'b'
}

function charLabel(ch: WordlePatternChar): string {
  return ch === 'g' ? 'G' : ch === 'y' ? 'Y' : 'B'
}

export function PatternPicker(props: {
  value: WordlePattern
  onChange: (next: WordlePattern) => void
}) {
  const chars = props.value.split('') as WordlePatternChar[]

  return (
    <div className="patternPicker" aria-label="Pattern picker">
      {chars.map((ch, idx) => (
        <button
          key={idx}
          type="button"
          className={`tile tile-${ch}`}
          onClick={() => {
            const next = [...chars]
            next[idx] = nextChar(ch)
            props.onChange(next.join('') as WordlePattern)
          }}
          aria-label={`Pattern position ${idx + 1}: ${ch}`}
          title="Click to cycle B → Y → G"
        >
          {charLabel(ch)}
        </button>
      ))}
    </div>
  )
}


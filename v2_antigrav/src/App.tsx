import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useSolver } from './hooks/useSolver';
import { WordRow } from './components/WordRow';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { SuggestionList } from './components/SuggestionList';
import type { Pattern } from './logic/types';
import { isWordValid } from './logic/wordList';

function App() {
  const { guesses, candidates, suggestions, addGuess, reset } = useSolver();
  const [currentInput, setCurrentInput] = useState('');
  const [currentPatterns, setCurrentPatterns] = useState<Pattern[]>([]);

  useEffect(() => {
    // Manage pattern length based on input length
    if (currentInput.length < currentPatterns.length) {
      setCurrentPatterns(prev => prev.slice(0, currentInput.length));
    } else if (currentInput.length > currentPatterns.length) {
      const diff = currentInput.length - currentPatterns.length;
      const newPatterns = Array(diff).fill('ABSENT');
      setCurrentPatterns(prev => [...prev, ...newPatterns]);
    }
  }, [currentInput, currentPatterns.length]);

  // Win Detection
  useEffect(() => {
    const lastGuess = guesses[guesses.length - 1];
    if (lastGuess && lastGuess.patterns.every(p => p === 'CORRECT')) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [guesses]);

  const handleKeyPress = (key: string) => {
    // Stop input if won
    const lastGuess = guesses[guesses.length - 1];
    if (lastGuess && lastGuess.patterns.every(p => p === 'CORRECT')) return;

    if (key === 'Backspace') {
      setCurrentInput(prev => prev.slice(0, -1));
    } else if (key === 'Enter') {
      if (currentInput.length !== 5) {
        alert('Word must be 5 letters');
        return;
      }
      if (!isWordValid(currentInput.toLowerCase())) {
        alert('Not in word list');
        return;
      }

      addGuess(currentInput.toLowerCase(), currentPatterns);
      setCurrentInput('');
      setCurrentPatterns([]);
    } else {
      if (currentInput.length < 5 && /^[a-zA-Z]$/.test(key)) {
        setCurrentInput(prev => prev + key.toLowerCase());
      }
    }
  };

  const handlePatternChange = (index: number, newPattern: Pattern) => {
    const nextPatterns = [...currentPatterns];
    nextPatterns[index] = newPattern;
    setCurrentPatterns(nextPatterns);
  };

  // Layout Logic
  const totalGridRows = 6;
  const usedRows = guesses.length + 1;
  const emptyRowsCount = Math.max(0, totalGridRows - usedRows);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <header style={{
        borderBottom: '1px solid var(--border-color)',
        padding: '1rem',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.05em' }}>WORDLE SOLVER</h1>
        <button onClick={reset} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Reset</button>
      </header>

      <div className="game-container">
        {/* Main Game Area */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', padding: '20px', alignItems: 'center', overflowY: 'auto' }}>
          <div style={{ marginBottom: '20px' }}>
            {guesses.map((g, i) => (
              <WordRow key={i} word={g.word} patterns={g.patterns} />
            ))}

            {/* Current Input Row */}
            {!guesses.length || !guesses[guesses.length - 1]?.patterns.every(p => p === 'CORRECT') ? (
              <WordRow
                word={currentInput}
                patterns={currentPatterns}
                active={true}
                onPatternChange={handlePatternChange}
              />
            ) : null}

            {/* Empty Rows */}
            {Array(emptyRowsCount).fill(null).map((_, i) => (
              <WordRow key={`empty-${i}`} word="" patterns={[]} />
            ))}
          </div>

          <div style={{ marginTop: 'auto', width: '100%' }}>
            <VirtualKeyboard onKeyPress={handleKeyPress} />
          </div>
        </div>

        {/* Sidebar Suggestions */}
        <div className="sidebar">
          <SuggestionList suggestions={suggestions} totalCandidates={candidates.length} />
        </div>
      </div>
    </div>
  );
}

export default App;

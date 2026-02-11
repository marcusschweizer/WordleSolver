import { useState, useMemo, useCallback } from 'react';
import { solutionWords } from '../logic/wordList';
import { filterWords, scoreWords } from '../logic/solver';
import type { Feedback, Pattern } from '../logic/types';

export function useSolver() {
    const [guesses, setGuesses] = useState<Feedback[]>([]);

    const candidates = useMemo(() => {
        let current = solutionWords;
        for (const guess of guesses) {
            current = filterWords(current, guess.word, guess.patterns);
        }
        return current;
    }, [guesses]);

    const suggestions = useMemo(() => scoreWords(candidates), [candidates]);

    const addGuess = useCallback((word: string, patterns: Pattern[]) => {
        setGuesses(prev => [...prev, { word, patterns }]);
    }, []);

    const reset = useCallback(() => {
        setGuesses([]);
    }, []);

    return {
        guesses,
        candidates,
        suggestions,
        addGuess,
        reset
    };
}

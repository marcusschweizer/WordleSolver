import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSolver } from './useSolver';
import type { Pattern } from '../logic/types';
import { solutionWords } from '../logic/wordList';

describe('useSolver', () => {
    it('initializes with full candidate list', () => {
        const { result } = renderHook(() => useSolver());
        expect(result.current.guesses).toHaveLength(0);
        expect(result.current.candidates.length).toBe(solutionWords.length);
        expect(result.current.suggestions.length).toBeGreaterThan(0);
    });

    it('filters candidates when a guess is added', () => {
        const { result } = renderHook(() => useSolver());
        const initialCount = result.current.candidates.length;

        // Guess 'apple' with all ABSENT -> remove words with a,p,l,e
        // Actually, let's use a specific case.
        // If we guess 'abyss' and get all ABSENT, 'abyss' should be removed.
        const guess = 'abyss';
        const patterns: Pattern[] = ['ABSENT', 'ABSENT', 'ABSENT', 'ABSENT', 'ABSENT'];

        act(() => {
            result.current.addGuess(guess, patterns);
        });

        expect(result.current.guesses).toHaveLength(1);
        expect(result.current.guesses[0]).toEqual({ word: guess, patterns });
        expect(result.current.candidates.length).toBeLessThan(initialCount);
        expect(result.current.candidates).not.toContain(guess);
    });

    it('resets the state', () => {
        const { result } = renderHook(() => useSolver());

        act(() => {
            result.current.addGuess('apple', ['CORRECT', 'CORRECT', 'CORRECT', 'CORRECT', 'CORRECT']);
        });

        expect(result.current.guesses.length).toBe(1);

        act(() => {
            result.current.reset();
        });

        expect(result.current.guesses).toHaveLength(0);
        expect(result.current.candidates.length).toBe(solutionWords.length);
    });
});

import { describe, it, expect } from 'vitest';
import { allWords, solutionWords, isWordValid, getRandomWord } from './wordList';
import solutions from '../data/solutions.json';
import guesses from '../data/guesses.json';

describe('wordList', () => {
    it('loads solution words correctly', () => {
        expect(solutionWords.length).toBeGreaterThan(0);
        expect(solutionWords).toContain('cigar'); // From the known list
        expect(solutionWords.length).toBe(solutions.length);
    });

    it('combines solutions and guesses into allWords', () => {
        expect(allWords.length).toBe(solutions.length + guesses.length);
        expect(allWords).toContain('cigar'); // Solution
        expect(allWords).toContain('aahed'); // Guess (from nonwordles.json)
    });

    it('validates words correctly', () => {
        expect(isWordValid('cigar')).toBe(true);
        expect(isWordValid('aahed')).toBe(true);
        expect(isWordValid('zzzzz')).toBe(false); // Valid length, invalid word
        expect(isWordValid('cig')).toBe(false); // Invalid length
    });

    it('gets a random word from solutions', () => {
        const word = getRandomWord();
        expect(solutionWords).toContain(word);
    });
});

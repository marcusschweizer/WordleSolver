import solutions from '../data/solutions.json';
import guesses from '../data/guesses.json';

export const solutionWords = solutions;
export const allWords = [...solutions, ...guesses];

export function isWordValid(word: string): boolean {
    return allWords.includes(word);
}

export function getRandomWord(): string {
    const randomIndex = Math.floor(Math.random() * solutionWords.length);
    return solutionWords[randomIndex];
}

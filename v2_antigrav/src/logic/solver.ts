import type { Pattern } from './types';

export function filterWords(candidates: string[], guess: string, patterns: Pattern[]): string[] {
    return candidates.filter(candidate => isMatch(candidate, guess, patterns));
}

function isMatch(candidate: string, guess: string, patterns: Pattern[]): boolean {
    if (candidate.length !== 5) return false;

    const guessChars = guess.split('');
    const candidateChars = candidate.split('');

    // 1. Check CORRECT (Green) positions first
    for (let i = 0; i < 5; i++) {
        if (patterns[i] === 'CORRECT') {
            if (candidateChars[i] !== guessChars[i]) return false;
        } else if (patterns[i] === 'PRESENT') {
            // Yellow means present but WRONG spot. So if it matches spot, it's fail.
            if (candidateChars[i] === guessChars[i]) return false;
        }
    }

    // 2. Count constraints
    const requiredCounts: Record<string, number> = {};
    const exactCounts: Record<string, boolean> = {};

    for (let i = 0; i < 5; i++) {
        const char = guessChars[i];
        if (patterns[i] === 'CORRECT' || patterns[i] === 'PRESENT') {
            requiredCounts[char] = (requiredCounts[char] || 0) + 1;
        } else {
            // ABSENT means we have found all instances of this char (if any).
            // So the count defined by requiredCounts is the Exact count (max).
            exactCounts[char] = true;
        }
    }

    // 3. Verify counts in candidate
    const candidateCounts: Record<string, number> = {};
    for (const char of candidateChars) {
        candidateCounts[char] = (candidateCounts[char] || 0) + 1;
    }

    for (const char in requiredCounts) {
        const minFn = requiredCounts[char];
        const actual = candidateCounts[char] || 0;
        if (actual < minFn) return false;
    }

    for (const char in exactCounts) {
        // If exact count is set, it means we cannot have MORE than requiredCounts
        // (which might be 0 if the letter was purely ABSENT)
        const maxFn = requiredCounts[char] || 0;
        const actual = candidateCounts[char] || 0;
        if (actual > maxFn) return false;
    }

    return true;
}

export function scoreWords(candidates: string[]): string[] {
    // 1. Calculate letter frequencies across all candidates
    const freq: Record<string, number> = {};
    for (const word of candidates) {
        // Count just presence in word (not total count) to favor words with unique common letters
        const uniqueChars = new Set(word.split(''));
        for (const char of uniqueChars) {
            freq[char] = (freq[char] || 0) + 1;
        }
    }

    // 2. Score words
    return [...candidates].sort((a, b) => {
        const scoreA = calculateScore(a, freq);
        const scoreB = calculateScore(b, freq);
        return scoreB - scoreA; // Descending
    });
}

function calculateScore(word: string, freq: Record<string, number>): number {
    const uniqueChars = new Set(word.split(''));
    let score = 0;
    for (const char of uniqueChars) {
        score += (freq[char] || 0);
    }
    return score;
}

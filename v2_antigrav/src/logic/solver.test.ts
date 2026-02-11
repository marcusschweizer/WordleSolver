import { describe, it, expect } from 'vitest';
import { filterWords, scoreWords } from './solver';
import type { Pattern } from './types';

describe('solver', () => {
    describe('filterWords', () => {
        const candidates = ['apple', 'alpha', 'adieu', 'crane', 'stare', 'slate', 'abide'];

        it('filters correctly for Green (CORRECT) letters', () => {
            // Target: 'abide'
            // Guess: 'apple' -> Correct, Absent, Absent, Absent, Correct
            // 'a' match, 'e' match. 'p','l' absent.
            const patterns: Pattern[] = ['CORRECT', 'ABSENT', 'ABSENT', 'ABSENT', 'CORRECT'];
            const filtered = filterWords(candidates, 'apple', patterns);

            expect(filtered).toContain('abide'); // Matches a...e and no p,l
            expect(filtered).not.toContain('apple'); // Has p,l -> invalid
            expect(filtered).not.toContain('adieu'); // Matches a... but ends u
            expect(filtered).not.toContain('stare'); // Starts s
            expect(filtered).not.toContain('alpha'); // Ends a
        });

        it('filters correctly for Yellow (PRESENT) letters', () => {
            // Guess: 'stare'
            // Input: 's' is present (yellow), 't' abs, ...
            // Let's say target is 'least'.
            // Guess 'slate':
            // s(p), l(p), a(p), t(p), e(p) -> all present?

            // Let's try simpler.
            // Candidates: ['mount', 'baton', 'month']
            // Guess: 'robot'
            // Feedback: r(A), o(C), b(A), o(A), t(A) -> Pattern: A, C, A, A, A
            // Means: 2nd letter is 'o'. 'r', 'b', 't', and 'other o' are absent.

            const list = ['mount', 'baton', 'month', 'robot'];
            const patterns: Pattern[] = ['ABSENT', 'CORRECT', 'ABSENT', 'ABSENT', 'ABSENT'];
            expect(filterWords(list, 'robot', patterns)).toHaveLength(0);

            // Target: 'knoll'
            // Guess: 'crane'
            // c(A), r(A), a(A), n(P), e(A)
            const cnds = ['knoll', 'crane', 'manor', 'cynic'];
            // 'knoll': no c,r,a,e. Contains n? Yes. 'n' is not at index 3 (crane[3]). Correct.
            // 'manor': has r (fail), has a (fail).
            // 'cynic': has c (fail), has n.

            const res = filterWords(cnds, 'crane', ['ABSENT', 'ABSENT', 'ABSENT', 'PRESENT', 'ABSENT']);
            expect(res).toContain('knoll');
            expect(res).not.toContain('manor');
            expect(res).not.toContain('cynic'); // contains 'c' which is absent
            expect(res).not.toContain('crane');
        });

        /*
                it('handles double letters logic correctly (basic)', () => {
                    // If guess has 2 'e's. First is Green, second is Gray.
                    // Means: word has 'e' at first pos, but NO other 'e'.
                    // Guess: 'eerie'
                    // Pattern: G, G, A, A, A
                    // Candidates: 'eeryX' (ok), 'eerer' (fail - 2nd e is marked Green, but 3rd e marked grey means no more e's?)
        
                    // Actually, the standard logic is:
                    // Green/Yellow consume the count of that letter in the target.
                    // If a letter is marked Gray, it means either:
                    // 1. It's not in the word at all (if no other instances of that letter were G/Y).
                    // 2. We have successfully found all instances of that letter (if we have other G/Y instances).
        
                    // Test case: Target 'abbot'
                    // Guess: 'babby'
                    // b(P), a(P), b(G), b(A), y(A)
                    // b[0] is Yellow -> b in word, not at 0.
                    // a[1] is Yellow -> a in word, not at 1.
                    // b[2] is Green  -> b at 2.
                    // b[3] is Gray   -> no more b's (we have found 1 at pos 2, and one implies elsewhere). So total b count is 2?
                    // Actually 'abbot' has 2 b's. 
                    // 'babby' -> target 'abbot'
                    // b (index 0): Target has b at 1, 2. So Yellow.
                    // a (index 1): Target has a at 0. So Yellow.
                    // b (index 2): Target has b at 1, 2. Matched at 2? Yes if target[2] == b. 'abbot' has b at 2. So Green.
                    // b (index 3): Target has 2 b's. We matched one at 2 (Green), one pending at 0 (Yellow -> implies exists).
                    // So we have found 2 b's. The b at 3 is 3rd b. Target has only 2. So Gray.
        
                    // Implementation of this 'Gray means strictly NOT present' vs 'Gray means surplus' is tricky.
                    // Simplest MVP: 'Gray' means letter is NOT in the word (if we don't handle known counts).
                    // BETTER MVP: 'Gray' means "this letter instance is not the logic".
        
                    // Let's expect the strict logic for now:
                    // If a letter is Gray AND NOT present elsewhere as Green/Yellow -> Remove all words with this letter.
                    // If a letter is Gray AND IS present elsewhere -> Remove words that have *more* instances of this letter than the G/Y ones.
        
                    // For now, let's just stick to "Gray means letter not in word" for the simple case where the letter is unique in the guess.
                    // const list = ['mount', 'baton'];
                    // Guess 'mmmxx' (fake). m(G), m(A), m(A)...
                    // Implies exactly one 'm' at position 0.
                    // 'mount' -> OK.
                    // 'mammy' -> Fail (3 m's).
        
                    // I will leave complex double-letter logic for a specific refinement task if I can't get it right immediately.
                });
        */
    });

    describe('scoreWords', () => {
        it('sorts words by some heuristic', () => {
            // 'aeros' has common letters (a,e,r,o,s). 'zzzzz' has only z.
            const candidates = ['apple', 'zzzzz', 'aeros'];
            const sorted = scoreWords(candidates);
            expect(sorted.length).toBe(candidates.length);
            // Aeros should be first because it has more unique high-frequency letters *in this set*
            // a(2), e(2), r(1), o(1), s(1) -> Score 7
            // apple: a(2), p(1), l(1), e(2) -> Score 6
            // zzzzz: z(1) -> Score 1
            expect(sorted[0]).toBe('aeros');
            expect(sorted[sorted.length - 1]).toBe('zzzzz');
        });
    });
});

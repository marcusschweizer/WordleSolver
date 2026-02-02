import { describe, expect, it } from 'vitest';
import { scoreGuess } from '../src/solver/scoreGuess';

describe('scoreGuess', () => {
  it('returns ggggg for exact match', () => {
    expect(scoreGuess('cigar', 'cigar')).toBe('ggggg');
  });

  it('handles duplicates: guess has more than answer', () => {
    // answer has a single 'r'; guess has two 'r'
    expect(scoreGuess('cigar', 'array')).toBe('bybgb');
  });

  it('handles duplicates: answer has more than guess', () => {
    expect(scoreGuess('allee', 'eagle')).toBe('yybyg');
  });

  it('greens consume letter inventory before yellows', () => {
    expect(scoreGuess('ababa', 'aaaab')).toBe('gygby');
  });

  it('throws on non-5-letter inputs', () => {
    expect(() => scoreGuess('short', 'toolong')).toThrow(/5-letter/i);
  });
});


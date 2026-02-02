import { describe, expect, it } from 'vitest';
import { filterCandidates } from '../src/solver/filterCandidates';

describe('filterCandidates', () => {
  it('filters candidates by full history', () => {
    const candidates = ['cigar', 'rebut', 'sissy', 'humph'];
    const rounds = [{ guess: 'cigar', pattern: 'ggggg' as const }];
    expect(filterCandidates(candidates, rounds)).toEqual(['cigar']);
  });
});


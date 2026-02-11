export type Pattern = 'CORRECT' | 'PRESENT' | 'ABSENT';

export interface Feedback {
    word: string;
    patterns: Pattern[];
}

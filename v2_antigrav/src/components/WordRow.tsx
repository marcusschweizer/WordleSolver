import React from 'react';
import type { Pattern } from '../logic/types';
import { LetterTile } from './LetterTile';

interface WordRowProps {
    word: string;
    patterns: Pattern[];
    onPatternChange?: (index: number, newPattern: Pattern) => void;
    active?: boolean;
}

const CYCLE: Pattern[] = ['ABSENT', 'PRESENT', 'CORRECT'];

export const WordRow: React.FC<WordRowProps> = ({ word, patterns, onPatternChange, active }) => {
    const paddedWord = word.padEnd(5, ' ').slice(0, 5);

    const handleTileClick = (index: number) => {
        if (!active || !onPatternChange) return;

        // If no letter, probably shouldn't set pattern? 
        // Or maybe yes, but it's weird. Let's allow it if there is a letter.
        if (paddedWord[index] === ' ') return;

        const currentPattern = patterns[index] || 'ABSENT';
        const nextIndex = (CYCLE.indexOf(currentPattern) + 1) % CYCLE.length;
        onPatternChange(index, CYCLE[nextIndex]);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '5px', marginBottom: '5px' }}>
            {paddedWord.split('').map((char, i) => (
                <LetterTile
                    key={i}
                    letter={char !== ' ' ? char : ''}
                    pattern={patterns[i]}
                    onClick={() => handleTileClick(i)}
                    editable={active && char !== ' '}
                />
            ))}
        </div>
    );
};

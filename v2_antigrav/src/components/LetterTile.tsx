import React from 'react';
import type { Pattern } from '../logic/types';

interface LetterTileProps {
    letter: string;
    pattern?: Pattern;
    onClick?: () => void;
    editable?: boolean;
}

export const LetterTile: React.FC<LetterTileProps> = ({ letter, pattern, onClick, editable }) => {
    const getColorVar = (p?: Pattern) => {
        switch (p) {
            case 'CORRECT': return 'var(--color-correct)';
            case 'PRESENT': return 'var(--color-present)';
            case 'ABSENT': return 'var(--color-absent)';
            default: return 'transparent'; // Empty/TBD state
        }
    };

    const style: React.CSSProperties = {
        width: '52px',
        height: '52px',
        border: '2px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        backgroundColor: getColorVar(pattern),
        color: pattern ? 'var(--color-default)' : 'var(--text-color)',
        cursor: editable ? 'pointer' : 'default',
        userSelect: 'none',
        borderColor: pattern ? 'transparent' : (letter ? 'var(--color-text-light)' : 'var(--border-color)'),
    };

    // Quick fix for dark mode border color in empty state if needed, but CSS var handles it.
    // Actually, if letter is present but no pattern, usually border is darker/active.

    return (
        <div style={style} onClick={onClick} data-testid={`tile-${letter}-${pattern || 'none'}`}>
            {letter}
        </div>
    );
};

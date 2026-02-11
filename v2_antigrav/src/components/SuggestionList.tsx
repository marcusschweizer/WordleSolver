import React from 'react';

interface SuggestionListProps {
    suggestions: string[];
    totalCandidates: number;
}

export const SuggestionList: React.FC<SuggestionListProps> = ({ suggestions, totalCandidates }) => {
    return (
        <div style={{
            padding: '10px',
            borderLeft: '1px solid var(--border-color)',
            minWidth: '200px',
            maxHeight: '400px',
            overflowY: 'auto'
        }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Suggestions</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-absent)' }}>
                {totalCandidates} possible words
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {suggestions.slice(0, 20).map((word, i) => (
                    <li key={word} style={{
                        padding: '5px 0',
                        borderBottom: '1px solid var(--border-color)',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <span style={{ fontWeight: 'bold' }}>{word}</span>
                        {/* Maybe score later? */}
                        <span style={{ color: 'var(--color-absent)', fontSize: '0.8rem' }}>#{i + 1}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

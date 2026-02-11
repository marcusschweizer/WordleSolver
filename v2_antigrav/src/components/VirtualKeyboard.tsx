import React from 'react';

interface KeyboardProps {
    onKeyPress: (key: string) => void;
}

const KEYS = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace']
];

export const VirtualKeyboard: React.FC<KeyboardProps> = ({ onKeyPress }) => {
    const handleKeyClick = (key: string) => {
        onKeyPress(key);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '500px', margin: '20px auto' }}>
            {KEYS.map((row, i) => (
                <div key={i} style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    {row.map(key => (
                        <button
                            key={key}
                            onClick={() => handleKeyClick(key)}
                            style={{
                                flex: key === 'Enter' || key === 'Backspace' ? 1.5 : 1,
                                height: '58px',
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                                borderRadius: '4px',
                                fontSize: '1.2rem', // Slightly smaller text
                                backgroundColor: '#d3d6da', // Default gray key color
                                color: '#000000',
                            }}
                        >
                            {key === 'Backspace' ? '⌫' : key}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

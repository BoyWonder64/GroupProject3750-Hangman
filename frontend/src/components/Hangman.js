import React, { useState } from 'react';

const Game = ({ game, setGame }) => {
    const [letter, setLetter] = useState('');
    const [message, setMessage] = useState('');

    const makeGuess = async () => {
        try {
            const response = await fetch('http://localhost:4000/hangman', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ letter })
            });
            const data = await response.json();
        } catch (error) {
            const errorData = await error.response.json();
            setMessage(errorData.message);
        }
    };

    return (
        <div>
            <p>This is the hangman screen</p>
        </div>
    );
};

export default Game;
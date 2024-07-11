import React, { useEffect, useState } from 'react';

const Scores = ({ length }) => {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        const fetchScores = async () => {
            const response = await fetch(`http://localhost:4000/scores`);
            const data = await response.json();
            setScores(data);
        };
        fetchScores();
    }, [length]);

    return (
        <div>
            <p>This is the Scores screen</p>
        </div>
    );
};

export default Scores;
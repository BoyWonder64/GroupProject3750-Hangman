import React, { useState } from 'react';

const Login = ({ setGame }) => {const [name, setName] = useState('');

    const startGame = async () => {
        const response = await fetch('http://localhost:4000/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
        const data = await response.json();
   
    };

    return (
        <div>
            <p>This is the login screen</p>
        </div>
    );
};

export default Login;
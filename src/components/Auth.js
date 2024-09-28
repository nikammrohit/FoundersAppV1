// src/components/Auth.js
import React, { useState } from 'react';
import { auth } from './firebase';

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const signUp = async () => {
        try {
            await auth.createUserWithEmailAndPassword(email, password);
        } catch (error) {
            setError(error.message);
        }
    };

    const signIn = async () => {
        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Authentication</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={signUp}>Sign Up</button>
            <button onClick={signIn}>Sign In</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Auth;
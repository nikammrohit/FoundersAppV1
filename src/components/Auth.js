// src/components/Auth.js
// Import React and useState hook
import React, { useState } from 'react';
// Import auth object from firebase.js
import { auth } from './firebase';

const Auth = () => {
    // State variables for email, password, and error message
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Function to handle user sign-up
    const signUp = async () => {
        try {
              // Create a new user with email and password
            await auth.createUserWithEmailAndPassword(email, password);
        } catch (error) {
            // Set error message if sign-up fails
            setError(error.message);
        }
    };

    // Function to handle user sign-in
    const signIn = async () => {
        try {
            // Sign in user with email and password
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            // Set error message if sign-in fails
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Authentication</h2>
            {/* Input field for email */}
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            {/* Input field for password */}
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {/* Button to trigger sign-up */}
            <button onClick={signUp}>Sign Up</button>
            {/* Button to trigger sign-in */}
            <button onClick={signIn}>Sign In</button>
            {/* Display error message if any */}
            {error && <p>{error}</p>}
        </div>
    );
};

export default Auth;
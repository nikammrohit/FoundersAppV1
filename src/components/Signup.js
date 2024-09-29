import React, { useState } from 'react';
import { auth, googleProvider } from './firebase';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import '../styles/Signup.css';

const Signup = () => {
    // State variables to manage form inputs and status messages
    const [email, setEmail] = useState(''); // State for email input
    const [password, setPassword] = useState(''); // State for password input
    const [error, setError] = useState(''); // State for error messages
    const [success, setSuccess] = useState(''); // State for success messages
    const [isExistingUser, setIsExistingUser] = useState(false); // State to check if user already exists
    const [isEmailEntered, setIsEmailEntered] = useState(false); // State to check if email is entered
    const navigate = useNavigate(); // Hook to access the history instance

    // Function to handle email submission
    const handleEmailSubmit = async () => {
        try {
            console.log('Email:', email); // Log the email
            console.log('Auth instance:', auth); // Log the auth instance

            // Check if the email is already in use
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            console.log('Sign-in methods:', signInMethods); // Log the sign-in methods

            // Set user existence state based on sign-in methods
            setIsExistingUser(signInMethods.length > 0);
            setError(''); // Clear any previous errors
            setIsEmailEntered(true); // Set email entered state to true
        } catch (error) {
            console.error('Error fetching sign-in methods:', error); // Log the error
            // Handle different error cases
            switch (error.code) {
                case 'auth/invalid-email':
                    setError(`Email address ${email} is invalid.`); // Set error message for invalid email
                    break;
                case 'auth/operation-not-allowed':
                    setError('Error during sign in.'); // Set error message for operation not allowed
                    break;
                default:
                    setError(error.message); // Set error message for other errors
                    break;
            }
            setIsEmailEntered(true);
        }
    };

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password); // Attempt to sign in with email and password
            setSuccess('Logged in successfully!'); // Set success message
            setError(''); // Clear any previous errors
            navigate('/homepage'); // Redirect to homepage
        } catch (error) {
            setError(error.message); // Set error message
            setSuccess(''); // Clear any previous success messages
        }
    };

    const handleSignup = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password); // Attempt to create a new user with email and password
            setSuccess('Account created successfully!'); // Set success message
            setError(''); // Clear any previous errors
            navigate('/homepage'); // Redirect to homepage
        } catch (error) {
            // Handle different error cases
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setError(`Email address ${email} already in use.`); // Set error message for email already in use
                    break;
                case 'auth/invalid-email':
                    setError(`Email address ${email} is invalid.`); // Set error message for invalid email
                    break;
                case 'auth/operation-not-allowed':
                    setError('Error during sign up.'); // Set error message for operation not allowed
                    break;
                case 'auth/weak-password':
                    setError('Password is not strong enough. Add additional characters including special characters and numbers.'); // Set error message for weak password
                    break;
                default:
                    setError(error.message); // Set error message for other errors
                    break;
            }
            setSuccess(''); // Clear any previous success messages
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider); // Sign in with Google
            setSuccess('Logged in with Google successfully!'); // Set success message
            setError(''); // Clear any previous errors
            navigate('/homepage'); // Redirect to homepage
        } catch (error) {
            setError(error.message); // Set error message
            setSuccess(''); // Clear any previous success messages
        }
    };

    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, email); // Send password reset email
            setSuccess('Password reset email sent!'); // Set success message
            setError(''); // Clear any previous errors
        } catch (error) {
            setError(error.message); // Set error message
            setSuccess(''); // Clear any previous success messages
        }
    };

    return (
        <div className="signup-page">
            <div className="container">
                <h2>Welcome to Founders</h2>
                <p>Log In or Register with your email.</p>
                {!isEmailEntered ? (
                    <>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="input"
                        />
                        <button onClick={handleEmailSubmit} className="button">Continue</button>
                    </>
                ) : (
                    <>
                        {isExistingUser ? (
                            <>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="input"
                                />
                                <button onClick={handleLogin} className="button">Log In</button>
                                <button onClick={handlePasswordReset} className="button">Forgot Password?</button>
                            </>
                        ) : (
                            <>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="input"
                                />
                                <button onClick={handleSignup} className="button">Sign Up</button>
                            </>
                        )}
                    </>
                )}
                <button onClick={handleGoogleSignIn} className="button google-signin">Sign In with Google</button>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
            </div>
        </div>
    );
};

export default Signup;
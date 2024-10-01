import React, { useState } from 'react';
import { auth, firestore } from './firebase';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail, signInWithPopup, sendPasswordResetEmail, GoogleAuthProvider } from 'firebase/auth';
import { collection, doc, setDoc, query, where, getDocs, getDoc } from 'firebase/firestore';
import '../styles/Signup.css';

const Signup = () => {
    // State variables to manage form inputs and status messages
    const [email, setEmail] = useState(''); // State for email input
    const [password, setPassword] = useState(''); // State for password input
    const [name, setName] = useState(''); // State for name input
    const [isNameSet, setIsNameSet] = useState(false); // State to check if name is set

    const [error, setError] = useState(''); // State for error messages
    const [success, setSuccess] = useState(''); // State for success messages

    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [isUsernameSet, setIsUsernameSet] = useState(false);

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

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          setSuccess('Account created successfully!');
          setError('');
          setIsUsernameSet(true);
        } catch (error) {
          switch (error.code) {
            case 'auth/email-already-in-use':
              setError(`Email address ${email} already in use.`);
              break;
            case 'auth/invalid-email':
              setError(`Email address ${email} is invalid.`);
              break;
            case 'auth/operation-not-allowed':
              setError('Error during sign up.');
              break;
            case 'auth/weak-password':
              setError('Password is not strong enough. Add additional characters including special characters and numbers.');
              break;
            default:
              setError(error.message);
              break;
          }
          setSuccess('');
        }
      }

    const handleSetUsername = async () => {
        try {
          // Check if the username is unique
          const usernamesQuery = query(collection(firestore, 'profiles'), where('username', '==', username));
          const querySnapshot = await getDocs(usernamesQuery);
          if (!querySnapshot.empty) {
            setUsernameError('Username already taken. Please choose another one.');
            return;
          }
    
          // Set the username in the user's profile
          const user = auth.currentUser;
          const profileRef = doc(collection(firestore, 'profiles'), user.uid);
          await setDoc(profileRef, { username, email: user.email });
          setIsNameSet(true);
        } catch (error) {
          console.error('Error setting username:', error);
        }
      };
    
    const handleSetName = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                await setDoc(doc(collection(firestore, 'profiles'), user.uid), {
                    name: name,
                    email: user.email,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }, { merge: true });
                navigate('/homepage');
            } catch (error) {
                setError(error.message);
            }
        } else {
            setError('No user is signed in.');
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            // Check if the user already has a profile
            const profileRef = doc(collection(firestore, 'profiles'), user.uid);
            const profileDoc = await getDoc(profileRef);

            if (profileDoc.exists()) {
                // User exists, navigate to profile
                navigate('/homepage');
            } else {
                // User does not exist, set username
                setIsUsernameSet(true);
            }
        } catch (error) {
            setError(error.message);
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
                {!isNameSet ? (
                    <>
                        {!isUsernameSet ? (
                        <>
                            {!isEmailEntered ? (
                            <>
                                <p>Log In or Register with your email.</p>
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
                                <form onSubmit={handleSignUp}>
                                    <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="input"
                                    required
                                    />
                                    <button type="submit" className="button">Sign Up</button>
                                    {error && <p style={{ color: 'red' }}>{error}</p>}
                                    {success && <p style={{ color: 'green' }}>{success}</p>}
                                </form>
                                )}
                            </>
                            )}
                        </>
                        ) : (
                        <div>
                            <p>What should we call you?</p>
                            <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input"
                            />
                            <button onClick={handleSetUsername} className="button">Set Username</button>
                            {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
                        </div>
                        )} 
                    </>
                ) : (
                <div className="enter-name-page">
                    <p>What is your name?</p>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className="input"
                    />
                    <button onClick={handleSetName} className="button">Submit</button>
                    {error && <p className="error">{error}</p>}
                </div>
                )}
                <button onClick={handleGoogleSignIn} className="button google-signin">Continue with Google</button>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
            </div>
        </div>
    );
};

export default Signup;
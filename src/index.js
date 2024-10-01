import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { auth, firestore, collection, doc, getDoc, setDoc } from './components/firebase';
import { onAuthStateChanged } from 'firebase/auth';


// Function to create a profile document
const createProfile = async (userId, profileData) => {
  try {
    const profileRef = doc(collection(firestore, 'profiles'), userId);
    const profileDoc = await getDoc(profileRef);
    if (!profileDoc.exists()) {
      await setDoc(profileRef, profileData);
      console.log('Profile created successfully');
    } else {
      console.log('Profile already exists');
    }
  } catch (error) {
    console.error('Error creating profile:', error);
  }
};

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, create a profile document if it doesn't exist
    const userId = user.uid;
    const profileData = {
      name: user.displayName || 'Anonymous',
      email: user.email || 'No email',
      profilePictureUrl: user.photoURL || '',
      bio: 'New user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    createProfile(userId, profileData);
  } else {
    console.log('No user is signed in.');
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
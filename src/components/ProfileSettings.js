// src/components/ProfileSettings.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from './firebase';
import { collection, doc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import '../styles/ProfileSettings.css';

const ProfileSettings = () => {
  const { userId } = useParams(); // Get userId from route parameters
  const navigate = useNavigate(); // Initialize navigate function
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newBio, setNewBio] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  const fetchProfile = async (userId) => {
    try {
      console.log(`Fetching profile for userId: ${userId}`); // Debugging statement
      const profileRef = doc(collection(firestore, 'profiles'), userId);
      const profileDoc = await getDoc(profileRef);
      if (profileDoc.exists()) {
        console.log('Profile data:', profileDoc.data()); // Debugging statement
        setProfile(profileDoc.data());
        setNewBio(profileDoc.data().bio || ''); // Set the bio in the input field
        setNewUsername(profileDoc.data().username || ''); // Set the username in the input field
        setNewName(profileDoc.data().name || ''); // Set the name in the input field
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      // Check if the new username is already taken
      const usernameQuery = query(collection(firestore, 'profiles'), where('username', '==', newUsername));
      const usernameSnapshot = await getDocs(usernameQuery);
      if (!usernameSnapshot.empty && newUsername !== profile.username) {
        setError('Username is already taken');
        return;
      }

      const profileRef = doc(collection(firestore, 'profiles'), userId);
      await updateDoc(profileRef, { bio: newBio, username: newUsername, name: newName });
      setProfile((prevProfile) => ({ ...prevProfile, bio: newBio, username: newUsername, name: newName }));
      setError('');
      navigate(`/profile/${userId}`); // Redirect to Profile.js page
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile');
    }
  };

  useEffect(() => {
    console.log(`useEffect triggered with userId: ${userId}`); // Debugging statement
    if (userId) {
      fetchProfile(userId);
    }
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>No profile found.</div>;
  }

  return (
    <div className="profile-settings-container">
      <div className="profile-info">
        <h1>Profile Settings</h1>
        <div className="input-wrapper">
          <p>Name:</p>
          <input type="text" className="name-input" value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <p>Email: {profile.email}</p>
        <div className="input-wrapper">
          <p>Username:</p>
          <input type="text" className="username-input" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
        </div>
        <div className="bio-section">
          <textarea
            className="bio-input"
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            placeholder="Enter your bio"
          />
          <button onClick={updateProfile} className="save-bio-button">Save Profile</button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default ProfileSettings;
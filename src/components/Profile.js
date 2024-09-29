// src/components/Profile.js
// Import React and hooks
import React, { useState, useEffect } from 'react';
// Import firestore and auth objects from firebase.js
import { firestore, auth } from './firebase';

const Profile = () => {
  // State variable for storing profile data
  const [profile, setProfile] = useState({});

  useEffect(() => {
    // Fetch user's profile from Firestore on component mount
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        // Get reference to user's profile document
        const profileRef = firestore.collection('profiles').doc(user.uid);
        // Fetch profile document
        const doc = await profileRef.get();
        if (doc.exists) {
          // Update profile state with fetched data
          setProfile(doc.data());
        }
      }
    };
    fetchProfile();
  }, []);

  // Function to update user's profile in Firestore
  const updateProfile = () => {
    const user = auth.currentUser;
    if (user) {
      // Set profile document with updated data
      firestore.collection('profiles').doc(user.uid).set(profile);
    }
  };

  return (
    <div>
      {/* Input field for profile name */}
      <input type="text" value={profile.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Name" />
      {/* Input field for profile startup */}
      <input type="text" value={profile.startup || ''} onChange={(e) => setProfile({ ...profile, startup: e.target.value })} placeholder="Startup" />
      {/* Button to update profile */}
      <button onClick={updateProfile}>Update Profile</button>
    </div>
  );
};

export default Profile;
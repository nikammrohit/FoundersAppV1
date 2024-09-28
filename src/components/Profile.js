// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { firestore, auth } from './firebase';

const Profile = () => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const profileRef = firestore.collection('profiles').doc(user.uid);
        const doc = await profileRef.get();
        if (doc.exists) {
          setProfile(doc.data());
        }
      }
    };
    fetchProfile();
  }, []);

  const updateProfile = () => {
    const user = auth.currentUser;
    if (user) {
      firestore.collection('profiles').doc(user.uid).set(profile);
    }
  };

  return (
    <div>
      <input type="text" value={profile.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Name" />
      <input type="text" value={profile.startup || ''} onChange={(e) => setProfile({ ...profile, startup: e.target.value })} placeholder="Startup" />
      <button onClick={updateProfile}>Update Profile</button>
    </div>
  );
};

export default Profile;
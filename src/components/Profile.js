import React, { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { firestore } from './firebase';
import {collection, doc, getDoc, updateDoc} from 'firebase/firestore';

const Profile = () => {
  const { userId } = useParams(); // Get userId from route parameters
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newBio, setNewBio] = useState('');
  const navigate = useNavigate();

  const fetchProfile = async (userId) => {
    try {
      console.log('Fetching profile for userId:', userId); // Debugging statement
      const profileRef = doc(collection(firestore, 'profiles'), userId);
      const profileDoc = await getDoc(profileRef);
      if (profileDoc.exists()) {
        console.log('Profile data:', profileDoc.data()); // Debugging statement
        setProfile(profileDoc.data());
        setNewBio(profileDoc.data().bio || ''); // Set the bio in the input field
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBio = async () => {
    try {
      const profileRef = doc(collection(firestore, 'profiles'), userId);
      await updateDoc(profileRef, { bio: newBio });
      setProfile((prevProfile) => ({ ...prevProfile, bio: newBio }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

  const handleProfilePictureClick = () => {
    document.getElementById('profilePictureInput').click();
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        const profileRef = doc(collection(firestore, 'profiles'), userId);
        await updateDoc(profileRef, { profilePictureUrl: base64String });
        setProfile((prevProfile) => ({ ...prevProfile, profilePictureUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
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
    <div>
      <h1>{profile.name}</h1>
      <button onClick={() => navigate('/profile-settings')}>Edit Profile</button>
      <p>{profile.username}</p>
      <p>Email: {profile.email}</p>
      <img
        src={profile.profilePictureUrl}
        alt="Profile"
        onClick={handleProfilePictureClick}
        style={{ cursor: 'pointer' }}
      />
      <input
        type="file"
        id="profilePictureInput"
        style={{ display: 'none' }}
        onChange={handleProfilePictureChange}
      />

      <div>
        <p>
          Bio: {profile.bio} 
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </p>
        {isEditing && (
          <div>
            <input
              type="text"
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
            />
            <button onClick={updateBio}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Profile;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { firestore, auth } from './firebase';
import {collection, doc, getDoc, updateDoc} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/Profile.css';

const Profile = () => {
  const { userId } = useParams(); // Get userId from route parameters
  const [profile, setProfile] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async (userId) => {
    try {
      console.log('Fetching profile for userId:', userId); // Debugging statement
      const profileRef = doc(collection(firestore, 'profiles'), userId);
      const profileDoc = await getDoc(profileRef);
      if (profileDoc.exists()) {
        console.log('Profile data:', profileDoc.data()); // Debugging statement
        setProfile(profileDoc.data());
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
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

  const handleEditProfileClick = () => {
    navigate(`/profile-settings/${userId}`);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsOwner(user.uid === userId); // Check if the logged-in user is the owner of the profile
        fetchProfile(userId);
      } else {
        console.log('No user is signed in.');
        navigate('/login'); // Redirect to login if no user is signed in
      }
    });
  }, [userId, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>No profile found.</div>;
  }

  return (
    <div className="profile-container">
      <button className="back-button" onClick={() => navigate('/homepage')}>&lt;</button>
      <div className="profile-header">
        {profile.profilePictureUrl ? (
          <img
            src={profile.profilePictureUrl}
            alt="Profile"
            className="profile-picture"
            onClick={handleProfilePictureClick}
          />
        ) : (
          <div className="profile-icon" onClick={handleProfilePictureClick}>
            {profile.username.charAt(0).toUpperCase()}
          </div>
        )}
        <input
          type="file"
          id="profilePictureInput"
          style={{ display: 'none' }}
          onChange={handleProfilePictureChange}
        />
        <div className="profile-info">
          <h1>{profile.name}</h1>
          {isOwner && (
            <button onClick={handleEditProfileClick} className="edit-profile-button">Edit Profile</button>
          )}
          <div className="profile-username-container">
            <p className="username">@{profile.username}</p>
            {!isOwner && (
              <button className="message-button" onClick={() => navigate(`/message/${userId}`)}>Message</button>
            )}
          </div>
        </div>
      </div>
      <div className="profile-bio">
        <p>
          {profile.bio}
        </p>
      </div>
    </div>
  );
};

export default Profile;
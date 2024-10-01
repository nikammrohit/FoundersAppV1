import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore, auth } from './firebase'; // Ensure these are correctly imported
import { collection, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/Homepage.css';
import Footer from './Footer'; // Import the Footer component

const Homepage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [usernameInitial, setUsernameInitial] = useState('P');

  const handleProfileClick = () => {
    navigate(`/profile/${userId}`); // Redirect to the user's profile page
  };

  // Function to fetch profile data
  const fetchProfile = async (userId) => {
    try {
      const profileRef = doc(collection(firestore, 'profiles'), userId);
      const profileDoc = await getDoc(profileRef);
      if (profileDoc.exists()) {
        console.log('Profile data:', profileDoc.data());
        const username = profileDoc.data().username;
        if (username) {
          setUsernameInitial(username.charAt(0).toUpperCase());
        }
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchProfile(user.uid);
      } else {
        console.log('No user is signed in.');
      }
    });
  }, []);

  return (
    <div className='background'>
      <button onClick={handleProfileClick} className="user-profile-button">
        {usernameInitial}
      </button>

      <div className="headerTitle">
        <h1>Welcome to the Homepage!</h1>
        <p>You are now logged in.</p>
      </div>
      
      <Footer />
    </div>
  );
};

export default Homepage;
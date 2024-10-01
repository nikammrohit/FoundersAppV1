import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore, auth } from './firebase'; // Ensure these are correctly imported
import { collection, query, where, doc, getDoc, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/Homepage.css';
import Footer from './Footer'; // Import the Footer component
import { FaSearch } from 'react-icons/fa'; // Import Font Awesome search icon

const Homepage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [usernameInitial, setUsernameInitial] = useState('P');

  const [searchUsername, setSearchUsername] = useState('');
  const [searchedProfile, setSearchedProfile] = useState(null);
  const [error, setError] = useState('');

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

  const handleSearch = async () => {
    try {
      const profilesRef = collection(firestore, 'profiles');
      const q = query(profilesRef, where('username', '==', searchUsername));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const profileDoc = querySnapshot.docs[0];
        setSearchedProfile(profileDoc.data());
        setError('');
      } else {
        setSearchedProfile(null);
        setError('No user found with that username.');
      }
    } catch (error) {
      console.error('Error searching profile:', error);
      setError('Error searching profile.');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
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
      <div className="search-bar-container">
        <div className="search-bar">
          <input
            type="text"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            placeholder="Search by username"
            className="input"
            onKeyDown={handleKeyDown} // Add this line
          />
          <button onClick={handleSearch} className="search-button">
            <FaSearch className="search-icon" />
          </button>
        </div>
      </div>

      <button onClick={handleProfileClick} className="user-profile-button">
        {usernameInitial}
      </button>

      <div className="headerTitle">
        <h1>Welcome to the Homepage!</h1>
        <p>You are now logged in.</p>
      </div>

      {searchedProfile && (
        <div className="searched-profile">
          <h2>Profile Found:</h2>
          <p>Username: {searchedProfile.username}</p>
          <p>Name: {searchedProfile.name}</p>
          <p>Email: {searchedProfile.email}</p>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <Footer />
    </div>
  );
};

export default Homepage;
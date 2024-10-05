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

  const [searchTerm, setSearchTerm] = useState('');
  const [searchedProfiles, setSearchedProfiles] = useState([]);
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
      
      // Query for username
      const usernameQuery = query(profilesRef, where('username', '==', searchTerm));
      const usernameSnapshot = await getDocs(usernameQuery);
      
      // Query for name
      const nameQuery = query(profilesRef, where('name', '==', searchTerm));
      const nameSnapshot = await getDocs(nameQuery);
      
      // Combine results
      const profiles = [
        ...usernameSnapshot.docs.map(doc => doc.data()),
        ...nameSnapshot.docs.map(doc => doc.data())
      ];
    
      if (profiles.length > 0) {
        setSearchedProfiles(profiles);
        setError('');
      } else {
        setSearchedProfiles([]);
        setError('No user found with that username or name.');
      }

    } catch (error) {
      console.error('Error searching profiles:', error);
      setError('Error searching profiles.');
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
    <div className='homepage-background'>
      <div className="homepage-search-bar-container">
        <div className="homepage-search-bar">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for User"
            className="homepage-input"
            onKeyDown={handleKeyDown} // Add this line
          />
          <button onClick={handleSearch} className="homepage-search-button">
            <FaSearch className="homepage-search-icon" />
          </button>
        </div>
      </div>

      <button onClick={handleProfileClick} className="homepage-user-profile-button">
        {usernameInitial}
      </button>

      <div className="homepage-headerTitle">
        <h1>Welcome to the Homepage!</h1>
        <p>You are now logged in.</p>
      </div>

      {searchedProfiles && searchedProfiles.length > 0 && (
        <div className="homepage-searched-profile">
          {searchedProfiles.map((profile, index) => (
            <div key={index} className="homepage-searched-profile">
              {profile.profilePictureUrl ? (
                <img
                  src={profile.profilePictureUrl}
                  alt="Profile"
                  className="homepage-profile-picture"
                />
              ) : (
                <div className="homepage-profile-icon">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="homepage-profile-info">
                <h2>{profile.name}</h2>
                <p className="homepage-username">@{profile.username}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {error && <p className="homepage-error">{error}</p>}

      <Footer />
    </div>
  );
};

export default Homepage;
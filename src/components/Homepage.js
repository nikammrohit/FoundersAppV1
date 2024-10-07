import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore, auth } from './firebase'; // Ensure these are correctly imported
import { collection, doc, getDoc, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/Homepage.css';
import Footer from './Footer'; // Import the Footer component
import { FaSearch } from 'react-icons/fa'; // Import Font Awesome search icon
import CreatePostModal from './CreatePostModal.js'; // Import the CreatePostModal component

const Homepage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [usernameInitial, setUsernameInitial] = useState('P');

  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [posts, setPosts] = useState([]); // State for posts

  const [searchTerm, setSearchTerm] = useState('');
  const [searchedProfiles, setSearchedProfiles] = useState([]);
  const [error, setError] = useState('');

  const handleProfileClick = (userId) => {
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
      const querySnapshot = await getDocs(profilesRef);
      const searchTermLower = searchTerm.toLowerCase();

      const profiles = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() })) // Include document ID
        .filter(profile => 
          profile.username.toLowerCase().includes(searchTermLower) ||
          profile.name.toLowerCase().includes(searchTermLower)
        );
    
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
        fetchPosts(); // Fetch posts when the user is authenticated
      } else {
        navigate('/login'); // Redirect to login if no user is signed in
      }
    });
  }, [navigate]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    handleSearch();
  };

  // Function to fetch posts
  const fetchPosts = async () => {
    try {
      const postsRef = collection(firestore, 'posts');
      const q = query(postsRef, orderBy('createdAt', 'desc'));
      const postsSnapshot = await getDocs(q);
      const postsData = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleMessagesClick = () => {
    navigate(`/message-log/${userId}`); // Redirect to the user's messages page
  };
  
  const createPost = () => {
    setIsModalOpen(true);
  };

  const handleSubmitPost = (content) => {
    console.log('Post content:', content);
    handleCreatePost(content);
    // Add logic to handle post submission, e.g., save to Firestore
  };

  const handleCreatePost = async (postContent) => {
    if (postContent.trim() === '') return;

    try {
      const newPost = {
        content: postContent,
        createdAt: new Date(),
        userId: userId,
      };
      const docRef = await addDoc(collection(firestore, 'posts'), newPost);
      newPost.id = docRef.id; // Add the document ID to the new post
      setPosts([newPost, ...posts]); // Update the state to include the new post
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className='homepage-background'>
      <div className="homepage-search-bar-container">
        <div className="homepage-search-bar">
          <button onClick={createPost} className="homepage-createPost-button">
            <p className="homepage-createPost-icon">+</p>
          </button>
          <input
            type="text"
            value={searchTerm}
            /*onChange={(e) => setSearchTerm(e.target.value)}*/
            onChange={handleInputChange}
            placeholder="Search for User"
            className="homepage-input"
            onKeyDown={handleKeyDown} // Add this line
          />
          <button onClick={handleSearch} className="homepage-search-button">
            <FaSearch className="homepage-search-icon" />
          </button>
          <button onClick={handleMessagesClick} className="homepage-message-button">
            <p className="homepage-message-icon">💬</p>
          </button>
        </div>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreatePost={handleCreatePost} // Pass the handleCreatePost function
        onSubmit={handleSubmitPost}
      />

      <div className="posts-container">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              {post.userProfilePictureUrl ? (
                <img src={post.userProfilePictureUrl} alt="Profile" className="post-profile-picture" />
              ) : (
                <div className="post-profile-icon">
                  {usernameInitial}
                </div>
              )}
              <span className="post-username">{post.username}</span>
            </div>
            <div className="post-content">
              <p>{post.content}</p>
            </div>
            <div className="post-footer">
              <small>{new Date(post.createdAt.seconds * 1000).toLocaleString()}</small>
              <div className="post-actions">
                <button className="post-action-button">❤️</button>
                <button className="post-action-button">💬</button>
                <button className="post-action-button">🔗</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => handleProfileClick(userId)} className="homepage-user-profile-button">
        {usernameInitial}
      </button>

      {searchedProfiles && searchedProfiles.length > 0 && (
        <div className="homepage-searched-profile">
          {searchedProfiles.map((profile, index) => (
            <div
              key={index}
              className="homepage-searched-profile"
              onClick={() => handleProfileClick(profile.id)} // Add onClick handler
              style={{ cursor: 'pointer' }} // Add cursor pointer style
            >
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
      <div className="homepage-headerTitle">
        <h1>Welcome to the Homepage!</h1>
        <p>You are now logged in.</p>
      </div>
      <Footer />
    </div>
  );
};

export default Homepage;
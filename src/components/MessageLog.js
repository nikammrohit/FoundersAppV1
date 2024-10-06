import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore, auth } from './firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import '../styles/MessageLog.css';

const MessageLog = () => {
  const [conversations, setConversations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      const user = auth.currentUser;
      if (user) {
        setCurrentUser(user);
        console.log('Current user:', user.uid); // Debugging log
        const q = query(collection(firestore, 'messages'), where('participants', 'array-contains', user.uid));
        const querySnapshot = await getDocs(q);
        const convos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched conversations:', convos); // Debugging log
        setConversations(convos);

        const userIds = new Set();
        convos.forEach(conversation => {
          conversation.participants.forEach(participant => {
            if (participant !== user.uid) {
              userIds.add(participant);
            }
          });
        });

        const userDetailsPromises = Array.from(userIds).map(async userId => {
          const userDoc = await getDoc(doc(firestore, 'profiles', userId));
          if (userDoc.exists()) {
            console.log('Fetched user details:', userDoc.data()); // Debugging log
            return { id: userId, ...userDoc.data() };
          } else {
            console.log('No such user:', userId); // Debugging log
            return { id: userId, name: 'Unknown', username: 'Unknown' };
          }
        });

        const userDetailsArray = await Promise.all(userDetailsPromises);
        const userDetailsMap = userDetailsArray.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});

        console.log('User details map:', userDetailsMap); // Debugging log
        setUserDetails(userDetailsMap);
      } else {
        console.log('No user is authenticated'); // Debugging log
      }
    };

    fetchConversations();
  }, []);

  const handleConversationClick = (conversationId) => {
    navigate(`/message/${conversationId}`);
  };

  return (
    <div className="message-log-container">
      <h1>Messages</h1>
      <div className="message-log-conversations">
        {conversations.map((conversation, index) => (
          <div
            key={index}
            className="message-log-conversation"
            onClick={() => handleConversationClick(conversation.id)}
          >
            {conversation.participants
              .filter(participant => currentUser && participant !== currentUser.uid)
              .map(participant => (
                <div key={participant} className="message-log-participant">
                  <div className="message-log-participant-details">
                    <strong>{userDetails[participant] ? userDetails[participant].name : 'Unknown'}</strong>
                    <div>@{userDetails[participant] ? userDetails[participant].username : 'Unknown'}</div>
                  </div>
                  {userDetails[participant] && userDetails[participant].profilePictureUrl ? (
                    <img
                      src={userDetails[participant].profilePictureUrl}
                      alt="Profile"
                      className="message-log-profile-picture"
                    />
                  ) : (
                    <div className="message-log-profile-icon">
                      {userDetails[participant] ? userDetails[participant].username.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageLog;
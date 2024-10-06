import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore, auth } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../styles/MessageLog.css';

const MessageLog = () => {
  const [conversations, setConversations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
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
      <div className="conversations">
        {conversations.map((conversation, index) => (
          <div
            key={index}
            className="conversation"
            onClick={() => handleConversationClick(conversation.id)}
          >
            <p>{conversation.participants.filter(participant => participant !== currentUser.uid).join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageLog;
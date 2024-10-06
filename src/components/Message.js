import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { firestore, auth } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import '../styles/Message.css';

const Message = () => {
  const { id } = useParams(); // This is the userId of the user being messaged
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null); // Create a ref for the messages end

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const docRef = doc(firestore, 'messages', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMessages(docSnap.data().messages);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        setError('Error fetching messages');
        console.error('Error fetching messages:', error);
      }
    };

    const fetchCurrentUser = async () => {
      const user = auth.currentUser;
      if (user) {
        setCurrentUser(user);
      }
    };

    fetchMessages();
    fetchCurrentUser();
  }, [id]);

  const handleSendMessage = async () => {
    if (!currentUser) {
      setError('No user is signed in.');
      return;
    }

    try {
      const docRef = doc(firestore, 'messages', id);
      const docSnap = await getDoc(docRef);

      const newMessage = {
        senderId: currentUser.uid,
        text: message,
        timestamp: new Date().toISOString(),
        participants: [currentUser.uid, id] // Ensure participants field is set
      };

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          messages: [...docSnap.data().messages, newMessage],
          participants: [...new Set([...docSnap.data().participants, ...newMessage.participants])]
        });
      } else {
        await setDoc(docRef, {
          messages: [newMessage],
          participants: newMessage.participants
        });
      }

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
      setError('');
      scrollToBottom(); // Scroll to bottom when a message is sent
    } catch (error) {
      setError('Error sending message');
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom when messages are updated
  }, [messages]);

  return (
    <div className="message-container">
      <h1 className="message-header">Chat</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.senderId === currentUser?.uid ? 'sent' : 'received'}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Add a div to act as the scroll target */}
      </div>
      <div className="message-input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown} // Add this line to handle Enter key press
          placeholder="Type your message"
          className="message-input"
        />
        <button onClick={handleSendMessage} className="send-button">Send</button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Message;
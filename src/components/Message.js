import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import '../styles/Message.css';

const Message = () => {
  const { id } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

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

    fetchMessages();
  }, [id]);

  const handleSendMessage = async () => {
    try {
      const docRef = doc(firestore, 'messages', id);
      await setDoc(docRef, { messages: [...messages, message] }, { merge: true });
      setMessages([...messages, message]);
      setMessage('');
    } catch (error) {
      setError('Error sending message');
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="message-container">
      <h1>Message User</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={handleSendMessage}>Send</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Message;
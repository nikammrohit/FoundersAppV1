// src/components/Messaging.js
// Import React and hooks
import React, { useState, useEffect } from 'react';
// Import firestore and auth objects from firebase.js
import { firestore, auth } from './firebase';
// Import serverTimestamp function from firebase/firestore
import { serverTimestamp } from 'firebase/firestore';

const Messaging = () => {
    // State variables for messages and new message input
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // Fetch messages from Firestore on component mount
    useEffect(() => {
        const fetchMessages = () => {
            // Listen for changes in the 'messages' collection, ordered by timestamp
            firestore.collection('messages').orderBy('timestamp').onSnapshot(snapshot => {
                // Update messages state with fetched data
                setMessages(snapshot.docs.map(doc => doc.data()));
            });
        };
        fetchMessages();
    }, []);

    // Function to send a new message to Firestore
    const sendMessage = () => {
        const user = auth.currentUser;
        if (user) {
            // Add new message with text, user ID, and timestamp
            firestore.collection('messages').add({
                text: newMessage,
                user: user.uid,
                timestamp: serverTimestamp()
            });
            // Clear new message input field
            setNewMessage('');
        }
    };

    return (
        <div>
            <div>
                {/* Display list of messages */}
                {messages.map((message, index) => (
                    <div key={index}>{message.text}</div>
                ))}
            </div>
            {/* Input field for new message */}
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message" />
            {/* Button to send new message */}
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Messaging;
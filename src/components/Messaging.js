// src/components/Messaging.js
import React, { useState, useEffect } from 'react';
import { firestore, auth } from './firebase';
import { serverTimestamp } from 'firebase/firestore';

const Messaging = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = () => {
            firestore.collection('messages').orderBy('timestamp').onSnapshot(snapshot => {
                setMessages(snapshot.docs.map(doc => doc.data()));
            });
        };
        fetchMessages();
    }, []);

    const sendMessage = () => {
        const user = auth.currentUser;
        if (user) {
            firestore.collection('messages').add({
                text: newMessage,
                user: user.uid,
                timestamp: serverTimestamp()
            });
            setNewMessage('');
        }
    };

    return (
        <div>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>{message.text}</div>
                ))}
            </div>
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message" />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Messaging;
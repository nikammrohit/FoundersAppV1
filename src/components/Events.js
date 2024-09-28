// src/components/Events.js
import React, { useState, useEffect } from 'react';
import { firestore } from './firebase';
import { serverTimestamp } from 'firebase/firestore';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState('');

    useEffect(() => {
        const fetchEvents = () => {
            firestore.collection('events').onSnapshot(snapshot => {
                setEvents(snapshot.docs.map(doc => doc.data()));
            });
        };
        fetchEvents();
    }, []);

    const addEvent = () => {
        firestore.collection('events').add({
            name: newEvent,
            timestamp: serverTimestamp()
        });
        setNewEvent('');
    };

    return (
        <div>
            <div>
                {events.map((event, index) => (
                    <div key={index}>{event.name}</div>
                ))}
            </div>
            <input type="text" value={newEvent} onChange={(e) => setNewEvent(e.target.value)} placeholder="Add a new event" />
            <button onClick={addEvent}>Add Event</button>
        </div>
    );
};

export default Events;
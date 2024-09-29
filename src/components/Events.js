// src/components/Events.js
// Import React and hooks
import React, { useState, useEffect } from 'react';
// Import firestore object from firebase.js
import { firestore } from './firebase';
// Import serverTimestamp function from firebase/firestore
import { serverTimestamp } from 'firebase/firestore';

const Events = () => {
    // State variables for events and new event input
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState('');

    // Fetch events from Firestore on component mount
    useEffect(() => {
        const fetchEvents = () => {
            // Listen for changes in the 'events' collection
            firestore.collection('events').onSnapshot(snapshot => {
                // Update events state with fetched data
                setEvents(snapshot.docs.map(doc => doc.data()));
            });
        };
        fetchEvents();
    }, []);

    // Function to add a new event to Firestore
    const addEvent = () => {
        // Add new event with name and timestamp
        firestore.collection('events').add({
            name: newEvent,
            timestamp: serverTimestamp()
        });
        // Clear new event input field
        setNewEvent('');
    };

    return (
        <div>
            <div>
                {/* Display list of events */}
                {events.map((event, index) => (
                    <div key={index}>{event.name}</div>
                ))}
            </div>
            {/* Input field for new event */}
            <input type="text" value={newEvent} onChange={(e) => setNewEvent(e.target.value)} placeholder="Add a new event" />
            {/* Button to add new event */}
            <button onClick={addEvent}>Add Event</button>
        </div>
    );
};

export default Events;
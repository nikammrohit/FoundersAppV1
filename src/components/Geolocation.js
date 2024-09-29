// src/components/Geolocation.js
// Import React and hooks
import React, { useEffect, useState } from 'react';
// Import firestore and auth objects from firebase.js
import { firestore, auth } from './firebase';

const Geolocation = () => {
    // State variable for storing location
    const [location, setLocation] = useState({});

    // Get user's current location on component mount
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            // Update location state with latitude and longitude
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        });
    }, []);

    // Function to save location to Firestore
    const saveLocation = () => {
        const user = auth.currentUser;
        if (user) {
            // Update user's profile document with location
            firestore.collection('profiles').doc(user.uid).update({ location });
        }
    };

    return (
        <div>
            {/* Button to save location */}
            <button onClick={saveLocation}>Save Location</button>
        </div>
    );
};

export default Geolocation;
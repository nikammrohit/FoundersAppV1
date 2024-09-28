// src/components/Geolocation.js
import React, { useEffect, useState } from 'react';
import { firestore, auth } from './firebase';

const Geolocation = () => {
    const [location, setLocation] = useState({});

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        });
    }, []);

    const saveLocation = () => {
        const user = auth.currentUser;
        if (user) {
            firestore.collection('profiles').doc(user.uid).update({ location });
        }
    };

    return (
        <div>
            <button onClick={saveLocation}>Save Location</button>
        </div>
    );
};

export default Geolocation;
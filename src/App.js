// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import Profile from './components/Profile';
import Message from './components/Message'; // Import the Message component
import MessageLog from './components/MessageLog'; // Import the MessageLog component
import Geolocation from './components/Geolocation';
import Events from './components/Events';
import Home from './components/Home';
import Signup from './components/Signup';
import ProfileSettings from './components/ProfileSettings';
import './App.css';
import Homepage from './components/Homepage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Use element prop and pass the component as JSX */}
        <Route path="/" element={<Home />} /> {/* Home route */}
        <Route path="/signup" element={<Signup />} /> {/* Signup route */}
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/message/:id" element={<Message />} /> {/* Add route for Message component */}
        <Route path="/message-log/:id" element={<MessageLog />} /> {/* Add route for Message component */}
        <Route path="/geolocation" element={<Geolocation />} />
        <Route path="/events" element={<Events />} />
        <Route path="/profile-settings/:userId" element={<ProfileSettings />} />
      </Routes>
    </Router>
  );
};

export default App;

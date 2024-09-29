// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import Profile from './components/Profile';
import Geolocation from './components/Geolocation';
import Messaging from './components/Messaging';
import Events from './components/Events';
import Home from './components/Home';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Use element prop and pass the component as JSX */}
        <Route path="/" element={<Home />} /> {/* Add Home route */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/geolocation" element={<Geolocation />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/events" element={<Events />} />
      </Routes>
    </Router>
  );
};

export default App;

// src/components/Home.js
// Import React and necessary hooks
//import React, { useEffect, useState } from 'react';
// Import the fetchUsers function from the API module
//import { fetchUsers } from '../services/api';
import LandingPage from './LandingPage';
import Header from './Header';
import Footer from './Footer';

// Define the Home component
const Home = () => {

    return (
        <div> 
            <Header />
            <LandingPage />
            <Footer />
        </div>
    );
};

// Export the Home component as the default export
export default Home;
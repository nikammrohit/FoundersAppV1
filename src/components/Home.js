// src/components/Home.js
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
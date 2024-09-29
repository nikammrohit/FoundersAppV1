//import React, { useState, useEffect } from 'react';
import '../styles/LandingPage.css';

const LandingPage = () => {
	
	const handleScroll = () => {
		const projectsSection = document.getElementById('projects');
		if (projectsSection) {
			projectsSection.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<div className="landing-about-wrapper">
			<section id="landing-page" className="landing-page">
				<h1>Welcome to Founders</h1>
				<p>Where Startup Journeys Meet.</p>
				<button onClick={handleScroll} className="cta-button">Start Your Journey</button>
			</section>
		</div>
	);
};

export default LandingPage;
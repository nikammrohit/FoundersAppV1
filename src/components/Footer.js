import React, { useEffect, useState } from 'react';
import '../styles/Footer.css';

const Footer = () => {
	const [localTime, setLocalTime] = useState(new Date().toLocaleTimeString());

	useEffect(() => {
		const timer = setInterval(() => {
			setLocalTime(new Date().toLocaleTimeString());
		}, 1000);

		return () => clearInterval(timer); // Cleanup interval on component unmount
	}, []);

	return (
		<footer className="footer">
			<div className="footer-content">
				<span>© 2024 Founders. All rights reserved.</span>
				<span className="local-time">Local Time: {localTime}</span>
			</div>
		</footer>
	);
};

export default Footer;
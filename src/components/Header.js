import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
	const navigate = useNavigate();

	return (
		<header className="header">
			<div className="logo">
				<button onClick={() => navigate('/')} className="logo-button">Founders</button>
			</div>
			<nav className="nav">
				<ul>
					<li>
						<button onClick={() => navigate('/signup')}>Login</button>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
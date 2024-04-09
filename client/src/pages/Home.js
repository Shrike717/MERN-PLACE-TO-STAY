import React from 'react';
import NavBar from '../components/NavBar';
import Login from '../components/user/Login';

import BottomNav from '../components/BottomNav';

import { GoogleOAuthProvider } from '@react-oauth/google';

const Home = () => {
	return (
		<>
			<GoogleOAuthProvider
				clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
			>
				<Login />
				<NavBar />
				<BottomNav />
			</GoogleOAuthProvider>
		</>
	);
};

export default Home;

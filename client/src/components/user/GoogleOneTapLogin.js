import jwt_decode from 'jwt-decode';

import { GoogleLogin } from '@react-oauth/google'; // Import Google Button

import { useValue } from '../../context/ContextProvider';
import {
	CLOSE_LOGIN,
	UPDATE_ALERT,
	UPDATE_USER,
} from '../../constants/actionTypes';

const GoogleOneTapLogin = () => {
	const { dispatch } = useValue();

	const googleSuccess = async (res) => {
		const token = res?.credential; // Extracting token
		const decodedToken = jwt_decode(token); // Decoding token
		const { sub: id, email, name, picture: photoUrl } = decodedToken; // Destructure what we need
		// console.log(decodedToken);
		dispatch({
			type: UPDATE_USER,
			payload: {
				id,
				email,
				name,
				photoUrl,
				token,
				google: true,
				role: 'basic',
			}, // Updating state wih this infos
		});
		dispatch({ type: CLOSE_LOGIN }); // Closing the login modal after login

		try {
		} catch (error) {
			dispatch({
				type: UPDATE_ALERT,
				payload: {
					open: true,
					severity: 'error',
					message: error.message,
				},
			});
			console.log(error);
		}
	};

	return (
		<GoogleLogin
			size='large'
			onSuccess={(credentialResponse) => {
				// console.log(credentialResponse);
				googleSuccess(credentialResponse);
			}}
			onError={() => {
				console.log('Login Failed');
			}}
		/>
	);
};

export default GoogleOneTapLogin;

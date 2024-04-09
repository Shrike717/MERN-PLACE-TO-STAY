import { useEffect } from 'react';
import { useValue } from '../context/ContextProvider';
import jwtDecode from 'jwt-decode';

import { UPDATE_USER } from '../constants/actionTypes';
import { storeRoom } from '../actions/room';
import { logout } from '../actions/user';

// Checks expiry date of token
const useCheckToken = () => {
	const {
		state: {
			currentUser,
			location,
			details,
			images,
			updatedRoom,
			deletedImages,
			addedImages,
		},
		dispatch,
	} = useValue();

	useEffect(() => {
		if (currentUser) {
			const decodedToken = jwtDecode(currentUser.token);
			// Here we check if the token is expired. Explanaton: If the expiry date of the token is less than the current date, the token is expired.
			// Unix timestamp * 1000
			if (decodedToken.exp * 1000 < new Date().getTime()) {
				// Before logout the user information hass to be stored in local storage:
				storeRoom(
					location,
					details,
					images,
					updatedRoom,
					deletedImages,
					addedImages,
					currentUser.id
				);

				// After storing the room we can logout the user:
				logout(dispatch);
			}
		}
	}, []);
};

export default useCheckToken;

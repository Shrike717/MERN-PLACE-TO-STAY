// Here we store all user related functionality - like api calls - for communicating with BE:

import { v4 as uuidv4 } from 'uuid'; // Creating unique names for user avatar images

import {
	CLOSE_LOGIN,
	END_LOADING,
	START_LOADING,
	UPDATE_ALERT,
	UPDATE_USER,
	UPDATE_PROFILE,
	PATCH,
	UPDATE_USERS,
	GET,
	RESET_ROOM,
} from '../constants/actionTypes';

import fetchData from './utils/fetchData';
import uploadFile from '../firebase/uploadFile'; // Sends file to Firebase and gets bback the photoUrl

// URL for user related requests
const url = process.env.REACT_APP_SERVER_URL + '/user';

// Action to register a new user. user is name, email, password
export const register = async (user, dispatch) => {
	dispatch({ type: START_LOADING });

	// Send request with fetch:
	const result = await fetchData(
		{
			url: url + '/register',
			body: user, // Is name, email, password
		},
		dispatch
	);
	// If we receive an object in result we update the user:
	if (result) {
		dispatch({ type: UPDATE_USER, payload: result });
		dispatch({ type: CLOSE_LOGIN }); // Close the sign up modal
		dispatch({
			type: UPDATE_ALERT,
			payload: {
				open: true,
				severity: 'success',
				message: 'Your account has been created successfully.',
			},
		});
	}

	dispatch({ type: END_LOADING });
};

// Action to log in a user. user is email, password
export const login = async (user, dispatch) => {
	dispatch({ type: START_LOADING });

	// Send request with fetch:
	const result = await fetchData(
		{
			url: url + '/login',
			body: user, // Is email, password
		},
		dispatch
	);
	// If we receive an object in result we update the user:
	if (result) {
		dispatch({ type: UPDATE_USER, payload: result });
		dispatch({ type: CLOSE_LOGIN }); // Close the sign in modal
	}

	dispatch({ type: END_LOADING });
};

// Action to update user profile. updatedFields is name and file
export const updateProfile = async (currentUser, updatedFields, dispatch) => {
	dispatch({ type: START_LOADING });

	const { name, file } = updatedFields;
	let body = { name };
	// If there is a file we upload it to firebase. try-catch: when failing we don't want to continue
	try {
		if (file) {
			// Creating unique filename. Extracting the file extension at the end
			const imageName = uuidv4() + '.' + file?.name?.split('.').pop();
			// Uploading it to firebase and getting back the photoUrl if image on firebase:
			const photoUrl = await uploadFile(
				file,
				`profile/${currentUser?.id}/${imageName}`
			);
			body = { ...body, photoUrl }; // Adding this photoUrl to the body. Now body has name and photoUrl
		}
		//Sending body and token to BE. Getting back updated name, photoUrl and new token for updated user
		const result = await fetchData(
			{
				url: url + '/updateProfile',
				method: PATCH,
				body,
				token: currentUser.token,
			},
			dispatch
		);
		if (result) {
			// Updating currentUser object in local storage with new name, photoUrl and new token
			dispatch({
				type: UPDATE_USER,
				payload: { ...currentUser, ...result },
			});
			dispatch({
				type: UPDATE_ALERT,
				payload: {
					open: true,
					severity: 'success',
					message: 'Your profile has been updated successfully.',
				},
			});
			// Closing update modal and store new url in profile object in state
			dispatch({
				type: UPDATE_PROFILE,
				payload: { open: false, file: null, photoUrl: result.photoUrl },
			});
		}
	} catch (error) {
		console.log(error);
		dispatch({
			type: UPDATE_ALERT,
			payload: {
				open: true,
				severity: 'error',
				message: error.message,
			},
		});
	}

	dispatch({ type: END_LOADING });
};

// Action to get all users. currentUser is needed for token
export const getUsers = async (dispatch, currentUser) => {
	dispatch({ type: START_LOADING });

	const result = await fetchData(
		{ url, method: GET, token: currentUser.token },
		dispatch
	);

	if (result) {
		dispatch({ type: UPDATE_USERS, payload: result });
	}

	dispatch({ type: END_LOADING });
};

// Action to update user status. updatedFields is role and active
export const updateStatus = (updatedFields, userId, dispatch, currentUser) => {
	return fetchData(
		{
			url: `${url}/updateStatus/${userId}`,
			method: PATCH,
			token: currentUser.token,
			body: updatedFields,
		},
		dispatch
	);
};

// Action to keep track when a user is trying to log out while edditing a room
export const logout = (dispatch) => {
	// First we clear the user object in state
	dispatch({ type: UPDATE_USER, payload: null });

	// Then we have to reset the room when a user logs out. If 2 users use the same computer it could be that the room is still in state.
	dispatch({ type: RESET_ROOM });

	// We also have to clear the users in state frrom the memory. This is very sensitive data.
	dispatch({ type: UPDATE_USERS, payload: [] });
};

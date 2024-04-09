// Here we store all room related functionality - like api calls - for communicating with BE:

import fetchData from './utils/fetchData';

import {
	END_LOADING,
	START_LOADING,
	UPDATE_ALERT,
	RESET_ROOM,
	UPDATE_ROOMS,
	GET,
	UPDATE_ROOM,
	DELETE_ROOM,
	UPDATE_SECTION,
} from '../constants/actionTypes';
import deleteImages from './utils/deleteImages';

// The url for room related api calls
const url = process.env.REACT_APP_SERVER_URL + '/room';

// Action to create a room
// We have to add current user because we have to send the token
export const createRoom = async (room, currentUser, dispatch) => {
	dispatch({ type: START_LOADING });

	const result = await fetchData(
		{ url, body: room, token: currentUser?.token },
		dispatch
	);

	// If the result is not null we receive an object and return success message:
	if (result) {
		dispatch({
			type: UPDATE_ALERT,
			payload: {
				open: true,
				severity: 'success',
				message: 'The room has been added successfully',
			},
		});
	}

	// After saving room we clear everything:
	clearRoom(dispatch, currentUser);
	// This will set the component in the main section to show the cluster map:
	dispatch({ type: UPDATE_SECTION, payload: 0 });
	// This will open the single page for the room after creating a new room
	dispatch({ type: UPDATE_ROOM, payload: result });

	dispatch({ type: END_LOADING });
};

// Action to get all rooms
export const getRooms = async (dispatch) => {
	dispatch({ type: START_LOADING });

	const result = await fetchData({ url, method: GET }, dispatch);

	if (result) {
		dispatch({ type: UPDATE_ROOMS, payload: result });
	}

	dispatch({ type: END_LOADING });
};

// Action to update a room
// the updatedRoom oobject contains the id of the room and the id of the user who created the room
export const updateRoom = async (
	room,
	currentUser,
	dispatch,
	updatedRoom,
	deletedImages
) => {
	dispatch({ type: START_LOADING });

	const result = await fetchData(
		{
			url: `${url}/${updatedRoom._id}`,
			method: 'PATCH',
			body: room,
			token: currentUser?.token,
		},
		dispatch
	);

	if (result) {
		dispatch({
			type: UPDATE_ALERT,
			payload: {
				open: true,
				severity: 'success',
				message: 'The room has been updated successfully',
			},
		});

		// After saving room we reset the state again:
		clearRoom(dispatch, currentUser, deletedImages, updatedRoom);
		// This will set the component in the main section to show the cluster map:
		dispatch({ type: UPDATE_SECTION, payload: 0 });
		// This will open the single page for the room after creating a new room
		dispatch({ type: UPDATE_ROOM, payload: result });
	}

	dispatch({ type: END_LOADING });
};

// Action to delete a room
export const deleteRoom = async (room, currentUser, dispatch) => {
	dispatch({ type: START_LOADING });

	const result = await fetchData(
		{
			url: `${url}/${room._id}`,
			method: 'DELETE',
			token: currentUser?.token,
		},
		dispatch
	);

	if (result) {
		dispatch({
			type: UPDATE_ALERT,
			payload: {
				open: true,
				severity: 'success',
				message: 'The room has been deleted successfully',
			},
		});

		// After deleting the room we have a action which filters the rooms and removes the deleted room
		dispatch({ type: DELETE_ROOM, payload: result._id });
		// After deleteing the room we also have to delete the images from the Firebase storage:
		deleteImages(room.images, room.uid); // We pass the id of the user who created the room. Not the current user id. This is because an admin can delete a room created by another user.
	}

	dispatch({ type: END_LOADING });
};

// This function clears properties of the room object which might be set from a previous attempt to updaate a room:
export const clearRoom = (
	dispatch,
	currentUser,
	images = [],
	updatedRoom = null
) => {
	// First we reset the room object:
	dispatch({ type: RESET_ROOM });

	// Then we remove information from local storage:
	localStorage.removeItem(currentUser?.id);

	// If we have an updated room we have to delete the images from the Firebase storage.
	if (updatedRoom) {
		deleteImages(images, updatedRoom.uid);
	} else {
		deleteImages(images, currentUser?.id);
	}
};

// This action will store the room object in the Local Storage when editing a room:
export const storeRoom = (
	location,
	details,
	images,
	updatedRoom,
	deletedImages,
	addedImages,
	userId
) => {
	// First we check if there is a change in any of these properties:
	if (
		location.lng ||
		location.lat ||
		details.price ||
		details.title ||
		details.description ||
		images.length
	) {
		// If there is a change we store the room object in the Local Storage:
		localStorage.setItem(
			userId,
			JSON.stringify({
				location,
				details,
				images,
				updatedRoom,
				deletedImages,
				addedImages,
			})
		);

		return true; // This will be used to show a warning message to the user if he tries to leave the page without saving the changes.
	} else {
		return false;
	}
};

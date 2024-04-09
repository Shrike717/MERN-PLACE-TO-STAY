import {
	createContext,
	useContext,
	useReducer,
	useEffect,
	useRef,
} from 'react';

import reducer from './reducer';
import {
	UPDATE_ADDED_IMAGES,
	UPDATE_DELETED_IMAGES,
	UPDATE_DETAILS,
	UPDATE_IMAGES,
	UPDATE_LOCATION,
	UPDATE_UPDATED_ROOM,
	UPDATE_USER,
} from '../constants/actionTypes';

// Contains all our global public values:
const initialState = {
	currentUser: null,
	openLogin: false,
	loading: false,
	alert: { open: false, severity: 'info', message: '' },
	profile: { open: false, file: null, photoUrl: '' },
	images: [], // Array storing the imageurls from Firebase
	details: { title: '', description: '', price: 0 },
	location: { lng: 0, lat: 0 },
	rooms: [],
	updatedRoom: null,
	deletedImages: [], // This is a temporary storage for the images that are deleted in the edit room page
	addedImages: [], // This is a temporary storage for the images that are added in the edit room page
	priceFilter: 50, // Default is the maximun price
	addressFilter: null, // This is for the address search in the Sidebar component. It will be lng and lat
	filteredRooms: [], // This is an array with rooms that changess depending on the filter applied
	room: null, // This is the state to open the room single page
	users: [], // This is needed to show the users in the dashboard main section
	section: 0, // This is the section above BottomNav. 0 is the map, 1 is the rooms, 2 is the add room
};

// Initiialising the context
const Context = createContext(initialState);

// create a hook to extract values of context easily:
export const useValue = () => {
	return useContext(Context);
};

// Now all the variables inside the state will be available to all components wrapped by this provider
const ContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	// The ref for controlling the map:
	const mapRef = useRef();
	// The ref for controlling the search box in drawer component:
	const containerRef = useRef();

	// Getting user from local storage on first rendering
	useEffect(() => {
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		if (currentUser) dispatch({ type: UPDATE_USER, payload: currentUser }); // And updating state if there is one
	}, []);

	// This useEffect will be triggered every time the currentUser changes
	useEffect(() => {
		// If there is a currentUser in the state, we read the information from the local storage
		if (state.currentUser) {
			const room = JSON.parse(localStorage.getItem(state.currentUser.id)); // Getting the room object from local storage. currentUser.id is the key

			// If there is a room object in the local storage, we update the state with this room object
			if (room) {
				dispatch({ type: UPDATE_LOCATION, payload: room.location });
				dispatch({ type: UPDATE_DETAILS, payload: room.details });
				dispatch({ type: UPDATE_IMAGES, payload: room.images });
				dispatch({
					type: UPDATE_UPDATED_ROOM,
					payload: room.updatedRoom,
				});
				dispatch({
					type: UPDATE_DELETED_IMAGES,
					payload: room.deletedImages,
				});
				dispatch({
					type: UPDATE_ADDED_IMAGES,
					payload: room.addedImages,
				});
			}
		}
	}, [state.currentUser]);

	return (
		// CAUTION!!! There has to be ad . bevore Provider!
		<Context.Provider value={{ state, dispatch, mapRef, containerRef }}>
			{children}
		</Context.Provider>
	);
};

export default ContextProvider;

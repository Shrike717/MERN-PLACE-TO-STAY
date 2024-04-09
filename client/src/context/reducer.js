import {
	UPDATE_USER,
	OPEN_LOGIN,
	CLOSE_LOGIN,
	UPDATE_ALERT,
	START_LOADING,
	END_LOADING,
	UPDATE_PROFILE,
	UPDATE_IMAGES,
	DELETE_IMAGE,
	UPDATE_DETAILS,
	UPDATE_LOCATION,
	RESET_ROOM,
	UPDATE_ROOMS,
	FILTER_PRICE,
	FILTER_ADDRESS,
	CLEAR_ADDRESS,
	UPDATE_ROOM,
	UPDATE_USERS,
	DELETE_ROOM,
	UPDATE_SECTION,
	UPDATE_UPDATED_ROOM,
	UPDATE_DELETED_IMAGES,
	UPDATE_ADDED_IMAGES,
} from '../constants/actionTypes';

//  the state is managed by a reducer. The reducer function contains all of the state update logic
// reducer - a pure function, accepting a state & action, and returning a new state to he context system
const reducer = (state, action) => {
	switch (action.type) {
		// Checks wether the Login Menu is  open or closed
		case OPEN_LOGIN:
			return { ...state, openLogin: true };
		case CLOSE_LOGIN:
			return { ...state, openLogin: false };

		// Checks loading state
		case START_LOADING:
			return { ...state, loading: true };
		case END_LOADING:
			return { ...state, loading: false };

		// Notifications / Alerts
		case UPDATE_ALERT:
			return { ...state, alert: action.payload };

		// Updates user profile
		case UPDATE_PROFILE:
			return { ...state, profile: action.payload };

		// Checks if a user is looged in or logged out
		case UPDATE_USER:
			localStorage.setItem('currentUser', JSON.stringify(action.payload)); // set current user in localStorage
			return { ...state, currentUser: action.payload };

		// Updates the images
		case UPDATE_IMAGES:
			return {
				...state, // This are the old other images
				images: [...state.images, ...action.payload],
			}; // payload is the url received from firebase

		// Deleting images
		case DELETE_IMAGE:
			// The imageUrl which should be deleted is filtered out. All other images pass
			return {
				...state,
				images: state.images.filter(
					(image) => image !== action.payload
				),
			};

		// Updating the details of a room
		case UPDATE_DETAILS:
			// We are returning all of the state, then details are the old state of the details and then we add the payload as an object.
			// This will overwrite title, description and price in details
			return {
				...state,
				details: { ...state.details, ...action.payload },
			};

		// Updating the location
		case UPDATE_LOCATION:
			// We are returning all of the state and then the longitude and latitude
			return { ...state, location: action.payload };

		// This action will update the id of the room and the id of the user who added this room. This is needed for the update action when editing a room
		case UPDATE_UPDATED_ROOM:
			return { ...state, updatedRoom: action.payload };

		// This action saves the deleted images during the edit room page temporarily
		case UPDATE_DELETED_IMAGES:
			return {
				...state, // This are the old other images
				deletedImages: [...state.deletedImages, ...action.payload],
			}; // payload is the url received from firebase

		// This action saves the added images during the edit room page temporarily
		case UPDATE_ADDED_IMAGES:
			return {
				...state, // This are the old other images
				addedImages: [...state.addedImages, ...action.payload],
			}; // payload is the url received from firebase

		// Resetting the room after saving it to DB
		case RESET_ROOM:
			return {
				...state,
				images: [],
				details: { title: '', description: '', price: 0 },
				location: { lng: 0, lat: 0 },
				updatedRoom: null,
				deletedImages: [],
				addedImages: [],
			};

		// Updating the rooms:
		case UPDATE_ROOMS:
			// We are returning all of the state and then the rooms array from the DB.
			// We also reset the adressFilter and priceFilter to their default values
			return {
				...state,
				rooms: action.payload,
				addressFilter: null,
				priceFilter: 50,
				filteredRooms: action.payload, // When we first open the page the filteredRooms im state are the same as in rooms state
			};

		// This action will update the priceFilter state:
		//
		case FILTER_PRICE:
			return {
				...state,
				priceFilter: action.payload,
				// This filteredRooms state will control the clusters. It will trigger it to create and update new clusters from the points (rooms)
				filteredRooms: applyFilter(
					state.rooms, // All the rooms
					state.addressFilter,
					action.payload // This is the new price we received from the slider
				),
			};
		// This action will update the Address search state in the Sidebar
		case FILTER_ADDRESS:
			return {
				...state,
				addressFilter: action.payload, // This is lng and lat
				// This filteredRooms state will control the clusters. It will trigger it to create and update new clusters from the points (rooms)
				filteredRooms: applyFilter(
					state.rooms, // All the rooms
					action.payload, // This is the new address we received from the Geocoder search input in Sidebar
					state.priceFilter
				),
			};

		// This action will clear the Address search state again
		case CLEAR_ADDRESS:
			return {
				...state,
				addressFilter: null,
				priceFilter: 50,
				filteredRooms: state.rooms, // Setting filteredRooms back to all rooms again
			};

		// This action updates the state room for the single page
		case UPDATE_ROOM:
			return {
				...state,
				room: action.payload,
			};

		// This action updates the state of users to show them in the dashboard main component
		case UPDATE_USERS:
			return {
				...state,
				users: action.payload,
			};

		// This action updates the state of the rooms after deleting a room
		case DELETE_ROOM:
			return {
				...state,
				rooms: state.rooms.filter(
					(room) => room._id !== action.payload
				),
			};

		// This action updatest the state to show a section in the main component. It is used in the BottomNav component. We need iit globally to acess the AddRoom component from the dashboard when editing a room
		case UPDATE_SECTION:
			return {
				...state,
				section: action.payload,
			};

		default:
			throw new Error('No matched actions');
	}
};

export default reducer;

// This function gets triggered every time we change the address or the price
const applyFilter = (rooms, address, price) => {
	let filteredRooms = rooms;
	// We check if there is an address onject
	if (address) {
		// Extracting lng and lat from the address
		const { lng, lat } = address;
		// Then we filter the rooms
		filteredRooms = filteredRooms.filter((room) => {
			// Applying conditions:
			// We check if the lng / lat in the address is bigger then the lng / lat in the room lng / lat
			// If yes we substract the room lng / lat from the address lng / lat. Otherwise it will be the opposite
			// In this way we always substract the smaller number from the bigger number
			const lngDifference =
				lng > room.lng ? lng - room.lng : room.lng - lng;
			const latDifference =
				lat > room.lat ? lat - room.lat : room.lat - lat;
			// Then we return all rooms within a range of ca. 60 miles. This is 1 degree
			// If i search for Munich i will find rooms within the range when i zoom out in the map.
			// If i change the range to 10 and search for Munich it will show all rooms in Germany when i zoom out in the map.

			return lngDifference <= 1 && latDifference <= 1;
		});
	}
	// We filter our rooms a second time  dependin on the price
	if (price < 50) {
		// We only show rooms that are within the price range of tthe slider
		filteredRooms = filteredRooms.filter((room) => room.price <= price);
	}

	// After applying these 2 filters we return the filtered rooms array
	// This then will be assigned to the global state filteredRooms variable in the actions FILTER_PRICE and FILTER_ADDRESS above
	return filteredRooms;
};

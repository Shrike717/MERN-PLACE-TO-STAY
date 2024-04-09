import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Delete, Edit, Preview } from '@mui/icons-material';
import { useValue } from '../../../context/ContextProvider';
import {
	UPDATE_DETAILS,
	UPDATE_IMAGES,
	UPDATE_LOCATION,
	UPDATE_ROOM,
	UPDATE_SECTION,
	UPDATE_UPDATED_ROOM,
} from '../../../constants/actionTypes';
import { clearRoom, deleteRoom } from '../../../actions/room';

// This component is the one that will show the actions that can be done with the rooms.
const RoomsActions = ({ params }) => {
	// For editing a room we need to extract the data from the row
	const { _id, lng, lat, price, title, description, images, uid } =
		params.row;
	const {
		dispatch,
		state: { currentUser, updatedRoom, addedImages, images: newImages },
	} = useValue();

	// We need the navigate function to redirect to the add room page
	const navigate = useNavigate();

	// This function will be called when the edit button is clicked
	const handleEdit = () => {
		if (updatedRoom) {
			// First we clear the room object to get rid of any previous data in the state which might be there from a previous attempt to update a room
			clearRoom(dispatch, currentUser, addedImages, updatedRoom);
		} else {
			// If we are creating a new room
			clearRoom(dispatch, currentUser, newImages);
		}

		// Here we dispatch the actions to update the room with the data of the row
		dispatch({ type: UPDATE_LOCATION, payload: { lng, lat } });
		dispatch({
			type: UPDATE_DETAILS,
			payload: { price, title, description },
		});
		dispatch({ type: UPDATE_IMAGES, payload: images });
		dispatch({ type: UPDATE_UPDATED_ROOM, payload: { _id, uid } });
		dispatch({ type: UPDATE_SECTION, payload: 2 }); // This will show the AddRoom component

		// After clicking the edit button we will be redirected to the Home page. There we will see the AddRoom component
		navigate('/');
	};

	return (
		<Box>
			<Tooltip title='View room details'>
				{/* Here we dispatch the room (the data of the row we are on) to the context and therefore change the state room. Then the single room is shown*/}
				<IconButton
					onClick={() =>
						dispatch({ type: UPDATE_ROOM, payload: params.row })
					}
				>
					<Preview />
				</IconButton>
			</Tooltip>
			<Tooltip title='Edit this room'>
				<IconButton onClick={handleEdit}>
					<Edit />
				</IconButton>
			</Tooltip>
			<Tooltip title='Delete this room'>
				{/* Here we call the action to delete a room and pass it the room and the currentUser */}
				<IconButton
					onClick={() =>
						deleteRoom(params.row, currentUser, dispatch)
					}
				>
					<Delete />
				</IconButton>
			</Tooltip>
		</Box>
	);
};

export default RoomsActions;

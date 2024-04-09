import { Dashboard, Settings } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import { ListItemIcon, MenuItem, Menu } from '@mui/material';

import { useValue } from '../../context/ContextProvider';

import Profile from './Profile';

import {
	UPDATE_USER,
	UPDATE_ALERT,
	POST,
	UPDATE_PROFILE,
} from '../../constants/actionTypes';
import useCheckToken from '../../hooks/useCheckToken';
import { useNavigate } from 'react-router-dom';
import { storeRoom } from '../../actions/room';
import { logout } from '../../actions/user';
import { useEffect } from 'react';

// This is the user menu when click on avatar in navbar
const UserMenu = ({ anchorUserMenu, setAnchorUserMenu }) => {
	useCheckToken(); // Checks expiry date of token
	const {
		dispatch,
		state: {
			currentUser,
			location,
			details,
			images,
			updatedRoom,
			deletedImages,
			addedImages,
		},
	} = useValue();

	const handleCloseUserMenu = () => {
		setAnchorUserMenu(null);
	};

	//Using hook navigate to navigate to the Dashboard component from user menu
	const navigate = useNavigate();

	//Function to handle logout
	const handleLogout = () => {
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
	};

	// This is a listener to check wether the user left or refreshed the page:
	useEffect(() => {
		//
		const storeBeforeLeave = (e) => {
			// Condition: If there is a change in the room object
			if (
				storeRoom(
					location,
					details,
					images,
					updatedRoom,
					deletedImages,
					addedImages,
					currentUser.id
				)
			) {
				// If there is a change we show a warning message to the user:
				e.preventDefault();
				e.returnValue = true; // This will show a warning message to the user
			}
		};

		// This function will be called when the user leaves the page:
		window.addEventListener('beforeunload', storeBeforeLeave);
		// After the user left the page we have to remove the listener:
		return () =>
			window.removeEventListener('beforeunload', storeBeforeLeave);
	}, [location, details, images]);

	return (
		<>
			<Menu
				anchorEl={anchorUserMenu}
				// Opens when anchorUserMenu is true
				open={Boolean(anchorUserMenu)}
				onClose={handleCloseUserMenu}
				onClick={handleCloseUserMenu}
			>
				{!currentUser.google && ( // Only showing Profile menu if user is not logged in with google
					<MenuItem
						onClick={() =>
							dispatch({
								type: UPDATE_PROFILE,
								payload: {
									open: true,
									file: null,
									photoUrl: currentUser?.photoUrl,
								},
							})
						}
					>
						<ListItemIcon>
							<Settings fontSize='small' />
						</ListItemIcon>
						Profile
					</MenuItem>
				)}
				<MenuItem onClick={() => navigate('dashboard')}>
					<ListItemIcon>
						<Dashboard fontSize='small' />
					</ListItemIcon>
					Dashboard
				</MenuItem>
				<MenuItem onClick={handleLogout}>
					<ListItemIcon>
						<LogoutIcon fontSize='small' />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
			<Profile />
		</>
	);
};

export default UserMenu;

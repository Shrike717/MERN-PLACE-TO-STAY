import React, { useState, useRef, useEffect } from 'react';
import {
	Box,
	Paper,
	BottomNavigation,
	BottomNavigationAction,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BedIcon from '@mui/icons-material/Bed';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import ClusterMap from './map/ClusterMap';
import Rooms from './rooms/Rooms';
import AddRoom from './addRoom/AddRoom';
import Protected from './protected/Protected';
import { useValue } from '../context/ContextProvider';
import { UPDATE_SECTION } from '../constants/actionTypes';

const BottomNav = () => {
	// Extracting the value and the setter function from the state
	const {
		state: { section },
		dispatch,
	} = useValue();

	const ref = useRef(); // If we change section it scrolls up to top

	useEffect(() => {
		ref.current.ownerDocument.body.scrollTop = 0; // If we change section it scrolls up to top
	}, [section]);

	return (
		<Box ref={ref}>
			{
				{
					// This is a switch inside JSX. Shows component when click on icon
					0: <ClusterMap />,
					1: <Rooms />,
					2: (
						// We wrap components which should be protected. These are the children of the  Protected component
						<Protected>
							<AddRoom />,
						</Protected>
					),
				}[section]
			}
			<Paper
				elevation={3}
				sx={{
					position: 'fixed',
					bottom: 0,
					left: 0,
					right: 0,
					zIndex: 2,
				}}
			>
				<BottomNavigation
					showLabels
					value={section}
					onChange={(e, newValue) =>
						dispatch({ type: UPDATE_SECTION, payload: newValue })
					} // Changes active value on clicks on icons
				>
					<BottomNavigationAction
						label='Map'
						icon={<LocationOnIcon />}
					></BottomNavigationAction>
					<BottomNavigationAction
						label='Rooms'
						icon={<BedIcon />}
					></BottomNavigationAction>
					<BottomNavigationAction
						label='Add'
						icon={<AddLocationIcon />}
					></BottomNavigationAction>
				</BottomNavigation>
			</Paper>
		</Box>
	);
};

export default BottomNav;

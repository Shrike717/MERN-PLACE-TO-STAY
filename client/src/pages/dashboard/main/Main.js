import React, { useEffect } from 'react';
import moment from 'moment'; // This is needed to show the ccreation date of recently added users and rooms

import { Group, MapsHomeWork } from '@mui/icons-material';
import {
	Avatar,
	Box,
	Divider,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Paper,
	Typography,
} from '@mui/material';

import { useValue } from '../../../context/ContextProvider';
import { getRooms } from '../../../actions/room';
import { getUsers } from '../../../actions/user';
import PieRoomsCost from './PieRoomsCost';
import AreaRoomsUsers from './AreaRoomsUsers';

// This component shows the main panel with the statistics
const Main = ({ setSelectedLink, link }) => {
	// Extracting the rooms and users from global context.
	const {
		state: { rooms, users, currentUser },
		dispatch,
	} = useValue();

	// Setting the selected link on the first render of the component
	// Also checking if we have rooms and users. If not, we get them and pass the dispatch because its needed in the action to update the state later
	useEffect(() => {
		setSelectedLink(link);

		if (rooms.length === 0) {
			getRooms(dispatch);
		}
		if (users.length === 0) {
			getUsers(dispatch, currentUser);
		}
	}, []);

	return (
		// In small devices 1 column, in large devices 3 columns
		<Box
			sx={{
				display: { xs: 'flex', md: 'grid' },
				gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns in the same size
				gridAutoRows: 'minmax(100px, auto)', // Min height 100px max height auto to fit the bigger one
				gap: 3,
				textAlign: 'center',
				flexDirection: 'column', // Flex direction for small devices is column
			}}
		>
			{/* Now adding columns */}
			{/* This is the icon and number of the users */}
			<Paper elevation={3} sx={{ p: 3 }}>
				<Typography variant='h4'>Total Users</Typography>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Group
						sx={{ height: 100, width: 100, opacity: 0.3, mr: 1 }}
					/>
					<Typography variant='h4'>{users.length}</Typography>
				</Box>
			</Paper>
			{/* This is the icon and number of the rooms */}
			<Paper elevation={3} sx={{ p: 3 }}>
				<Typography variant='h4'>Total Rooms</Typography>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<MapsHomeWork
						sx={{ height: 100, width: 100, opacity: 0.3, mr: 1 }}
					/>
					<Typography variant='h4'>{rooms.length}</Typography>
				</Box>
			</Paper>
			{/* This is the icon and number of the recently added users and rooms */}
			<Paper
				elevation={3}
				// Grid column will start from line 3 and will fill only one column
				// Rows: we reserve 3 rows for this cell starting from first line 1 to line 4
				sx={{ p: 2, gridColumn: 3, gridRow: '1/4' }}
			>
				{/* Adding the users inside a list */}
				<Box>
					<Typography>Recently added Users:</Typography>
					<List>
						{/* Getting the recently added 4 users */}
						{users.slice(0, 4).map((user, index) => (
							<Box key={user._id}>
								<ListItem>
									<ListItemAvatar>
										<Avatar
											alt={user?.name}
											src={user?.photoUrl}
										/>
									</ListItemAvatar>
									<ListItemText
										primary={user?.name}
										secondary={`Time created: ${moment(
											user.createdAt
										).format('YYYY-MM-DD HH:mm:ss')}`}
									/>
								</ListItem>
								{/* We omit the last divider between users and rooms */}
								{/* inset: We don't need it to be  full width */}
								{index !== 3 && <Divider variant='inset' />}
							</Box>
						))}
					</List>
				</Box>
				<Divider sx={{ mt: 3, mb: 3, opacity: 0.7 }} />
				{/* Adding the rooms inside a list */}
				<Box>
					<Typography>Recently added Rooms:</Typography>
					<List>
						{/* Getting the recently added 4 users */}
						{rooms.slice(0, 4).map((room, index) => (
							<Box key={room._id}>
								<ListItem>
									<ListItemAvatar>
										<Avatar
											alt={room?.title}
											src={room?.images[0]}
											variant='rounded'
										/>
									</ListItemAvatar>
									<ListItemText
										primary={room?.title}
										secondary={`Time created: ${moment(
											room.createdAt
										).fromNow()}`}
									/>
								</ListItem>
								{/* We omit the last divider between users and rooms */}
								{/* inset: We don't need it to be  full width */}
								{index !== 3 && <Divider variant='inset' />}
							</Box>
						))}
					</List>
				</Box>
			</Paper>
			{/* This is the column for the pie chart */}
			{/* gridColumn: "1/3" means: the first 2 columns */}
			<Paper elevation={3} sx={{ p: 2, gridColumn: '1/3' }}>
				{/* This is the Pie Chart component */}
				<PieRoomsCost />
			</Paper>
			{/* This is the column for the Area chart */}
			{/* gridColumn: "1/3" means: the first 2 columns */}
			<Paper elevation={3} sx={{ p: 2, gridColumn: '1/3' }}>
				{/* This is the Area Chart component */}
				<AreaRoomsUsers />
			</Paper>
		</Box>
	);
};

export default Main;

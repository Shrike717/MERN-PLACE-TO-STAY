import React from 'react';
import {
	Avatar,
	Card,
	Container,
	ImageList,
	ImageListItem,
	ImageListItemBar,
	Rating,
	Tooltip,
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';

import { useValue } from '../../context/ContextProvider';
import { UPDATE_ROOM } from '../../constants/actionTypes';

const Rooms = () => {
	// Extracting the  rooms from global state
	const {
		state: { filteredRooms },
		dispatch,
	} = useValue();
	return (
		// Container centralizes the rooms list
		<Container sx={{ pb: 2 }}>
			<ImageList
				gap={12} // This adds vertically and horizontally 12px spacing between images
				sx={{
					mb: 8,
					gridTemplateColumns:
						'repeat(auto-fill, minmax(280px, 1fr)) !important', // This makes it responsive
				}}
			>
				{filteredRooms.map((room) => (
					<Card key={room._id}>
						<ImageListItem
							// Shall take full height of the row.
							sx={{
								height: '400px !important', // Originally: 100% !important
								width: '100% !important', // Originally without width
							}}
						>
							<ImageListItemBar // This is the bar at the top of the card
								sx={{
									background:
										'linear-gradient(to bottom, rgba(0,0,0,0.7)0%, rgba(0,0,0,0.3)70%, rgba(0,0,0,0)100%)',
								}}
								title={
									room.price === 0
										? 'Free Stay'
										: '$' + room.price
								}
								actionIcon={
									<Tooltip
										title={room.uName}
										sx={{ mr: '5px' }}
									>
										<Avatar src={room.uPhoto} />
									</Tooltip>
								}
								position='top'
							/>
							<img
								src={room.images[0]}
								alt={room.title}
								loading='lazy'
								style={{ cursor: 'pointer' }}
								onClick={() =>
									// This opens the single room component of the room the user is clicking on
									dispatch({
										type: UPDATE_ROOM,
										payload: room,
									})
								}
							/>
							<ImageListItemBar
								title={room.title}
								actionIcon={
									<Rating
										sx={{
											color: 'rgba(255, 255, 255, 0.8)',
											mr: '5px',
										}}
										defaultChecked={3.5} // This is the default value with 3.5 stars
										precision={0.5} // We can rate with 1/2 stars
										emptyIcon={
											<StarBorderIcon
												sx={{
													color: 'rgba(255, 255, 255, 0.8)',
												}}
											/>
										}
									/>
								}
							/>
						</ImageListItem>
					</Card>
				))}
			</ImageList>
		</Container>
	);
};

export default Rooms;

import React from 'react';
import { Box, Card, ImageListItem, ImageListItemBar } from '@mui/material';
// This are the Swiper components
import { Swiper, SwiperSlide } from 'swiper/react';

// This are the needed moduls from the main swiper package:
import {
	Pagination, // This is for the dots
	Autoplay,
} from 'swiper/modules';

// These are the styles:
import 'swiper/css'; // Main style
import 'swiper/css/pagination';

// Our custom stylin:
import './cluster.css';

import { useValue } from '../../context/ContextProvider';
import { UPDATE_ROOM } from '../../constants/actionTypes';

// This component is the slider when i click on a room in the ClusterMap
// It receives the information to show a room as props from tthe parent component ClusterMap
const PopupRoom = ({ popupInfo }) => {
	// Extracting the props.
	const { title, description, price, images } = popupInfo;
	// Extracting dispatcher from the global context
	const { dispatch } = useValue();
	return (
		<Card sx={{ maxWidth: 400 }}>
			{/* ImageListItem because we need to add 2 Bars. */}
			{/* block instead of the default inline */}
			<ImageListItem sx={{ display: 'block' }}>
				<ImageListItemBar
					sx={{
						background:
							// This means: from top to bottom. 0% of the height: relatively opaque, 70% of the height: more transparent, 100% of the height: fully transparent
							'linear-gradient(to bottom, rgba(0,0,0,0.7)0%, rgba(0,0,0,0.3)70%, rgba(0,0,0,0)100%)',
						// To be on top of the slider:
						zIndex: 2,
					}}
					title={price === 0 ? 'Free Stay' : '$ ' + price}
					position='top' // The default position would be bottom
				/>
				<ImageListItemBar // The default position is bottom
					title={title}
					// The subtitle is a part from the description. First 30 chars:
					subtitle={description.substr(0, 30) + '...'}
					sx={{
						zIndex: 2,
					}}
				/>
				{/* Swiper component */}
				<Swiper
					modules={[Pagination, Autoplay]}
					// Props:
					autoplay // If nothing else assigned it is true
					pagination={{ clickable: true }}
					// This is adding the styles according to the swiper docs:
					style={{
						// Here we overwrite the pagination dotts variable with our styling rules
						'--swiper-pagination-color': 'rgba(255,255,255,0.8)', // This is the bullet when active
						'--swiper-pagination-bullet-inactive-color': '#fff',
						'--swiper-pagination-bullet-inactive-opacity': 0.5, // This is the bullet when not active
					}}
					// lazy
					lazy={{ loadPrevNext: true }} // This is for the lazy loading of the images‚
				>
					{/* Looping over the images of the room */}
					{/* We receive the url */}
					{images.map((url) => (
						// For every url we return a SwiperSlide
						<SwiperSlide key={url}>
							<Box
								component='img'
								src={url}
								alt='room'
								// lazy='true'
								loading='lazy'
								sx={{
									height: 255,
									display: 'block',
									overflow: 'hidden',
									width: '100%',
									cursor: 'pointer',
									objectFit: 'cover', // This avoids the imagee distortion
								}}
								// On click we open the single paage of the room:
								onClick={() =>
									dispatch({
										type: UPDATE_ROOM,
										payload: popupInfo,
									})
								}
							/>
						</SwiperSlide>
					))}
				</Swiper>
			</ImageListItem>
		</Card>
	);
};

export default PopupRoom;

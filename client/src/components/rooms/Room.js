import React, { forwardRef, useState, useEffect } from 'react';
import {
	AppBar,
	Avatar,
	Box,
	Container,
	Dialog,
	IconButton,
	Rating,
	Slide,
	Stack,
	Toolbar,
	Tooltip,
	Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarBorderIcon from '@mui/icons-material/StarBorder';

// This are the imports for the slider:
import { Swiper, SwiperSlide } from 'swiper/react';
import {
	Navigation,
	Autoplay,
	EffectCoverflow,
	// Lazy,
	Zoom,
} from 'swiper/modules'; // This are the modules we need from swiper
// These are the styles:
import 'swiper/css'; // Main style
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
// import "swiper/css/lazy";
import 'swiper/css/zoom';
import './swiper.css'; // This is our custom styles

import { useValue } from '../../context/ContextProvider';
import { UPDATE_ROOM } from '../../constants/actionTypes';

// This is the helper function Transition which...
// The forwardRef from react passes sth to a child component
const Transition = forwardRef((props, ref) => {
	// The Dialog will slide to top when opened and slide to bottom when closed
	return <Slide direction='up' {...props} ref={ref} />;
});

// This component is the single page for the room
const Room = () => {
	// Importing the room from global state:
	const {
		state: { room },
		dispatch,
	} = useValue();

	// State needed for reverse geocoding:
	const [place, setPlace] = useState(null);

	// useEffect for
	useEffect(() => {
		if (room) {
			// This API gets coordinates and sends back the address
			const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${room.lng},${room.lat}.json?access_token=${process.env.REACT_APP_MAP_TOKEN}`;
			fetch(url)
				.then((response) => response.json()) // Parsing result to json object
				.then((data) => setPlace(data.features[0])) // Then extracting the address and setting it as state
				.catch((err) => console.log(err));
		}
	}, [room]);

	const handleClose = () => {
		dispatch({ type: UPDATE_ROOM, payload: null }); // Closing the room single pages
	};

	return (
		// The slider and the whole content afterwards gets placed in a Dialog component
		<Dialog
			fullScreen
			open={Boolean(room)} // If it is null its false, if object its true
			onClose={handleClose}
			TransitionComponent={Transition} // The transition lets the dialog slide up and down
		>
			{/* Contains Title and Close Button on top */}
			<AppBar
				position='relative' // We need it to be aware of our container content
			>
				<Toolbar>
					<Typography
						variant='h6'
						component='h3'
						sx={{ ml: 2, flex: 1 }} // flex: 1 expands it to fill the whole Appbar and push close icon to end of the Bar
					>
						{room?.title}
					</Typography>
					<IconButton color='inherit' onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<Container
				sx={{ pt: 5 }} // Padding top to push container away from AppBar
			>
				<Swiper
					modules={[
						Navigation, // Navigation for the icons
						Autoplay,
						EffectCoverflow,
						Zoom,
					]} // Adding modules inside Array
					// Props:
					centeredSlides
					slidesPerView={2}
					grabCursor // This shows user its grabaple
					navigation
					autoplay
					lazy={{ loadPrevNext: true }} // Configure the lazy property
					zoom
					effect='coverflow'
					// Configuring the effect:
					coverflowEffect={{
						rotate: 50,
						stretch: 0,
						depth: 100,
						modifier: 1,
						slideShadows: true,
					}}
				>
					{/* Looping through the room images. */}
					{room?.images?.map((url) => (
						<SwiperSlide key={url}>
							{/* Adding div container for the zoom */}
							{/* <div className="swiper-zoom-container" lazy="true"> */}
							<div className='swiper-zoom-container'>
								{/* <img src={url} alt={room} loading='lazy' /> */}
								<img
									src={url}
									alt={room}
									className='swiper-lazy'
								/>
							</div>
						</SwiperSlide>
					))}
					{/* This is the avatar for the user */}
					<Tooltip
						title={room?.uName || ''}
						sx={{
							position: 'absolute',
							bottom: '8px',
							left: '8px',
							zIndex: 2, // Avatar image must be on top of the slider
						}}
					>
						<Avatar src={room?.uPhoto} />
					</Tooltip>
				</Swiper>
				{/* Adding the information of the room. Wrapped in a stack */}
				<Stack sx={{ p: 3 }} spacing={2}>
					<Stack
						direction='row'
						sx={{
							justifyContent: 'space-between',
							flexWrap: 'wrap', // This is for smaller screens: If there is no space the components go down
						}}
					>
						<Box>
							<Typography variant='h6' component='span'>
								{'Price Per Night: '}
							</Typography>
							<Typography component='span'>
								{room?.price === 0
									? 'Free Stay'
									: '$' + room?.price}
							</Typography>
						</Box>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<Typography variant='h6' component='span'>
								{'Ratings: '}
							</Typography>
							<Rating
								name='room-ratings'
								defaultValue={3.5}
								precision={0.5}
								emptyIcon={<StarBorderIcon />}
							/>
						</Box>
					</Stack>
					<Stack
						direction='row'
						sx={{
							justifyContent: 'space-between',
							flexWrap: 'wrap', // This is for smaller screens: If there is no space the components go down
						}}
					>
						<Box>
							<Typography variant='h6' component='span'>
								{'Place Name: '}
							</Typography>
							<Typography component='span'>
								{/* This contains the place name */}
								{place?.text}
							</Typography>
						</Box>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<Typography
								variant='h6'
								component='span'
								sx={{ pr: 1 }}
							>
								{'Address: '}
							</Typography>
							<Typography component='span'>
								{/* This contains the addresss */}
								{place?.place_name}
							</Typography>
						</Box>
					</Stack>
					<Stack>
						<Typography variant='h6' component='span'>
							{'Details: '}
						</Typography>
						<Typography component='span'>
							{/* This contains the address */}
							{room?.description}
						</Typography>
					</Stack>
				</Stack>
			</Container>
		</Dialog>
	);
};

export default Room;

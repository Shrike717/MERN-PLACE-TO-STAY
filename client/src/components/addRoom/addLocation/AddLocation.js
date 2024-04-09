import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import ReactMapGL, {
	GeolocateControl,
	Marker,
	NavigationControl,
} from 'react-map-gl'; // This is the map component and the tools
import 'mapbox-gl/dist/mapbox-gl.css'; // Importing the mapbox-gl styles

import { useValue } from '../../../context/ContextProvider';
import { UPDATE_LOCATION } from '../../../constants/actionTypes';
import Geocoder from './Geocoder';

const AddLocation = () => {
	// Getting the location from state
	const {
		state: {
			location: { lng, lat },
			currentUser,
		},
		dispatch,
	} = useValue();
	// console.log(lng, lat);

	// Selecting map in DOM needed for the find location by ip feature
	const mapRef = useRef();
	// Check on first render: Feature find user location by ip using ipapi
	useEffect(() => {
		// First we want to check if there is a location already stored in the local storage:
		const storedLocation = JSON.parse(
			localStorage.getItem(currentUser.id)
		)?.location;

		// If lng and lat are 0 and there is no stored location in local storage we want to find the location by ip
		if (!lng && !lat & !storedLocation?.lng && !storedLocation?.lat) {
			// Sends ip automatically in req body
			fetch('https://ipapi.co/json')
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					// Then updating the state
					dispatch({
						type: UPDATE_LOCATION,
						payload: { lng: data.longitude, lat: data.latitude },
					});
				});
		}
	}, []);

	// This useEffect will be triggered every time the lng or lat changes:
	useEffect(() => {
		if ((lng || lat) && mapRef.current) {
			// This is the method to move the map to the new location:
			mapRef.current.getMap().flyTo({ center: [lng, lat] });
		}
	}, [lng, lat]);

	return (
		<Box
			sx={{
				height: 400,
				position: 'relative', // To contain our map
			}}
		>
			<ReactMapGL
				ref={mapRef}
				mapboxAccessToken={process.env.REACT_APP_MAP_TOKEN}
				initialViewState={{
					// The place which is shown on map when starting
					longitude: lng,
					latitude: lat,
					zoom: 8,
				}}
				mapStyle='mapbox://styles/mapbox/streets-v12'
			>
				{/* This marker can be moved. Then location state gets updated with new lng and lat which is extracted from event*/}
				<Marker
					longitude={lng}
					latitude={lat}
					draggable
					onDragEnd={(e) =>
						dispatch({
							type: UPDATE_LOCATION,
							payload: { lng: e.lngLat.lng, lat: e.lngLat.lat },
						})
					}
				/>
				{/* This is the control to zoom in and out */}
				<NavigationControl position='bottom-right' />
				{/* This is the icon left top to show user location using browser gps */}
				<GeolocateControl
					position='top-left'
					trackUserLocation
					onGeolocate={(e) =>
						dispatch({
							type: UPDATE_LOCATION,
							payload: {
								lng: e.coords.longitude,
								lat: e.coords.latitude,
							},
						})
					}
				/>
				{/* This is the search field  for city and adress top right*/}
				<Geocoder />
			</ReactMapGL>
		</Box>
	);
};

export default AddLocation;

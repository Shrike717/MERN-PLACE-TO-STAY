import React, { useEffect, useState } from 'react';
import { Avatar, Tooltip, Paper } from '@mui/material';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import Supercluster from 'supercluster'; // Import of the class Supercluster.
import './cluster.css';

import { useValue } from '../../context/ContextProvider';
import { getRooms } from '../../actions/room';
import GeocoderInput from '../sidebar/GeocoderInput';
import PopupRoom from './PopupRoom';

// Initialising an object from Supercluster class
const supercluster = new Supercluster({
	radius: 75,
	maxZoom: 20, // Maximum zoom that SC will make clusters from  points (rooms)
});

const ClusterMap = () => {
	// First we  were extracting the rooms from the state.
	// After we had filteredRooms functionality in place, we replaced it with filteredRooms state
	const {
		state: { filteredRooms },
		dispatch,
		mapRef,
	} = useValue();

	// These states will be usd by SC:
	const [points, setPoints] = useState([]);
	const [clusters, setClusters] = useState([]);
	const [bounds, setBounds] = useState([-180, -85, 180, 85]); // Default value taken from SC package
	const [zoom, setZoom] = useState(0);

	// This is the state we need to pass to the Slider when clickin on a room on the ClusterMap:
	const [popupInfo, setPopupInfo] = useState(null);

	// In the first render we use useEffect to fetch all rooms
	useEffect(() => {
		getRooms(dispatch);
	}, []);

	// This depends on the state rooms change. Everytime there is any change we loop through rooms and create the points
	// After we had filteredRooms functionality in place, we replaced rooms with filteredRooms state
	useEffect(() => {
		const points = filteredRooms.map((room) => ({
			type: 'Feature',
			properties: {
				cluster: false, // This is a single point and therefore no cluster
				roomId: room._id,
				title: room.title,
				description: room.description,
				price: room.price,
				lng: room.lng,
				lat: room.lat,
				images: room.images,
				uName: room.uName,
				uPhoto: room.uPhoto,
			},
			geometry: {
				type: 'Point',
				coordinates: [parseFloat(room.lng), parseFloat(room.lat)],
			},
		}));
		setPoints(points); //Then set the points to the points array
		// After we had filteredRooms functionality in place, we replaced rooms with filteredRooms state
	}, [filteredRooms]);

	// This useEffect depends on the points, zoom and bounds. Everytime one of them changes a new Supercluster is created
	useEffect(() => {
		supercluster.load(points); // First it loads the points
		// Then we set the clusters according to documentation. A cluster also has all information on the points
		setClusters(supercluster.getClusters(bounds, zoom));
	}, [points, zoom, bounds]);

	// This useEffect extracts the exact bounds of the map:
	useEffect(() => {
		// We check if mapRef is already assigned to our map
		if (mapRef.current) {
			// We get the 2 objects, transform them in arrays and merge them in one array
			setBounds(mapRef.current.getMap().getBounds().toArray().flat());
		}
	}, [mapRef?.current]);

	return (
		// This renders the map. Initial location is London
		<ReactMapGL
			initialViewState={{ latitude: 51.5072, longitude: 0.1276 }}
			dragRotate={false}
			mapboxAccessToken={process.env.REACT_APP_MAP_TOKEN}
			mapStyle='mapbox://styles/mapbox/streets-v11'
			ref={mapRef}
			// Everytime it is zoomed we pass the new zoom to the state and therefore trigger a cluster rerender
			onZoomEnd={(e) => setZoom(Math.round(e.viewState.zoom))}
		>
			{/* Then looping through the clusters */}
			{clusters.map((cluster) => {
				// We extract a cluster. It is false or true. And we extract the number of the points (rooms) in this cluster
				// These  will be injected by SC
				const { cluster: isCluster, point_count } = cluster.properties;
				// Extracting lng and lat
				const [longitude, latitude] = cluster.geometry.coordinates;
				// Then we check if it is a cluster.  If Yes, we retuurn a marker.
				if (isCluster) {
					// As keys we use the id given by SC
					return (
						<Marker
							key={`cluster-${cluster.id}`}
							longitude={longitude}
							latitude={latitude}
						>
							{/* Then building the cluster icon */}
							<div
								className='cluster-marker'
								// We dynamically set the size of the marker depending on the number of points
								style={{
									width: `${
										10 + (point_count / points.length) * 20
									}px`,
									height: `${
										10 + (point_count / points.length) * 20
									}px`,
								}}
								// On click we extract tthe zoom from SC
								onClick={() => {
									// We check if there is one for the cluster id. Then we pick the minimum value of it, otherwise we use the default of 20
									const zoom = Math.min(
										supercluster.getClusterExpansionZoom(
											cluster.id
										),
										20
									);
									// Then we change the view of the map depending on the zoom
									mapRef.current.flyTo({
										// center  is the location of the cluster
										center: [longitude, latitude],
										// This is the zoom we just extracted:
										zoom,
										// Spped is 1s
										speed: 1,
									});
								}}
							>
								{/* Adding the number of points (the rooms) in the cluster icon*/}
								{point_count}
							</div>
						</Marker>
					);
				}
				// If it is a single point (room) and not a cluster:
				return (
					// We return the Avatar of the user
					<Marker
						key={`room-${cluster.properties.roomId}`}
						longitude={longitude}
						latitude={latitude}
					>
						<Tooltip title={cluster.properties.uName}>
							<Avatar
								src={cluster.properties.uPhoto}
								component={Paper}
								elevation={2}
								// When we click on the user avatar on the map we set all needed properties for a room from the cluster we are mapping over above
								onClick={() => setPopupInfo(cluster.properties)}
								sx={{ cursor: 'pointer' }}
							/>
						</Tooltip>
					</Marker>
				);
			})}
			{/* This is the component which injects the Address from the Sidebar search into the map */}
			<GeocoderInput />
			{/* Checking if the popupInfo state was set.. When true, we open the Popup component from react-map-gl*/}
			{popupInfo && (
				<Popup
					// Passing  the needed properties to ...
					longitude={popupInfo.lng}
					latitude={popupInfo.lat}
					maxWidth='auto'
					closeOnClick={false} // We don't need to close it when clicking outside of this popup
					focusAfterOpen={false} // We don't want it to move the focus dirctly to the X closing  icon
					onClose={() => setPopupInfo(null)}
				>
					{/* Then showing the PopupRoom component with the slider and passing the props to it */}
					<PopupRoom {...{ popupInfo }} />
				</Popup>
			)}
		</ReactMapGL>
	);
};

export default ClusterMap;

import React, { useEffect } from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import { useValue } from "../../context/ContextProvider";
import { FILTER_ADDRESS, CLEAR_ADDRESS } from "../../constants/actionTypes";

// Creating the mapbox geocoder instance object. This is the search input field
// Mapbox Geocoder is the process of taking an address or name of a place and converting it into coordinates (latitude and longitude) values.
const ctrl = new MapboxGeocoder({
	marker: false, // We don't need marker
	accessToken: process.env.REACT_APP_MAP_TOKEN,
});

// his component injects our search input into the Sidebar
const GeocoderInput = () => {
	const { mapRef, containerRef, dispatch } = useValue();

	// In this useEffect we manipulate the the DOM element <Box> in the parent component with JS commands to inject search input
	useEffect(() => {
		// Checking if there is already a input search. This would be the first child of the parent component
		// If yes, we remove it to avoid adding it many timess
		if (containerRef?.current?.children[0]) {
			containerRef.current.removeChild(containerRef.current.children[0]);
		}
		// Then we inject the search input.
		// When the controller object of the geocoder is added we associate it with the map
		containerRef.current.appendChild(ctrl.onAdd(mapRef.current.getMap()));

		// Then we add a listener. We receive the event to extract the location of the search
		// Under the hood it gets tthe coords of the searchd address and gives back the coordinates from the Mapbox Geocoding Api
		ctrl.on("result", (e) => {
			const coords = e.result.geometry.coordinates; // This is an array of latitude and longitude
			// Then updating the state adressFilter
			dispatch({
				type: FILTER_ADDRESS,
				payload: { lng: coords[0], lat: coords[1] },
			});
		});

		// Another listener to clear the search input
		ctrl.on("clear", () => {
			dispatch({ type: CLEAR_ADDRESS });
		});
	}, []);

	return null;
};

export default GeocoderInput;

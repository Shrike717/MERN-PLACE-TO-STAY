import MapBoxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"; // Importing the mapbox-gl-geocoder styles
import { useControl } from "react-map-gl";

import { useValue } from "../../../context/ContextProvider";
import { UPDATE_LOCATION } from "../../../constants/actionTypes";

// This component is the search to find a location by city or street
const Geocoder = () => {
	const { dispatch } = useValue();

	// Iniitialising MapBoxGeocoder
	const ctrl = new MapBoxGeocoder({
		accessToken: process.env.REACT_APP_MAP_TOKEN,
		marker: false, // Marker is false becauuse we already have a marker
		collapsed: true,
	});

	// Passing the ctrl object to the hook
	useControl(() => ctrl);

	// Setting a listener to the ctrl object. If there is a result after the search we pass a function.
	// We receive an event
	ctrl.on("result", (e) => {
		// Extracting the coords from event
		const coords = e.result.geometry.coordinates;
		// Then updating thee state
		dispatch({
			type: UPDATE_LOCATION,
			payload: { lng: coords[0], lat: coords[1] },
		});
	});

	// We return null because we use a hook
	return null;
};

export default Geocoder;

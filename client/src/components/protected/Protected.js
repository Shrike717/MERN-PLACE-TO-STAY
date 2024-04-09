import React from "react";

import { useValue } from "../../context/ContextProvider";

import AccessMessage from "./AccessMessage";

// This component is the parent of the protected components
const Protected = ({ children }) => {
	const {
		state: { currentUser },
	} = useValue();

	return (
		// Only if there is a authenticated user we return the children of this component
		currentUser ? children : <AccessMessage />
	);
};

export default Protected;

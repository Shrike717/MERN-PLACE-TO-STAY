import React, { useEffect } from 'react';

const Messages = ({ setSelectedLink, link }) => {
	// Setting the selected link on the first render of the component
	useEffect(() => {
		setSelectedLink(link);
	}, []);

	return <div>Messages: Maybe one day...:-))</div>;
};

export default Messages;

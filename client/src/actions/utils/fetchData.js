import { POST, UPDATE_ALERT, UPDATE_USER } from '../../constants/actionTypes';

// Reusable function to fetch data from the server
const fetchData = async (
	{ url, method = POST, token = '', body = null },
	dispatch
) => {
	const headers = token // If we have a token
		? {
				'Content-Type': 'application/json',
				authorization: `Bearer ${token}`,
		  }
		: { 'Content-Type': 'application/json' };
	body = body ? { body: JSON.stringify(body) } : {}; // If we have a body

	try {
		const response = await fetch(url, { method, headers, ...body }); // Sending request
		const data = await response.json(); // Extracting data from response

		// If we have a failed response
		if (!data.success) {
			// If User is not authenticated: Logout
			if (response.status === 401) {
				dispatch({ type: UPDATE_USER, payload: null });
			}
			throw new Error(data.message); // Error with message from server
		}
		// In case of success return object inside result:
		return data.result;
	} catch (error) {
		console.log(error);
		dispatch({
			type: UPDATE_ALERT,
			payload: { open: true, severity: 'error', message: error.message },
		});
		// In case of failure: return null
		return null;
	}
};

export default fetchData;

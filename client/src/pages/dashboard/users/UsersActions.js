import React, { useEffect, useState } from 'react';

import { Box, CircularProgress, Fab } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import { green, grey } from '@mui/material/colors';

import { getUsers, updateStatus } from '../../../actions/user';
import { useValue } from '../../../context/ContextProvider';

// This component is the actions for the users. We have a save button and a loading icon
const UsersActions = ({ params, rowId, setRowId }) => {
	const {
		state: { currentUser },
		dispatch,
	} = useValue();

	// This state is needed for the loading:
	const [loading, setLoading] = useState(false);
	// This state is needed for successful loading:
	const [success, setSuccess] = useState(false);

	// The handleSubmit function. Async because we communicate with the server
	const handleSubmit = async () => {
		setLoading(true);
		const { role, active, _id } = params.row; // _id is the user id
		const result = await updateStatus(
			{ role, active },
			_id,
			dispatch,
			currentUser
		);
		setLoading(false);

		// If there is an object in the result we set success to true
		if (result) {
			setSuccess(true);
			// Then we reset  the row id
			setRowId(null);
			// We have to reload the users after saving a change to update the users table
			getUsers(dispatch, currentUser);
		}
	};

	// We need this useEffect to reset the success icon after saving a change.
	// When we edit twice in a row it has to show the save button again.
	useEffect(() => {
		// We check if the actve row is the same row as the success icon && success state is true. If yes we set it to false
		if (rowId === params.id && success) setSuccess(false);
	}, [rowId]);

	return (
		// We need position relative for our loading
		<Box sx={{ m: 1, position: 'relative' }}>
			{success ? (
				<Fab
					color='primary'
					sx={{
						width: 40,
						height: 40,
						bgcolor: green[500],
						'&:hover': { bgcolor: green[700] },
					}}
				>
					<CheckIcon />
				</Fab>
			) : (
				<Fab
					color='primary'
					sx={{
						width: 40,
						height: 40,
						bgcolor: grey[500],
						'&:hover': { bgcolor: grey[700] },
					}}
					// Now we have to check the inactive rows in order to disable the icons there.. Or if loading is true:
					disabled={params.id !== rowId || loading}
					// Here we cchane the active rowId with a submit function:
					onClick={handleSubmit}
				>
					<SaveIcon />
				</Fab>
			)}
			{/* If loading is true we load the loading icon */}
			{loading && (
				<CircularProgress
					size={52}
					sx={{
						color: green[500],
						position: 'absolute',
						top: -6,
						left: -6,
						zIndex: 1,
					}}
				/>
			)}
		</Box>
	);
};

export default UsersActions;

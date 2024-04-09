import { useState, useRef, useEffect } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	TextField,
	Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

import { useValue } from "../../context/ContextProvider";
import { UPDATE_PROFILE } from "../../constants/actionTypes";
import { updateProfile } from "../../actions/user";

const Profile = () => {
	// We need currentUser aswell for name and photoUrl
	const {
		state: { profile, currentUser },
		dispatch,
	} = useValue();
	const nameRef = useRef(); // Holds name of user

	const handleClose = () => {
		dispatch({
			type: UPDATE_PROFILE,
			payload: { ...profile, open: false }, // Spread: The same profiile fields, but we change open to false
		});
	};

	const handleChange = (e) => {
		const file = e.target.files[0]; // Extracting first file from event
		if (file) {
			const photoUrl = URL.createObjectURL(file);
			// If we have a file we update the profile state and add the file and the above created photoUrl
			dispatch({
				type: UPDATE_PROFILE,
				payload: { ...profile, file, photoUrl: photoUrl },
			});
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const name = nameRef.current.value;
		// Passing the name and the image to the updateProfile function in user actions:
		updateProfile(currentUser, { name, file: profile.file }, dispatch);
	};
	return (
		// Opens Login form when openLogin gets true
		<Dialog open={profile.open} onClose={handleClose}>
			<DialogTitle>
				profile
				<IconButton
					sx={{
						position: "absolute",
						top: 8,
						right: 8,
						color: (theme) => theme.palette.grey[500],
					}}
					onClick={handleClose}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<form onSubmit={handleSubmit}>
				<DialogContent dividers>
					<DialogContentText>
						You can update your profile by updating these fields:
					</DialogContentText>

					<TextField
						autoFocus
						margin="normal"
						variant="standard"
						id="name"
						label="Name"
						type="text"
						fullWidth
						inputRef={nameRef}
						inputProps={{ minLength: 2 }}
						required
						defaultValue={currentUser?.name} // Populatingg name
					/>
					{/* htmlFor: associate the label with some control. Like  an atribute*/}
					<label htmlFor="profilePhoto">
						<input
							accept="image/*" // Accept only images
							id="profilePhoto"
							type="file"
							style={{ display: "none" }}
							onChange={handleChange}
						/>
						<Avatar
							src={profile.photoUrl}
							sx={{ width: 75, height: 75, cursor: "pointer" }}
						/>
					</label>
				</DialogContent>
				<DialogActions sx={{ px: "19px" }}>
					<Button
						type="submit"
						variant="contained"
						endIcon={<SendIcon />}
					>
						Update
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default Profile;

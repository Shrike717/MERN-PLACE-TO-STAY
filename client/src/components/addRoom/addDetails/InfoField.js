import React, { useState } from "react";
import { InputAdornment, TextField, Avatar } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import { useValue } from "../../../context/ContextProvider";
import pendingIcon from "./icons/progress1.svg";
import { UPDATE_DETAILS } from "../../../constants/actionTypes";

// This component are the Input fields for the room details
const InfoField = ({ mainProps, optionalProps = {}, minLength }) => {
	const { dispatch } = useValue();
	// This state is for editing when user is typing
	const [editing, setEditing] = useState(false);
	const [error, setError] = useState(false);
	const [success, setSuccess] = useState(false);

	// Timer variable has to be cleared beefore we set timer again
	let timer;

	const handleChange = (e) => {
		// [e.target.name]: This updates either the title or the description
		dispatch({
			type: UPDATE_DETAILS,
			payload: { [e.target.name]: e.target.value },
		});
		// Checking the state of editing in REALIME. If it is false we set it to true cause user started typing:
		if (!editing) {
			setEditing(true);
		}
		// Old timer cleared first
		clearTimeout(timer);
		// Setting  new timer. Checks the user input statte of title or description after 1s
		timer = setTimeout(() => {
			// If user stops for 1s we set editing to false.
			setEditing(false);
			//  Then checking the state length of title or description. If not met error, otherwise success
			if (e.target.value.length < minLength) {
				if (!error) setError(true);
				if (success) setSuccess(false);
			} else {
				if (error) setError(false);
				if (!success) setSuccess(true);
			}
		}, 1000);
	};

	return (
		<TextField
			{...mainProps}
			{...optionalProps}
			error={error}
			helperText={
				error && `This field must be ${minLength} characters or more.`
			}
			color={success ? "success" : "primary"}
			variant="outlined"
			onChange={handleChange}
			required
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						{editing ? (
							<Avatar src={pendingIcon} sx={{ height: 70 }} />
						) : (
							success && <CheckIcon color="success" />
						)}
					</InputAdornment>
				),
			}}
		/>
	);
};

export default InfoField;

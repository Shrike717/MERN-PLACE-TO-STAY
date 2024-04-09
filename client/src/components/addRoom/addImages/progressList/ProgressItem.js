import React, { useEffect, useState } from 'react';
import { CheckCircleOutline } from '@mui/icons-material';
import { Box, ImageListItem } from '@mui/material';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import { v4 as uuidv4 } from 'uuid';
import uploadFileProgress from '../../../../firebase/uploadFileProgress';
import { useValue } from '../../../../context/ContextProvider';
import {
	UPDATE_IMAGES,
	UPDATE_ALERT,
	UPDATE_ADDED_IMAGES,
} from '../../../../constants/actionTypes';

// This component is responsible for uploading every file one by one onto firebase
const ProgressItem = ({ file }) => {
	// console.log("3. This is the file coming in in ProgressItem", file);
	const [progress, setProgress] = useState(0);
	const [imageURL, setImageURL] = useState(null);
	const {
		state: { currentUser, updatedRoom },
		dispatch,
	} = useValue();

	useEffect(() => {
		const uploadImage = async () => {
			const imageName = uuidv4() + '.' + file.name.split('.').pop();
			try {
				const url = await uploadFileProgress(
					file,
					`rooms/${updatedRoom ? updatedRoom.uid : currentUser?.id}`,
					imageName,
					setProgress
				);

				dispatch({ type: UPDATE_IMAGES, payload: [url] });

				// If we have an updated room we have to save the added images temporarily
				if (updatedRoom)
					dispatch({ type: UPDATE_ADDED_IMAGES, payload: [url] });

				setImageURL(null);
			} catch (error) {
				dispatch({
					type: UPDATE_ALERT,
					payload: {
						open: true,
						severity: 'error',
						message: error.message,
					},
				});
				console.log(error);
			}
		};
		setImageURL(URL.createObjectURL(file));
		uploadImage();
	}, [file]);

	return (
		imageURL && (
			<ImageListItem cols={1} rows={1}>
				<img src={imageURL} alt='room' loading='lazy' />
				<Box sx={backDrop}>
					{progress < 100 ? (
						<CircularProgressWithLabel value={progress} />
					) : (
						<CheckCircleOutline
							sx={{ width: 60, height: 60, color: 'lightgreen' }}
						/>
					)}
				</Box>
			</ImageListItem>
		)
	);
};

export default ProgressItem;

const backDrop = {
	position: 'absolute',
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	background: 'rgba(0,0,0, .5)',
};

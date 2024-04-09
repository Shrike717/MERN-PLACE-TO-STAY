import React from 'react';
import { useValue } from '../../../context/ContextProvider';
import {
	IconButton,
	ImageList,
	ImageListItem,
	ImageListItemBar,
	Toolbar,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

import {
	DELETE_IMAGE,
	UPDATE_DELETED_IMAGES,
} from '../../../constants/actionTypes';
import deleteFile from '../../../firebase/deleteFile';

// This component shows a list of images that has been selected
const ImagesList = () => {
	// Importing the already uploaded images from state.
	//  currenUser is needed for the id which is included in the image path. Needed to delete images
	const {
		state: { images, currentUser, updatedRoom },
		dispatch,
	} = useValue();

	// async because we communicate with firebase. Arg is the image path to image in firebase
	const handleDelete = async (image) => {
		// First we dispatch the action to delete the image from state
		dispatch({ type: DELETE_IMAGE, payload: image }); // Sending imageUrl

		// But we have to check wether we have a editing for a room operation or not:
		if (updatedRoom)
			return dispatch({ type: UPDATE_DELETED_IMAGES, payload: [image] });

		// Theen we delete the image from firebase:
		// This is a image url coming back from firebase ...rooms%2F64c4df21b6f9dd30f1be1fba%2F2f0d6695-61e7-4ffa-9ca3-b3f01d25329b.jpg4. This is the image url coming back from firebase https://firebasestorage.googleapis.com/v0/b/place-to-stay-359d7.appspot.com/o/rooms%2F64c4df21b6f9dd30f1be1fba%2F2f0d6695-61e7-4ffa-9ca3-b3f01d25329b.jpg?alt=media&token=84566605-d7b5-430e-8298-d71fbf330399
		// First we split after user id + 2F, then after ?
		const imageName = image
			?.split(`${currentUser?.id}%2F`)[1]
			?.split('?')[0];
		try {
			// Here we are passing the extracted image path to deleteFile function
			await deleteFile(`rooms/${currentUser?.id}/${imageName}`);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		// Showing the uploaded images
		<>
			<ImageList
				rowHeight={250}
				sx={{
					// Overwriting styling so that ImageList is responsive
					'&.MuiImageList-root': {
						gridTemplateColumns:
							'repeat(auto-fill, minmax(250px, 1fr))!important',
					},
				}}
			>
				{/* image is the imageUrl */}
				{images.map((image, index) => (
					<ImageListItem key={index} cols={1} rows={1}>
						<img
							src={image}
							alt='rooms'
							loading='lazy'
							style={{ height: '100px' }}
						/>
						{/* Is on top of the image so closing icon can be added */}
						<ImageListItemBar
							position='top'
							sx={{
								background:
									'linear-gradient(to bottom, rgba(0,0,0,0.7)0%, rgba(0,0,0,0.3)70%, rgba(0,0,0,0)100%)',
							}}
							actionIcon={
								<IconButton
									sx={{ color: 'white' }}
									onClick={() => handleDelete(image)}
								>
									<CancelIcon />
								</IconButton>
							}
						></ImageListItemBar>
					</ImageListItem>
				))}
			</ImageList>
		</>
	);
};

export default ImagesList;

import deleteFile from '../../firebase/deleteFile';

// This function deletes the images from the Firebase storage after a room has been deleted:
const deleteImages = async (images, userId) => {
	// We have to check if there are images Urls in this array:
	if (images.length > 0) {
		// If there are we  have to create another array for our promises. This array will contain the promises of the images we want to delete:
		const promises = images.map((imgUrl) => {
			// Then we extract the name of the image from the Url:
			const imgName = imgUrl?.split(`${userId}%2F`)[1]?.split('?')[0];
			// We return the promise of the image we want to delete to be stored in the promises array.
			// We use the deleteFile function we created before:
			return deleteFile(`rooms/${userId}/${imgName}`); // We have to pass the path to the image in the Firebase storage. This functin will be stored in the promises array as a requested promise for every image.
		});
		// After we have all the promises in the array:
		try {
			await Promise.all(promises); // We use the Promise.all method to wait for all the promises to be resolved.
		} catch (error) {
			console.log(error);
		}
	}
};

export default deleteImages; // We export the function to use it in the deleteRoom action.

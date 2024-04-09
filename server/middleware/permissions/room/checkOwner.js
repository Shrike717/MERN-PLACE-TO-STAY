import Room from '../../../models/Room.js';

//
const checkOwner = async (req) => {
	// Check if the user is the owner of the room. Returns a boolean.
	// The 2 properties of the room object are the _id and the uid. The _id is the id of the room and the uid is the id of the user that created the room coming from the request object.
	try {
		const room = await Room.findOne({
			_id: req.params.roomId,
			uid: req.user.id,
		});
		// If we have a room we return true. That means that the user is the owner of the room.
		if (room) {
			return true;
		}
		// If we don't have a room we return false. That means that the user is not the owner of the room.
		return false;
	} catch (error) {
		console.log(error);
		return 'error';
	}
};

export default checkOwner;

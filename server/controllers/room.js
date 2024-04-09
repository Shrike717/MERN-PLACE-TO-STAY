import tryCatch from './utils/tryCatch.js';
import Room from '../models/Room.js';

// Creating a new room. Wrapped with tryCatch util function.
export const createRoom = tryCatch(async (req, res) => {
	// Destructuuring the needed values of the user object which was added in the auth middleware:
	const { id: uid, name: uName, photoUrl: uPhoto } = req.user;
	// Creating a new room. We first spread the fields for the room and then add the user info
	const newRoom = new Room({ ...req.body, uid, uName, uPhoto });
	// Then savingg to DB:
	await newRoom.save();
	// Then sending back response
	res.status(201).json({ success: true, result: newRoom });
});

// Getting all rooms. Wrapped with tryCatch util function.
export const getRooms = tryCatch(async (req, res) => {
	// Get all rooms and sort them from newest to oldest
	const rooms = await Room.find().sort({ _id: -1 });

	res.status(200).json({ success: true, result: rooms });
});

// Updating a room. Wrapped with tryCatch util function.
export const updateRoom = tryCatch(async (req, res) => {
	// Getting the room id from the request params
	const { roomId: _id } = req.params;
	// Updating the room by the id
	const updatedRoom = await Room.findByIdAndUpdate(_id, req.body, {
		new: true,
	});

	res.status(200).json({ success: true, result: updatedRoom });
});

// Deleting a room. Wrapped with tryCatch util function.
export const deleteRoom = tryCatch(async (req, res) => {
	// Getting the room id from the request params
	const { roomId: _id } = req.params;
	// Deleting the room by the id
	await Room.findByIdAndDelete(_id);

	res.status(200).json({ success: true, result: { _id } });
});

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import Room from '../models/Room.js';
import tryCatch from './utils/tryCatch.js';

// Wrapped with tryCatch util function
export const register = tryCatch(async (req, res) => {
	const { name, email, password } = req.body;

	if (password.length < 6) {
		return res.status(400).json({
			// return otherwise app crashes because headers are already sent
			success: false,
			message: 'Password must be at least 6 characters.',
		});
	}
	const emailToLowerCase = email.toLowerCase();
	const existingUser = await User.findOne({ email: emailToLowerCase });
	if (existingUser) {
		return res.status(400).json({
			success: false,
			message: 'User already exists.',
		});
	}
	// If we make it this far we can hash the password wih 12 salts:
	const hashedPassword = await bcrypt.hash(password, 12);
	// Creating User in DB
	const user = await User.create({
		name,
		email: emailToLowerCase,
		password: hashedPassword,
	});
	// Now extracting some fields to send back to FE
	const { _id: id, photoUrl, role, active } = user;
	// Then creating the token:
	const token = jwt.sign(
		{ id, name, photoUrl, role },
		process.env.JWT_SECRET,
		{
			expiresIn: '1h',
		}
	);
	// Then send result:
	res.status(201).json({
		success: true,
		result: { id, name, email: user.email, photoUrl, token, role, active },
	});
});

export const login = tryCatch(async (req, res) => {
	const { email, password } = req.body;

	const emailToLowerCase = email.toLowerCase();
	const existingUser = await User.findOne({ email: emailToLowerCase });
	if (!existingUser) {
		return res.status(404).json({
			success: false,
			message: 'User does not exists.',
		});
	}
	// Comparing sent pw with pw returned from DB:
	const correctPassword = await bcrypt.compare(
		password,
		existingUser.password
	);
	if (!correctPassword)
		return res
			.status(400)
			.json({ success: false, message: 'Invalid credentials.' });

	// Now extracting some fields to send back to FE
	const { _id: id, name, photoUrl, role, active } = existingUser;
	//  Check if the user is not active:
	if (!active) {
		return res.status(400).json({
			success: false,
			message:
				'The account has been suspended. Please try to contact the admin',
		});
	}
	// Then creating the token:
	const token = jwt.sign(
		{ id, name, photoUrl, role },
		process.env.JWT_SECRET,
		{
			expiresIn: '1h',
		}
	);
	// Then send result:
	res.status(200).json({
		success: true,
		result: {
			id,
			name,
			email: emailToLowerCase,
			photoUrl,
			token,
			role,
			active,
		},
	});
});

// Update the user profile:
export const updateProfile = tryCatch(async (req, res) => {
	// We only allow the user to change his name and photoUrl:
	const fields = req.body?.photoUrl
		? { name: req.body.name, photoUrl: req.body.photoUrl }
		: { name: req.body.name };

	// DB returns new  updated user
	const updatedUser = await User.findByIdAndUpdate(req.user.id, fields, {
		new: true,
	});
	// Now extracting some fields to send back to FE
	const { _id: id, name, photoUrl, role } = updatedUser;

	// Updating all room records added by this user. We search them with the id of the user. Then we set the new name and photoUrl
	await Room.updateMany({ uid: id }, { uName: name, uPhoto: photoUrl });

	// Then creating the token:
	const token = jwt.sign(
		{ id, name, photoUrl, role },
		process.env.JWT_SECRET,
		{
			expiresIn: '1h',
		}
	);
	res.status(200).json({ success: true, result: { name, photoUrl, token } });
});

// Getting all users. Wrapped with tryCatch util function.
export const getUsers = tryCatch(async (req, res) => {
	// Get all rooms and sort them from newest to oldest
	const users = await User.find().sort({ _id: -1 });

	res.status(200).json({ success: true, result: users });
});

// Updating the user status. Wrapped with tryCatch util function.
export const updateStatus = tryCatch(async (req, res) => {
	// Extracting role and active:
	const { role, active } = req.body;
	// Updatin the status of the user
	await User.findByIdAndUpdate(req.params.userId, {
		role: role,
		active: active,
	});
	// Then sending the response
	res.status(200).json({
		success: true,
		message: 'User status updated successfully.',
		result: { _id: req.params.userId },
	});
});

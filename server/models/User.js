import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
	{
		name: { type: String, min: 2, max: 50, required: true },
		email: {
			type: String,
			min: 5,
			max: 50,
			required: true,
			unique: true,
			trim: true,
		},
		password: { type: String, required: true },
		photoUrl: { type: String, default: '' },
		role: {
			type: String,
			default: 'basic',
			enum: ['basic', 'editor', 'admin'], // his array specifies which valuess are allowed
		},
		active: { type: Boolean, default: true }, // This is needed to enable or disable the user
	},
	{ timestamps: true }
);

const User = mongoose.model('users', userSchema); // Creating model

export default User;

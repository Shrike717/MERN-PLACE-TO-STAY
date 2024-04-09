import checkOwner from './checkOwner.js';

// This object contains the permissions for the different authorization levels:
const roomPermissions = {
	// Ablity to update a room
	update: {
		roles: ['admin', 'editor'],
		owner: checkOwner,
	},
	// Ablity to delete a room
	delete: {
		roles: ['admin', 'editor'],
		owner: checkOwner,
	},
};

export default roomPermissions;

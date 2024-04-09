// This object contains the permissions for the different authorization levels:
const userPermssions = {
	// Request to see the list with all users in dashboard
	listUsers: {
		roles: ['admin', 'editor'],
	},
	// Ability for the admin to activate or deactivate a user
	updateStatus: {
		roles: ['admin'],
	},
};

export default userPermssions;

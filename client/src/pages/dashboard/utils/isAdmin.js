// This function checks if the user is an admin or editor
const isAdmin = (user) => {
	// If the user role is admin or editor, return true
	return ['admin', 'editor'].includes(user?.role);
};

export default isAdmin;

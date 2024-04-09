// This middleware is used to check if the user has the required permission to access the route.
// It is a second layer of security. The first layer is the authentication middleware.
const checkAccess = (permission) => {
	//
	return async (req, res, next) => {
		// Check if the user has the required role to do the action
		if (permission.roles.includes(req.user?.role)) return next();

		// In case the user doesn't have the required role we check if the user is the owner of the resource
		if (!permission?.owner)
			return res
				.status(401)
				.send({ success: false, message: 'Access denied' });

		// Check if the user is the owner of the resource.
		// The owner function is defined in the permission object. It is a function that returns a boolean.
		const isOwner = await permission.owner(req);

		// If the user is the owner we give access to the route
		if (isOwner === true) return next();
		// If the user is not the owner we send a 401 status code
		if (isOwner === false)
			return res
				.status(401)
				.send({ success: false, message: 'Access denied' });

		// If we have an error we send a 500 status code
		res.status(500).send({
			success: false,
			message: 'Something went wrong! Try again later.',
		});
	};
};

export default checkAccess;

import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const auth = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const googleToken = token.length > 1000; // Google token is more than 1000 characters long

		if (googleToken) {
			const ticket = await client.verifyIdToken({
				idToken: token,
				audience: process.env.GOOGLE_CLIENT_ID,
			});
			const payload = ticket.getPayload();

			// If Google token is verified we include user to request. User data is coming from Google, therefore safer
			req.user = {
				id: payload.sub,
				name: payload.name,
				photoUrl: payload.picture,
				role: 'basic', // Google users are always basic users. They can't be admins or editors
			};
		} else {
			// Verifying our custom JWT token
			const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
			// Extracting trusted information from the JWT token
			const { id, name, photoUrl, role } = decodedToken;
			// If  token is verified we include user to request.
			req.user = { id, name, photoUrl, role };
		}
		next(); // If everything is succeessfull req goes to controller actions
	} catch (error) {
		console.log(error);
		res.status(401).json({
			success: false,
			message: 'Something is wrong with your authorization!',
		});
	}
};

export default auth;

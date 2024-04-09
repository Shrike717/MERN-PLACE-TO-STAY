import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import roomRouter from './routes/roomRouter.js';
import userRouter from './routes/userRouter.js';

dotenv.config();

const port = process.env.PORT || 5000;

// Create an Express application. The express() function is a top-level function exported by the express module.
const app = express();

// MW CORS
app.use((req, res, next) => {
	// Explanation: The Access-Control-Allow-Origin response header indicates whether the response can be shared with requesting code from the given origin.
	res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
	// Explanation: The Access-Control-Allow-Methods response header specifies the method or methods allowed when accessing the resource.
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT,PATCH, DELETE, OPTIONS'
	);
	// Explanation: The Access-Control-Allow-Headers response header is used in response to a preflight request to indicate which HTTP headers can be used when making the actual request.
	res.setHeader(
		'Access-Control-Allow-Headers',
		'X-Requested-With, Content-Type, Authorization'
	);
	next();
});

// built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json({ limit: '10mb' })); // Limit not o be blank or to big. Dangger of DoS attacks.

// MW Routes:
app.use('/user', userRouter);
app.use('/room', roomRouter);

// MW main link welcome message
app.get('/', (req, res) => res.json({ message: 'Welcome to our API' }));
// In case client accesses non available link:
app.use((req, res) =>
	res.status(404).json({ success: false, message: 'Not found.' })
);

// Function to make the server listen to requests. Async because of communiccaiion with DB
const startServer = async () => {
	try {
		// Connext to MGDB
		await mongoose.connect(process.env.MONGO_CONNECT);
		app.listen(port, () =>
			console.log(
				`Server listening on port: ${port} --------------------------------------`
			)
		);
	} catch (error) {
		console.log(error);
	}
};

startServer();

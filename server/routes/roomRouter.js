import { Router } from 'express';

import auth from '../middleware/auth.js';
import {
	createRoom,
	deleteRoom,
	getRooms,
	updateRoom,
} from '../controllers/room.js';
import checkAccess from '../middleware/checkAccess.js';
import roomPermissions from '../middleware/permissions/room/roomPermissions.js';

const roomRouter = Router();

roomRouter.post('/', auth, createRoom);
roomRouter.get('/', getRooms);
roomRouter.patch(
	'/:roomId',
	auth,
	checkAccess(roomPermissions.update),
	updateRoom
); // This route is protected. Only admin and editor or the owner of the room can access it. And they must be authenticated.
roomRouter.delete(
	'/:roomId',
	auth,
	checkAccess(roomPermissions.delete),
	deleteRoom
); // This route is protected. Only admin and editor or the owner of the room can access it. And they must be authenticated.

export default roomRouter;

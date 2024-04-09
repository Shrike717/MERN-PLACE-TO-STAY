import { Router } from 'express';
import {
	register,
	login,
	updateProfile,
	getUsers,
	updateStatus,
} from '../controllers/user.js';
import auth from '../middleware/auth.js';
import checkAccess from '../middleware/checkAccess.js';
import userPermissions from '../middleware/permissions/user/userPermissions.js';

const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.patch('/updateProfile', auth, updateProfile); // auth: Has to  be user owning his profile
userRouter.get('/', auth, checkAccess(userPermissions.listUsers), getUsers); // This route is protected. Only admin and editor can access it. And they must be authenticated.
userRouter.patch(
	'/updateStatus/:userId',
	auth,
	checkAccess(userPermissions.updateStatus),
	updateStatus
); // This route is protected. Only admin can access it. And they must be authenticated.

export default userRouter;

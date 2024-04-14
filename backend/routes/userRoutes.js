import express from 'express'
const userRouter = express.Router();


import UserController from '../controllers/userController.js';
import protect from '../middleware/authmiddleware.js';
const userController = new UserController();

userRouter.post('/', userController.registration)

userRouter.get('/', protect, userController.allUsers);

userRouter.post('/login', userController.authUser)


export default userRouter;
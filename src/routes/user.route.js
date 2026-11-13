import { Router } from 'express';
import { addUser, deleteUser, getUsers, updateUser } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.post('/add', addUser);
userRouter.get('/list', getUsers);
userRouter.put('/edit/:id', updateUser);
userRouter.delete('/delete/:id', deleteUser);

export default userRouter;

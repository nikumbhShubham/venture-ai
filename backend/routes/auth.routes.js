import express from 'express';


const authRouter = express.Router();
import {
    registerUser,
    authUser,
    getUserProfile,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

// Public routes
authRouter.post('/register', registerUser);
authRouter.post('/login', authUser);

// Private route (requires a valid token to access)
authRouter.get('/profile', protect, getUserProfile);

export default authRouter;


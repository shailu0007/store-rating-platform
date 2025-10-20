import express from 'express';
import  * as authController from '../controllers/authController.js'
import { authenticate } from '../middlewares/authMiddleware.js';

const authRoutes = express.Router();

authRoutes.post('/register', authController.signup);
authRoutes.post('/login', authController.login);

authRoutes.post('/logout', authenticate, authController.logout);
authRoutes.get('/me', authenticate, authController.me);
authRoutes.post('/change-password', authenticate, authController.changePassword);

export default authRoutes;

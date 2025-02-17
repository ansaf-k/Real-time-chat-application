import express from 'express';
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controllers.js';
import protect from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.put('/update', protect, updateProfile);
router.get('/check', protect, checkAuth);

export default router;
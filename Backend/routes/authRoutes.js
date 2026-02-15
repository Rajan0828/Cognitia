import express from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, updateProfile, changePassword } from '../controllers/authController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('username').trim().isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').trim().isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required'),
];

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;

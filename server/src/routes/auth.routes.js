import { Router } from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import {
  validateLogin,
  validateLogout,
  validateSignup,
} from '../middlewares/validator.middleware.js';

const router = Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/logout', validateLogout, logout);
router.get('/me', requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    },
  });
});

export default router;

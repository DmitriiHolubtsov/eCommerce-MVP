import express from 'express';
import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { login, register } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../multerConfig';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/users', authMiddleware, getUsers);
router.post('/users', authMiddleware, upload.single('avatar'), createUser);
router.get('/users/:id', authMiddleware, getUserById);
router.put('/users/:id', authMiddleware, upload.single('avatar'), updateUser);
router.delete('/users/:id', authMiddleware, deleteUser);

export default router;

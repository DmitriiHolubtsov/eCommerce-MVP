import express from 'express';
import {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
} from '../controllers/categoryController';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../multerConfig';

const router = express.Router();

router.get('/categories', getCategories);
router.post(
  '/categories',
  authMiddleware,
  upload.single('image'),
  createCategory,
);
router.get('/categories/:id', getCategoryById);
router.put(
  '/categories/:id',
  authMiddleware,
  upload.single('image'),
  updateCategory,
);
router.delete('/categories/:id', authMiddleware, deleteCategory);
router.get('/categories/:id/products', getProductsByCategory);

export default router;

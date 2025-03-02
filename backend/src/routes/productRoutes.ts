import express from 'express';
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
  getProductBySlug,
  getRelatedProductsBySlug,
} from '../controllers/productController';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../multerConfig';

const router = express.Router();

router.get('/products', getProducts);
router.post(
  '/products',
  authMiddleware,
  upload.array('images', 5),
  createProduct,
);
router.get('/products/:id', getProductById);
router.put(
  '/products/:id',
  authMiddleware,
  upload.array('images', 5),
  updateProduct,
);
router.delete('/products/:id', authMiddleware, deleteProduct);
router.get('/products/:id/related', getRelatedProducts);
router.get('/products/slug/:slug', getProductBySlug);
router.get('/products/slug/:slug/related', getRelatedProductsBySlug);

export default router;

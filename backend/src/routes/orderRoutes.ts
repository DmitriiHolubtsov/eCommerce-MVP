import express from 'express';
import {
  addToCart,
  removeFromCart,
  createOrder,
  getCart,
} from '../controllers/orderController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/orders/cart/add', authMiddleware, addToCart);
router.post('/orders/cart/remove', authMiddleware, removeFromCart);
router.post('/orders/create', authMiddleware, createOrder);
router.get('/orders/cart', authMiddleware, getCart);

export default router;

import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';

export const addToCart = async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  const userId = (req as any).user.id;

  console.log('Add to cart request:', { productId, quantity, userId });

  let order = await Order.findOne({ user: userId, novaPoshtaBranch: null });
  if (!order) {
    order = new Order({ user: userId, products: [], totalPrice: 0 });
  }

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const productIndex = order.products.findIndex(
    (p) => p.product.toString() === productId,
  );
  if (productIndex > -1) {
    order.products[productIndex].quantity += quantity;
  } else {
    order.products.push({ product: productId, quantity });
  }

  order.totalPrice = order.products.reduce((total, p) => {
    return total + p.quantity * (product.price || 0);
  }, 0);

  await order.save();
  res.json(order);
};

export const removeFromCart = async (req: Request, res: Response) => {
  const { productId } = req.body;
  const userId = (req as any).user.id;

  const order = await Order.findOne({ user: userId, novaPoshtaBranch: null });
  if (!order) return res.status(404).json({ message: 'Cart not found' });

  order.products = order.products.filter(
    (p) => p.product.toString() !== productId,
  ) as any;

  order.totalPrice = 0;
  for (const p of order.products) {
    const product = await Product.findById(p.product);
    if (product) {
      order.totalPrice += p.quantity * product.price;
    }
  }

  await order.save();
  res.json(order);
};

export const createOrder = async (req: Request, res: Response) => {
  const { novaPoshtaBranch } = req.body;
  const userId = (req as any).user.id;

  const order = await Order.findOne({ user: userId, novaPoshtaBranch: null });
  if (!order || order.products.length === 0)
    return res.status(400).json({ message: 'Cart is empty' });

  order.novaPoshtaBranch = novaPoshtaBranch;
  await order.save();
  res.status(201).json(order);
};

export const getCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const order = await Order.findOne({ user: userId, novaPoshtaBranch: null });
  if (!order) return res.status(200).json({ products: [], totalPrice: 0 });
  res.json(order);
};

import { Request, Response } from 'express';
import Product from '../models/Product';
import slugify from 'slugify';

export const getProducts = async (_req: Request, res: Response) => {
  const products = await Product.find().populate('category', 'name');
  res.json(products);
};

export const createProduct = async (req: Request, res: Response) => {
  const { title, price, description, category } = req.body;
  const images = req.files
    ? (req.files as Express.Multer.File[]).map(
        (file) => `${process.env.API_URL}/uploads/${file.filename}`,
      )
    : [];

  if (!title || !price || !category) {
    return res
      .status(400)
      .json({ message: 'Title, price, and category are required' });
  }

  const slug = slugify(title, { lower: true });
  const product = new Product({
    title,
    price,
    description,
    category,
    images,
    slug,
  });

  try {
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    const err = error as Error;
    res
      .status(400)
      .json({ message: 'Error creating product', error: err.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate(
    'category',
    'name',
  );
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { title } = req.body;
  if (title) req.body.slug = slugify(title, { lower: true });
  if (req.files) {
    req.body.images = (req.files as Express.Multer.File[]).map(
      (file) => `${process.env.API_URL}/uploads/${file.filename}`,
    );
  }
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.status(204).send();
};

export const getRelatedProducts = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(4);
  res.json(related);
};

export const getProductBySlug = async (req: Request, res: Response) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate(
    'category',
    'name',
  );
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

export const getRelatedProductsBySlug = async (req: Request, res: Response) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(4);
  res.json(related);
};

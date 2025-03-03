import { Request, Response } from 'express';
import Category from '../models/Category';
import Product from '../models/Product';

export const getCategories = async (_req: Request, res: Response) => {
  const categories = await Category.find().populate('createdBy', 'name');
  res.json(categories);
};

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  const image = req.file
    ? `${process.env.API_URL}/uploads/${req.file.filename}`
    : undefined;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  const category = new Category({
    name,
    image,
    createdBy: (req as any).user.id, // Додаємо ID користувача з JWT
  });

  try {
    await category.save();
    console.log('Category created:', category);
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(400).json({ message: 'Error creating category', error });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id).populate(
    'createdBy',
    'name',
  );
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
};

export const updateCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (req.file) {
    req.body.image = `${process.env.API_URL}/uploads/${req.file.filename}`;
  }
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category)
      return res.status(404).json({ message: 'Category not found' });
    console.log('Category updated:', category);
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(400).json({ message: 'Error updating category', error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  console.log('Category deleted:', category);
  res.json({ message: 'Category deleted' });
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  const products = await Product.find({ category: req.params.id });
  res.json(products);
};

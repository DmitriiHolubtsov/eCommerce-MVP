import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { addToCartAsync } from '../../redux/cartSlice';
import styles from './ProductList.module.scss';

interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  images: string[];
}

interface Category {
  _id: string;
  name: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/categories`,
      );
      setCategories(res.data);
    } catch (err: any) {
      console.error(
        'Error fetching categories:',
        err.response?.data || err.message,
      );
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = selectedCategory
        ? `${process.env.REACT_APP_API_URL}/categories/${selectedCategory}/products`
        : `${process.env.REACT_APP_API_URL}/products`;
      const res = await axios.get(url);
      setProducts(res.data);
    } catch (err: any) {
      setError('Failed to load products');
      console.error(
        'Error fetching products:',
        err.response?.data || err.message,
      );
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  const handleAddToCart = (productId: string) => {
    if (token) {
      dispatch(addToCartAsync({ productId, quantity: 1 }));
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Shop
      </h1>
      <div className="mb-6 flex justify-center items-center gap-3">
        <label className="text-lg font-medium text-gray-700">
          Filter by Category:
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No products available
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className={`${styles.productCard} border rounded-lg p-4 bg-white`}
            >
              <h3 className={`${styles.title} text-lg mb-2`}>
                {product.title}
              </h3>
              <p className={`${styles.price} text-xl mb-2`}>
                {product.price} USD
              </p>
              <p className={`${styles.description} mb-4`}>
                {product.description}
              </p>
              {product.images?.length > 0 && (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className={`${styles.image} w-full h-48 object-cover`}
                  loading="lazy"
                />
              )}
              {token ? (
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className={`${styles.addButton} text-white p-2 rounded-md w-full`}
                >
                  Add to Cart
                </button>
              ) : (
                <p className="text-gray-500 text-center">
                  Please log in to buy
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;

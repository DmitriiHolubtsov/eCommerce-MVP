import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { addToCartAsync } from '../../redux/cartSlice';
import { AppDispatch } from '../../redux/store';
import styles from './ProductList.module.scss';

const ProductList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/v1/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const url = selectedCategory
          ? `http://localhost:5001/api/v1/categories/${selectedCategory}/products`
          : 'http://localhost:5001/api/v1/products';
        const res = await axios.get(url);
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, [selectedCategory]);

  const handleAddToCart = (productId: string) => {
    if (token) {
      dispatch(addToCartAsync({ productId, quantity: 1 }));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Shop
      </h1>
      <div className="mb-6 flex justify-center">
        <label className="mr-3 text-lg font-medium text-gray-700">
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
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className={`${styles.image} w-full h-48 object-cover`}
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

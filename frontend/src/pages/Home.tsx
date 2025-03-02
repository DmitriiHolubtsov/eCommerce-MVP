import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { addToCartAsync } from '../redux/cartSlice';
import { AppDispatch } from '../redux/store';
import styles from '../components/ProductList/ProductList.module.scss';

const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/v1/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (productId: string) => {
    if (token) {
      dispatch(addToCartAsync({ productId, quantity: 1 }));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Welcome to E-Shop
      </h1>
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

export default Home;

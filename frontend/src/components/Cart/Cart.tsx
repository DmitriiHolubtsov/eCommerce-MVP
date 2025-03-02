import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { removeFromCart } from '../../redux/cartSlice';
import styles from './Cart.module.scss';

const Cart = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  if (items.length === 0) {
    return <p className="p-4 text-gray-500">Your cart is empty</p>;
  }

  return (
    <div className={`${styles.cartContainer} p-4 shadow-md`}>
      <h2 className={`${styles.cartHeader} mb-4`}>Cart</h2>
      <ul>
        {items.map((item) => (
          <li
            key={item.productId}
            className={`${styles.cartItem} flex justify-between items-center`}
          >
            <span className={`${styles.productInfo}`}>
              Product ID: {item.productId} - Qty: {item.quantity}
            </span>
            <button
              onClick={() => handleRemove(item.productId)}
              className={`${styles.removeButton} text-white p-2 rounded-md`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cart;

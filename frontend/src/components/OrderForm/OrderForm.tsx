import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import axios from 'axios';
import { resetCart } from '../../redux/cartSlice';
import styles from './OrderForm.module.scss';

const OrderForm = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/nova-poshta/branches`,
        );
        setBranches(res.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching branches:', error);
        setError('Failed to load Nova Poshta branches');
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const handleSubmit = async () => {
    if (!selectedBranch) {
      alert('Please select a Nova Poshta branch');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/orders/create`,
        { novaPoshtaBranch: selectedBranch },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(resetCart());
      alert('Order created successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.orderContainer} p-6 mt-6 shadow-md`}>
      <h2 className={`${styles.orderHeader} mb-4`}>Checkout</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Items in Cart:</h3>
        <ul className={styles.itemList}>
          {items.map((item) => (
            <li key={item.productId}>
              Product ID: {item.productId} - Qty: {item.quantity}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Nova Poshta Branch:
        </label>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className={styles.branchSelect}
          disabled={loading || !!error}
        >
          <option value="">Select a branch</option>
          {branches.map((branch) => (
            <option key={branch.Ref} value={branch.Description}>
              {branch.Description}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleSubmit}
        className={`${styles.submitButton} text-white p-3 rounded-md w-full`}
        disabled={loading || !!error}
      >
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  );
};

export default OrderForm;

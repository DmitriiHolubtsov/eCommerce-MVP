import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { removeFromCart, resetCart } from '../redux/cartSlice';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../components/OrderForm/OrderForm.module.scss';

const OrderPage = () => {
  const { items, status } = useSelector((state: RootState) => state.cart);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [branches, setBranches] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderMessage, setOrderMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [locationsRes, branchesRes] = await Promise.all([
          axios.get('http://localhost:5001/api/v1/locations'),
          axios.get('http://localhost:5001/api/v1/nova-poshta/branches'),
        ]);
        setLocations(locationsRes.data);
        setBranches(branchesRes.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called', {
      selectedLocation,
      selectedBranch,
      token,
    });

    if (!selectedLocation || !selectedBranch) {
      setOrderMessage('Please select a location and Nova Poshta branch');
      return;
    }

    setLoading(true);
    console.log('Sending order request...');
    try {
      const response = await axios.post(
        'http://localhost:5001/api/v1/orders/create',
        { novaPoshtaBranch: selectedBranch, location: selectedLocation },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log('Order response:', response.data);
      dispatch(resetCart());
      setOrderMessage('Order completed successfully!');
      setSelectedBranch('');
      setSelectedLocation('');
    } catch (error: any) {
      console.error(
        'Error creating order:',
        error.response?.data || error.message,
      );
      setOrderMessage('Failed to create order');
    } finally {
      setLoading(false);
      console.log('Loading set to false');
    }
  };

  if (items.length === 0 && !orderMessage) {
    return <p className="p-6 text-center text-gray-500">Your cart is empty</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Your Order
      </h1>
      {orderMessage && (
        <div className="mb-6 text-center">
          <p
            className={`text-lg ${
              orderMessage.includes('successfully')
                ? 'text-green-500'
                : 'text-red-500'
            }`}
          >
            {orderMessage}
          </p>
        </div>
      )}
      {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Items in Cart
            </h2>
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span className="text-gray-700">
                    Product ID: {item.productId} - Qty: {item.quantity}
                  </span>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${styles.orderContainer} p-6 shadow-md`}>
            <h2 className={`${styles.orderHeader} mb-4`}>Checkout</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Location:
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => {
                  console.log('Location selected:', e.target.value);
                  setSelectedLocation(e.target.value);
                }}
                className={`${styles.branchSelect} mb-4`}
                disabled={loading || !!error}
              >
                <option value="">Select a location</option>
                {locations.map((loc) => (
                  <option key={loc._id || loc.id} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
              <label className="block text-gray-700 font-medium mb-2">
                Nova Poshta Branch:
              </label>
              {error && <p className="text-red-500 mb-2">{error}</p>}
              {status === 'loading' && (
                <p className="text-gray-500 mb-2">Loading branches...</p>
              )}
              <select
                value={selectedBranch}
                onChange={(e) => {
                  console.log('Branch selected:', e.target.value);
                  setSelectedBranch(e.target.value);
                }}
                className={styles.branchSelect}
                disabled={loading || !!error || !selectedLocation}
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
              onClick={() => {
                console.log('Place Order button clicked');
                handleSubmit();
              }}
              className={`${styles.submitButton} text-white p-3 rounded-md w-full`}
              disabled={loading || !!error}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;

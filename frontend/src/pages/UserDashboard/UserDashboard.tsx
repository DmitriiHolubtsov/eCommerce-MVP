import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { login, logout } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import OrderForm from '../../components/OrderForm/OrderForm';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import styles from './UserDashboard.module.scss';

interface User {
  _id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface Location {
  _id: string;
  name: string;
}

const UserDashboard = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const storedToken = localStorage.getItem('token') || token;
    if (!storedToken) return;

    setLoading(true);
    setError(null);
    try {
      const [userRes, locationsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/locations`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        }),
      ]);
      setUser(userRes.data);
      setLocations(locationsRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      dispatch(login(storedToken));
    }
    if (storedToken || token) {
      fetchData();
    }
  }, [dispatch, token, fetchData]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleAvatarUpload = async () => {
    if (!avatar || !user) return;

    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      setUser(res.data);
      setAvatar(null);
    } catch (err: any) {
      console.error(
        'Error uploading avatar:',
        err.response?.data || err.message,
      );
    }
  };

  if (!token) {
    return <p className="p-4 text-gray-500">Please log in</p>;
  }

  const decodedToken = jwtDecode<{ role: string }>(token);
  const isAdmin = decodedToken.role === 'admin';

  if (loading) return <p className="p-4 text-gray-500">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={`${styles.header} mb-6 text-center`}>User Dashboard</h1>
      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={handleLogout}
          className={`${styles.logoutButton} text-white p-3 rounded-md`}
        >
          Logout
        </button>
        {isAdmin && (
          <button
            onClick={() => navigate('/admin')}
            className={`${styles.adminButton} text-white p-3 rounded-md`}
          >
            Go to Admin Dashboard
          </button>
        )}
      </div>
      {user && (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mb-6">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          {user.avatar && (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full mx-auto mb-4"
              loading="lazy"
              onError={(e) => console.error('Error loading avatar:', e)}
            />
          )}
          <p className="text-gray-700 mb-2">Name: {user.name}</p>
          <p className="text-gray-700 mb-4">Role: {user.role}</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files?.[0] || null)}
            className="border p-2 w-full rounded-md mb-4"
          />
          <button
            onClick={handleAvatarUpload}
            className="bg-blue-500 text-white p-2 w-full rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            disabled={!avatar}
          >
            Upload Avatar
          </button>
        </div>
      )}
      {locations.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mb-6">
          <h2 className="text-xl font-semibold mb-4">Locations</h2>
          <ul>
            {locations.map((loc) => (
              <li key={loc._id} className="text-gray-700">
                {loc.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {items.length > 0 && <OrderForm />}
    </div>
  );
};

export default UserDashboard;

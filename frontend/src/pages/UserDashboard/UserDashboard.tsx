import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { login, logout } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import OrderForm from '../../components/OrderForm/OrderForm';
import { useEffect, useState } from 'react';
import api from '../../api/api';
import styles from './UserDashboard.module.scss';
import axios from 'axios';

const UserDashboard = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      dispatch(login(storedToken));
    }

    const fetchData = async () => {
      try {
        const [userRes, locationsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${storedToken || token}` },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/locations`, {
            headers: { Authorization: `Bearer ${storedToken || token}` },
          }),
        ]);
        console.log('User data fetched:', userRes.data);
        setUser(userRes.data);
        console.log('Locations fetched:', locationsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (storedToken || token) {
      fetchData();
    }
  }, [dispatch, token]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleAvatarUpload = async () => {
    if (!avatar) return;
    const formData = new FormData();
    formData.append('avatar', avatar);
    try {
      const res = await api.put(`/users/${user._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Updated user data:', res.data);
      setUser(res.data);
      setAvatar(null);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  if (!token) {
    return <p className="p-4 text-gray-500">Please log in</p>;
  }

  const decodedToken = jwtDecode<{ role: string }>(token);
  const isAdmin = decodedToken.role === 'admin';

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={`${styles.header} mb-6 text-center`}>User Dashboard</h1>
      <div className="flex justify-center mb-6">
        <button
          onClick={handleLogout}
          className={`${styles.logoutButton} text-white p-3 rounded-md`}
        >
          Logout
        </button>
        {isAdmin && (
          <button
            onClick={() => navigate('/admin')}
            className={`${styles.adminButton} text-white p-3 rounded-md ml-4`}
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
              onError={(e) =>
                console.error('Error loading avatar:', user.avatar, e)
              }
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
            className="bg-blue-500 text-white p-2 w-full rounded-md hover:bg-blue-600"
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
              <li key={loc._id || loc.id} className="text-gray-700">
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

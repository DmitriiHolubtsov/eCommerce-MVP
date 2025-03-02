import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Header.module.scss';

const Header = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold hover:text-gray-300">
          E-Shop
        </Link>
        <nav className="flex space-x-6 items-center">
          <Link to="/" className={`${styles.navLink} hover:text-gray-300`}>
            Home
          </Link>
          <Link to="/shop" className={`${styles.navLink} hover:text-gray-300`}>
            Shop
          </Link>
          {token ? (
            <>
              <Link
                to="/dashboard"
                className={`${styles.navLink} hover:text-gray-300`}
              >
                Dashboard
              </Link>
              <Link
                to="/order"
                className={`${styles.navLink} hover:text-gray-300 flex items-center`}
              >
                Buy
                {cartItemCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`${styles.navLink} hover:text-gray-300`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`${styles.navLink} hover:text-gray-300`}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

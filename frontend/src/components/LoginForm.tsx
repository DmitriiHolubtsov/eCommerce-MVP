import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ErrorResponse {
  message: string;
}

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(6, 'Min 6 characters').required('Required'),
    }),
    onSubmit: async (values) => {
      setStatus('Logging in...');
      console.log('Login form submitted with values:', values);
      try {
        const res = await axios.post(
          'http://localhost:5001/api/v1/auth/login',
          values,
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        console.log('Login response:', res.data);
        dispatch(login(res.data.token));
        localStorage.setItem('token', res.data.token);
        setStatus('Login successful!');
        navigate('/dashboard');
      } catch (error: any) {
        console.error('Login error:', error.response?.data || error.message);
        setStatus(error.response?.data?.message || 'Login failed');
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-4 max-w-md mx-auto p-6"
    >
      {status && (
        <p
          className={
            status.includes('successful') ? 'text-green-500' : 'text-red-500'
          }
        >
          {status}
        </p>
      )}
      <div>
        <input
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
        />
        {formik.errors.email && formik.touched.email && (
          <p className="text-red-500">{formik.errors.email}</p>
        )}
      </div>
      <div>
        <input
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
        />
        {formik.errors.password && formik.touched.password && (
          <p className="text-red-500">{formik.errors.password}</p>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 w-full rounded-md hover:bg-blue-600"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;

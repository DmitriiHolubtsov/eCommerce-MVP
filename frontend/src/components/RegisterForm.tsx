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

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: { email: '', password: '', name: '', role: 'user' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(6, 'Min 6 characters').required('Required'),
      name: Yup.string().required('Required'),
      role: Yup.string().oneOf(['user', 'admin']).required('Required'),
    }),
    onSubmit: async (values) => {
      setStatus('Registering...');
      console.log('Register form submitted with values:', values);
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/register`,
          values,
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        console.log('Register response:', res.data);
        dispatch(login(res.data.token));
        localStorage.setItem('token', res.data.token);
        setStatus('Registration successful!');
        navigate('/dashboard');
      } catch (error: any) {
        console.error('Register error:', error.response?.data || error.message);
        setStatus(error.response?.data?.message || 'Registration failed');
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
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
      <div>
        <input
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Name"
        />
        {formik.errors.name && formik.touched.name && (
          <p className="text-red-500">{formik.errors.name}</p>
        )}
      </div>
      <select
        name="role"
        value={formik.values.role}
        onChange={formik.handleChange}
        className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 w-full rounded-md hover:bg-blue-600"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;

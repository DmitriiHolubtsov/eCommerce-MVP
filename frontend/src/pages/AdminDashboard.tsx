import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface ProductFormValues {
  title: string;
  price: number;
  description: string;
  category: string;
  images: File[];
}

interface CategoryFormValues {
  name: string;
  image?: File | null;
}

interface UserFormValues {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: File | null;
}

const AdminDashboard = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const { token } = useSelector((state: RootState) => state.auth);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes, userRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/products`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
        setUsers(userRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (token) fetchData();
  }, [token]);

  const productFormik = useFormik<ProductFormValues>({
    initialValues: editingProduct || {
      title: '',
      price: 0,
      description: '',
      category: '',
      images: [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      price: Yup.number().min(0, 'Price must be positive').required('Required'),
      description: Yup.string(),
      category: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('price', values.price.toString());
      formData.append('description', values.description);
      formData.append('category', values.category);
      values.images.forEach((image) => formData.append('images', image));

      try {
        if (editingProduct) {
          const res = await axios.put(
            `${process.env.REACT_APP_API_URL}/products/${editingProduct._id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            },
          );
          setProducts(
            products.map((p) => (p._id === editingProduct._id ? res.data : p)),
          );
          setEditingProduct(null);
        } else {
          const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/products`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            },
          );
          setProducts([...products, res.data]);
        }
        productFormik.resetForm();
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        console.error(
          'Error with product:',
          axiosError.response?.data || axiosError.message,
        );
      }
    },
  });

  const categoryFormik = useFormik<CategoryFormValues>({
    initialValues: editingCategory || { name: '', image: null },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('name', values.name);
      if (values.image) {
        formData.append('image', values.image);
      }

      try {
        if (editingCategory) {
          const res = await axios.put(
            `${process.env.REACT_APP_API_URL}/categories/${editingCategory._id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            },
          );
          setCategories(
            categories.map((c) =>
              c._id === editingCategory._id ? res.data : c,
            ),
          );
          setEditingCategory(null);
        } else {
          const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/categories`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            },
          );
          setCategories([...categories, res.data]);
        }
        categoryFormik.resetForm();
      } catch (error) {
        console.error('Error with category:', error);
      }
    },
  });

  const userFormik = useFormik<UserFormValues>({
    initialValues: editingUser || {
      email: '',
      password: '',
      name: '',
      role: 'user',
      avatar: null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(6, 'Min 6 chars').required('Required'),
      name: Yup.string().required('Required'),
      role: Yup.string().oneOf(['user', 'admin']).required('Required'),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('name', values.name);
      formData.append('role', values.role);
      if (values.avatar) {
        formData.append('avatar', values.avatar);
      }

      try {
        if (editingUser) {
          const res = await axios.put(
            `${process.env.REACT_APP_API_URL}/users/${editingUser._id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            },
          );
          setUsers(
            users.map((u) => (u._id === editingUser._id ? res.data : u)),
          );
          setEditingUser(null);
        } else {
          const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/users`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            },
          );
          setUsers([...users, res.data]);
        }
        userFormik.resetForm();
      } catch (error) {
        console.error('Error with user:', error);
      }
    },
  });

  const deleteProduct = async (id: string) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts(products.filter((p) => p._id !== id));
  };

  const deleteCategory = async (id: string) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategories(categories.filter((c) => c._id !== id));
  };

  const deleteUser = async (id: string) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(users.filter((u) => u._id !== id));
  };

  if (!token) {
    return (
      <p className="p-4 text-gray-500 text-center">
        Please log in to access the Admin Dashboard
      </p>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Admin Dashboard
      </h1>

      {/* Products */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Manage Products
      </h2>
      <form
        onSubmit={productFormik.handleSubmit}
        className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        <input
          name="title"
          value={productFormik.values.title}
          onChange={productFormik.handleChange}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Title"
        />
        {productFormik.touched.title && productFormik.errors.title && (
          <p className="text-red-500">{productFormik.errors.title}</p>
        )}
        <input
          name="price"
          type="number"
          value={productFormik.values.price}
          onChange={productFormik.handleChange}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Price"
        />
        {productFormik.touched.price && productFormik.errors.price && (
          <p className="text-red-500">{productFormik.errors.price}</p>
        )}
        <input
          name="description"
          value={productFormik.values.description}
          onChange={productFormik.handleChange}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Description"
        />
        <select
          name="category"
          value={productFormik.values.category}
          onChange={productFormik.handleChange}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        {productFormik.touched.category && productFormik.errors.category && (
          <p className="text-red-500">{productFormik.errors.category}</p>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            productFormik.setFieldValue(
              'images',
              Array.from(e.target.files || []),
            )
          }
          className="border p-2 w-full rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded-md hover:bg-blue-600"
        >
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
        {editingProduct && (
          <button
            type="button"
            onClick={() => setEditingProduct(null)}
            className="bg-gray-500 text-white p-2 w-full rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>
      <ul className="mt-6 space-y-4">
        {products.map((prod) => (
          <li
            key={prod._id}
            className="flex justify-between items-center p-4 bg-gray-100 rounded-lg"
          >
            <div>
              <span className="font-semibold">{prod.title}</span>
              {prod.images && prod.images.length > 0 && (
                <img
                  src={prod.images[0]}
                  alt={prod.title}
                  className="w-16 h-16 object-cover ml-4"
                />
              )}
            </div>
            <div>
              <button
                onClick={() => setEditingProduct(prod)}
                className="text-blue-500 mr-4 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteProduct(prod._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Categories */}
      <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-700">
        Manage Categories
      </h2>
      <form
        onSubmit={categoryFormik.handleSubmit}
        className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        <input
          name="name"
          value={categoryFormik.values.name}
          onChange={categoryFormik.handleChange}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Name"
        />
        {categoryFormik.touched.name && categoryFormik.errors.name && (
          <p className="text-red-500">{categoryFormik.errors.name}</p>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            categoryFormik.setFieldValue('image', e.target.files?.[0] || null)
          }
          className="border p-2 w-full rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded-md hover:bg-blue-600"
        >
          {editingCategory ? 'Update Category' : 'Add Category'}
        </button>
        {editingCategory && (
          <button
            type="button"
            onClick={() => setEditingCategory(null)}
            className="bg-gray-500 text-white p-2 w-full rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>
      <ul className="mt-6 space-y-4">
        {categories.map((cat) => (
          <li
            key={cat._id}
            className="flex justify-between items-center p-4 bg-gray-100 rounded-lg"
          >
            <div className="flex items-center">
              <span>{cat.name}</span>
              {cat.image && (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-12 h-12 object-cover ml-4"
                />
              )}
            </div>
            <div>
              <button
                onClick={() => setEditingCategory(cat)}
                className="text-blue-500 mr-4 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCategory(cat._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Users */}
      <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-700">
        Manage Users
      </h2>
      <form
        onSubmit={userFormik.handleSubmit}
        className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        <input
          name="email"
          value={userFormik.values.email}
          onChange={userFormik.handleChange}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
        />
        <input
          name="password"
          type="password"
          value={userFormik.values.password}
          onChange={userFormik.handleChange}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
        />
        <input
          name="name"
          value={userFormik.values.name}
          onChange={userFormik.handleChange}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Name"
        />
        <select
          name="role"
          value={userFormik.values.role}
          onChange={userFormik.handleChange}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            userFormik.setFieldValue('avatar', e.target.files?.[0] || null)
          }
          className="border p-2 w-full rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded-md hover:bg-blue-600"
        >
          {editingUser ? 'Update User' : 'Add User'}
        </button>
        {editingUser && (
          <button
            type="button"
            onClick={() => setEditingUser(null)}
            className="bg-gray-500 text-white p-2 w-full rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>
      <ul className="mt-6 space-y-4">
        {users.map((user) => (
          <li
            key={user._id}
            className="flex justify-between items-center p-4 bg-gray-100 rounded-lg"
          >
            <div className="flex items-center">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
              )}
              <span>
                {user.name} ({user.role})
              </span>
            </div>
            <div>
              <button
                onClick={() => setEditingUser(user)}
                className="text-blue-500 mr-4 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteUser(user._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;

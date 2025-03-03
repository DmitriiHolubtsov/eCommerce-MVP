import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface ErrorResponse {
  message?: string;
}

const initialState: CartState = {
  items: [],
  status: 'idle',
  error: null,
};

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: CartItem, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/orders/cart/add`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data.products.map((item: any) => ({
        productId: item.product.toString(),
        quantity: item.quantity,
      }));
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error('Error syncing cart with backend:', axiosError);
      return rejectWithValue(
        axiosError.response?.data?.message || axiosError.message,
      );
    }
  },
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      const token = localStorage.getItem('token');
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/orders/cart/remove`,
          { productId: action.payload },
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .catch((error) =>
          console.error('Error syncing cart with backend:', error),
        );
    },
    resetCart: (state) => {
      state.items = [];
    },
    setItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        addToCartAsync.fulfilled,
        (state, action: PayloadAction<CartItem[]>) => {
          state.status = 'succeeded';
          state.items = action.payload;
        },
      )
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { removeFromCart, resetCart, setItems } = cartSlice.actions;
export default cartSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  token: string | null;
}

const initialState: AuthState = { token: null };

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null as string | null,
    role: null as string | null,
  },
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      const decoded = jwtDecode<{ role: string }>(action.payload);
      state.role = decoded.role;
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProfile, loginUser as loginRequest, logoutUser as logoutRequest, registerUser as registerRequest } from '../../api/authApi.js';

const initialState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || '',
  loading: false,
  error: ''
};

export const login = createAsyncThunk('auth/login', async (payload, thunkAPI) => {
  try {
    const response = await loginRequest(payload);
    const { token, user } = response.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { token, user };
  } catch (error) {
    if (!error.response) {
      return thunkAPI.rejectWithValue('Unable to reach the API. Start the backend server on port 5000 and try again.');
    }
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (payload, thunkAPI) => {
  try {
    const response = await registerRequest(payload);
    return response.data.message || 'Registration successful';
  } catch (error) {
    if (!error.response) {
      return thunkAPI.rejectWithValue('Unable to reach the API. Start the backend server on port 5000 and try again.');
    }
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const fetchProfile = createAsyncThunk('auth/profile', async (_, thunkAPI) => {
  try {
    const response = await getProfile();
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to load profile');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await logoutRequest();
  } catch {
    // Local logout should still succeed when the server session has expired.
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return true;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = '';
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

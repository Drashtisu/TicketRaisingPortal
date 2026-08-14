import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsers, updateUser, deleteUser as deleteUserRequest } from '../../api/userApi.js';

const initialState = { items: [], loading: false, error: '' };

export const fetchUsers = createAsyncThunk('users/fetch', async (params = {}, thunkAPI) => {
  try {
    const response = await getUsers(params);
    return response.data.data.users || response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Could not load users');
  }
});

export const changeUser = createAsyncThunk('users/change', async ({ id, payload }, thunkAPI) => {
  try {
    const response = await updateUser(id, payload);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Could not update user');
  }
});

export const removeUser = createAsyncThunk('users/remove', async (id, thunkAPI) => {
  try {
    await deleteUserRequest(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Could not delete user');
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(changeUser.fulfilled, (state, action) => {
        state.items = state.items.map((user) => user._id === action.payload._id ? action.payload : user);
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.items = state.items.filter((user) => user._id !== action.payload);
      });
  }
});

export default userSlice.reducer;

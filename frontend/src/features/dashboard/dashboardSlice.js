import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardStats } from './../../api/dashboardApi';


const initialState = { stats: {}, loading: false, error: '' };

export const fetchDashboard = createAsyncThunk('dashboard/fetch', async (_, thunkAPI) => {
  try {
    const response = await getDashboardStats();
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Could not load dashboard');
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default dashboardSlice.reducer;

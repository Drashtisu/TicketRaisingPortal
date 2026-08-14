import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createDepartment, deleteDepartment, getDepartments, updateDepartment } from './../../api/departmentApi';


const initialState = { items: [], loading: false, error: '' };

export const fetchDepartments = createAsyncThunk('departments/fetch', async (params = {}, thunkAPI) => {
  try {
    const response = await getDepartments(params);
    return response.data.data.departments;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Could not load departments');
  }
});

export const addDepartment = createAsyncThunk('departments/add', async (payload, thunkAPI) => {
  try {
    const response = await createDepartment(payload);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Could not create department');
  }
});

export const editDepartment = createAsyncThunk('departments/edit', async ({ id, payload }, thunkAPI) => {
  try {
    const response = await updateDepartment(id, payload);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Could not update department');
  }
});

export const removeDepartment = createAsyncThunk('departments/remove', async (id, thunkAPI) => {
  try {
    await deleteDepartment(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Could not delete department');
  }
});

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addDepartment.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editDepartment.fulfilled, (state, action) => {
        state.items = state.items.map((item) => item._id === action.payload._id ? action.payload : item);
      })
      .addCase(removeDepartment.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  }
});

export default departmentSlice.reducer;

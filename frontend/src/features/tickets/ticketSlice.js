import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createTicket, deleteTicket, getAllTickets, getMyTickets, updateTicket } from '../../api/ticketapi';


const initialState = {
  tickets: [],
  pagination: null,
  loading: false,
  error: '',
};

export const fetchTickets = createAsyncThunk('tickets/fetch', async (params = {}, thunkAPI) => {
  try {
    const response = await getMyTickets(params);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Could not load tickets');
  }
});

export const fetchAllTickets = createAsyncThunk('tickets/fetchAll', async (params = {}, thunkAPI) => {
  try {
    const response = await getAllTickets(params);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Could not load tickets');
  }
});

export const addTicket = createAsyncThunk('tickets/add', async (payload, thunkAPI) => {
  try {
    const response = await createTicket(payload);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Could not create ticket');
  }
});

export const editTicket = createAsyncThunk('tickets/edit', async ({ id, payload }, thunkAPI) => {
  try {
    const response = await updateTicket(id, payload);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Could not update ticket');
  }
});

export const removeTicket = createAsyncThunk('tickets/remove', async (id, thunkAPI) => {
  try {
    await deleteTicket(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Could not delete ticket');
  }
});

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.tickets || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllTickets.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchAllTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.tickets || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchAllTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTicket.fulfilled, (state, action) => {
        state.tickets.unshift(action.payload);
        if (state.tickets.length > 10) state.tickets.pop();
      })
      .addCase(editTicket.fulfilled, (state, action) => {
        state.tickets = state.tickets.map((ticket) => ticket._id === action.payload._id ? action.payload : ticket);
      })
      .addCase(removeTicket.fulfilled, (state, action) => {
        state.tickets = state.tickets.filter((ticket) => ticket._id !== action.payload);
      });
  }
});

export const { clearError } = ticketSlice.actions;
export default ticketSlice.reducer;

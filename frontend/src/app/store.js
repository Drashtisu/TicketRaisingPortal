import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import ticketReducer from '../features/tickets/ticketSlice.js';
import departmentReducer from "../features/departments/departmentSlice.js";
import categoryReducer from '../features/categories/categorySlice.js';
import dashboardReducer from '../features/dashboard/dashboardSlice.js';
import userReducer from '../features/users/userSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
    departments: departmentReducer,
    categories: categoryReducer,
    dashboard: dashboardReducer,
    users: userReducer
  }
});

export default store;

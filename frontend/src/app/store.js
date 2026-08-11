import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import ticketReducer from '../features/tickets/ticketSlice';
import departmentReducer from '../features/departments/departmentSlice';
import categoryReducer from '../features/categories/categorySlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import userReducer from '../features/users/userSlice';

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

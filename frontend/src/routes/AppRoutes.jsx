import { Navigate, Route, Routes } from 'react-router-dom';


import Login from '../features/auth/Login';
import Profile from '../features/auth/Profile';
import Register from '../features/auth/Register';
import CategoryList from '../features/categories/CategoryList';
import Dashboard from '../features/dashboard/Dashboard';
import DepartmentList from '../features/departments/DepartmentList';
import CreateTicket from '../features/tickets/CreateTicket';
import TicketDetails from '../features/tickets/TicketDetails';
import TicketList from '../features/tickets/TicketList';
import UserList from '../features/users/UserList';
import UserLayout from '../layouts/UserLayout';



const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/*"
        element={
          
            <UserLayout>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="tickets" element={<TicketList />} />
                <Route path="tickets/new" element={<CreateTicket />} />
                <Route path="tickets/:id" element={<TicketDetails />} />
                
              
                <Route path="departments" element={<DepartmentList />} />
                <Route path="categories" element={<CategoryList />} />
                <Route path="users" element={<UserList />} />
                <Route path="profile" element={<Profile />} />
              </Routes>
            </UserLayout>
     
        }
      />
    </Routes>
  );
};

export default AppRoutes;

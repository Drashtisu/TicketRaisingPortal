import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import UserAdminRoute from '../components/common/UserAdminRoute';
import AdminRoute from '../components/common/AdminRoute';
import AgentRoute from '../components/common/AgentRoute';
import UserLayout from '../layouts/UserLayout';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import Profile from '../features/auth/Profile';
import Dashboard from '../features/dashboard/Dashboard';

import CreateTicket from '../features/tickets/CreateTicket';
import TicketDetails from '../features/tickets/TicketDetails';
import AdminTickets from '../features/tickets/AdminTickets';
import AgentTickets from '../features/agent/AgentTickets';
import DepartmentList from '../features/departments/DepartmentList';
import CategoryList from '../features/categories/CategoryList';
import UserList from '../features/users/UserList';
import TicketTabList from '../features/tickets/TicketTabList';


const AppRoutes = () => {
  const { token } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/" element={<Navigate to={token ? "/dashboard" : "/register"} replace />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <UserLayout>
              <Routes>
                
                <Route path="dashboard" element={<Dashboard />} />
                
               
                <Route path="tickets" element={<UserAdminRoute><TicketTabList /></UserAdminRoute>} />
                <Route path="tickets/new" element={<UserAdminRoute><CreateTicket /></UserAdminRoute>} />
                <Route path="tickets/:id" element={<TicketDetails />} />
                
               
                <Route path="assigned-tickets" element={<AgentRoute><AgentTickets /></AgentRoute>} />
                
               
                <Route path="admin/tickets" element={<AdminRoute><AdminTickets /></AdminRoute>} />
                <Route path="departments" element={<AdminRoute><DepartmentList /></AdminRoute>} />
                <Route path="categories" element={<AdminRoute><CategoryList /></AdminRoute>} />
                <Route path="users" element={<AdminRoute><UserList /></AdminRoute>} />
                
                
                <Route path="profile" element={<Profile />} />
              </Routes>
            </UserLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;

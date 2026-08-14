import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminRoute from '../components/common/AdminRoute';
import AgentRoute from '../components/common/AgentRoute';
import ProtectedRoute from '../components/common/ProtectedRoute';
import UserAdminRoute from '../components/common/UserAdminRoute';
import AgentTickets from '../features/agent/AgentTickets';
import Login from '../features/auth/Login';
import Profile from '../features/auth/Profile';
import Register from '../features/auth/Register';
import CategoryList from '../features/categories/CategoryList';
import Dashboard from '../features/dashboard/Dashboard';
import DepartmentList from '../features/departments/DepartmentList';
import AdminTickets from '../features/tickets/AdminTickets';
import CreateTicket from '../features/tickets/CreateTicket';
import TicketDetails from '../features/tickets/TicketDetails';
import TicketList from '../features/tickets/TicketList';
import UserList from '../features/users/UserList';
import UserLayout from '../layouts/UserLayout';

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
                
               
                <Route path="tickets" element={<UserAdminRoute><TicketList /></UserAdminRoute>} />
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

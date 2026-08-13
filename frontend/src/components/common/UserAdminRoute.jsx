import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const UserAdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return ['user', 'admin'].includes(user?.role) ? children : <Navigate to="/dashboard" replace />;
};

export default UserAdminRoute;

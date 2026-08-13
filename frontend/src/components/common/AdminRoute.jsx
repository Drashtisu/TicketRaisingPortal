import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
console.log(user)
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;

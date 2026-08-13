import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const UserRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user?.role === 'user' ? children : <Navigate to="/dashboard" replace />;
};

export default UserRoute;

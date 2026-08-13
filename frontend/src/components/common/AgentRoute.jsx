import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AgentRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user?.role === 'agent' ? children : <Navigate to="/dashboard" replace />;
};

export default AgentRoute;

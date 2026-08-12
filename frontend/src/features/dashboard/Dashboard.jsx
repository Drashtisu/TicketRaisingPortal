import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard } from './dashboardSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  return (
    <div className="page-card">
      <h2>Dashboard</h2>
      {loading ? <p>Loading dashboard...</p> : (
        <div className="card-grid">
          <div className="ticket-card">
            <h3>Total Tickets</h3>
            
          </div>
          <div className="ticket-card">
            <h3>Open Tickets</h3>
            
          </div>
          <div className="ticket-card">
            <h3>Resolved</h3>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

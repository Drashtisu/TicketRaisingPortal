import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard } from './dashboardSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.dashboard);

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
            <p>{stats.totalTickets ?? 0}</p>
          </div>
          <div className="ticket-card">
            <h3>Open Tickets</h3>
            <p>{stats.openTickets ?? 0}</p>
          </div>
          <div className="ticket-card">
            <h3>Resolved</h3>
            <p>{stats.resolvedTickets ?? 0}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

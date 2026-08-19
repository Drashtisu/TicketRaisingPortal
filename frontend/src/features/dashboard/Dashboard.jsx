import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard } from './dashboardSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.dashboard);
  console.log(stats)
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const user = currentUser || stats?.user;
  const role = (currentUser?.role || stats?.role || 'user').toString().toLowerCase();
  const tickets = stats?.tickets || [];

  const getDashboardTitle = () => {
    if (role === 'admin') return 'Admin Dashboard';
    if (role === 'agent') return 'My Assigned Tickets';
    return 'My Tickets';
  };

  const getTicketSectionTitle = () => {
    if (role === 'admin') return 'Recent System Tickets';
    if (role === 'agent') return 'Recent Assigned Tickets';
    return 'My Recent Tickets';
  };

  const getCards = () => {
    if (role === 'admin') {
      return [
        { title: 'Total System Tickets', count: stats.totalTickets ?? 0 },
        { title: 'Open Tickets', count: stats.openTickets ?? 0 },
        { title: 'In Progress Tickets', count: stats.inProgressTickets ?? 0 },
        { title: 'Resolved Tickets', count: stats.resolvedTickets ?? 0 },
        { title: 'Closed Tickets', count: stats.closedTickets ?? 0 },
      ];
    }

    if (role === 'agent') {
      return [
        { title: 'My Total Assigned', count: stats.myAssignedTicketsCount ?? stats.totalTickets ?? 0 },
        { title: 'Open / Pending', count: stats.openTickets ?? 0 },
        { title: 'In Progress', count: stats.inProgressTickets ?? 0 },
        { title: 'Resolved', count: stats.resolvedTickets ?? 0 },
        { title: 'Closed', count: stats.closedTickets ?? 0 },
      ];
    }

    return [
      { title: 'My Total Created', count: stats.myCreatedTicketsCount ?? stats.totalTickets ?? 0 },
      { title: 'My Open Tickets', count: stats.openTickets ?? 0 },
      { title: 'My In Progress', count: stats.inProgressTickets ?? 0 },
      { title: 'My Resolved Tickets', count: stats.resolvedTickets ?? 0 },
      { title: 'My Closed Tickets', count: stats.closedTickets ?? 0 },
    ];
  };

  return (
    <div className="page-card">
      <div className="dashboard-banner">
        <div>
          <h3>Welcome, {user?.name || 'User'}</h3>
          <p>Email: {user?.email || '—'}</p>
        </div>
        <span className="badge" style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
          Role: {role}
        </span>
      </div>

      <h2>{getDashboardTitle()}</h2>
      {error && <div className="alert error">{error}</div>}
      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          <div className="card-grid">
            {getCards().map((card) => (
              <div key={card.title} className="ticket-card">
                <h3 style={{ fontSize: '0.95rem', color: '#475569' }}>{card.title}</h3>
                <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '8px 0 0', color: '#0f172a' }}>{card.count}</p>
              </div>
            ))}
          </div>

          <h3 className="dashboard-section-title">{getTicketSectionTitle()}</h3>
          {tickets.length === 0 ? (
            <p>No tickets to show yet.</p>
          ) : (
            <div className="card-grid">
              {tickets.map((ticket) => (
                <div key={ticket._id} className="ticket-card">
                  <div className="ticket-top">
                    <strong>{ticket.ticketNumber}</strong>
                    <span className="badge">{ticket.status}</span>
                  </div>
                  <h3>{ticket.title}</h3>
                  <p>{ticket.description}</p>
                  <div className="meta-row" style={{ fontSize: '0.85rem' }}>
                    <span>Priority: {ticket.priority || '—'}</span>
                    <span>Dept: {ticket.department?.name || '—'}</span>
                  </div>
                  {role !== 'user' && (
                    <p style={{ fontSize: '0.85rem', margin: '4px 0 0', color: '#64748b' }}>
                      Requester: {ticket.createdBy?.name || 'Unknown'}
                    </p>
                  )}
                  {role === 'admin' && (
                    <p style={{ fontSize: '0.85rem', margin: '2px 0 0', color: '#64748b' }}>
                      Assigned Agent: {ticket.assignedAgent?.name || 'Unassigned'}
                    </p>
                  )}
                  <div className="actions" style={{ marginTop: '12px' }}>
                    {role === 'agent' ? (
                      <a href="/assigned-tickets" className="btn" style={{ fontSize: '0.85rem', padding: '4px 10px' }}>
                        View / Work
                      </a>
                    ) : (
                      <a href={`/tickets/${ticket._id}`}>View Details</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;

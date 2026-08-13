import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTickets } from './ticketSlice';

const AdminTickets = () => {
  const dispatch = useDispatch();
  const { tickets, loading, error } = useSelector((state) => state.tickets);

  useEffect(() => {
    dispatch(fetchAllTickets());
  }, [dispatch]);

  return (
    <div className="page-card">
      <h2>Manage Tickets</h2>
      {error && <div className="alert error">{error}</div>}
      {loading ? <p>Loading tickets...</p> : tickets.length === 0 ? <p>No tickets found.</p> : (
        <div className="card-grid">
          {tickets.map((ticket) => (
            <article key={ticket._id} className="ticket-card">
              <strong>{ticket.ticketNumber}</strong>
              <h3>{ticket.title}</h3>
              <p>Status: {ticket.status}</p>
              <p>Requester: {ticket.createdBy?.name || 'Unknown'}</p>
              <p>Assigned agent: {ticket.assignedAgent?.name || 'Unassigned'}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTickets;

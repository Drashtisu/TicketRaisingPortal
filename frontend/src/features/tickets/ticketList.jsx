import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets, removeTicket } from './ticketSlice';

const TicketList = () => {
  const dispatch = useDispatch();
  const { tickets, loading, error } = useSelector((state) => state.tickets);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(removeTicket(id));
  };

  return (
    <div className="page-card">
      <div className="page-header">
        <h2>My Tickets</h2>
        <a href="/tickets/new" className="btn">Create Ticket</a>
      </div>
      {error && <div className="alert error">{error}</div>}
      {loading ? <p>Loading tickets</p> : tickets.length === 0 ? <p>No tickets yet.</p> : (
        <div className="card-grid">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="ticket-card">
              <div className="ticket-top">
                <strong>{ticket.ticketNumber}</strong>
                <span className="badge">{ticket.status}</span>
              </div>
              <h3>{ticket.title}</h3>
              <p>{ticket.description}</p>
              <div className="meta-row">
                <span>Priority: {ticket.priority || '—'}</span>
                <span>Dept: {ticket.department?.name || '—'}</span>
              </div>
              <div className="actions">
                <a href={`/tickets/${ticket._id}`}>View</a>
                <button onClick={() => handleDelete(ticket._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketList;

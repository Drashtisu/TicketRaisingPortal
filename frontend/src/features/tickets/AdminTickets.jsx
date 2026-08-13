import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTickets, editTicket, removeTicket } from './ticketSlice';
import { fetchUsers } from '../users/userSlice';

const AdminTickets = () => {
  const dispatch = useDispatch();
  const { tickets, loading, error } = useSelector((state) => state.tickets);
  const { items: users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchAllTickets());
    dispatch(fetchUsers());
  }, [dispatch]);

  const agents = users.filter((user) => user.role === 'agent' && user.isActive);

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

              <label style={{ display: 'block', marginTop: '10px' }}>
                Assign Agent:
                <select
                  value={ticket.assignedAgent?._id || ''}
                  onChange={(e) => dispatch(editTicket({ id: ticket._id, payload: { assignedAgent: e.target.value || null } }))}
                  style={{ marginLeft: '8px', padding: '4px', borderRadius: '4px', display: 'block', width: '100%', marginTop: '4px' }}
                >
                  <option value="">Unassigned</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                disabled={ticket.status === 'Closed'}
                style={{
                  marginTop: '12px',
                  backgroundColor: ticket.status === 'Closed' ? '#ccc' : '#e63946',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: ticket.status === 'Closed' ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  width: '100%'
                }}
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete ticket ${ticket.ticketNumber}?`)) {
                    dispatch(removeTicket(ticket._id));
                  }
                }}
              >
                Delete Ticket
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTickets;

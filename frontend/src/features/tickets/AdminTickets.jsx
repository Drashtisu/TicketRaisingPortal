import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTickets, editTicket, removeTicket } from './ticketSlice';
import { getUsers } from '../../api/userapi';
import Pagination from '../../components/common/Pagination';

const AdminTickets = () => {
  const dispatch = useDispatch();
  const { tickets, pagination, loading, error } = useSelector((state) => state.tickets);
  const [agents, setAgents] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllTickets({ page, limit: 10 }));
    getUsers({ limit: 100 }).then((res) => {
      const allUsers = res.data.data.users || (Array.isArray(res.data.data) ? res.data.data : []);
      setAgents(allUsers.filter((user) => user.role === 'agent' && user.isActive));
    }).catch(() => {});
  }, [dispatch, page]);

  const limit = 10;
  const totalTicketsCount = pagination?.totalTickets ?? tickets.length;
  const totalPages = pagination?.totalPages ?? Math.ceil(totalTicketsCount / limit) ?? 1;

  const effectivePagination = {
    currentPage: page,
    totalPages: totalPages,
    totalTickets: totalTicketsCount,
    hasNextPage: pagination?.hasNextPage !== undefined ? pagination.hasNextPage : page < totalPages,
    hasPreviousPage: pagination?.hasPreviousPage !== undefined ? pagination.hasPreviousPage : page > 1
  };

  const visibleTickets = tickets.length > limit ? tickets.slice((page - 1) * limit, page * limit) : tickets;

  return (
    <div className="page-card">
      <h2>Manage Tickets</h2>
      {error && <div className="alert error">{error}</div>}
      {loading ? <p>Loading tickets...</p> : tickets.length === 0 ? <p>No tickets found.</p> : (
        <>
          
          <div className="card-grid" style={{ marginTop: '16px', marginBottom: '16px' }}>
            {visibleTickets.map((ticket) => (
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
                    backgroundColor: ticket.status === 'Closed' ? '#6c757d' : '#d97706',
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
                    if (window.confirm(`Are you sure you want to close ticket ${ticket.ticketNumber}?`)) {
                      dispatch(editTicket({ id: ticket._id, payload: { status: 'Closed' } }));
                    }
                  }}
                >
                  {ticket.status === 'Closed' ? 'Ticket Closed' : 'Close Ticket'}
                </button>
              </article>
            ))}
          </div>
          <Pagination
            currentPage={effectivePagination.currentPage}
            totalPages={effectivePagination.totalPages}
            totalItems={effectivePagination.totalTickets}
            hasNextPage={effectivePagination.hasNextPage}
            hasPreviousPage={effectivePagination.hasPreviousPage}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </>
      )}
    </div>
  );
};

export default AdminTickets;

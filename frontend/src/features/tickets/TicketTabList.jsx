import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editTicket, fetchTickets } from './ticketSlice';
import Pagination from '../../components/common/Pagination';

const TicketTabList = () => {
  const dispatch = useDispatch();
  const { tickets, pagination, loading, error } = useSelector((state) => state.tickets);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchTickets({ page, limit: 10 }));
  }, [dispatch, page]);

  const handleClose = (ticket) => {
    if (window.confirm(`Are you sure you want to close ticket ${ticket.ticketNumber}?`)) {
      dispatch(editTicket({ id: ticket._id, payload: { status: 'Closed' } }));
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="page-card">
      <div className="page-header">
        <h2>My Tickets</h2>
        <a href="/tickets/new" className="btn">Create Ticket</a>
      </div>
      {error && <div className="alert error">{error}</div>}
      {loading ? <p>Loading tickets...</p> : tickets.length === 0 ? <p>No tickets yet.</p> : (
        <>
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
                  <button
                    disabled={ticket.status === 'Closed'}
                    style={{
                      backgroundColor: ticket.status === 'Closed' ? '#6c757d' : '#d97706',
                      cursor: ticket.status === 'Closed' ? 'not-allowed' : 'pointer'
                    }}
                    onClick={() => handleClose(ticket)}
                  >
                    {ticket.status === 'Closed' ? 'Closed' : 'Close Ticket'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {pagination && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalTickets}
              hasNextPage={pagination.hasNextPage}
              hasPreviousPage={pagination.hasPreviousPage}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TicketTabList;

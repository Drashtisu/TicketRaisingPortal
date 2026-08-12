import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchTickets } from './ticketSlice';

const TicketDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { tickets } = useSelector((state) => state.tickets);
  const ticket = tickets.find((item) => item._id === id);

  useEffect(() => {
    if (!tickets.length) dispatch(fetchTickets());
  }, [dispatch, tickets.length]);

  if (!ticket) return <div className="page-card">Ticket not found.</div>;

  return (
    <div className="page-card">
      <h2>{ticket.title}</h2>
      <p>{ticket.description}</p>
      <p><strong>Status:</strong> {ticket.status}</p>
      <p><strong>Priority:</strong> {ticket.priority || '—'}</p>
      <p><strong>Ticket Number:</strong> {ticket.ticketNumber}</p>
    </div>
  );
};

export default TicketDetails;

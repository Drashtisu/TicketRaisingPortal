import { useEffect, useState } from "react";
import {
  addWorkLog,
  getAssignedTickets,
  resolveAgentTicket,
  startTicketWork,
} from "./../../api/agentApi";
import Pagination from "../../components/common/Pagination";

const AgentTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [resolution, setResolution] = useState({});

  const loadTickets = async (pageNum = page) => {
    try {
      const response = await getAssignedTickets({ page: pageNum, limit: 10 });
      setTickets(response.data.data.tickets || []);
      setPagination(response.data.data.pagination || null);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not load assigned tickets",
      );
    }
  };

  useEffect(() => {
    loadTickets(page);
  }, [page]);

  const runAction = async (action) => {
    try {
      await action();
      setMessage("Ticket updated successfully.");
      loadTickets(page);
    } catch (error) {
      setMessage(error.response?.data?.message || "Ticket update failed");
    }
  };

  return (
    <div className="page-card">
      <h2>Assigned Tickets</h2>
      {message && <div className="alert">{message}</div>}
      <div className="card-grid">
        {tickets.map((ticket) => (
          <article key={ticket._id} className="ticket-card">
            <strong>{ticket.ticketNumber}</strong>
            <h3>{ticket.title}</h3>
            <p>{ticket.description}</p>
            <p>Status: {ticket.status}</p>
            <p>User Name: {ticket.createdBy?.name || "Unknown"}</p>
            <p>Ticket Assigner: {ticket.assignedBy?.name || "Unknown"}</p>
            {ticket.status === "Assigned" || ticket.status === "Reopened" ? (
              <button
                onClick={() => runAction(() => startTicketWork(ticket._id))}
              >
                Start work
              </button>
            ) : null}
            {ticket.status === "In Progress" && (
              <>
                <form
                  className="form-stack"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const text = e.currentTarget.message.value;
                    runAction(() => addWorkLog(ticket._id, text));
                    e.currentTarget.reset();
                  }}
                >
                  <input name="message" required placeholder="Work log" />
                  <button type="submit">Add log</button>
                </form>
                <form
                  className="form-stack"
                  onSubmit={(e) => {
                    e.preventDefault();
                    runAction(() =>
                      resolveAgentTicket(
                        ticket._id,
                        resolution[ticket._id] || "",
                      ),
                    );
                  }}
                >
                  <textarea
                    required
                    placeholder="Resolution"
                    value={resolution[ticket._id] || ""}
                    onChange={(e) =>
                      setResolution({
                        ...resolution,
                        [ticket._id]: e.target.value,
                      })
                    }
                  />
                  <button type="submit">Resolve</button>
                </form>
              </>
            )}
          </article>
        ))}
      </div>
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalTickets}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
};

export default AgentTickets;

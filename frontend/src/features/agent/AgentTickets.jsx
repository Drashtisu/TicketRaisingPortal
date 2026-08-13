import { useEffect, useState } from "react";
import {
  addWorkLog,
  getAssignedTickets,
  resolveAgentTicket,
  startTicketWork,
} from "../../api/agentApi";

const AgentTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");
  const [resolution, setResolution] = useState({});

  const loadTickets = async () => {
    try {
      const response = await getAssignedTickets();
      console.log(response);
      setTickets(response.data.data.tickets);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not load assigned tickets",
      );
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const runAction = async (action) => {
    try {
      await action();
      setMessage("Ticket updated successfully.");
      loadTickets();
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
            <p>Requester: {ticket.createdBy?.name || "Unknown"}</p>
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
    </div>
  );
};

export default AgentTickets;

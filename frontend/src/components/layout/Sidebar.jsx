import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <aside className="sidebar">
      <h3>Ticket Portal</h3>
      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        {user?.role !== 'agent' && <><NavLink to="/tickets">My Tickets</NavLink><NavLink to="/tickets/new">Create Ticket</NavLink></>}
        {user?.role === 'agent' && <NavLink to="/assigned-tickets">Assigned Tickets</NavLink>}
        {user?.role === 'admin' && (
          <>
            <NavLink to="/admin/tickets">Manage Tickets</NavLink>
            <NavLink to="/departments">Departments</NavLink>
            <NavLink to="/categories">Categories</NavLink>
            <NavLink to="/users">Users</NavLink>
          </>
        )}
        <NavLink to="/profile">Profile</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;

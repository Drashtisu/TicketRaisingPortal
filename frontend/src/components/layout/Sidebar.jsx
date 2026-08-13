import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <aside className="sidebar">
      <h3>Ticket Portal</h3>
      <nav>
        {/* Dashboard - All authenticated users */}
        <NavLink to="/dashboard">Dashboard</NavLink>

        {/* User & Admin Menu - Ticket Management */}
        {(user?.role === 'user' || user?.role === 'admin') && (
          <>
            <NavLink to="/tickets">My Tickets</NavLink>
            <NavLink to="/tickets/new">Create Ticket</NavLink>
          </>
        )}

        {/* Agent Menu */}
        {user?.role === 'agent' && (
          <NavLink to="/assigned-tickets">Assigned Tickets</NavLink>
        )}

        {/* Admin Menu - Management Features */}
        {user?.role === 'admin' && (
          <>
            <NavLink to="/admin/tickets">Manage Tickets</NavLink>
            <NavLink to="/departments">Departments</NavLink>
            <NavLink to="/categories">Categories</NavLink>
            <NavLink to="/users">Users</NavLink>
          </>
        )}

        {/* Profile - All authenticated users */}
        <NavLink to="/profile">Profile</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;

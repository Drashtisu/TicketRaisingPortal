import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeUser, fetchUsers, removeUser } from './userSlice';

const UserList = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.users);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="page-card">
      <h2>Users</h2>
      {loading ? <p>Loading users...</p> : (
        <div className="card-grid">
          {items.map((user) => (
            <div key={user._id} className="ticket-card">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <label>Role
                <select value={user.role} onChange={(e) => dispatch(changeUser({ id: user._id, payload: { role: e.target.value } }))}>
                  <option value="user">User</option><option value="agent">Agent</option><option value="admin">Admin</option>
                </select>
              </label>
              <label>Status
                <select value={String(user.isActive)} onChange={(e) => dispatch(changeUser({ id: user._id, payload: { isActive: e.target.value === 'true' } }))}>
                  <option value="true">Active</option><option value="false">Inactive</option>
                </select>
              </label>
              {currentUser && currentUser._id !== user._id && (
                <button
                  type="button"
                  style={{
                    marginTop: '12px',
                    backgroundColor: '#e63946',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.85rem'
                  }}
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete user ${user.name}?`)) {
                      dispatch(removeUser(user._id));
                    }
                  }}
                >
                  Delete User
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;

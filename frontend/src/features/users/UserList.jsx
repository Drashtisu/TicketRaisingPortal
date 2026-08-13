import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeUser, fetchUsers } from './userSlice';

const UserList = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.users);

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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeUser, fetchUsers, removeUser } from './userSlice';
import Pagination from '../../components/common/Pagination';

const UserList = () => {
  const dispatch = useDispatch();
  const { items, pagination, loading } = useSelector((state) => state.users);
  const currentUser = useSelector((state) => state.auth.user);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchUsers({ page, limit: 10 }));
  }, [dispatch, page]);

  const limit = 10;
  const totalUsersCount = pagination?.totalUsers ?? items.length;
  const totalPages = pagination?.totalPages ?? Math.ceil(totalUsersCount / limit) ?? 1;

  const effectivePagination = {
    currentPage: page,
    totalPages: totalPages,
    totalUsers: totalUsersCount,
    hasNextPage: pagination?.hasNextPage !== undefined ? pagination.hasNextPage : page < totalPages,
    hasPreviousPage: pagination?.hasPreviousPage !== undefined ? pagination.hasPreviousPage : page > 1
  };

  const visibleItems = items.length > limit ? items.slice((page - 1) * limit, page * limit) : items;

  return (
    <div className="page-card">
      <h2>Users</h2>
      {loading ? <p>Loading users...</p> : (
        <>
         
          <div className="card-grid" style={{ marginTop: '16px', marginBottom: '16px' }}>
            {visibleItems.map((user) => (
              <div key={user._id} className="ticket-card">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <label>Role
                  <select value={user.role} onChange={(e) => dispatch(changeUser({ id: user._id, payload: { role: e.target.value } }))}>
                    <option value="user">User</option><option value="agent">Agent</option><option value="admin">Admin</option>
                  </select>
                </label>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Status</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => dispatch(changeUser({ id: user._id, payload: { isActive: true } }))}
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #16a34a',
                        backgroundColor: user.isActive ? '#16a34a' : 'transparent',
                        color: user.isActive ? '#ffffff' : '#16a34a',
                        fontWeight: user.isActive ? 'bold' : 'normal',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch(changeUser({ id: user._id, payload: { isActive: false } }))}
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #dc2626',
                        backgroundColor: !user.isActive ? '#dc2626' : 'transparent',
                        color: !user.isActive ? '#ffffff' : '#dc2626',
                        fontWeight: !user.isActive ? 'bold' : 'normal',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={effectivePagination.currentPage}
            totalPages={effectivePagination.totalPages}
            totalItems={effectivePagination.totalUsers}
            hasNextPage={effectivePagination.hasNextPage}
            hasPreviousPage={effectivePagination.hasPreviousPage}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </>
      )}
    </div>
  );
};

export default UserList;

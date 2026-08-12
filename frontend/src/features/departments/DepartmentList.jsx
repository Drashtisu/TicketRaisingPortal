import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDepartment, editDepartment, fetchDepartments, removeDepartment } from './departmentSlice';

const DepartmentList = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.departments);
  const [form, setForm] = useState({ name: '', code: '', description: '' });

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const edit = (department) => {
    const name = window.prompt('Department name', department.name);
    if (name === null) return;
    const code = window.prompt('Department code', department.code);
    if (code === null) return;
    const description = window.prompt('Description', department.description || '');
    if (description === null) return;
    dispatch(editDepartment({ id: department._id, payload: { name, code, description } }));
  };

  return (
    <div className="page-card">
      <h2>Departments</h2>
      <form className="form-stack admin-form" onSubmit={async (e) => { e.preventDefault(); const result = await dispatch(addDepartment(form)); if (addDepartment.fulfilled.match(result)) setForm({ name: '', code: '', description: '' }); }}>
        <input required placeholder="Department name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button type="submit">Add department</button>
      </form>
      {loading ? <p>Loading departments...</p> : (
        <div className="card-grid">
          {items.map((dept) => (
            <div key={dept._id} className="ticket-card">
              <h3>{dept.name}</h3>
              <p>{dept.description || 'No description.'}</p>
              <p><strong>Code:</strong> {dept.code}</p>
              <p><strong>Status:</strong> {dept.status}</p>
              <div className="actions"><button onClick={() => edit(dept)}>Edit</button><button className="danger-button" onClick={() => { if (window.confirm(`Delete ${dept.name}?`)) dispatch(removeDepartment(dept._id)); }}>Delete</button></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentList;

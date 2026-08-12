import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../categories/categorySlice';
import { fetchDepartments } from '../departments/departmentSlice';
import { addTicket } from './ticketSlice';

const CreateTicket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: departments } = useSelector((state) => state.departments);
  const { items: categories } = useSelector((state) => state.categories);
  const [form, setForm] = useState({ title: '', description: '', department: '', category: '', priority: 'Medium' });

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(addTicket(form));
    if (addTicket.fulfilled.match(result)) navigate('/tickets');
  };

  return (
    <div className="page-card">
      <h2>Create Ticket</h2>
      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          Title
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>
        <label>
          Description
          <textarea required rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>
        <label>
          Department
          <select required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
            <option value="">Select department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>{dept.name}</option>
            ))}
          </select>
        </label>
        <label>
          Category
          <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label>
          Priority
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateTicket;

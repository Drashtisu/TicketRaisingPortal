import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getDepartments } from '../../api/departmentapi';
import { getCategories } from '../../api/categoryapi';
import { addTicket } from './ticketSlice';

const CreateTicket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', department: '', category: '', priority: 'Medium' });

  useEffect(() => {
    getDepartments({ limit: 100 }).then((res) => setDepartments(res.data.data.departments || [])).catch(() => {});
    getCategories({ limit: 1000, status: 'Active' }).then((res) => setCategories(res.data.data.categories || [])).catch(() => {});
  }, []);

  const handleDepartmentChange = (deptId) => {
    const isCategoryValid = categories.some(
      (cat) => cat._id === form.category && (cat.department?._id || cat.department) === deptId
    );
    setForm({
      ...form,
      department: deptId,
      category: isCategoryValid ? form.category : ''
    });
  };

  const availableCategories = form.department
    ? categories.filter((cat) => (cat.department?._id || cat.department) === form.department)
    : categories;

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
          <select required value={form.department} onChange={(e) => handleDepartmentChange(e.target.value)}>
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
            {availableCategories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name} {category.department?.name ? `(${category.department.name})` : ''}
              </option>
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

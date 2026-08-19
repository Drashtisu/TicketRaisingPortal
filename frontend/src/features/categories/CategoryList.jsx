import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDepartments } from "../../api/departmentapi";
import {
  addCategory,
  editCategory,
  fetchCategories,
  removeCategory,
} from "./categorySlice";
import Pagination from "../../components/common/Pagination";

const CategoryList = () => {
  const dispatch = useDispatch();
  const { items, pagination, loading } = useSelector((state) => state.categories);
  const [departments, setDepartments] = useState([]);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    department: "",
  });

  useEffect(() => {
    dispatch(fetchCategories({ page, limit: 10 }));
    getDepartments({ limit: 100 }).then((res) => {
      setDepartments(res.data.data.departments || []);
    }).catch(() => {});
  }, [dispatch, page]);

  const edit = (category) => {
    const name = window.prompt("Category name", category.name);
    if (name === null) return;
    const code = window.prompt("Category code", category.code);
    if (code === null) return;
    const description = window.prompt(
      "Description",
      category.description || "",
    );
    if (description === null) return;
    dispatch(
      editCategory({ id: category._id, payload: { name, code, description } }),
    );
  };

  return (
    <div className="page-card">
      <h2>Categories</h2>
      <form
        className="form-stack admin-form"
        onSubmit={async (e) => {
          e.preventDefault();
          const result = await dispatch(addCategory(form));
          if (addCategory.fulfilled.match(result))
            setForm({ name: "", code: "", description: "", department: "" });
        }}
      >
        <input
          required
          placeholder="Category name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          required
          placeholder="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />
        <select
          required
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
        >
          <option value="">Select department</option>
          {departments.map((department) => (
            <option key={department._id} value={department._id}>
              {department.name}
            </option>
          ))}
        </select>
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit">Add category</button>
      </form>
      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <>
          <div className="card-grid">
            {items.map((category) => (
              <div key={category._id} className="ticket-card">
                <h3>{category.name}</h3>
                <p>{category.description || "No description."}</p>
                <p>
                  <strong>Code:</strong> {category.code}
                </p>
                <p>
                  <strong>Department:</strong> {category.department?.name || "—"}
                </p>
                <div className="actions">
                  <button onClick={() => edit(category)}>Edit</button>
                  <button
                    className="danger-button"
                    onClick={() => {
                      if (window.confirm(`Delete ${category.name}?`))
                        dispatch(removeCategory(category._id));
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {pagination && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalCategories}
              hasNextPage={pagination.hasNextPage}
              hasPreviousPage={pagination.hasPreviousPage}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CategoryList;

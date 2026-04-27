import React, { useEffect, useState } from "react";
import "./Categories.css";

const Categories = () => {

  const [categories, setCategories] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [name, setName] = useState("");

  // ===== LOAD DATA =====
  const fetchCategories = async () => {
    const res = await fetch("http://localhost:4000/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ===== ADD =====
  const handleAdd = async () => {
    const res = await fetch("http://localhost:4000/api/categories/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    if (data.success) {
      setCategories([...categories, data.category]);
      setShowDialog(false);
      setName("");
    }
  };

  // ===== UPDATE =====
  const handleUpdate = async () => {
    const res = await fetch(`http://localhost:4000/api/categories/update/${currentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    if (data.success) {
      const updated = categories.map((cat) =>
        cat.id === currentId ? { ...cat, name } : cat
      );

      setCategories(updated);
      setShowDialog(false);
      setName("");
      setIsEdit(false);
    }
  };

  // ===== DELETE =====
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xoá không?");
    if (!confirmDelete) return;

    const res = await fetch(`http://localhost:4000/api/categories/delete/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  // ===== OPEN EDIT =====
  const openEdit = (cat) => {
    setIsEdit(true);
    setCurrentId(cat.id);
    setName(cat.name);
    setShowDialog(true);
  };

  return (
    <div className="categories">

      <h2>Quản lý Category</h2>

      <button
        className="add-btn"
        onClick={() => {
          setShowDialog(true);
          setIsEdit(false);
          setName("");
        }}
      >
        + Thêm Category
      </button>

      {/* LIST */}
      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td>
                <button onClick={() => openEdit(cat)}>Sửa</button>
                <button onClick={() => handleDelete(cat.id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* DIALOG */}
      {showDialog && (
        <div className="dialog-overlay">

          <div className="dialog">

            <h3>{isEdit ? "Cập nhật Category" : "Thêm Category"}</h3>

            <input
              type="text"
              placeholder="Nhập tên category"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="dialog-actions">
              <button onClick={isEdit ? handleUpdate : handleAdd}>
                {isEdit ? "Cập nhật" : "Thêm"}
              </button>

              <button onClick={() => setShowDialog(false)}>
                Huỷ
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Categories;
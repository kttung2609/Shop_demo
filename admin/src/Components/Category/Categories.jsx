import React, { useEffect, useState } from "react";
import "./Categories.css";
import { toast } from 'react-toastify';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Layers, 
  X, 
  Check, 
  ChevronRight,
  AlertCircle 
} from "lucide-react";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [name, setName] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Lỗi fetch categories:", error);
      toast.error("Không tải được danh mục");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!name.trim()) return toast.warning("Vui lòng nhập tên danh mục");

    try {
      const res = await fetch("http://localhost:4000/api/categories/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();

      if (data.success) {
        await fetchCategories();
        setShowDialog(false);
        setName("");
        toast.success("Đã thêm danh mục");
      } else {
        toast.error(data.message || "Không thể thêm danh mục");
      }
    } catch (error) {
      console.error("Lỗi thêm danh mục:", error);
      toast.error("Không thể kết nối tới máy chủ");
    }
  };

  const handleUpdate = async () => {

    try {
      const res = await fetch(`http://localhost:4000/api/categories/update/${currentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();

      if (data.success) {
        await fetchCategories();
        setShowDialog(false);
        setName("");
        setIsEdit(false);
        toast.success("Đã cập nhật danh mục");
      } else {
        toast.error(data.message || "Không thể cập nhật danh mục");
      }
    } catch (error) {
      console.error("Lỗi cập nhật danh mục:", error);
      toast.error("Không thể kết nối tới máy chủ");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá danh mục này có thể ảnh hưởng đến sản phẩm liên quan. Bạn chắc chứ?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/categories/delete/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        await fetchCategories();
        toast.success("Đã xóa danh mục");
      } else {
        toast.error(data.message || "Không thể xóa danh mục");
      }
    } catch (error) {
      console.error("Lỗi xóa danh mục:", error);
      toast.error("Không thể kết nối tới máy chủ");
    }
  };

  const openEdit = (cat) => {
    setIsEdit(true);
    setCurrentId(cat.id);
    setName(cat.name);
    setShowDialog(true);
  };

  return (
    <div className="admin-categories-page">
      <div className="categories-header-top">
        <div className="title-section">
          <h1>Danh Mục Sản Phẩm</h1>
          <p>Quản lý các nhóm hàng hóa chính trên cửa hàng</p>
        </div>
        <button className="btn-add-cat" onClick={() => { setShowDialog(true); setIsEdit(false); setName(""); }}>
          <Plus size={20} /> THÊM DANH MỤC
        </button>
      </div>

      <div className="categories-table-wrapper">
        <table className="modern-cat-table">
          <thead>
            <tr>
              <th style={{ width: '100px' }}>ID</th>
              <th>TÊN DANH MỤC</th>
              <th style={{ width: '200px' }} className="text-right">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="cat-id">#{cat.id}</td>
                <td className="cat-name-cell">
                  <Layers size={18} className="cat-icon-mini" />
                  <span>{cat.name}</span>
                </td>
                <td className="text-right">
                  <div className="cat-actions">
                    <button className="btn-cat-edit" onClick={() => openEdit(cat)}><Edit3 size={16} /></button>
                    <button className="btn-cat-delete" onClick={() => handleDelete(cat.id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDialog && (
        <div className="cat-modal-overlay">
          <div className="cat-modal-card">
            <div className="modal-header">
              <h3>{isEdit ? "CẬP NHẬT DANH MỤC" : "THÊM DANH MỤC MỚI"}</h3>
              <X className="close-icon" onClick={() => setShowDialog(false)} />
            </div>
            <div className="modal-body">
              <div className="input-field">
                <label>Tên danh mục *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Vợt cầu lông, Giày..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowDialog(false)}>ĐÓNG</button>
              <button className="btn-save" onClick={isEdit ? handleUpdate : handleAdd}>
                <Check size={18} /> {isEdit ? "LƯU THAY ĐỔI" : "XÁC NHẬN THÊM"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
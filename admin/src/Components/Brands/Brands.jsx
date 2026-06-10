import React, { useEffect, useState } from "react";
import "./Brands.css";
import { toast } from 'react-toastify';
import { 
  Plus,
  Edit3,
  Trash2,
  Layers,
  X,
  Check
} from "lucide-react";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [name, setName] = useState("");

  const fetchBrands = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/brands");
      const data = await res.json();
      setBrands(data || []);
    } catch (error) {
      console.error("Lỗi fetch brands:", error);
      toast.error("Không tải được danh sách thương hiệu");
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleAdd = async () => {
    if (!name.trim()) return toast.warning("Vui lòng nhập tên thương hiệu");

    try {
      const res = await fetch("http://localhost:4000/api/brands/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();

      if (data.success) {
        await fetchBrands();
        setShowDialog(false);
        setName("");
        toast.success("Đã thêm thương hiệu");
      } else {
        toast.error(data.message || "Không thể thêm thương hiệu");
      }
    } catch (error) {
      console.error("Lỗi thêm thương hiệu:", error);
      toast.error("Không thể kết nối tới máy chủ");
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/brands/update/${currentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();

      if (data.success) {
        await fetchBrands();
        setShowDialog(false);
        setName("");
        setIsEdit(false);
        toast.success("Đã cập nhật thương hiệu");
      } else {
        toast.error(data.message || "Không thể cập nhật thương hiệu");
      }
    } catch (error) {
      console.error("Lỗi cập nhật thương hiệu:", error);
      toast.error("Không thể kết nối tới máy chủ");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa thương hiệu này sẽ ảnh hưởng đến sản phẩm liên quan. Bạn chắc chứ?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/brands/delete/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        await fetchBrands();
        toast.success("Đã xóa thương hiệu");
      } else {
        toast.error(data.message || "Không thể xóa thương hiệu");
      }
    } catch (error) {
      console.error("Lỗi xóa thương hiệu:", error);
      toast.error("Không thể kết nối tới máy chủ");
    }
  };

  const openEdit = (b) => {
    setIsEdit(true);
    setCurrentId(b.id);
    setName(b.name);
    setShowDialog(true);
  };

  return (
    <div className="admin-brands-page">
      <div className="brands-header-top">
        <div className="title-section">
          <h1>Thương hiệu</h1>
          <p>Quản lý thương hiệu sản phẩm</p>
        </div>
        <button className="btn-add-cat" onClick={() => { setShowDialog(true); setIsEdit(false); setName(""); }}>
          <Plus size={20} /> THÊM THƯƠNG HIỆU
        </button>
      </div>

      <div className="categories-table-wrapper">
        <table className="modern-cat-table">
          <thead>
            <tr>
              <th style={{ width: '100px' }}>ID</th>
              <th>TÊN THƯƠNG HIỆU</th>
              <th style={{ width: '200px' }} className="text-right">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id}>
                <td className="cat-id">#{b.id}</td>
                <td className="cat-name-cell">
                  <Layers size={18} className="cat-icon-mini" />
                  <span>{b.name}</span>
                </td>
                <td className="text-right">
                  <div className="cat-actions">
                    <button className="btn-cat-edit" onClick={() => openEdit(b)}><Edit3 size={16} /></button>
                    <button className="btn-cat-delete" onClick={() => handleDelete(b.id)}><Trash2 size={16} /></button>
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
              <h3>{isEdit ? "CẬP NHẬT THƯƠNG HIỆU" : "THÊM THƯƠNG HIỆU MỚI"}</h3>
              <X className="close-icon" onClick={() => setShowDialog(false)} />
            </div>
            <div className="modal-body">
              <div className="input-field">
                <label>Tên thương hiệu *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Yonex, Victor..."
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

export default Brands;

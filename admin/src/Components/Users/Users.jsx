import React, { useEffect, useState } from "react";
import "./Users.css";
import { 
  UserPlus, 
  Edit3, 
  Trash2, 
  Mail, 
  Shield, 
  Camera, 
  X, 
  Check, 
  UserCircle
} from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return null;
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    const res = await fetch("http://localhost:4000/api/users/upload-avatar", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    return data.filename;
  };

  const handleSubmit = async () => {
    let avatar = form.avatar;
    if (avatarFile) {
      avatar = await uploadAvatar();
    }

    const url = isEdit 
      ? `http://localhost:4000/api/users/update/${currentId}` 
      : "http://localhost:4000/api/users/add";
    
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, avatar })
    });

    const data = await res.json();
    if (data.success) {
      fetchUsers();
      setShowDialog(false);
      resetForm();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thành viên này?")) return;
    await fetch(`http://localhost:4000/api/users/delete/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const openEdit = (user) => {
    setIsEdit(true);
    setCurrentId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      avatar: user.avatar
    });
    setPreview(`http://localhost:4000/uploads/avatars/${user.avatar}`);
    setShowDialog(true);
  };

  const resetForm = () => {
    setForm({ name: "", email: "", password: "", role: "user" });
    setAvatarFile(null);
    setPreview("");
  };

  return (
    <div className="admin-users-page">
      {/* HEADER: Kéo dãn 100% */}
      <div className="users-top-bar">
        <div className="title-area">
          <h1>Quản lý thành viên</h1>
          <p>Hệ thống ghi nhận {users.length} tài khoản đang hoạt động</p>
        </div>
        <button className="btn-add-main" onClick={() => { setShowDialog(true); setIsEdit(false); resetForm(); }}>
          <UserPlus size={20} /> THÊM THÀNH VIÊN
        </button>
      </div>

      {/* TABLE WRAPPER: Kéo dãn 100% */}
      <div className="users-table-container">
        <table className="users-modern-table">
          <thead>
            <tr>
              <th className="w-id">ID</th>
              <th className="w-user">THÀNH VIÊN</th>
              <th className="w-email">EMAIL</th>
              <th className="w-role">VAI TRÒ</th>
              <th className="w-actions text-right">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td className="col-id">#{u.id}</td>
                <td className="col-user">
                  <div className="user-profile-box">
                    <div className="avatar-wrapper">
                      <img 
                        src={`http://localhost:4000/uploads/avatars/${u.avatar}`} 
                        alt="avatar" 
                        onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      />
                    </div>
                    <span className="name-text">{u.name}</span>
                  </div>
                </td>
                <td className="col-email">
                  <div className="email-info"><Mail size={16} /> {u.email}</div>
                </td>
                <td className="col-role">
                  <span className={`badge-role ${u.role}`}>
                    {u.role === 'admin' ? <Shield size={14} /> : <UserCircle size={14} />}
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="col-actions text-right">
                  <div className="action-buttons-group">
                    <button className="act-btn edit" onClick={() => openEdit(u)}><Edit3 size={18} /></button>
                    <button className="act-btn delete" onClick={() => handleDelete(u.id)}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DIALOG */}
      {showDialog && (
        <div className="users-modal-overlay">
          <div className="users-modal-card">
            <div className="modal-header">
              <h3>{isEdit ? "Cập nhật tài khoản" : "Tạo tài khoản mới"}</h3>
              <X className="close-icon" onClick={() => setShowDialog(false)} />
            </div>
            <div className="modal-body">
               <div className="upload-avatar-zone">
                  <div className="preview-circle">
                    {preview ? <img src={preview} alt="preview" /> : <Camera size={40} color="#ccc" />}
                  </div>
                  <label className="label-upload">
                    Tải ảnh đại diện
                    <input type="file" hidden onChange={handleImage} />
                  </label>
               </div>
               <div className="form-inputs">
                  <div className="input-field">
                    <label>Họ và tên</label>
                    <input name="name" placeholder="Họ và tên" onChange={handleChange} value={form.name} />
                  </div>
                  <div className="input-field">
                    <label>Địa chỉ Email</label>
                    <input name="email" placeholder="Email" onChange={handleChange} value={form.email} />
                  </div>
                  {!isEdit && (
                    <div className="input-field">
                      <label>Mật khẩu</label>
                      <input name="password" type="password" placeholder="Mật khẩu" onChange={handleChange} />
                    </div>
                  )}
                  <div className="input-field">
                    <label>Quyền hạn</label>
                    <select name="role" onChange={handleChange} value={form.role}>
                      <option value="user">Khách hàng</option>
                      <option value="admin">Quản trị viên</option>
                    </select>
                  </div>
               </div>
            </div>
            <div className="modal-footer">
               <button className="btn-close-modal" onClick={() => setShowDialog(false)}>Đóng</button>
               <button className="btn-save-modal" onClick={handleSubmit}>
                 {isEdit ? "Lưu thay đổi" : "Tạo thành viên"}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
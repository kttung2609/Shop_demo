import React, { useEffect, useRef, useState } from "react";
import "./Users.css";
import { toast } from "react-toastify";
import { 
  UserPlus, 
  Edit3, 
  Trash2, 
  Mail, 
  Shield, 
  Camera, 
  X, 
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
    avatar: ""
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState("");
  const avatarInputRef = useRef(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi fetch users:", error);
      toast.error("Không tải được danh sách thành viên");
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
      toast.success("Đã chọn ảnh xem trước");
    }
  };

  const openAvatarPicker = () => {
    avatarInputRef.current?.click();
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
    if (!data.success) {
      throw new Error(data.message || "Upload avatar thất bại");
    }
    return data.filename;
  };

  const handleSubmit = async () => {
    try {
      let avatar = form.avatar;
      if (avatarFile) {
        avatar = await uploadAvatar();
      }

      const password = form.password.trim();
      if (!isEdit && !password) {
        toast.error("Vui lòng nhập mật khẩu cho tài khoản mới");
        return;
      }

      const url = isEdit 
        ? `http://localhost:4000/api/users/update/${currentId}` 
        : "http://localhost:4000/api/users/add";

      const payload = {
        name: form.name,
        email: form.email,
        avatar
      };

      if (password) {
        payload.password = password;
      }
      
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        await fetchUsers();
        setShowDialog(false);
        resetForm();
        toast.success(isEdit ? "Đã cập nhật thành viên" : "Đã thêm thành viên");
      } else {
        toast.error(data.message || (isEdit ? "Không thể cập nhật thành viên" : "Không thể thêm thành viên"));
      }
    } catch (error) {
      console.error("Lỗi lưu thành viên:", error);
      toast.error(error.message || "Không thể kết nối tới máy chủ");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thành viên này?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/users/delete/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        await fetchUsers();
        toast.success("Đã xóa thành viên");
      } else {
        toast.error(data.message || "Không thể xóa thành viên");
      }
    } catch (error) {
      console.error("Lỗi xóa thành viên:", error);
      toast.error("Không thể kết nối tới máy chủ");
    }
  };

  const openEdit = (user) => {
    setIsEdit(true);
    setCurrentId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      avatar: user.avatar
    });
    setPreview(`http://localhost:4000/uploads/avatars/${user.avatar}`);
    setAvatarFile(null);
    setShowDialog(true);
  };

  const resetForm = () => {
    setForm({ name: "", email: "", password: "", avatar: "" });
    setAvatarFile(null);
    setPreview("");
  };

  return (
    <div className="admin-users-page">
      <div className="users-top-bar">
        <div className="title-area">
          <h1>Quản lý thành viên</h1>
          <p>Hệ thống ghi nhận {users.length} tài khoản đang hoạt động</p>
        </div>
        <button className="btn-add-main" onClick={() => { setShowDialog(true); setIsEdit(false); resetForm(); }}>
          <UserPlus size={20} /> THÊM THÀNH VIÊN
        </button>
      </div>

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
                  <button type="button" className="label-upload" onClick={openAvatarPicker}>
                    Tải ảnh đại diện
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImage}
                  />
                  {avatarFile && <span className="selected-file-name">{avatarFile.name}</span>}
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
                  <div className="input-field">
                    <label>{isEdit ? "Mật khẩu mới" : "Mật khẩu"}</label>
                    <input
                      name="password"
                      type="password"
                      placeholder={isEdit ? "Để trống nếu không đổi mật khẩu" : "Mật khẩu"}
                      onChange={handleChange}
                      value={form.password}
                    />
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
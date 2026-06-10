import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../Context/AdminContext";
import { User, Mail, Phone, Fingerprint, LogOut, ShieldCheck, Camera, ChevronRight, Save } from "lucide-react";
import { toast } from "react-toastify";
import "./Profile.css";

const AdminProfile = () => {
  const { admin, setAdmin, fetchAdminData } = useContext(AdminContext);
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("admin") && !admin) {
      navigate("/login");
    }
  }, [admin, navigate]);

  useEffect(() => {
    if (admin) {
      setProfileForm({
        name: admin.name || "",
        email: admin.email || "",
        phone: admin.phone || "",
      });
    }
  }, [admin]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const handleSaveProfile = async (event) => {
    event?.preventDefault?.();
    if (!admin?.id) return;

    try {
      setSavingProfile(true);
      const res = await fetch(`http://localhost:4000/api/users/update/${admin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileForm.name.trim(),
          email: profileForm.email.trim(),
          phone: profileForm.phone.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Không thể cập nhật hồ sơ");
      }

      const updatedAdmin = await fetchAdminData();
      if (updatedAdmin) {
        setAdmin(updatedAdmin);
        localStorage.setItem("admin", JSON.stringify(updatedAdmin));
      }

      toast.success("Đã cập nhật hồ sơ admin");
      window.location.reload();
    } catch (error) {
      toast.error(error.message || "Không thể cập nhật hồ sơ admin");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/auth/logout/admin", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.log("Lỗi logout admin:", error);
    }

    localStorage.removeItem("admin");
    setAdmin(null);
    window.location.replace("/login");
  };

  if (!admin) {
    return (
      <div className="admin-profile-loading">
        <div className="spinner"></div>
        <p>Đang tải thông tin quản trị viên...</p>
      </div>
    );
  }

  return (
    <div className="admin-profile-page">
      <div className="admin-profile-breadcrumb">
        <div className="container-custom">
          <span onClick={() => navigate("/")}>Trang chủ</span> <ChevronRight size={14} />
          <span className="active">Tài khoản admin</span>
        </div>
      </div>

      <div className="container-custom admin-profile-layout">
        <aside className="admin-profile-sidebar">
          <div className="sidebar-header">
            <div className="avatar-preview">
              <img
                src={admin.avatar ? `http://localhost:4000/uploads/avatars/${admin.avatar}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="avatar"
              />
              <label className="change-avatar-btn">
                <Camera size={14} />
                <input type="file" hidden />
              </label>
            </div>
            <div className="header-info">
              <h3>{admin.name}</h3>
              <p>Quản trị viên hệ thống</p>
            </div>
          </div>

          <nav className="sidebar-menu">
            <button className="menu-item active" type="button" onClick={() => navigate("/profile")}>
              <User size={18} /> Hồ sơ admin
            </button>
            <button className="menu-item" type="button" onClick={() => navigate("/stats")}>
              <ShieldCheck size={18} /> Thống kê
            </button>
            <hr />
            <button className="menu-item logout" type="button" onClick={handleLogout}>
              <LogOut size={18} /> Đăng xuất
            </button>
          </nav>
        </aside>

        <main className="admin-profile-content">
          <div className="content-card">
            <div className="card-header">
              <h2>Hồ sơ của tôi</h2>
              <p>Quản lý thông tin tài khoản quản trị viên</p>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon"><User size={20} /></div>
                <div className="info-text">
                  <label>Họ và tên</label>
                  <input
                    className="profile-input inline"
                    name="name"
                    value={profileForm.name}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên"
                  />
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon"><Mail size={20} /></div>
                <div className="info-text">
                  <label>Địa chỉ Email</label>
                  <input
                    className="profile-input inline"
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ email"
                  />
                </div>
                <span className="verified-badge">Quản trị</span>
              </div>

              <div className="info-item">
                <div className="info-icon"><Phone size={20} /></div>
                <div className="info-text">
                  <label>Số điện thoại</label>
                  <input
                    className="profile-input inline"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon"><Fingerprint size={20} /></div>
                <div className="info-text">
                  <label>ID Tài khoản</label>
                  <p>#{admin.id}</p>
                </div>
              </div>
            </div>

            <div className="profile-actions-footer">
              <button className="btn-save-profile" type="button" onClick={handleSaveProfile} disabled={savingProfile}>
                <Save size={16} />
                {savingProfile ? "Đang lưu..." : "Cập nhật tổng"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;
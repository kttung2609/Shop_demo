import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import { ShopContext } from "../../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import { ChevronRight, LogOut, Package, ShieldCheck, User, Save } from "lucide-react";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const { user, setUser } = useContext(ShopContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("user") && !user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin mật khẩu");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("http://localhost:4000/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Không thể đổi mật khẩu");
      }

      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Đổi mật khẩu thành công");
    } catch (error) {
      toast.error(error.message || "Không thể đổi mật khẩu");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/auth/logout/user", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("user");
      setUser(null);
      window.location.replace("/");
    } catch (error) {
      console.log("Lỗi logout:", error);
    }
  };

  if (!user) {
    return (
      <div className="profile-loading-container">
        <div className="spinner"></div>
        <p>Đang tải thông tin tài khoản...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-breadcrumb">
        <div className="container-custom">
          <span onClick={() => navigate("/")}>Trang chủ</span> <ChevronRight size={14} />
          <span onClick={() => navigate("/profile")}>Tài khoản của tôi</span> <ChevronRight size={14} />
          <span className="active">Đổi mật khẩu</span>
        </div>
      </div>

      <div className="container-custom profile-layout">
        <aside className="profile-sidebar">
          <div className="sidebar-header">
            <div className="avatar-preview">
              <img
                src={user.avatar ? `http://localhost:4000/uploads/avatars/${user.avatar}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="avatar"
              />
            </div>
            <div className="header-info">
              <h3>{user.name}</h3>
              <p>Thành viên của Badminton Shop</p>
            </div>
          </div>

          <nav className="sidebar-menu">
            <button className="menu-item" onClick={() => navigate("/profile")}>
              <User size={18} /> Hồ sơ cá nhân
            </button>
            <button className="menu-item" onClick={() => navigate("/orders")}>
              <Package size={18} /> Đơn hàng đã mua
            </button>
            <button className="menu-item active" onClick={() => navigate("/change-password")}>
              <ShieldCheck size={18} /> Đổi mật khẩu
            </button>
            <hr />
            <button className="menu-item logout" onClick={handleLogout}>
              <LogOut size={18} /> Đăng xuất
            </button>
          </nav>
        </aside>

        <main className="profile-content">
          <div className="content-card">
            <div className="card-header">
              <h2>Đổi mật khẩu</h2>
              <p>Nhập mật khẩu cũ và tạo mật khẩu mới an toàn hơn.</p>
            </div>

            <form className="password-form" onSubmit={handleSubmit}>
              <label className="field-group full-width">
                <span>Mật khẩu hiện tại</span>
                <input
                  className="profile-input"
                  type="password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </label>

              <div className="form-grid">
                <label className="field-group">
                  <span>Mật khẩu mới</span>
                  <input
                    className="profile-input"
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu mới"
                  />
                </label>

                <label className="field-group">
                  <span>Xác nhận mật khẩu</span>
                  <input
                    className="profile-input"
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </label>
              </div>

              <div className="profile-actions-footer">
                <button className="btn-save-profile secondary" type="submit" disabled={saving}>
                  <Save size={16} /> {saving ? "ĐANG CẬP NHẬT..." : "ĐỔI MẬT KHẨU"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChangePassword;

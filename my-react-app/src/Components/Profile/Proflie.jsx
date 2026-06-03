import React, { useContext, useEffect } from "react";
import "./Profile.css";
import { ShopContext } from "../../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Fingerprint, 
  LogOut, 
  Package, 
  ShieldCheck, 
  Camera,
  ChevronRight 
} from "lucide-react";

const Profile = () => {
  const { user, setUser } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("user") && !user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/auth/logout/user", { 
        method: "POST", 
        credentials: "include" 
      });
      localStorage.removeItem("user");
      setUser(null);
      window.location.replace("/");
    } catch (err) {
      console.log("Lỗi logout:", err);
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
          <span className="active">Tài khoản của tôi</span>
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
              <label className="change-avatar-btn">
                <Camera size={14} />
                <input type="file" hidden />
              </label>
            </div>
            <div className="header-info">
              <h3>{user.name}</h3>
              <p>Thành viên của Badminton Shop</p>
            </div>
          </div>

          <nav className="sidebar-menu">
            <button className="menu-item active">
              <User size={18} /> Hồ sơ cá nhân
            </button>
            <button className="menu-item" onClick={() => navigate("/orders")}>
              <Package size={18} /> Đơn hàng đã mua
            </button>
            <button className="menu-item">
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
              <h2>Hồ sơ của tôi</h2>
              <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon"><User size={20} /></div>
                <div className="info-text">
                  <label>Họ và tên</label>
                  <p>{user.name}</p>
                </div>
                <button className="edit-btn">Thay đổi</button>
              </div>

              <div className="info-item">
                <div className="info-icon"><Mail size={20} /></div>
                <div className="info-text">
                  <label>Địa chỉ Email</label>
                  <p>{user.email}</p>
                </div>
                <span className="verified-badge">Đã xác thực</span>
              </div>

              <div className="info-item">
                <div className="info-icon"><Fingerprint size={20} /></div>
                <div className="info-text">
                  <label>ID Tài khoản</label>
                  <p>#{user.id}</p>
                </div>
              </div>
            </div>

            <div className="profile-actions-footer">
              <button className="btn-save-profile">CẬP NHẬT THÔNG TIN</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
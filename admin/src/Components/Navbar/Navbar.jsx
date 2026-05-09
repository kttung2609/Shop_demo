import React, { useEffect, useState } from "react";
import "./Navbar.css";
import navlogo from "../../assets/nav-logo.svg";
import { LogOut, User as UserIcon, Settings, ExternalLink, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/auth/me", { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (data && data.role === "admin") {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        } else {
          window.location.href = "http://localhost:5174/login";
        }
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const logout = async () => {
    await fetch("http://localhost:4000/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/login";
  };

  return (
    <div className="admin-navbar">
      <div className="nav-left-brand">
        <img src={navlogo} alt="Logo" className="admin-logo" />
        <div className="brand-text">
          <span className="shop-name">BADMINTON SHOP</span>
          <span className="admin-badge">ADMIN</span>
        </div>
      </div>

      <div className="nav-right-user">
        <a href="http://localhost:5174" target="_blank" rel="noreferrer" className="go-to-shop">
           <ExternalLink size={16} /> Xem cửa hàng
        </a>

        {user ? (
          <div className="admin-user-profile" onClick={() => setShowMenu(!showMenu)}>
            <div className="admin-info-text">
              <span className="name">{user.name}</span>
              <span className="role">Quản trị viên</span>
            </div>
            <div className="avatar-container">
                <img
                  src={user.avatar ? `http://localhost:4000/uploads/avatars/${user.avatar}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  className="admin-avatar"
                  alt="avatar"
                />
            </div>
            <ChevronDown size={16} className={`chevron-icon ${showMenu ? "rotate" : ""}`} />

            {showMenu && (
              <div className="admin-dropdown-menu">
                <div className="dropdown-header">
                    <p><strong>{user.name}</strong></p>
                    <p className="user-email">{user.email}</p>
                </div>
                <hr />
                <button onClick={() => window.location.href = "/profile"}><UserIcon size={16}/> Hồ sơ</button>
                <button onClick={() => window.location.href = "/settings"}><Settings size={16}/> Cài đặt</button>
                <hr />
                <button className="logout-btn-nav" onClick={logout}><LogOut size={16}/> Đăng xuất</button>
              </div>
            )}
          </div>
        ) : (
          <button className="btn-nav-login" onClick={() => window.location.href = "/login"}>Đăng nhập</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
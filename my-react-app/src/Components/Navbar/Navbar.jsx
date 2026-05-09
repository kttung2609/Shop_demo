import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import './Navbar.css';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ClipboardList, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar = () => {
  const { getTotalCartItems, user, setUser } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("http://localhost:4000/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    navigate("/login");
  };

  return (
    <div className='navbar-container'>
      <div className='navbar-wrapper'>
        <div className='nav-left'>
          <Link to="/" className='nav-logo'>
            <img src={logo} alt="Logo" />
            <span>BADMINTON<span>SHOP</span></span>
          </Link>
        </div>

        <div className='nav-right'>
          <Link to='/orders' className='nav-icon-link'><ClipboardList size={26} /></Link>
          <div className='nav-cart-box' onClick={() => navigate("/cart")}>
            <ShoppingCart size={26} />
            <span className='cart-badge'>{getTotalCartItems()}</span>
          </div>

          <div className='nav-user-section'>
            {user && user.role === "user" ? (
              <div className='user-profile-dropdown'>
                <div className='user-trigger'>
                  <img
                    src={user.avatar ? `http://localhost:4000/uploads/avatars/${user.avatar}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    className="user-avatar"
                    alt="avatar"
                  />
                  <span className="user-name-label">{user.name}</span>
                </div>
                <div className='user-dropdown-menu'>
                  <Link to="/profile" className="dropdown-link">Hồ sơ của tôi</Link>
                  <Link to="/orders" className="dropdown-link">Đơn hàng</Link>
                  <button onClick={handleLogout} className='logout-btn'><LogOut size={16} /> Đăng xuất</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className='login-btn-nav'>
                <UserIcon size={20} />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
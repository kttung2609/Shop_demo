import React, { useState, useEffect, useContext, useRef } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import './Navbar.css';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ClipboardList, LogOut, User as UserIcon, Search } from 'lucide-react';

export const Navbar = () => {
  const { getTotalCartItems, user, setUser, all_product } = useContext(ShopContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const categories = [
    { value: "all", label: "Tất cả" },
    { value: "1", label: "Vợt cầu lông" },
    { value: "2", label: "Giày cầu lông" },
    { value: "3", label: "Áo cầu lông" },
    { value: "5", label: "Phụ kiện cầu lông" },
  ];

  // Logic lọc 8 sản phẩm gợi ý
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = all_product.filter(item => {
        const matchesName = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = searchCategory === "all" || String(item.category_id) === searchCategory;
        return matchesName && matchesCategory;
      });
      setSuggestions(filtered.slice(0, 8)); // Chỉ lấy tối đa 8 sản phẩm
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, searchCategory, all_product]);

  // Đóng gợi ý khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setShowSuggestions(false);
    navigate(`/search?q=${searchTerm.trim()}${searchCategory !== "all" ? `&category=${searchCategory}` : ""}`);
  };

  const handleLogout = async () => {
    await fetch("http://localhost:4000/auth/logout", { method: "POST", credentials: "include" });
    localStorage.removeItem("user");
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

        <div className='nav-center' ref={searchRef}>
          <form className='search-box' onSubmit={handleSearch}>
            <input
              type="text"
              value={searchTerm}
              onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Bạn cần tìm sản phẩm gì..."
            />
            {/* <select
              className="search-category"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            > */}
              {/* {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))} 
            </select> */}
            <button type='submit' className='search-icon-btn'>
              <Search size={18} />
            </button>
          </form>
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions-box">
              <div className="suggestion-header">Sản phẩm gợi ý</div>
              {suggestions.map((item) => {
                let imgPreview = "default.jpg";
                try {
                  const imgs = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
                  imgPreview = imgs[0];
                } catch (e) { imgPreview = item.image || "default.jpg"; }

                return (
                  <div 
                    key={item.id} 
                    className="suggestion-item"
                    onClick={() => {
                      navigate(`/product/${item.id}`);
                      setShowSuggestions(false);
                      setSearchTerm("");
                    }}
                  >
                    <img src={`http://localhost:4000/uploads/${imgPreview}`} alt="" />
                    <div className="sug-info">
                      <p className="sug-name">{item.name}</p>
                      <p className="sug-price">{Number(item.new_price).toLocaleString()}₫</p>
                    </div>
                  </div>
                );
              })}
              <div className="suggestion-footer" onClick={handleSearch}>
                Xem tất cả kết quả cho "{searchTerm}"
              </div>
            </div>
          )}
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
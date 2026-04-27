import React, { useState, useEffect, useContext } from 'react'
import { ShopContext } from '../../Context/ShopContext';
import './Navbar.css'
import logo from '../assets/logo.png'
import cart_icon from '../assets/cart_icon.png'
import orders_icon from '../assets/order.png'
import { Link, useNavigate } from 'react-router-dom'

export const Navbar = () => {

  const { getTotalCartItems, all_product } = useContext(ShopContext);

  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  // SEARCH
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  // ===== HANDLE SEARCH =====
  const handleSearch = () => {
    if (search.trim() !== "") {
      navigate(`/search?q=${search}`);
      setSearch("");
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // ===== LOAD USER =====
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // ===== LOAD CATEGORY =====
  useEffect(() => {
    fetch("http://localhost:4000/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  // ===== SEARCH SUGGESTION =====
  useEffect(() => {
    if (search.trim() === "") {
      setSuggestions([]);
      return;
    }

    const keyword = search.toLowerCase();

    const productList = Array.isArray(all_product)
      ? all_product
      : all_product?.data || [];

    const filtered = productList.filter(item =>
      item.name.toLowerCase().includes(keyword)
    );

    setSuggestions(filtered.slice(0, 6));

  }, [search, all_product]);

  return (
    <div className='navbar'>

      {/* LEFT */}
      <div className='nav-left'>

        {/* CATEGORY */}
        <div className='nav-category' onClick={() => setShowMenu(!showMenu)}>
          ☰ Danh mục ▼
          {showMenu && (
            <div className="dropdown-menu">
              {categories.map((cat) => (
                <Link 
                  key={cat.id} 
                  to={`/${cat.slug}`} 
                  className="dropdown-item"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* LOGO */}
        <Link to="/" className='nav-logo'>
          <img src={logo} alt="" />
          <p>BadmintonShop</p>
        </Link>

      </div>

      {/* SEARCH */}
      <div className='nav-search'>

        <input
          type="text"
          placeholder='Tìm kiếm sản phẩm'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button className="search-btn" onClick={handleSearch}>
          🔍
        </button>

        {/* DROPDOWN */}
        {suggestions.length > 0 && (
          <div className="search-dropdown">

            {/* CATEGORY */}
            <div className="search-category">
              <p>Danh mục sản phẩm</p>

              <div className="category-list">
                {categories
                  .filter(cat => 
                    cat.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .slice(0, 6)
                  .map(cat => (
                    <Link key={cat.id} to={`/${cat.slug}`}>
                      {cat.name}
                    </Link>
                  ))}
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="search-products">
              <p>Sản phẩm</p>

              {suggestions.map(item => (
                <div
                  key={item.id}
                  className="search-item"
                  onClick={() => {
                    navigate(`/product/${item.id}`);
                    setSearch("");
                    setSuggestions([]);
                  }}
                >
                  <img
                    src={`http://localhost:4000/uploads/${item.images?.[0]}`}
                    alt=""
                  />

                  <div>
                    <p>{item.name}</p>
                    <span className="price">
                      {item.new_price}đ
                    </span>
                  </div>
                </div>
              ))}

            </div>

          </div>
        )}

      </div>

      {/* RIGHT */}
      <div className='nav-right'>

        <div className='nav-phone'>
          📞 0974594175
        </div>

        <div className='nav-order-box'>
          <Link to='/orders'>
            <img width="30px" src={orders_icon} alt="" />
          </Link>
        </div>

        <div className='nav-cart-box'>
          <Link to='/cart'>
            <img src={cart_icon} alt="" />
          </Link>

          <div className='nav-cart-count'>
            {getTotalCartItems()}
          </div>
        </div>

        {user ? (
          <Link to="/profile">
            <img
              src={user.avatar || "https://via.placeholder.com/40"}
              className="nav-avatar"
              alt=""
            />
          </Link>
        ) : (
          <Link to='/login'>
            <button>Login</button>
          </Link>
        )}

      </div>

    </div>
  )
}
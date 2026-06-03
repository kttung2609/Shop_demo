import React, { useEffect, useState } from 'react'
import './Popular.css'
import Item from '../AdminItems/AdminItem.jsx'
import { useLocation, useNavigate } from "react-router-dom"
import { 
  Search, 
  Plus, 
  ChevronRight, 
  Filter, 
  Package,
  AlertCircle,
  LayoutDashboard
} from "lucide-react"

const Popular = () => {
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([])
  const [searchFocused, setSearchFocused] = useState(false)

  const itemsPerPage = 15; 
  const location = useLocation()
  const navigate = useNavigate()

  const queryParams = new URLSearchParams(location.search)
  const category = queryParams.get("category")
  const q = queryParams.get("q") || ""

  const categories = [
    { id: 1, name: "Vợt cầu lông" },
    { id: 2, name: "Giày cầu lông" },
    { id: 3, name: "Áo cầu lông" },
    { id: 4, name: "Cầu lông" },
    { id: 5, name: "Phụ kiện" },
    { id: 6, name: "Túi vợt" },
    { id: 7, name: "Quấn cán" },
    { id: 8, name: "Dây cước" },
  ]

  const fetchProducts = async () => {
    try {
      setLoading(true)
      let url = `http://localhost:4000/products?page=${currentPage}&limit=${itemsPerPage}`
      if (category) url += `&category=${category}`
      if (q) url += `&q=${encodeURIComponent(q)}`
      const res = await fetch(url)
      const data = await res.json()
      setProducts(data.data || [])
      setTotalPages(Math.ceil(data.total / itemsPerPage))
    } catch (err) {
      console.log("Fetch lỗi:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    try {
      const url = `http://localhost:4000/products?page=1&limit=5&q=${encodeURIComponent(query)}${category ? `&category=${category}` : ''}`
      const res = await fetch(url)
      const data = await res.json()
      setSuggestions(data.data || [])
    } catch (err) {
      console.log("Suggestion lỗi:", err)
      setSuggestions([])
    }
  }

  const removeProduct = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) return
    try {
      const res = await fetch(`http://localhost:4000/products/delete/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id))
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleSearch = () => {
    const trimmed = search.trim()
    if (trimmed !== "") {
      setSearchFocused(false)
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate(`/listproduct`);
    }
  };

  const handleSuggestionClick = (term) => {
    setSearch(term)
    setSuggestions([])
    setSearchFocused(false)
    navigate(`/search?q=${encodeURIComponent(term)}`)
  }

  useEffect(() => {
    setSearch(q)
  }, [q])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(search)
    }, 250)

    return () => clearTimeout(timer)
  }, [search, category])

  useEffect(() => {
    fetchProducts()
  }, [currentPage, category, q, location.pathname])

  return (
    <div className='admin-list-page'>
      {/* 1. BREADCRUMBS & HEADER */}
      <div className="admin-list-top">
        <div className="admin-breadcrumb">
          <span>Quản trị</span> <ChevronRight size={14} />
          <span className="active">Danh sách sản phẩm</span>
        </div>
        
        <div className="admin-header-main">
          <div className="header-text">
            <h1>Kho Sản Phẩm</h1>
            <p>Quản lý và cập nhật thông tin hàng hóa trong kho</p>
          </div>
          <button className="btn-add-product" onClick={() => navigate("/addproduct")}>
            <Plus size={20} /> THÊM SẢN PHẨM
          </button>
        </div>
      </div>

      <div className="admin-main-layout">
        <aside className="admin-list-sidebar">
          <div className="sidebar-filter-card">
            <h3 className="sidebar-filter-title"><Filter size={18} /> BỘ LỌC</h3>
            <ul className="filter-cat-list">
              <li 
                className={!category ? "active" : ""} 
                onClick={() => navigate("/listproduct")}
              >
                <LayoutDashboard size={16} /> Tất cả sản phẩm
              </li>
              {categories.map((cat) => (
                <li 
                  key={cat.id}
                  className={category === String(cat.id) ? "active" : ""}
                  onClick={() => navigate(`/listproduct?category=${cat.id}`)}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
            
            <div className="sidebar-stats">
               <div className="stat-box">
                  <Package size={20} />
                  <span>Hiện có: <strong>{products.length}</strong> sản phẩm</span>
               </div>
            </div>
          </div>
        </aside>

        <div className="admin-list-content">
          <div className="admin-search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm sản phẩm nhanh..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                />
                {searchFocused && suggestions.length > 0 && (
                  <ul className="search-suggestion-list">
                    {suggestions.map((item) => (
                      <li
                        key={item.id}
                        className="search-suggestion-item"
                        onMouseDown={() => handleSuggestionClick(item.name)}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button onClick={handleSearch}>TÌM</button>
            </div>
          </div>

          {loading ? (
            <div className="admin-loading-state">Đang tải dữ liệu...</div>
          ) : (
            <>
              <div className="admin-product-grid-main">
                {products.length > 0 ? (
                  products.map((item) => (
                    <div className="admin-grid-item" key={item.id}>
                      <Item
                        id={item.id}
                        name={item.name}
                        image={item.images?.[0]}
                        quantity={item.quantity}
                        new_price={item.new_price}
                        old_price={item.old_price}
                        onDelete={removeProduct}
                      />
                    </div>
                  ))
                ) : (
                  <div className="admin-no-data">
                    <AlertCircle size={48} />
                    <p>Không tìm thấy sản phẩm nào trong mục này.</p>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="admin-pagination-footer">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Trang trước
                  </button>
                  <div className="page-list">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        className={currentPage === index + 1 ? "active" : ""}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Trang sau
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Popular
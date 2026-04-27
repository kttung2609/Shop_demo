import React, { useEffect, useState } from 'react'
import './Popular.css'
import Item from '../AdminItems/AdminItem.jsx'
import { useLocation, useNavigate } from "react-router-dom"
import { 
  Search, 
  Plus, 
  ChevronRight, 
  LayoutGrid, 
  Filter, 
  Package,
  AlertCircle 
} from "lucide-react"

const Popular = () => {
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const itemsPerPage = 15;
  const location = useLocation()
  const navigate = useNavigate()

  const queryParams = new URLSearchParams(location.search)
  const category = queryParams.get("category")

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
    if (search.trim() !== "") {
      navigate(`/search?q=${search}`);
      setSearch("");
      setSuggestions([]);
    }
  };

  useEffect(() => {
    fetchProducts()
  }, [currentPage, category, location.key])

  return (
    <div className='admin-list-page'>
      {/* 1. BREADCRUMBS */}
      <div className="admin-breadcrumb">
        <span>Quản trị</span> <ChevronRight size={14} />
        <span className="active">Danh sách sản phẩm</span>
      </div>

      <div className="admin-container">
        {/* 2. SIDEBAR FILTER (Giống trang User) */}
        <aside className="admin-sidebar">
          <div className="sidebar-box">
            <h3 className="sidebar-title"><Filter size={18} /> PHÂN LOẠI</h3>
            <ul className="admin-cat-list">
              <li 
                className={!category ? "active" : ""} 
                onClick={() => navigate("/listproduct")}
              >
                Tất cả sản phẩm
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
          </div>

          <div className="admin-stats-box">
             <div className="stat-item">
                <Package size={20} />
                <div>
                   <p>Tổng sản phẩm</p>
                   <strong>{products.length}+</strong>
                </div>
             </div>
          </div>
        </aside>

        {/* 3. MAIN CONTENT */}
        <main className="admin-main-content">
          <div className="admin-header-actions">
            <div className="header-title-box">
              <h1>Quản Lý Kho Hàng</h1>
              <p>Hiển thị {products.length} sản phẩm trong danh mục</p>
            </div>
            <button className="btn-add-product" onClick={() => navigate("/addproduct")}>
              <Plus size={20} /> THÊM SẢN PHẨM MỚI
            </button>
          </div>

          {/* SEARCH BAR CHUYÊN NGHIỆP */}
          <div className="admin-search-bar">
            <div className="search-wrapper">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Tìm mã sản phẩm hoặc tên sản phẩm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button onClick={handleSearch}>Tìm kiếm</button>
            </div>
          </div>

          {/* GRID DANH SÁCH */}
          {loading ? (
            <div className="admin-loading">Đang tải dữ liệu...</div>
          ) : (
            <div className="admin-product-grid">
              {products.length > 0 ? (
                products.map((item) => (
                  <div className="admin-card-wrapper" key={item.id}>
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
                <div className="no-data">
                   <AlertCircle size={40} />
                   <p>Không có sản phẩm nào trong mục này.</p>
                </div>
              )}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="admin-pagination">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Trải
              </button>
              <div className="page-numbers">
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
                Phải
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Popular
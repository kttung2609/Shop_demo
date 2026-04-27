import React, { useEffect, useState } from "react";
import "./Popular.css";
import Item from "../Items/Item";
import { useLocation } from "react-router-dom";
import { ChevronRight, Filter, ChevronDown, LayoutGrid, Check } from "lucide-react";

const Popular = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [brand, setBrand] = useState("all");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 12;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  const brands = [
    { id: "all", name: "Tất cả thương hiệu" },
    { id: 1, name: "Yonex" },
    { id: 2, name: "Lining" },
    { id: 3, name: "Victor" },
    { id: 4, name: "Mizuno" },
    { id: 5, name: "Kawasaki" }
  ];

  const fetchProducts = () => {
    setLoading(true);
    let url = `http://localhost:4000/products?page=${currentPage}&limit=${itemsPerPage}`;
    if (category) url += `&category=${category}`;
    if (brand !== "all") url += `&brand=${brand}`;
    if (sort) url += `&sort=${sort}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data.data || []);
        setTotalPages(Math.ceil(data.total / itemsPerPage));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { setCurrentPage(1); }, [category, brand, sort]);
  useEffect(() => { fetchProducts(); }, [currentPage, category, brand, sort]);

  return (
    <div className="shop-page">
      {/* BREADCRUMB */}
      <div className="breadcrumb-area">
        <div className="container-custom">
          <span>Trang chủ</span> <ChevronRight size={14} />
          <span className="active">{category === "2" ? "Giày Cầu Lông" : "Sản phẩm"}</span>
        </div>
      </div>

      <div className="container-custom shop-layout">
        {/* SIDEBAR - GIỐNG HVSHOP */}
        <aside className="shop-sidebar">
          <div className="sidebar-widget">
            <h3 className="widget-title">DANH MỤC SẢN PHẨM</h3>
            <ul className="category-list">
              <li className={category === "1" ? "active" : ""}>Vợt Cầu Lông</li>
              <li className={category === "2" ? "active" : ""}>Giày Cầu Lông</li>
              <li className={category === "3" ? "active" : ""}>Áo Cầu Lông</li>
              <li>Phụ Kiện Cầu Lông</li>
            </ul>
          </div>

          <div className="sidebar-widget">
            <h3 className="widget-title">THƯƠNG HIỆU</h3>
            <div className="brand-filter-list">
              {brands.map((b) => (
                <label key={b.id} className="filter-checkbox">
                  <input 
                    type="radio" 
                    name="brand" 
                    checked={brand === b.id} 
                    onChange={() => setBrand(b.id)} 
                  />
                  <span className="checkmark"></span>
                  {b.name}
                </label>
              ))}
            </div>
          </div>

          <div className="sidebar-banner">
            <img src="https://hvshop.vn/wp-content/uploads/2023/04/banner-sidebar.jpg" alt="Ads" />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="shop-main">
          <div className="shop-intro">
            <h1>{category === "2" ? "Giày Cầu Lông Chính Hãng" : "Sản Phẩm Cầu Lông"}</h1>
            <p>Tổng hợp các mẫu giày cầu lông mới nhất từ các thương hiệu hàng đầu, hỗ trợ di chuyển linh hoạt và bảo vệ đôi chân của bạn.</p>
          </div>

          <div className="shop-filter-bar">
            <div className="filter-left">
              <LayoutGrid size={20} />
              <span>Hiển thị {products.length} sản phẩm</span>
            </div>
            <div className="filter-right">
              <span>Sắp xếp theo:</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="shop-loading">Đang tải...</div>
          ) : (
            <div className="product-grid-main">
              {products.map((item) => (
                <Item key={item.id} {...item} image={item.images?.[0]} />
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pagination-custom">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>«</button>
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i} 
                  className={currentPage === i + 1 ? "active" : ""} 
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>»</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Popular;
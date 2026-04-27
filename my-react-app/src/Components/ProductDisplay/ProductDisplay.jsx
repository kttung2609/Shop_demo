import React, { useContext, useState, useEffect } from "react";
import "./ProductDisplay.css";
import { ShopContext } from "../../Context/ShopContext";
import { 
  ChevronRight, 
  Star, 
  CheckCircle, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  PhoneCall,
  Gift
} from "lucide-react";

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const [mainImage, setMainImage] = useState("");
  const [tab, setTab] = useState("desc");

  useEffect(() => {
    if (product?.images?.length > 0) {
      setMainImage(product.images[0]);
    }
  }, [product]);

  if (!product) return <div className="loading-spinner">Đang tải...</div>;

  const discount = product.old_price
    ? Math.round(((product.old_price - product.new_price) / product.old_price) * 100)
    : 0;

  return (
    <div className="product-display-container">
      {/* 1. BREADCRUMBS */}
      <div className="product-breadcrumb">
        <span>Trang chủ</span> <ChevronRight size={14} />
        <span>Sản phẩm</span> <ChevronRight size={14} />
        <span className="active">{product.name}</span>
      </div>

      <div className="product-display-content">
        {/* 2. LEFT: GALLERY */}
        <div className="product-display-left">
          <div className="thumbs-vertical">
            {product.images?.map((img, i) => (
              <div 
                key={i} 
                className={`thumb-item ${mainImage === img ? "active" : ""}`}
                onClick={() => setMainImage(img)}
              >
                <img src={`http://localhost:4000/uploads/${img}`} alt="thumbnail" />
              </div>
            ))}
          </div>
          <div className="main-image-wrapper">
            <img src={`http://localhost:4000/uploads/${mainImage}`} alt={product.name} />
            {discount > 0 && <span className="discount-tag">-{discount}%</span>}
          </div>
        </div>

        {/* 3. RIGHT: INFO & ACTIONS */}
        <div className="product-display-right">
          <h1 className="product-name">{product.name}</h1>
          
          <div className="product-rating">
            <div className="stars">
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
            </div>
            <span className="rating-count">(12 đánh giá)</span>
            <span className="status-instock">
               <CheckCircle size={14} /> {product.quantity > 0 ? "Còn hàng" : "Hết hàng"}
            </span>
          </div>

          <div className="product-price-box">
            <span className="current-price">{Number(product.new_price).toLocaleString("vi-VN")}₫</span>
            {product.old_price > 0 && (
              <span className="original-price">{Number(product.old_price).toLocaleString("vi-VN")}₫</span>
            )}
          </div>

          <div className="product-short-desc">
            <p><strong>Thương hiệu:</strong> {product.brand || "Chính hãng"}</p>
            <p><strong>Mã sản phẩm:</strong> SP-{product.id}</p>
          </div>

          {/* PROMOTION BOX (Giống HVShop) */}
          <div className="promotion-box">
            <div className="promotion-title">
              <Gift size={18} /> QUÀ TẶNG KÈM & ƯU ĐÃI
            </div>
            <ul className="promotion-list">
              <li>✅ Tặng 01 cuốn cán vợt cầu lông cao cấp.</li>
              <li>✅ Miễn phí cước đan (Nếu mua combo vợt + dây).</li>
              <li>✅ Giảm 10% khi mua thêm phụ kiện kèm theo.</li>
              <li>✅ Bảo hành chính hãng 1 đổi 1 nếu có lỗi từ NSX.</li>
            </ul>
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
                <button>-</button>
                <input type="text" value="1" readOnly />
                <button>+</button>
            </div>
            <button 
              className="btn-add-cart"
              onClick={() => addToCart(product.id)}
              disabled={product.quantity <= 0}
            >
              THÊM VÀO GIỎ HÀNG
            </button>
          </div>
          
          <button className="btn-buy-now">MUA NGAY - GIAO TẬN NƠI</button>

          <div className="hotline-support">
            <PhoneCall size={18} /> Tư vấn: <strong>0123.456.789</strong> (8:00 - 22:00)
          </div>
        </div>

        {/* 4. SIDEBAR TRUST BADGES */}
        <div className="product-display-trust">
          <div className="trust-item">
            <Truck />
            <div>
              <p>GIAO HÀNG SIÊU TỐC</p>
              <span>Nội thành nhận hàng trong 2h</span>
            </div>
          </div>
          <div className="trust-item">
            <ShieldCheck />
            <div>
              <p>CAM KẾT CHÍNH HÃNG</p>
              <span>Đền gấp 10 lần nếu phát hiện hàng giả</span>
            </div>
          </div>
          <div className="trust-item">
            <RefreshCw />
            <div>
              <p>ĐỔI TRẢ DỄ DÀNG</p>
              <span>Đổi size, đổi mẫu trong 7 ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. DESCRIPTION TABS */}
      <div className="product-description-tabs">
        <div className="tabs-header">
          <button className={tab === "desc" ? "active" : ""} onClick={() => setTab("desc")}>CHI TIẾT SẢN PHẨM</button>
          <button className={tab === "spec" ? "active" : ""} onClick={() => setTab("spec")}>THÔNG SỐ KỸ THUẬT</button>
        </div>
        <div className="tabs-body">
          {tab === "desc" ? (
            <div className="desc-content">
              {product.description || "Nội dung đang được cập nhật..."}
            </div>
          ) : (
            <table className="specs-table">
              <tbody>
                <tr><td>Trọng lượng</td><td>4U (83g)</td></tr>
                <tr><td>Chu vi cán</td><td>G5</td></tr>
                <tr><td>Sức căng</td><td>11-12.5kg</td></tr>
                <tr><td>Sản xuất</td><td>Nhật Bản/Trung Quốc</td></tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
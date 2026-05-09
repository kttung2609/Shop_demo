import React, { useContext, useState, useEffect } from "react";
import "./ProductDisplay.css";
import { ShopContext } from "../../Context/ShopContext";
import { 
  ChevronRight, Star, CheckCircle, Truck, 
  ShieldCheck, RefreshCw, PhoneCall, Gift, ShoppingCart 
} from "lucide-react";

const ProductDisplay = ({ product }) => {
  // Lấy hàm addToCart từ Context
  const { addToCart } = useContext(ShopContext);
  
  const [mainImage, setMainImage] = useState("");
  const [tab, setTab] = useState("desc");

  useEffect(() => {
    if (product?.images?.length > 0) {
      setMainImage(product.images[0]);
    } else if (typeof product?.images === 'string') {
        const imgs = JSON.parse(product.images);
        setMainImage(imgs[0]);
    }
  }, [product]);

  if (!product) return <div className="loading-spinner">Đang tải...</div>;

  const discount = product.old_price
    ? Math.round(((product.old_price - product.new_price) / product.old_price) * 100)
    : 0;

  return (
    <div className="product-display-container">
      <div className="product-breadcrumb">
        <span>Trang chủ</span> <ChevronRight size={14} />
        <span>Sản phẩm</span> <ChevronRight size={14} />
        <span className="active">{product.name}</span>
      </div>

      <div className="product-display-content">
        {/* GALLERY */}
        <div className="product-display-left">
          <div className="thumbs-vertical">
            {(typeof product.images === 'string' ? JSON.parse(product.images) : product.images)?.map((img, i) => (
              <div 
                key={i} 
                className={`thumb-item ${mainImage === img ? "active" : ""}`}
                onClick={() => setMainImage(img)}
              >
                <img src={`http://localhost:4000/uploads/${img}`} alt="thumb" />
              </div>
            ))}
          </div>
          <div className="main-image-wrapper">
            <img src={`http://localhost:4000/uploads/${mainImage}`} alt={product.name} />
            {discount > 0 && <span className="discount-tag">-{discount}%</span>}
          </div>
        </div>

        {/* INFO */}
        <div className="product-display-right">
          <h1 className="product-name">{product.name}</h1>
          
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#ffc107" color="#ffc107" />)}
            </div>
            <span className="status-instock">
               <CheckCircle size={14} /> {product.quantity > 0 ? `Còn hàng (${product.quantity})` : "Hết hàng"}
            </span>
          </div>

          <div className="product-price-box">
            <span className="current-price">{Number(product.new_price).toLocaleString()}₫</span>
            {product.old_price > 0 && (
              <span className="original-price">{Number(product.old_price).toLocaleString()}₫</span>
            )}
          </div>

          <div className="promotion-box">
            <div className="promotion-title"><Gift size={18} /> ƯU ĐÃI KÈM THEO</div>
            <ul className="promotion-list">
              <li>✅ Tặng 01 cuốn cán vợt cao cấp.</li>
              <li>✅ Bảo hành chính hãng 1 đổi 1 lỗi NSX.</li>
            </ul>
          </div>

          <div className="product-actions">
            <button 
              className="btn-add-cart"
              onClick={() => addToCart(product.id)}
              disabled={product.quantity <= 0}
            >
              <ShoppingCart size={20} /> THÊM VÀO GIỎ HÀNG
            </button>
          </div>
          
          <button className="btn-buy-now">MUA NGAY - GIAO TẬN NƠI</button>

          <div className="hotline-support">
            <PhoneCall size={18} /> Tư vấn: 0974.594.175 (8:00 - 22:00)
          </div>
        </div>

        {/* TRUST SIDEBAR */}
        <div className="product-display-trust">
          <div className="trust-item"><Truck /><p>GIAO HÀNG TOÀN QUỐC</p></div>
          <div className="trust-item"><ShieldCheck /><p>100% CHÍNH HÃNG</p></div>
          <div className="trust-item"><RefreshCw /><p>7 NGÀY ĐỔI TRẢ</p></div>
        </div>
      </div>

      <div className="product-description-tabs">
        <div className="tabs-header">
          <button className={tab === "desc" ? "active" : ""} onClick={() => setTab("desc")}>MÔ TẢ SẢN PHẨM</button>
          <button className={tab === "spec" ? "active" : ""} onClick={() => setTab("spec")}>THÔNG SỐ KỸ THUẬT</button>
        </div>
        <div className="tabs-body">
          {tab === "desc" ? (
            <div className="desc-content">{product.description || "Đang cập nhật nội dung..."}</div>
          ) : (
            <table className="specs-table">
              <tbody>
                <tr><td>Thương hiệu</td><td>Yonex / Lining / Victor</td></tr>
                <tr><td>Trọng lượng</td><td>4U (80-84g)</td></tr>
                <tr><td>Sức căng</td><td>11 - 12.5 kg</td></tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
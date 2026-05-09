import React, { useContext, useState, useEffect } from "react";
import "./ProductDisplayAdmin.css";
import { 
  ChevronRight, 
  Star, 
  CheckCircle, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  PhoneCall,
  Gift,
  ShoppingCart,
  Edit,
  Loader2 // Thêm icon loading
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductDisplayAdmin = (props) => {
  const { product } = props;
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  
  const [mainImage, setMainImage] = useState("");
  const [tab, setTab] = useState("desc");
  const [isAdding, setIsAdding] = useState(false); // State xử lý loading nút
  const [showToast, setShowToast] = useState(false); // State hiện thông báo thành công

  useEffect(() => {
    if (product) {
      let imagesArray = [];
      try {
        imagesArray = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
      } catch (e) {
        imagesArray = product.images || [];
      }
      if (imagesArray && imagesArray.length > 0) {
        setMainImage(imagesArray[0]);
      }
    }
  }, [product]);

  const addToCart = async (productID) => {
    const userID = storedUser?.id || storedUser?.userID;
    if (!userID) {
        alert("Vui lòng đăng nhập!");
        return;
    }

    setIsAdding(true); 
    try {
      const res = await fetch("http://localhost:4000/api/cart/add", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID, productID, quantity: 1 }),
      });
      const data = await res.json();

      if (res.ok) {
        // Hiện thông báo thành công
        setShowToast(true);
        // Tự động ẩn sau 3 giây
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.error("Lỗi:", err);
    } finally {
      setIsAdding(false); // Tắt loading
    }
  };

  if (!product) return <div className="loading-spinner">Đang tải...</div>;

  const discount = product.old_price
    ? Math.round(((product.old_price - product.new_price) / product.old_price) * 100)
    : 0;

  return (
    <div className="product-admin-container">
      {/* ----- THÔNG BÁO THÀNH CÔNG (TOAST) ----- */}
      <div className={`success-toast ${showToast ? "show" : ""}`}>
        <CheckCircle size={20} />
        <span>Thêm vào giỏ hàng thành công!</span>
      </div>

      <div className="admin-breadcrumb">
        <span>Admin</span> <ChevronRight size={14} />
        <span>Danh sách</span> <ChevronRight size={14} />
        <span className="active">{product.name}</span>
      </div>

      <div className="product-admin-content">
        <div className="product-admin-left">
          <div className="admin-thumbs-vertical">
            {(typeof product.images === 'string' ? JSON.parse(product.images) : product.images)?.map((img, i) => (
              <div 
                key={i} 
                className={`admin-thumb-item ${mainImage === img ? "active" : ""}`}
                onClick={() => setMainImage(img)}
              >
                <img 
                  src={`http://localhost:4000/uploads/${img}`} 
                  alt="thumbnail" 
                  onError={(e) => e.target.src = "http://localhost:4000/uploads/vot1.jpg"}
                />
              </div>
            ))}
          </div>
          <div className="admin-main-image-wrapper">
            <img 
              src={`http://localhost:4000/uploads/${mainImage}`} 
              alt={product.name} 
              onError={(e) => e.target.src = "http://localhost:4000/uploads/vot1.jpg"}
            />
            {discount > 0 && <span className="admin-discount-tag">-{discount}%</span>}
          </div>
        </div>

        <div className="product-admin-right">
          <div className="admin-header-flex">
            <h1 className="admin-product-name">{product.name}</h1>
            <button className="admin-edit-link" onClick={() => navigate(`/update/${product.id}`)}>
              <Edit size={16} /> Sửa sản phẩm
            </button>
          </div>
          
          <div className="admin-product-rating">
            <div className="admin-stars">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <span className="admin-status-stock">
               <CheckCircle size={14} /> Kho: {product.quantity} sản phẩm
            </span>
          </div>

          <div className="admin-price-box">
            <span className="admin-current-price">{Number(product.new_price).toLocaleString("vi-VN")}₫</span>
            {product.old_price > 0 && (
              <span className="admin-original-price">{Number(product.old_price).toLocaleString("vi-VN")}₫</span>
            )}
          </div>

          <div className="admin-promo-box">
            <div className="admin-promo-title">
              <Gift size={18} /> QUÀ TẶNG KÈM & ƯU ĐÃI
            </div>
            <ul className="admin-promo-list">
              <li>✅ Tặng 01 cuốn cán vợt cầu lông cao cấp.</li>
              <li>✅ Bảo hành chính hãng nếu có lỗi từ NSX.</li>
            </ul>
          </div>

          <div className="admin-actions">
            <button 
              className={`admin-btn-cart ${isAdding ? "btn-loading" : ""}`}
              onClick={() => addToCart(product.id)}
              disabled={product.quantity <= 0 || isAdding}
            >
              {isAdding ? (
                <Loader2 className="spinner" size={20} />
              ) : (
                <>
                THÊM VÀO GIỎ
                  {/* <button onClick={() => addToCart(product.id)}></button> */}
                </>
              )}
            </button>
          </div>
          
          <div className="admin-hotline">
            <PhoneCall size={18} /> Hotline hỗ trợ: <strong>0123.456.789</strong>
          </div>
        </div>

        <div className="product-admin-trust">
          <div className="admin-trust-item">
            <Truck /><p>GIAO HÀNG NHANH</p>
          </div>
          <div className="admin-trust-item">
            <ShieldCheck /><p>CHÍNH HÃNG 100%</p>
          </div>
          <div className="admin-trust-item">
            <RefreshCw /><p>ĐỔI TRẢ 7 NGÀY</p>
          </div>
        </div>
      </div>

      <div className="product-admin-tabs">
        <div className="admin-tabs-header">
          <button className={tab === "desc" ? "active" : ""} onClick={() => setTab("desc")}>MÔ TẢ</button>
          <button className={tab === "spec" ? "active" : ""} onClick={() => setTab("spec")}>THÔNG SỐ</button>
        </div>
        <div className="admin-tabs-body">
          {tab === "desc" ? (
            <div className="admin-desc-text">
              {product.description || "Nội dung mô tả sản phẩm dành cho quản trị viên xem trước."}
            </div>
          ) : (
            <table className="admin-specs-table">
              <tbody>
                <tr><td>Thương hiệu</td><td>{product.brand || "Yonex"}</td></tr>
                <tr><td>Trọng lượng</td><td>4U (83g)</td></tr>
                <tr><td>Sức căng</td><td>11-12.5kg</td></tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDisplayAdmin;
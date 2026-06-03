import React, { useContext, useState, useEffect } from "react";
import "./ProductDisplay.css";
import { ShopContext } from "../../Context/ShopContext";
import { 
  ChevronRight, Star, CheckCircle, Truck, ShieldCheck, 
  RefreshCw, PhoneCall, Gift, ShoppingCart, Loader2, MessageSquare 
} from "lucide-react";

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const [mainImage, setMainImage] = useState("");
  const [tab, setTab] = useState("desc");
  const [isAddingCart, setIsAddingCart] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (product) {
      let imagesArray = [];
      try {
        imagesArray = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
      } catch (e) { imagesArray = product.images || []; }
      if (imagesArray?.length > 0) setMainImage(imagesArray[0]);
      fetchReviews();
    }
  }, [product]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/reviews/product/${product.id}`);
      const data = await res.json();
      setReviews(data);
    } catch (err) { console.log(err); }
  };

  if (!product) return <div className="loading-spinner">Đang tải...</div>;

  const discount = product.old_price ? Math.round(((product.old_price - product.new_price) / product.old_price) * 100) : 0;
  const productImages = typeof product.images === 'string' ? JSON.parse(product.images || "[]") : product.images || [];

  return (
    <div className="product-display-container">
      <div className="product-breadcrumb">
        <span>Trang chủ</span> <ChevronRight size={14} />
        <span>Sản phẩm</span> <ChevronRight size={14} />
        <span className="active">{product.name}</span>
      </div>

      <div className="product-display-content">
        <div className="product-display-left">
          <div className="thumbs-vertical">
            {productImages.map((img, i) => (
              <div key={i} className={`thumb-item ${mainImage === img ? "active" : ""}`} onClick={() => setMainImage(img)}>
                <img src={`http://localhost:4000/uploads/${img}`} alt="" />
              </div>
            ))}
          </div>
          <div className="main-image-wrapper">
            <img src={`http://localhost:4000/uploads/${mainImage}`} alt={product.name} />
            {discount > 0 && <span className="discount-tag">-{discount}%</span>}
          </div>
        </div>

        <div className="product-display-right">
          <h1 className="product-name">{product.name}</h1>
          <div className="product-rating-summary">
            <div className="stars">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < 5 ? "#ffc107" : "none"} color="#ffc107" />)}
            </div>
            <span className="review-count">({reviews.length} đánh giá)</span>
            <span className="status-instock"><CheckCircle size={14} /> {product.quantity > 0 ? "Còn hàng" : "Hết hàng"}</span>
          </div>

          <div className="product-price-box">
            <span className="current-price">{Number(product.new_price).toLocaleString()}₫</span>
            {product.old_price > 0 && <span className="original-price">{Number(product.old_price).toLocaleString()}₫</span>}
          </div>

          <div className="promotion-box">
            <div className="promotion-title"><Gift size={18} /> ƯU ĐÃI KÈM THEO</div>
            <ul className="promotion-list">
              <li>✅ Tặng 01 cuốn cán vợt cao cấp.</li>
              <li>✅ Bảo hành chính hãng 1 đổi 1 lỗi NSX.</li>
            </ul>
          </div>

          <div className="product-actions">
            <button className="btn-add-cart" onClick={async () => { setIsAddingCart(true); await addToCart(product.id); setIsAddingCart(false); }} disabled={product.quantity <= 0 || isAddingCart}>
              {isAddingCart ? <Loader2 size={20} className="animate-spin" /> : <><ShoppingCart size={20} /> THÊM VÀO GIỎ</>}
            </button>
          </div>
          <button className="btn-buy-now">MUA NGAY - GIAO TẬN NƠI</button>
          <div className="hotline-support"><PhoneCall size={18} /> Tư vấn: 0974.594.175</div>
        </div>

        <div className="product-display-trust">
          <div className="trust-item"><Truck /><p>GIAO HÀNG TOÀN QUỐC</p></div>
          <div className="trust-item"><ShieldCheck /><p>100% CHÍNH HÃNG</p></div>
          <div className="trust-item"><RefreshCw /><p>7 NGÀY ĐỔI TRẢ</p></div>
        </div>
      </div>

      <div className="product-description-tabs">
        <div className="tabs-header">
          <button className={tab === "desc" ? "active" : ""} onClick={() => setTab("desc")}>MÔ TẢ</button>
          <button className={tab === "spec" ? "active" : ""} onClick={() => setTab("spec")}>THÔNG SỐ</button>
          <button className={tab === "reviews" ? "active" : ""} onClick={() => setTab("reviews")}>ĐÁNH GIÁ ({reviews.length})</button>
        </div>
        
        <div className="tabs-body">
          {tab === "desc" && <div className="desc-content">{product.description || "Đang cập nhật..."}</div>}
          
          {tab === "spec" && (
            <table className="specs-table">
              <tbody>
                <tr><td>Trọng lượng</td><td>{product.weight || "N/A"}</td></tr>
                <tr><td>Mức căng</td><td>{product.max_tension || "N/A"}</td></tr>
                <tr><td>Điểm cân bằng</td><td>{product.balance_point || "N/A"}</td></tr>
              </tbody>
            </table>
          )}

          {tab === "reviews" && (
            <div className="reviews-tab-content">
              <div className="reviews-list">
                {reviews.length === 0 ? (
                  <div className="no-reviews"><MessageSquare size={40} /><p>Chưa có đánh giá nào cho sản phẩm này.</p></div>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="review-item">
                      <div className="review-user-info">
                        <img src={rev.userAvatar ? `http://localhost:4000/uploads/avatars/${rev.userAvatar}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="" />
                        <div className="user-meta">
                          <strong>{rev.userName}</strong>
                          <div className="item-stars">
                            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < rev.rating ? "#ff4d4f" : "none"} color={i < rev.rating ? "#ff4d4f" : "#ccc"} />)}
                          </div>
                          <span className="rev-date">{new Date(rev.created_at).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                      <p className="rev-text">{rev.comment}</p>
                      {rev.reply && (
                        <div className="shop-reply">
                          <strong>Phản hồi từ Shop:</strong>
                          <p>{rev.reply}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
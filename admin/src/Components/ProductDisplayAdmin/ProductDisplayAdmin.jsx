import React, { useState, useEffect } from "react";
import "./ProductDisplayAdmin.css";
import { 
  ChevronRight, Star, CheckCircle, Truck, ShieldCheck, RefreshCw, 
  PhoneCall, Gift, ShoppingCart, Edit, Loader2, MessageSquare, CornerDownRight, Send 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductDisplayAdmin = (props) => {
  const { product } = props;
  const navigate = useNavigate();
  
  const [mainImage, setMainImage] = useState("");
  const [tab, setTab] = useState("desc");
  const [showToast, setShowToast] = useState(false);
  const [adding, setAdding] = useState(false);


  const [reviews, setReviews] = useState([]);
  const [replyTexts, setReplyTexts] = useState({});

  useEffect(() => {
    if (product) {
      let imagesArray = [];
      try {
        imagesArray = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
      } catch (e) { imagesArray = product.images || []; }
      if (imagesArray && imagesArray.length > 0) setMainImage(imagesArray[0]);
      
      fetchReviews();
    }
  }, [product]);

  const fetchReviews = async () => {
    if (!product?.id) return;
    const res = await fetch(`http://localhost:4000/api/reviews/product/${product.id}`);
    const data = await res.json();
    setReviews(data);
  };

  const handleReply = async (reviewId) => {
    const text = replyTexts[reviewId];
    if (!text?.trim()) return toast.warn("Vui lòng nhập nội dung phản hồi");

    try {
      const res = await fetch(`http://localhost:4000/api/reviews/reply/${reviewId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reply: text })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Đã gửi phản hồi");
        setReplyTexts({ ...replyTexts, [reviewId]: "" }); 
        fetchReviews(); 
      }
    } catch (err) { console.error(err); }
  };

  const outOfStock = Number(product?.quantity ?? 0) <= 0;

  const addToCart = async () => {
    if (!product?.id || outOfStock) return;
    setAdding(true);
    try {
      const res = await fetch("http://localhost:4000/api/cart/admin/add", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productID: product.id, quantity: 1 }),
      });
      const data = await res.json();
      if (data.success) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    } catch (err) { console.error(err); } 
    finally { setAdding(false); }
  };

  if (!product) return <div className="loading-spinner">Đang tải...</div>;

  return (
    <div className="product-admin-container">
      <div className={`success-toast ${showToast ? "show" : ""}`}>
        <CheckCircle size={20} /> <span>Thêm vào giỏ hàng thành công!</span>
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
              <div key={i} className={`admin-thumb-item ${mainImage === img ? "active" : ""}`} onClick={() => setMainImage(img)}>
                <img src={`http://localhost:4000/uploads/${img}`} alt="" onError={(e) => e.target.src = "http://localhost:4000/uploads/vot1.jpg"}/>
              </div>
            ))}
          </div>
          <div className="admin-main-image-wrapper">
            <img src={`http://localhost:4000/uploads/${mainImage}`} alt={product.name} />
          </div>
        </div>

        <div className="product-admin-right">
          <div className="admin-header-flex">
            <h1 className="admin-product-name">{product.name}</h1>
            <button className="admin-edit-link" onClick={() => navigate(`/update/${product.id}`)}><Edit size={16} /> Sửa sản phẩm</button>
          </div>
          
          <div className="admin-product-rating">
            <div className="admin-stars">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < 5 ? "#ffc107" : "none"} color="#ffc107" />)}
            </div>
            <span className="admin-status-stock"><CheckCircle size={14} /> Kho: {product.quantity ?? 0}</span>
          </div>

          <div className="admin-price-box">
            <span className="admin-current-price">{Number(product.new_price).toLocaleString()}₫</span>
          </div>

          <div className="admin-actions">
            <button className="admin-btn-cart" onClick={addToCart} disabled={adding || outOfStock} title={outOfStock ? "Sản phẩm đã hết hàng" : "Thêm sản phẩm này vào giỏ hàng của admin"}>
              {outOfStock ? "Hết hàng" : adding ? <Loader2 className="animate-spin" /> : <><ShoppingCart size={20} /> Thêm vào giỏ admin</>}
            </button>
          </div>
        </div>
      </div>

      <div className="product-admin-tabs">
        <div className="admin-tabs-header">
          <button className={tab === "desc" ? "active" : ""} onClick={() => setTab("desc")}>MÔ TẢ</button>
          <button className={tab === "spec" ? "active" : ""} onClick={() => setTab("spec")}>THÔNG SỐ</button>
          <button className={tab === "review" ? "active" : ""} onClick={() => setTab("review")}>
            ĐÁNH GIÁ ({reviews.length})
          </button>
        </div>

        <div className="admin-tabs-body">
          {tab === "desc" && <div className="admin-desc-text">{product.description}</div>}
          
          {tab === "spec" && (
            <table className="admin-specs-table">
              <tbody>
                <tr><td>Trọng lượng</td><td>{product.weight || "N/A"}</td></tr>
                <tr><td>Mức căng</td><td>{product.max_tension || "N/A"}</td></tr>
                <tr><td>Điểm cân bằng</td><td>{product.balance_point || "N/A"}</td></tr>
              </tbody>
            </table>
          )}

          {tab === "review" && (
            <div className="admin-reviews-list">
              {reviews.length === 0 ? <p className="no-review">Chưa có đánh giá nào cho sản phẩm này.</p> : 
                reviews.map((rev) => (
                  <div key={rev.id} className="admin-review-item">
                    <div className="rev-user-info">
                      <img src={rev.userAvatar ? `http://localhost:4000/uploads/avatars/${rev.userAvatar}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="" />
                      <div>
                        <strong>{rev.userName}</strong>
                        <div className="rev-stars">
                          {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < rev.rating ? "#ffc107" : "none"} color="#ffc107" />)}
                        </div>
                      </div>
                      <span className="rev-date">{new Date(rev.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="rev-comment">{rev.comment}</p>

                    {rev.reply && (
                      <div className="admin-reply-box">
                        <CornerDownRight size={16} />
                        <div className="reply-content">
                          <strong>Phản hồi của Shop:</strong>
                          <p>{rev.reply}</p>
                        </div>
                      </div>
                    )}

                    <div className="admin-reply-input">
                      <input 
                        type="text" 
                        placeholder={rev.reply ? "Cập nhật phản hồi..." : "Nhập lời cảm ơn hoặc phản hồi..."}
                        value={replyTexts[rev.id] || ""}
                        onChange={(e) => setReplyTexts({...replyTexts, [rev.id]: e.target.value})}
                      />
                      <button onClick={() => handleReply(rev.id)}><Send size={16}/></button>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDisplayAdmin;
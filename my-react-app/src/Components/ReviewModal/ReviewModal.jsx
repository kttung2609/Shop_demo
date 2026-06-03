import React, { useState } from 'react';
import { Star, X, Send } from 'lucide-react';
import './ReviewModal.css';

const ReviewModal = ({ order, onClose, onRefresh }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(order.items[0]);

  const submitReview = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/reviews/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productID: selectedItem.product_id,
          orderID: order.id,
          rating,
          comment
        })
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Server không trả về JSON. Có thể là lỗi 404 hoặc 500.");
      }

      const data = await res.json();
      if (data.success) {
        alert("✅ " + data.message);
        onClose();
        onRefresh();
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Lỗi:", err);
      alert("Không thể gửi đánh giá. Vui lòng kiểm tra lại server.");
    }
  };

  return (
    <div className="review-modal-overlay">
      <div className="review-modal-card">
        <div className="modal-header">
          <h3>ĐÁNH GIÁ SẢN PHẨM</h3>
          <X className="close-icon" onClick={onClose} style={{cursor: 'pointer'}}/>
        </div>
        
        <div className="modal-body">
          <p className="select-hint">Chọn sản phẩm cần đánh giá:</p>
          <div className="product-selector">
            {order.items.map((item, idx) => (
              <div 
                key={idx} 
                className={`item-to-review ${selectedItem.product_id === item.product_id ? 'active' : ''}`}
                onClick={() => setSelectedItem(item)}
              >
                <img src={`http://localhost:4000/uploads/${item.image}`} alt="" width="50"/>
              </div>
            ))}
          </div>

          <div className="selected-product-info">
             <strong>Đang đánh giá:</strong> {selectedItem.name}
          </div>

          <div className="star-rating">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((num) => (
                <Star
                  key={num}
                  size={35}
                  fill={num <= rating ? "#ff4d4f" : "none"}
                  color={num <= rating ? "#ff4d4f" : "#ccc"}
                  onClick={() => setRating(num)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
          </div>

          <textarea
            placeholder="Bạn thấy sản phẩm này như thế nào? (Chất lượng, đóng gói, giao hàng...)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="modal-footer">
          <button className="btn-submit-review" onClick={submitReview}>
            <Send size={18} /> GỬI ĐÁNH GIÁ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
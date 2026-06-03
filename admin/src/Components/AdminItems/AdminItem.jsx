import React, { useState } from "react";
import "./AdminItem.css";
import { useNavigate } from "react-router-dom";
import { Edit3, Trash2, Package, ShoppingCart } from "lucide-react"; // Import icon chuyên nghiệp
import { toast } from 'react-toastify';

const AdminItem = (props) => {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const getImageUrl = (img) => {
    if (!img) return "http://localhost:4000/uploads/default.jpg";
    if (img.startsWith("http")) return img;
    return `http://localhost:4000/uploads/${img}`;
  };

  const imageUrl = getImageUrl(props.image);

  const discount = props.old_price
    ? Math.round(((props.old_price - props.new_price) / props.old_price) * 100)
    : 0;

  const outOfStock = Number(props.quantity) <= 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (outOfStock) {
      toast.warn("Sản phẩm đã hết hàng, không thể thêm vào giỏ hàng");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("http://localhost:4000/api/cart/admin/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productID: props.id,
          quantity: 1
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`✓ Đã thêm "${props.name}" vào giỏ hàng của admin`);
      } else {
        toast.error("Lỗi khi thêm vào giỏ hàng");
      }
    } catch (err) {
      toast.error("Lỗi kết nối!");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="admin-item-card" onClick={() => navigate(`/product/${props.id}`)}>
      <div className="admin-item-image">
        {discount > 0 && (
          <span className="admin-discount-tag">-{discount}%</span>
        )}
        <img src={imageUrl} alt={props.name} />
        
        <div className="admin-image-overlay">
          <span>Xem chi tiết</span>
        </div>
      </div>
      <div className="admin-item-content">
        <h3 className="admin-item-title">{props.name}</h3>
        
        <div className="admin-item-status">
          <Package size={14} />
          <span>Kho: <strong>{props.quantity}</strong> sản phẩm</span>
        </div>

        <div className="admin-item-prices">
          <span className="admin-new-price">
            {Number(props.new_price).toLocaleString("vi-VN")}₫
          </span>
          {props.old_price > 0 && (
            <span className="admin-old-price">
              {Number(props.old_price).toLocaleString("vi-VN")}₫
            </span>
          )}
        </div>

        <div className="admin-item-actions">
          <button 
            className="admin-btn-cart"
            onClick={handleAddToCart}
            disabled={adding || outOfStock}
            title={outOfStock ? "Sản phẩm đã hết hàng" : "Thêm sản phẩm này vào giỏ hàng của admin để bán tại cửa hàng"}
          >
            <ShoppingCart size={16} /> {outOfStock ? "Hết hàng" : adding ? "Đang thêm..." : "Giỏ hàng"}
          </button>
          <button 
            className="admin-btn-edit"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/update/${props.id}`);
            }}
          >
            <Edit3 size={16} /> Sửa
          </button>

          <button 
            className="admin-btn-delete"
            onClick={(e) => {
              e.stopPropagation();
              props.onDelete(props.id);
            }}
          >
            <Trash2 size={16} /> Xoá
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminItem;
import React, { useEffect, useState } from "react";
import './CartItems.css';
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ChevronRight, ArrowLeft } from "lucide-react";

const CartItems = () => {
  const [carts, setCarts] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCarts = async () => {
    if (!user?.id) return;
    const res = await fetch(`http://localhost:4000/api/cart/${user.id}`);
    const data = await res.json();
    setCarts(data);
  };

  const increase = async (productID) => {
    await fetch("http://localhost:4000/api/cart/increase", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: user.id, productID }),
    });
    fetchCarts();
  };

  const decrease = async (productID) => {
    await fetch("http://localhost:4000/api/cart/decrease", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: user.id, productID }),
    });
    fetchCarts();
  };

  const removeItem = async (productID) => {
    if(!window.confirm("Bạn muốn xóa sản phẩm này khỏi giỏ hàng?")) return;
    await fetch("http://localhost:4000/api/cart/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: user.id, productID }),
    });
    fetchCarts();
  };

  const getTotal = () => {
    return carts.reduce((sum, item) => sum + item.new_price * item.quantity, 0);
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  return (
    <div className='cart-page-container'>
      <div className="container">
        {/* BREADCRUMB */}
        <div className="cart-breadcrumb">
          <span onClick={() => navigate("/")}>Trang chủ</span> <ChevronRight size={14} />
          <span className="active">Giỏ hàng</span>
        </div>

        <h1 className="page-title">GIỎ HÀNG CỦA BẠN</h1>

        {carts.length === 0 ? (
          <div className="cart-empty-state">
            <ShoppingBag size={80} strokeWidth={1} color="#ccc" />
            <p>Giỏ hàng của bạn hiện đang trống.</p>
            <button className="btn-return" onClick={() => navigate("/")}>TIẾP TỤC MUA SẮM</button>
          </div>
        ) : (
          <div className="cart-content-layout">
            {/* LEFT: LIST OF PRODUCTS */}
            <div className="cart-main-list">
              <div className="cart-header-row">
                <div className="col-product">SẢN PHẨM</div>
                <div className="col-price">GIÁ</div>
                <div className="col-qty">SỐ LƯỢNG</div>
                <div className="col-total">TỔNG</div>
              </div>

              {carts.map(item => (
                <div key={item.productID} className="cart-item-row">
                  <div className="col-product product-cell">
                    <button className="remove-item-btn" onClick={() => removeItem(item.productID)}>
                      <Trash2 size={18} />
                    </button>
                    <div className="product-img-box">
                      <img
                        src={item.images ? `http://localhost:4000/uploads/${item.images[0]}` : "http://localhost:4000/uploads/default.jpg"}
                        alt={item.name}
                      />
                    </div>
                    <span className="product-name-link">{item.name}</span>
                  </div>

                  <div className="col-price price-text">
                    {Number(item.new_price).toLocaleString('vi-VN')}₫
                  </div>

                  <div className="col-qty">
                    <div className="qty-selector">
                      <button onClick={() => decrease(item.productID)}><Minus size={14} /></button>
                      <input type="text" value={item.quantity} readOnly />
                      <button onClick={() => increase(item.productID)}><Plus size={14} /></button>
                    </div>
                  </div>

                  <div className="col-total total-text">
                    {(item.new_price * item.quantity).toLocaleString('vi-VN')}₫
                  </div>
                </div>
              ))}

              <div className="cart-actions-footer">
                <button className="btn-continue" onClick={() => navigate("/")}>
                   <ArrowLeft size={18} /> QUAY LẠI CỬA HÀNG
                </button>
              </div>
            </div>

            {/* RIGHT: SUMMARY SIDEBAR */}
            <aside className="cart-sidebar-summary">
              <div className="summary-card">
                <h3 className="summary-card-title">TỔNG ĐƠN HÀNG</h3>
                <div className="summary-row">
                  <span>Tạm tính</span>
                  <span className="bold-price">{getTotal().toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="summary-row">
                  <span>Giao hàng</span>
                  <span className="shipping-info">Giao hàng miễn phí toàn quốc</span>
                </div>
                <div className="summary-row total-final">
                  <span>Tổng cộng</span>
                  <span className="final-price-val">{getTotal().toLocaleString('vi-VN')}₫</span>
                </div>
                <button className="btn-checkout-now" onClick={() => navigate("/checkout")}>
                  TIẾN HÀNH THANH TOÁN
                </button>
              </div>

              <div className="coupon-box-mini">
                <p>Mã ưu đãi</p>
                <div className="coupon-input-group">
                  <input type="text" placeholder="Nhập mã giảm giá" />
                  <button>ÁP DỤNG</button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItems;
import React, { useContext } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";

const CartItems = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    increase,
    decrease,
    removeFromCart,
    getTotalCartAmount
  } = useContext(ShopContext);

  const totalAmount = getTotalCartAmount();

  return (
    <div className='cart-page'>
      <div className="container-custom">
        {/* BREADCRUMB */}
        <div className="cart-breadcrumb">
          <span onClick={() => navigate("/")}>Trang chủ</span> <span>/</span> <span className="active">Giỏ hàng</span>
        </div>

        <h1 className="cart-title">GIỎ HÀNG CỦA BẠN</h1>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={80} strokeWidth={1} />
            <p>Chưa có sản phẩm nào trong giỏ hàng.</p>
            <button className="return-shop" onClick={() => navigate("/")}>
              QUAY LẠI CỬA HÀNG
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            {/* LEFT SIDE: PRODUCT TABLE */}
            <div className="cart-main">
              <div className="cart-header-labels">
                <span className="label-product">SẢN PHẨM</span>
                <span className="label-price">GIÁ</span>
                <span className="label-quantity">SỐ LƯỢNG</span>
                <span className="label-subtotal">TẠM TÍNH</span>
              </div>

              <div className="cart-items-list">
                {cartItems.map(item => (
                  <div className="cart-item-row" key={item.productID}>
                    {/* Sản phẩm */}
                    <div className="cart-item-product">
                      <button 
                        className="btn-remove" 
                        onClick={() => removeFromCart(item.productID)}
                        title="Xóa sản phẩm"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="product-img">
                        <img
                          src={item.images ? `http://localhost:4000/uploads/${item.images[0]}` : "http://localhost:4000/uploads/default.jpg"}
                          alt={item.name}
                        />
                      </div>
                      <h3 className="product-name-cart">{item.name}</h3>
                    </div>

                    {/* Giá */}
                    <div className="cart-item-price">
                      {Number(item.new_price).toLocaleString('vi-VN')}₫
                    </div>

                    {/* Số lượng */}
                    <div className="cart-item-quantity">
                      <div className="qty-control">
                        <button onClick={() => decrease(item.productID)}><Minus size={14} /></button>
                        <input type="text" value={item.quantity} readOnly />
                        <button onClick={() => increase(item.productID)}><Plus size={14} /></button>
                      </div>
                    </div>

                    {/* Tạm tính */}
                    <div className="cart-item-subtotal">
                      {(item.new_price * item.quantity).toLocaleString('vi-VN')}₫
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-actions-bottom">
                <button className="continue-shopping" onClick={() => navigate("/")}>
                  <ArrowLeft size={18} /> TIẾP TỤC XEM SẢN PHẨM
                </button>
              </div>
            </div>

            {/* RIGHT SIDE: SUMMARY */}
            <aside className="cart-sidebar">
              <div className="summary-box">
                <h3 className="summary-title">TỔNG SỐ LƯỢNG</h3>
                <div className="summary-line">
                  <span>Tổng phụ</span>
                  <span className="price-val">{totalAmount.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="summary-line">
                  <span>Giao hàng</span>
                  <span className="shipping-text">Giao hàng miễn phí nội thành TP.Hà Nội</span>
                </div>
                <div className="summary-line total-line">
                  <span>Tổng cộng</span>
                  <span className="total-val">{totalAmount.toLocaleString('vi-VN')}₫</span>
                </div>
                <button 
                  className="btn-checkout"
                  onClick={() => navigate("/checkout")}
                >
                  TIẾN HÀNH THANH TOÁN
                </button>
              </div>

              <div className="coupon-section">
                <h4>Phiếu ưu đãi</h4>
                <div className="coupon-input">
                  <input type="text" placeholder="Mã ưu đãi" />
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
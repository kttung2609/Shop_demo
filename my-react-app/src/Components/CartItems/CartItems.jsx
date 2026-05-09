import React, { useContext, useEffect } from "react";
import "./CartItems.css";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ChevronRight, ArrowLeft, CreditCard } from "lucide-react";
import { ShopContext } from "../../Context/ShopContext";

const CartItems = () => {
  const navigate = useNavigate();
  
  // Lấy dữ liệu từ Context (Đảm bảo Navbar và Cart luôn khớp nhau)
  const { 
    user, 
    cartItems, 
    increase, 
    decrease, 
    removeFromCart, 
    getTotalCartAmount,
    fetchCart 
  } = useContext(ShopContext);

  // Load lại giỏ hàng mới nhất khi vào trang
  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  // Nếu chưa đăng nhập
  if (!user) {
    return (
      <div className="cart-empty-container">
        <div className="empty-box">
          <ShoppingBag size={100} strokeWidth={1} color="#ccc" />
          <h2>BẠN CHƯA ĐĂNG NHẬP</h2>
          <p>Vui lòng đăng nhập để xem và quản lý giỏ hàng của bạn.</p>
          <button className="btn-primary-large" onClick={() => navigate("/login")}>
            ĐĂNG NHẬP NGAY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='cart-page-wrapper'>
      <div className="cart-container-full">
        {/* BREADCRUMB */}
        <div className="cart-navigation">
          <span onClick={() => navigate("/")}>Trang chủ</span> <ChevronRight size={14} />
          <span className="active">Giỏ hàng của bạn</span>
        </div>

        <h1 className="cart-main-title">GIỎ HÀNG ({cartItems.length} sản phẩm)</h1>

        {cartItems.length === 0 ? (
          <div className="cart-empty-box">
            <ShoppingBag size={120} strokeWidth={1} color="#eee" />
            <p>Giỏ hàng của bạn hiện đang trống.</p>
            <button className="btn-return-shop" onClick={() => navigate("/")}>
              QUAY LẠI CỬA HÀNG ĐỂ MUA SẮM
            </button>
          </div>
        ) : (
          <div className="cart-flex-layout">
            
            {/* PHẦN DANH SÁCH SẢN PHẨM (KÉO DÀI) */}
            <div className="cart-products-section">
              <div className="cart-table-header">
                <span className="h-prod">SẢN PHẨM</span>
                <span className="h-price">GIÁ</span>
                <span className="h-qty">SỐ LƯỢNG</span>
                <span className="h-sub">TẠM TÍNH</span>
              </div>

              <div className="cart-items-body">
                {cartItems.map((item, index) => {
                  // Xử lý ảnh (Parse nếu là string JSON)
                  let imageSrc = "default.jpg";
                  try {
                    const parsedImgs = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
                    if (parsedImgs && parsedImgs.length > 0) imageSrc = parsedImgs[0];
                  } catch (e) {
                    imageSrc = item.images?.[0] || "default.jpg";
                  }

                  return (
                    <div key={`${item.productID}-${index}`} className="cart-row-item">
                      <div className="cart-col-product">
                        <button className="remove-item-icon" onClick={() => removeFromCart(item.productID)}>
                          <Trash2 size={20} />
                        </button>
                        <div className="prod-img-wrapper">
                          <img src={`http://localhost:4000/uploads/${imageSrc}`} alt={item.name} />
                        </div>
                        <div className="prod-detail-info">
                          <h3 className="prod-name-display">{item.name}</h3>
                          <span className="prod-sku">Mã SP: BS-{item.productID}</span>
                        </div>
                      </div>

                      <div className="cart-col-price">
                        {Number(item.new_price).toLocaleString('vi-VN')}₫
                      </div>

                      <div className="cart-col-qty">
                        <div className="quantity-box-modern">
                          <button onClick={() => decrease(item.productID)}><Minus size={16} /></button>
                          <input type="text" value={item.quantity} readOnly />
                          <button onClick={() => increase(item.productID)}><Plus size={16} /></button>
                        </div>
                      </div>

                      <div className="cart-col-subtotal">
                        {(item.new_price * item.quantity).toLocaleString('vi-VN')}₫
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="cart-footer-actions">
                <button className="btn-back-to-shop" onClick={() => navigate("/")}>
                   <ArrowLeft size={18} /> TIẾP TỤC MUA SẮM
                </button>
              </div>
            </div>

            {/* PHẦN TỔNG KẾT (SIDEBAR) */}
            <aside className="cart-summary-sidebar">
              <div className="summary-sticky-card">
                <h3 className="summary-card-title">TỔNG ĐƠN HÀNG</h3>
                <div className="summary-detail-row">
                  <span>Tạm tính:</span>
                  <span className="val-bold">{getTotalCartAmount().toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="summary-detail-row">
                  <span>Giao hàng:</span>
                  <span className="val-free">MIỄN PHÍ VẬN CHUYỂN</span>
                </div>
                <div className="summary-total-final">
                  <span>TỔNG CỘNG:</span>
                  <span className="total-amount-big">{getTotalCartAmount().toLocaleString('vi-VN')}₫</span>
                </div>
                <button className="btn-proceed-checkout" onClick={() => navigate("/checkout")}>
                  <CreditCard size={20} /> TIẾN HÀNH THANH TOÁN
                </button>
                <div className="secure-checkout-hint">
                   🔒 Thanh toán an toàn và bảo mật
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
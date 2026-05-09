import React, { useContext, useState } from "react";
import { ShopContext } from "../../Context/ShopContext";
import "./Checkout.css";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  CreditCard, 
  Truck,
  ChevronRight
} from "lucide-react";

const Checkout = () => {
  const { cartItems, getTotalCartAmount } = useContext(ShopContext);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    // Đồng bộ cách lấy ảnh khi gửi lên server để lưu vào bảng order_items
    const items = cartItems.map(item => {
      let imageSrc = "default.jpg";
      try {
        const parsedImgs = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
        if (parsedImgs && parsedImgs.length > 0) imageSrc = parsedImgs[0];
      } catch (e) {
        imageSrc = item.image || "default.jpg";
      }

      return {
        product_id: item.productID,
        name: item.name,
        image: imageSrc, // Gửi ảnh đã xử lý
        price: item.new_price,
        quantity: item.quantity,
      };
    });

      try {
      const res = await fetch("http://localhost:4000/orders/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          items,
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          note: form.note,
          payment_method: paymentMethod
        })
      });

      const data = await res.json();

      if (data.success) {
        // 🔥 BƯỚC QUAN TRỌNG: Gọi API xóa sạch giỏ hàng trong Database
        await fetch("http://localhost:4000/api/cart/clear", {
          method: "DELETE",
          credentials: "include" // Để server biết xóa giỏ hàng của ai dựa trên Token
        });

        alert("✅ Đặt hàng thành công!");
        
        // Chuyển hướng người dùng về trang đơn hàng
        // Sử dụng window.location.href sẽ làm mới toàn bộ App và đưa giỏ hàng về 0
        window.location.href = "/orders"; 
      } else {
        alert(data.message || "❌ Đặt hàng thất bại!");
      }
    } catch (err) {
      alert("Lỗi kết nối server!");
    }
  };

  return (
    <div className="checkout-page">
      <div className="container-custom">
        <div className="checkout-breadcrumb">
          <span>Giỏ hàng</span> <ChevronRight size={14} />
          <span className="active">Thanh toán</span> <ChevronRight size={14} />
          <span>Hoàn tất</span>
        </div>

        <div className="checkout-layout">
          <div className="checkout-left">
            <div className="checkout-section">
              <h2 className="section-title">
                <User size={20} /> THÔNG TIN GIAO HÀNG
              </h2>
              <div className="form-content">
                <div className="input-box">
                  <label>Họ và tên *</label>
                  <div className="input-wrapper">
                    <input type="text" name="name" placeholder="Nhập họ tên người nhận" onChange={handleChange} />
                    <User className="input-icon" size={18} />
                  </div>
                </div>

                <div className="input-grid">
                  <div className="input-box">
                    <label>Số điện thoại *</label>
                    <div className="input-wrapper">
                      <input type="text" name="phone" placeholder="Số điện thoại" onChange={handleChange} />
                      <Phone className="input-icon" size={18} />
                    </div>
                  </div>
                  <div className="input-box">
                    <label>Email (Nhận thông báo)</label>
                    <div className="input-wrapper">
                      <input type="email" name="email" placeholder="Email của bạn" onChange={handleChange} />
                      <Mail className="input-icon" size={18} />
                    </div>
                  </div>
                </div>

                <div className="input-box">
                  <label>Địa chỉ nhận hàng *</label>
                  <div className="input-wrapper">
                    <input type="text" name="address" placeholder="Số nhà, tên đường, xã/phường, quận/huyện..." onChange={handleChange} />
                    <MapPin className="input-icon" size={18} />
                  </div>
                </div>

                <div className="input-box">
                  <label>Ghi chú đơn hàng</label>
                  <div className="input-wrapper">
                    <textarea name="note" placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..." onChange={handleChange} />
                    <FileText className="input-icon" size={18} />
                  </div>
                </div>
              </div>
            </div>

            <div className="checkout-section payment-section">
              <h2 className="section-title">
                <CreditCard size={20} /> PHƯƠNG THỨC THANH TOÁN
              </h2>
              <div className="payment-options">
                <label className={`payment-item ${paymentMethod === 'cod' ? 'active' : ''}`}>
                  <input type="radio" name="pay" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  <div className="pay-content">
                    <span className="pay-name">Thanh toán khi nhận hàng (COD)</span>
                    <span className="pay-desc">Bạn sẽ thanh toán bằng tiền mặt khi shipper giao hàng đến.</span>
                  </div>
                </label>
                <label className={`payment-item ${paymentMethod === 'bank' ? 'active' : ''}`}>
                  <input type="radio" name="pay" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} />
                  <div className="pay-content">
                    <span className="pay-name">Chuyển khoản ngân hàng</span>
                    <span className="pay-desc">Chuyển khoản qua QR Code hoặc số tài khoản (Giao hàng nhanh hơn).</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <aside className="checkout-right">
            <div className="order-summary-card">
              <h3 className="summary-title">ĐƠN HÀNG CỦA BẠN</h3>
              
              <div className="checkout-items-list">
                {cartItems.map((item, index) => {
                  // LOGIC XỬ LÝ ẢNH GIỐNG CARTITEMS.JSX
                  let imageSrc = "default.jpg";
                  try {
                    const parsedImgs = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
                    if (parsedImgs && parsedImgs.length > 0) imageSrc = parsedImgs[0];
                  } catch (e) {
                    imageSrc = item.image || "default.jpg"; // Fallback nếu có field image đơn
                  }

                  return (
                    <div key={`${item.productID}-${index}`} className="checkout-item">
                      <div className="item-img">
                        <img src={`http://localhost:4000/uploads/${imageSrc}`} alt={item.name} />
                      </div>
                      <div className="item-info">
                        <p className="item-name">{item.name}</p>
                        <p className="item-price">{(item.new_price * item.quantity).toLocaleString()}₫</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="summary-pricing">
                <div className="pricing-row">
                  <span>Tạm tính</span>
                  <span>{getTotalCartAmount().toLocaleString()}₫</span>
                </div>
                <div className="pricing-row">
                  <span>Phí vận chuyển</span>
                  <span className="free-shipping">Miễn phí</span>
                </div>
                <div className="pricing-row total">
                  <span>TỔNG CỘNG</span>
                  <span className="final-price">{getTotalCartAmount().toLocaleString()}₫</span>
                </div>
              </div>

              <div className="order-policy">
                <p><Truck size={14} /> Giao hàng từ 2-4 ngày làm việc</p>
                <p>Bằng cách đặt hàng, bạn đồng ý với điều khoản của shop.</p>
              </div>

              <button
                className="btn-place-order"
                onClick={handleOrder}
                disabled={cartItems.length === 0}
              >
                ĐẶT HÀNG NGAY
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
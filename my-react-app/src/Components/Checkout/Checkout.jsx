import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../Context/ShopContext";
import { toast } from "react-toastify";
import "./Checkout.css";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  CreditCard, 
  Truck,
  ChevronRight,
  Loader2
} from "lucide-react";

const Checkout = () => {
  const { cartItems, getTotalCartAmount, clearCart, user } = useContext(ShopContext);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: ""
  });

  useEffect(() => {
    if (!user) return;

    setForm((currentForm) => ({
      ...currentForm,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || currentForm.phone || "",
    }));
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    if (isLoading) return;

    if (!form.address.trim()) {
      toast.warning("❌ Vui lòng điền địa chỉ nhận hàng");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("❌ Giỏ hàng trống, không thể tạo đơn hàng");
      return;
    }

    setIsLoading(true);

    try {
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
          image: imageSrc, 
          price: item.new_price,
          quantity: item.quantity,
        };
      });

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
        toast.success("✅ Đặt hàng thành công!");
        
        const cleared = await clearCart();
        if (!cleared) {
          console.warn("Không xóa được giỏ hàng sau khi đặt hàng");
        }

        setTimeout(() => {
          window.location.href = "/orders";
        }, 800);
      } else {
        toast.error(data.message || "❌ Đặt hàng thất bại!");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
      toast.error("Lỗi kết nối server!");
      setIsLoading(false);
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
                    <input type="text" name="name" placeholder="Họ và tên" value={form.name} readOnly />
                    <User className="input-icon" size={18} />
                  </div>
                </div>

                <div className="input-grid">
                  <div className="input-box">
                    <label>Số điện thoại *</label>
                    <div className="input-wrapper">
                      <input type="text" name="phone" placeholder="Số điện thoại" value={form.phone} readOnly />
                      <Phone className="input-icon" size={18} />
                    </div>
                  </div>
                  <div className="input-box">
                    <label>Email (Nhận thông báo)</label>
                    <div className="input-wrapper">
                      <input type="email" name="email" placeholder="Email của bạn" value={form.email} readOnly />
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
                  let imageSrc = "default.jpg";
                  try {
                    const parsedImgs = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
                    if (parsedImgs && parsedImgs.length > 0) imageSrc = parsedImgs[0];
                  } catch (e) {
                    imageSrc = item.image || "default.jpg"; 
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
                disabled={cartItems.length === 0 || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    ĐANG XỬ LÝ...
                  </>
                ) : (
                  "ĐẶT HÀNG NGAY"
                )}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
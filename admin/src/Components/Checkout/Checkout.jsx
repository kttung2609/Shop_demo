import React, { useState, useEffect } from "react";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: ""
  }); 
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminCart = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/cart/admin", {
          credentials: "include" // Sẽ gửi admin_token cookie
        });
        if (!res.ok) {
          setCartItems([]);
          return;
        }
        const data = await res.json();
        setCartItems(data || []);
      } catch (err) {
        console.error("Lỗi fetch giỏ hàng admin:", err);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminCart();
  }, []);

  const getTotalCartAmount = () => {
    return cartItems.reduce((sum, item) => sum + (item.new_price * item.quantity), 0);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    // Validation form
    if (!form.name || !form.phone || !form.address) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc (Tên, SĐT, Địa chỉ)");
      return;
    }

    if (cartItems.length === 0) {
      setError("Giỏ hàng trống, không thể tạo đơn hàng");
      return;
    }

    setError("");
    const user = JSON.parse(localStorage.getItem("user"));

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
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: user?.id,
        items,
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        note: form.note,
        status: "completed" 
      })
    });
    
    const data = await res.json();

    if (data.success) {
      toast.success("Đặt hàng thành công! Đơn hàng đã được thêm vào danh sách đã giao.");


      try {
        await fetch("http://localhost:4000/api/cart/admin/clear", {
          method: "DELETE",
          credentials: "include"
        });
      } catch (err) {
        console.log("Lỗi khi xóa cart admin:", err);
      }

  
      setForm({ name: "", phone: "", email: "", address: "", note: "" });
      setCartItems([]);
      setError("");

      setTimeout(() => {
        window.location.href = "/orders";
      }, 1000);
    } else {
      setError(data.message || "Đặt hàng thất bại!");
    }
  };
  
  return (
    <div className="checkout">
      
      {/* LEFT */}
      <div className="checkout-left">

        <h2>THÔNG TIN THANH TOÁN</h2>

        {error && <div className="checkout-error">{error}</div>}

        <input
          type="text"
          name="name"
          placeholder="Nhập họ và tên *"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Nhập số điện thoại *"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Nhập email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="address"
          placeholder="Địa chỉ *"
          value={form.address}
          onChange={handleChange}
        />

        <textarea 
          name="note"
          placeholder="Ghi chú đơn hàng (tuỳ chọn)..."
          value={form.note}
          onChange={handleChange}
        />

      </div>

      {/* RIGHT */}
      <div className="checkout-right">

        <h3 className="checkout-right-title">GIỎ HÀNG CỦA ADMIN</h3>

        <div className="checkout-items-container">
          {loading ? (
            <p className="empty-cart-msg">Đang tải giỏ hàng...</p>
          ) : cartItems.length === 0 ? (
            <p className="empty-cart-msg">Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng tại mục "Giỏ hàng hệ thống".</p>
          ) : (
            cartItems.map((item) => {
              const itemTotal = item.new_price * item.quantity;
              let imageSrc = "default.jpg";
              try {
                const parsedImgs = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
                if (parsedImgs && parsedImgs.length > 0) imageSrc = parsedImgs[0];
              } catch (e) {
                imageSrc = "default.jpg";
              }

              return (
                <div key={item.productID} className="checkout-item">
                  <div className="checkout-item-img">
                    <img 
                      src={`http://localhost:4000/uploads/${imageSrc}`}
                      alt={item.name}
                      className="checkout-img"
                    />
                  </div>
                  <div className="checkout-item-details">
                    <p className="item-name">{item.name}</p>
                    <div className="item-meta">
                      <span className="item-qty">SL: <strong>{item.quantity}</strong></span>
                      <span className="item-unit-price">{item.new_price.toLocaleString()}đ/cái</span>
                    </div>
                  </div>
                  <div className="item-total-price">
                    {itemTotal.toLocaleString()}đ
                  </div>
                </div>
              );
            })
          )}
        </div>

        <hr className="checkout-divider" />
        
        <div className="checkout-summary">
          <div className="summary-row">
            <span>Tạm tính:</span>
            <span>{getTotalCartAmount().toLocaleString()}đ</span>
          </div>
          <div className="summary-row">
            <span>Phí vận chuyển:</span>
            <span className="shipping-free">Miễn phí</span>
          </div>
          <div className="summary-row total">
            <span>TỔNG CỘNG</span>
            <span className="total-price">{getTotalCartAmount().toLocaleString()}đ</span>
          </div>
        </div>

        <button className="checkout-btn" onClick={handleOrder} disabled={loading || cartItems.length === 0}>
          ĐẶT HÀNG
        </button>

      </div>

    </div>
  );
};

export default Checkout;
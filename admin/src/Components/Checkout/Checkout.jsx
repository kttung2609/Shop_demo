import React, { useContext, useState } from "react";
import { ShopContext } from "../../Context/ShopContext";
import "./Checkout.css";

const Checkout = () => {

  
  const { cartItems, all_product, getTotalCartAmount } = useContext(ShopContext);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  }); 
  const cartProducts = cartItems;
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    // 🔥 gửi đầy đủ dữ liệu (có category)
    const items = cartItems.map(item => ({
      product_id: item.productID,
      name: item.name,
      image: item.image,
      price: item.new_price,
      quantity: item.quantity,
    }));
    
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
        address: form.address
      })
    });
    
    const data = await res.json();

    if (data.success) {
      alert("Đặt hàng thành công!");

      // 🔥 xoá cart DB
      let res = await fetch(`http://localhost:4000/api/cart/clear/${user.id}`, {
        method: "DELETE"
      });
      localStorage.removeItem("cart");

      window.location.href = "/orders";
    } else {
      alert(data.message || "Đặt hàng thất bại!");
    }
  };
  
  return (
    <div className="checkout">
      
      {/* LEFT */}
      <div className="checkout-left">

        <h2>THÔNG TIN THANH TOÁN</h2>

        <input
          type="text"
          name="name"
          placeholder="Nhập họ và tên"
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Nhập số điện thoại"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Nhập email"
          onChange={handleChange}
        />

        <input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          onChange={handleChange}
        />

        <textarea placeholder="Ghi chú đơn hàng..." />

      </div>

      {/* RIGHT */}
      <div className="checkout-right">

        <h3>ĐƠN HÀNG CỦA BẠN</h3>

        {cartProducts.map((item) => {
          return (
            <div key={item.productID} className="checkout-item">

              <img 
                src={`http://localhost:4000/uploads/${item.image}`}
                alt=""
                className="checkout-img"
              />
              <div className="checkout-content">
                <p className="name">{item.name}</p>

                <div className="price-qty-row">
                  <span className="quantity">SL: {item.quantity}</span>
                  <span className="price">{item.new_price}đ</span>
                </div>
              </div>
            </div>
          );
        })}

        <hr />
        <div className="checkout-total">
          <p>Tổng</p>
          <p>{getTotalCartAmount()}đ</p>
        </div>

        <button className="checkout-btn" onClick={handleOrder}>
          Đặt hàng
        </button>

      </div>

    </div>
  );
};

export default Checkout;
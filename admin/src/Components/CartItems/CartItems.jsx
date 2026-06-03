import React, { useEffect, useState } from "react";
import "./CartItems.css";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingCart, User as UserIcon, ChevronRight, AlertCircle, CreditCard } from "lucide-react";

const CartItems = () => {
  const [user, setUser] = useState(null);
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/auth/me?role=admin", { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (data?.role !== "admin") navigate("/login");
        else setUser(data);
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  const fetchCarts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/cart/admin", { credentials: "include" });
      const data = await res.json();
      setCarts(data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchCarts(); }, [user]);

  const getTotalCartAmount = () => {
    return carts.reduce((sum, item) => sum + (Number(item.new_price) * Number(item.quantity)), 0);
  };

  const increase = async (userID, productID) => {
    await fetch("http://localhost:4000/api/cart/admin/increase", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID, productID }),
    });
    fetchCarts();
  };

  const decrease = async (userID, productID) => {
    await fetch("http://localhost:4000/api/cart/admin/decrease", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID, productID }),
    });
    fetchCarts();
  };

  const removeItem = async (productID) => {
    if (!window.confirm("Xóa sản phẩm này khỏi giỏ hàng?")) return;
    await fetch(`http://localhost:4000/api/cart/admin/delete?productID=${productID}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchCarts();
  };

  return (
    <div className="admin-cart-page">
      <div className="cart-container-full">
        <div className="cart-header-main">
          <h1>Giỏ Hàng Hệ Thống</h1>
          <div className="cart-total-badge">Tổng: <strong>{carts.length}</strong> món</div>
        </div>
        <div className="cart-content-grid">
          <div className="cart-table-wrapper">
            <table className="modern-admin-table">
              <thead>
                <tr>
                  <th>KHÁCH HÀNG</th>
                  <th>SẢN PHẨM</th>
                  <th>GIÁ</th>
                  <th className="text-center">SỐ LƯỢNG</th>
                  <th>TẠM TÍNH</th>
                  <th className="text-right">HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody>
                {!loading && carts.map((item, index) => {
                  let imgS = "default.jpg";
                  try {
                    const imgs = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
                    imgS = imgs[0];
                  } catch (e) { imgS = "default.jpg"; }
                  return (
                    <tr key={index}>
                      <td><div className="user-info-chip"><UserIcon size={14} /> ID: {item.userID}</div></td>
                      <td><div className="product-info-cell"><img src={`http://localhost:4000/uploads/${imgS}`} alt="" /><span>{item.name}</span></div></td>
                      <td>{Number(item.new_price).toLocaleString()}₫</td>
                      <td>
                        <div className="qty-control-admin">
                          <button onClick={() => decrease(item.userID, item.productID)}>-</button>
                          <input type="text" value={item.quantity} readOnly />
                          <button onClick={() => increase(item.userID, item.productID)}>+</button>
                        </div>
                      </td>
                      <td>{(item.new_price * item.quantity).toLocaleString()}₫</td>
                      <td className="text-right"><button className="btn-delete-item" onClick={() => removeItem(item.productID)}><Trash2 size={18} /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <aside className="admin-cart-summary">
            <div className="summary-card">
              <h3>TỔNG GIỎ HÀNG</h3>
              <div className="summary-row">
                <span>Số sản phẩm:</span>
                <strong>{carts.length}</strong>
              </div>
              <div className="summary-row">
                <span>Tạm tính:</span>
                <strong>{getTotalCartAmount().toLocaleString('vi-VN')}₫</strong>
              </div>
              <div className="summary-row">
                <span>Giao hàng:</span>
                <strong>Miễn phí</strong>
              </div>
              <div className="summary-total">
                <span>TỔNG CỘNG</span>
                <strong>{getTotalCartAmount().toLocaleString('vi-VN')}₫</strong>
              </div>
              <button className="btn-proceed-checkout" onClick={() => navigate("/checkout")}
                disabled={loading || carts.length === 0}
              >
                <CreditCard size={18} /> TIẾN HÀNH THANH TOÁN
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
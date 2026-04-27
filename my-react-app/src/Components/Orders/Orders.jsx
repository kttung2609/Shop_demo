import React, { useState, useEffect } from "react";
import "./Orders.css";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  ShoppingBag, 
  ChevronRight,
  Clock
} from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("pending");

  useEffect(() => {
    fetch("http://localhost:4000/orders")
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  const cancelOrder = async (id) => {
    const reason = prompt("Nhập lý do huỷ đơn:");
    if (!reason) return alert("Bạn phải nhập lý do!");

    const res = await fetch(`http://localhost:4000/orders/cancel/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: reason })
    });

    const data = await res.json();
    if (data.success) {
      setOrders(prev =>
        prev.map(o => o.id === id ? { ...o, status: "cancelled" } : o)
      );
    }
  };

  const filteredOrders = orders.filter(
    o => (o.status || "").toLowerCase() === tab
  );

  // Helper hiển thị icon theo trạng thái
  const getStatusInfo = (status) => {
    switch (status) {
      case "pending": return { label: "Chờ xử lý", icon: <Clock size={16} /> };
      case "shipping": return { label: "Đang giao hàng", icon: <Truck size={16} /> };
      case "delivered": return { label: "Đã hoàn thành", icon: <CheckCircle size={16} /> };
      case "cancelled": return { label: "Đã hủy", icon: <XCircle size={16} /> };
      default: return { label: status, icon: <Package size={16} /> };
    }
  };

  return (
    <div className="orders-page">
      <div className="container-custom">
        {/* BREADCRUMB */}
        <div className="orders-breadcrumb">
          <span>Trang chủ</span> <ChevronRight size={14} />
          <span className="active">Đơn hàng của tôi</span>
        </div>

        <h1 className="page-title">QUẢN LÝ ĐƠN HÀNG</h1>

        {/* TABS CHUYÊN NGHIỆP */}
        <div className="orders-tabs-nav">
          {[
            { key: "pending", label: "Chờ xác nhận" },
            { key: "shipping", label: "Đang giao" },
            { key: "delivered", label: "Đã giao" },
            { key: "cancelled", label: "Đã hủy" }
          ].map(t => (
            <button
              key={t.key}
              className={tab === t.key ? "tab-item active" : "tab-item"}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* DANH SÁCH ĐƠN HÀNG */}
        <div className="orders-list-wrapper">
          {filteredOrders.length === 0 ? (
            <div className="orders-empty-state">
              <ShoppingBag size={60} strokeWidth={1} />
              <p>Bạn chưa có đơn hàng nào trong mục này.</p>
              <button onClick={() => window.location.href = "/"}>TIẾP TỤC MUA SẮM</button>
            </div>
          ) : (
            filteredOrders.map(order => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div key={order.id} className="order-main-card">
                  {/* Header: ID & Trạng thái */}
                  <div className="card-header">
                    <div className="header-left">
                      <Package size={18} />
                      <span className="order-code">ĐƠN HÀNG: #{order.id}</span>
                      <span className="order-date">| {new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className={`header-status ${order.status}`}>
                      {statusInfo.icon}
                      <span>{statusInfo.label.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Body: Danh sách sản phẩm */}
                  <div className="card-body">
                    {order.items.map((item, i) => (
                      <div key={i} className="product-row">
                        <div className="prod-img">
                          <img src={`http://localhost:4000/uploads/${item.image}`} alt={item.name} />
                        </div>
                        <div className="prod-info">
                          <h4 className="prod-name">{item.name}</h4>
                          <span className="prod-qty">Số lượng: x{item.quantity}</span>
                        </div>
                        <div className="prod-price">
                          {Number(item.price).toLocaleString()}₫
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer: Tổng tiền & Nút bấm */}
                  <div className="card-footer">
                    <div className="total-payment">
                      <span className="total-label">Tổng số tiền:</span>
                      <span className="total-amount">{Number(order.total).toLocaleString()}₫</span>
                    </div>
                    <div className="footer-actions">
                      {order.status === "pending" && (
                        <button className="btn-cancel" onClick={() => cancelOrder(order.id)}>
                          HỦY ĐƠN HÀNG
                        </button>
                      )}
                      <button className="btn-view-detail">XEM CHI TIẾT</button>
                      {order.status === "delivered" && (
                        <button className="btn-rebuy">MUA LẠI</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
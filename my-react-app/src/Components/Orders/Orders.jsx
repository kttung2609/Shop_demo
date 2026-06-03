import React, { useState, useEffect } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import { 
  Package, Truck, CheckCircle, XCircle, ShoppingBag, ChevronRight, Clock 
} from "lucide-react";
import ReviewModal from "../../Components/ReviewModal/ReviewModal"; // 1. NHỚ IMPORT

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("pending");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = () => {
    fetch("http://localhost:4000/orders")
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    o => (o.status || "").toLowerCase() === tab
  );

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending": return { label: "Chờ xử lý", icon: <Clock size={16} />, color: "#f39c12" };
      case "shipping": return { label: "Đang giao hàng", icon: <Truck size={16} />, color: "#3498db" };
      case "completed": return { label: "Đã hoàn thành", icon: <CheckCircle size={16} />, color: "#2ecc71" };
      case "cancelled": return { label: "Đã hủy", icon: <XCircle size={16} />, color: "#e74c3c" };
      default: return { label: status, icon: <Package size={16} />, color: "#333" };
    }
  };

  return (
    <div className="orders-page">
      <div className="container-custom">
        <h1 className="page-title">QUẢN LÝ ĐƠN HÀNG</h1>

        <div className="orders-tabs-nav">
          {[
            { key: "pending", label: "Chờ xác nhận" },
            { key: "shipping", label: "Đang giao" },
            { key: "completed", label: "Đã giao" },
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

        <div className="orders-list-wrapper">
          {filteredOrders.length === 0 ? (
            <div className="orders-empty-state"><ShoppingBag size={60} /><p>Trống</p></div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="order-main-card">
                <div className="card-header">
                  <span>MÃ ĐƠN: #{order.id}</span>
                  <span className={`header-status ${order.status}`}>{getStatusInfo(order.status).label}</span>
                </div>

                <div className="card-body">
                  {order.items.map((item, i) => (
                    <div key={i} className="product-row">
                      <div className="prod-img">
                        <img src={`http://localhost:4000/uploads/${item.image}`} alt="" />
                      </div>
                      <div className="prod-info">
                        <h4>{item.name}</h4>
                        <span>x{item.quantity}</span>
                      </div>
                      <div className="prod-price">{Number(item.price).toLocaleString()}₫</div>
                    </div>
                  ))}
                </div>

                <div className="card-footer">
                  <div className="total-payment">
                    <span>Tổng tiền:</span>
                    <span className="total-amount">{Number(order.total).toLocaleString()}₫</span>
                  </div>
                  <div className="footer-actions">
                    {order.status === "completed" && (
                      <button 
                        className="btn-review" 
                        onClick={() => {
                          setSelectedOrder(order); 
                          setShowReviewModal(true); 
                        }}
                      >
                        ĐÁNH GIÁ NGAY
                      </button>
                    )}
                    <button className="btn-rebuy">MUA LẠI</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {showReviewModal && selectedOrder && (
        <ReviewModal 
          order={selectedOrder} 
          onClose={() => setShowReviewModal(false)} 
          onRefresh={fetchOrders}
        />
      )}
    </div>
  );
};

export default Orders;
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Order_items.css";
import {
  ArrowLeft,
  ClipboardList,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Package,
  User,
  CreditCard,
} from "lucide-react";

const Order_items = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { orderId } = useParams();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/orders/user", { credentials: "include" });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi tải chi tiết đơn hàng:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusInfo = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return { label: "Chờ xử lý", icon: <Clock size={16} />, className: "pending" };
      case "shipping":
        return { label: "Đang giao", icon: <Truck size={16} />, className: "shipping" };
      case "completed":
        return { label: "Hoàn thành", icon: <CheckCircle size={16} />, className: "completed" };
      case "cancelled":
        return { label: "Đã hủy", icon: <XCircle size={16} />, className: "cancelled" };
      default:
        return { label: status || "Không rõ", icon: <ClipboardList size={16} />, className: "default" };
    }
  };

  const filteredOrders = useMemo(() => {
    if (orderId) {
      return orders.filter((order) => String(order.id) === String(orderId));
    }

    const keyword = search.trim().toLowerCase();
    if (!keyword) return orders;

    return orders.filter((order) => {
      const fields = [
        order.id,
        order.name,
        order.phone,
        order.email,
        order.address,
        order.note,
        order.status,
        ...(order.items || []).map((item) => `${item.name} ${item.category || ""}`),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return fields.includes(keyword);
    });
  }, [orders, search, orderId]);

  return (
    <div className="order-items-page">
      <div className="order-items-header">
        <div>
          <h1>Chi tiết đơn hàng</h1>
          <p>Hiển thị dữ liệu từ `order_items` theo từng đơn</p>
        </div>
        <div className="order-items-counter">
          <span>Tổng đơn: <strong>{orders.length}</strong></span>
          <span>Tổng kết quả: <strong>{filteredOrders.length}</strong></span>
        </div>
      </div>

      {orderId && (
        <button className="back-to-orders" onClick={() => navigate("/orders")}>
          <ArrowLeft size={16} /> Quay lại danh sách đơn hàng
        </button>
      )}

      {!orderId && (
        <div className="order-items-toolbar">
          <div className="search-box">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo khách hàng, sản phẩm, số điện thoại..."
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="order-items-empty">Đang tải dữ liệu đơn hàng...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="order-items-empty">Không tìm thấy đơn hàng nào</div>
      ) : (
        <div className="order-items-list">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);

            return (
              <div key={order.id} className="order-items-card">
                <div className="order-card-header">
                  <div className="order-id-block">
                    <h3>Thông tin đơn hàng</h3>
                    <span className={`status-pill ${statusInfo.className}`}>
                      {statusInfo.icon}
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="order-total-block">
                    <CreditCard size={16} />
                    <span>{Number(order.total || 0).toLocaleString("vi-VN")}₫</span>
                  </div>
                </div>

                <div className="order-card-grid">
                  <div className="order-meta-panel">
                    <div className="meta-item">
                      <User size={16} />
                      <div>
                        <label>Khách hàng</label>
                        <span>{order.name || "Ẩn danh"}</span>
                      </div>
                    </div>
                    <div className="meta-item">
                      <Phone size={16} />
                      <div>
                        <label>Số điện thoại</label>
                        <span>{order.phone || "N/A"}</span>
                      </div>
                    </div>
                    <div className="meta-item">
                      <Mail size={16} />
                      <div>
                        <label>Email</label>
                        <span>{order.email || "N/A"}</span>
                      </div>
                    </div>
                    <div className="meta-item">
                      <MapPin size={16} />
                      <div>
                        <label>Địa chỉ</label>
                        <span>{order.address || "N/A"}</span>
                      </div>
                    </div>
                    <div className="meta-item note-item">
                      <ClipboardList size={16} />
                      <div>
                        <label>Ghi chú</label>
                        <span>{order.note || "Không có ghi chú"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="order-items-panel">
                    <div className="panel-title">
                      <Package size={16} />
                      <span>Sản phẩm trong đơn</span>
                    </div>

                    <div className="items-list">
                      {(order.items || []).length > 0 ? (
                        order.items.map((item, index) => (
                          <div key={`${order.id}-${index}`} className="item-row">
                            <div className="item-image-wrap">
                              {item.image ? (
                                <img
                                  src={`http://localhost:4000/uploads/${item.image}`}
                                  alt={item.name}
                                  onError={(e) => {
                                    e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/892/892458.png";
                                  }}
                                />
                              ) : (
                                <Package size={22} />
                              )}
                            </div>
                            <div className="item-info">
                              <strong>{item.name || "Sản phẩm"}</strong>
                              <span>Danh mục: {item.category || "N/A"}</span>
                              <span>Số lượng: x{item.quantity || 0}</span>
                            </div>
                            <div className="item-price">
                              {Number(item.price || 0).toLocaleString("vi-VN")}₫
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="empty-items">Đơn hàng này chưa có chi tiết sản phẩm</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Order_items;
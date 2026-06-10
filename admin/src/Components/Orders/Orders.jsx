import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.css";
import { toast } from "react-toastify";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChevronRight, 
  Eye, 
  Check, 
  X 
} from "lucide-react";

const STATUS_FILTER_KEY = "admin-orders-status-filter";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState(() => {
    return localStorage.getItem(STATUS_FILTER_KEY) || "pending";
  });
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:4000/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error("Không tải được danh sách đơn hàng");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:4000/orders/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          newStatus === "shipping"
            ? "Đã xác nhận đơn hàng"
            : "Đã cập nhật trạng thái đơn hàng"
        );
        fetchOrders();
      } else {
        toast.error(data.message || "Không thể cập nhật trạng thái đơn hàng");
      }
    } catch (err) {
      console.log(err);
      toast.error("Không thể kết nối tới máy chủ");
    }
  };

  const handleCancel = async (id) => {
    const reason = prompt("Nhập lý do huỷ đơn:");
    if (!reason || !reason.trim()) {
      toast.warning("Vui lòng nhập lý do huỷ đơn");
      return;
    }
    const res = await fetch(`http://localhost:4000/orders/cancel/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: reason.trim() })
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Đã huỷ đơn hàng");
      fetchOrders();
    } else {
      toast.error(data.message || "Không thể huỷ đơn hàng");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  useEffect(() => {
    localStorage.setItem(STATUS_FILTER_KEY, statusFilter);
  }, [statusFilter]);

  const filteredOrders = orders
    .filter((order) => order.status === statusFilter)
    .sort((leftOrder, rightOrder) => {
      const leftTime = new Date(leftOrder.created_at || 0).getTime();
      const rightTime = new Date(rightOrder.created_at || 0).getTime();

      if (rightTime !== leftTime) return rightTime - leftTime;

      return Number(rightOrder.id || 0) - Number(leftOrder.id || 0);
    });

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending": return "Chờ xử lý";
      case "shipping": return "Đang giao";
      case "completed": return "Hoàn thành";
      case "cancelled": return "Đã hủy";
      default: return status;
    }
  };

  return (
    <div className="admin-orders-page">
      <div className="orders-container-full">
        <div className="admin-orders-header-top">
          <div className="title-box">
            <h1>Quản Lý Đơn Hàng</h1>
            <p>Theo dõi và cập nhật trạng thái đơn hàng của hệ thống</p>
          </div>
          <div className="orders-stats">
            <span>Tổng đơn: <strong>{orders.length}</strong></span>
          </div>
        </div>

        <div className="admin-orders-tabs">
          {[
            { key: "pending", label: "Chờ xác nhận", icon: <Clock size={16}/> },
            { key: "shipping", label: "Đang giao hàng", icon: <Truck size={16}/> },
            { key: "completed", label: "Đã giao hàng", icon: <CheckCircle size={16}/> },
            { key: "cancelled", label: "Đơn đã hủy", icon: <XCircle size={16}/> }
          ].map((tab) => (
            <button
              key={tab.key}
              className={statusFilter === tab.key ? "active" : ""}
              onClick={() => setStatusFilter(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="orders-table-wrapper">
          <table className="modern-admin-table">
            <thead>
              <tr>
                <th style={{width: '180px'}}>KHÁCH HÀNG</th>
                <th>SẢN PHẨM</th>
                <th style={{width: '120px'}}>TỔNG TIỀN</th>
                <th style={{width: '150px'}}>TRẠNG THÁI</th>
                <th style={{width: '200px'}}>GHI CHÚ / HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="col-customer">
                      <div className="customer-info">
                        <strong>{order.name || "Ẩn danh"}</strong>
                        <span>{order.phone || "N/A"}</span>
                      </div>
                    </td>
                    <td className="col-products">
                      <div className="products-list-mini">
                        {order.items.map((item, i) => (
                          <div key={i} className="mini-item">
                            <Package size={12} /> {item.name} <span>x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="col-total">
                      {Number(order.total).toLocaleString("vi-VN")}₫
                    </td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="col-actions">
                      <button className="btn-action detail" onClick={() => navigate(`/order-items/${order.id}`)}>
                        <Eye size={14} /> Chi tiết
                      </button>

                      {order.status === "pending" && (
                        <div className="action-btn-group">
                          <button className="btn-action confirm" onClick={() => updateStatus(order.id, "shipping")}>
                            <Check size={14} /> Xác nhận
                          </button>
                          <button className="btn-action cancel" onClick={() => handleCancel(order.id)}>
                            <X size={14} /> Hủy
                          </button>
                        </div>
                      )}

                      {order.status === "shipping" && (
                        <div className="action-btn-group">
                          <button className="btn-action success" onClick={() => updateStatus(order.id, "completed") }>
                            <Check size={14} /> Giao xong
                          </button>
                        </div>
                      )}

                      {order.status === "cancelled" && (
                        <div className="cancel-note">
                          <XCircle size={14} /> {order.note || "Không có lý do"}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-table">Không tìm thấy đơn hàng nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
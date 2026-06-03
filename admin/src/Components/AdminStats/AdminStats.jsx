import React, { useEffect, useState } from "react";
import "./AdminStats.css";

const AdminStats = () => {
  const [type, setType] = useState("day");

  // ===== STATE =====
  const [date, setDate] = useState("");
  const [dayData, setDayData] = useState(null);

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [monthData, setMonthData] = useState([]);

  const [yearOnly, setYearOnly] = useState("");
  const [yearData, setYearData] = useState([]);

  const [weekDate, setWeekDate] = useState("");
  const [weekData, setWeekData] = useState([]);

  // Thống kê tổng quan
  const [weeklyStats, setWeeklyStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    newUsers: 0,
    productsSold: 0,
  });
  const [monthlyStats, setMonthlyStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    newUsers: 0,
    productsSold: 0,
  });

  const [loading, setLoading] = useState(false);

  // 🔥 load ngày hôm nay
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    setWeekDate(today);
    fetchDay(today);
    fetchWeeklyStats();
    fetchMonthlyStats();
  }, []);

  // ================= API =================

  const fetchDay = async (d) => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:4000/stats/daily/day?date=${d}` // 🔥 Sử dụng API từ bảng daily_statistics
      );
      const json = await res.json();

      console.log("DAY:", json);

      if (json.success) {
        setDayData(json.data);
      } else {
        setDayData(null);
      }
    } catch (err) {
      console.log(err);
      setDayData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeek = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:4000/stats/daily/week?date=${weekDate}` // 🔥 Sử dụng API từ bảng daily_statistics
      );
      const json = await res.json();

      console.log("WEEK:", json);

      if (json.success) {
        setWeekData(json.data);
      } else {
        setWeekData([]);
      }
    } catch (err) {
      console.log(err);
      setWeekData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonth = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:4000/stats/daily/month?month=${month}&year=${year}` // 🔥 Sử dụng API từ bảng daily_statistics
      );
      const json = await res.json();

      console.log("MONTH:", json);

      if (json.success) {
        setMonthData(json.data);
      } else {
        setMonthData([]);
      }
    } catch (err) {
      console.log(err);
      setMonthData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchYear = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:4000/stats/daily/year?year=${yearOnly}` // 🔥 Sử dụng API từ bảng daily_statistics
      );
      const json = await res.json();

      console.log("YEAR:", json);

      if (json.success) {
        setYearData(json.data);
      } else {
        setYearData([]);
      }
    } catch (err) {
      console.log(err);
      setYearData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyStats = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/stats/daily/current-week`
      );
      const json = await res.json();

      if (json.success) {
        setWeeklyStats({
          totalOrders: json.data.totalOrders ?? 0,
          totalRevenue: json.data.totalRevenue ?? 0,
          newUsers: json.data.newUsers ?? 0,
          productsSold: json.data.productsSold ?? 0,
        });
      }
    } catch (err) {
      console.log(err);
      setWeeklyStats({
        totalOrders: 0,
        totalRevenue: 0,
        newUsers: 0,
        productsSold: 0,
      });
    }
  };

  const fetchMonthlyStats = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/stats/daily/current-month`
      );
      const json = await res.json();

      if (json.success) {
        setMonthlyStats({
          totalOrders: json.data.totalOrders ?? 0,
          totalRevenue: json.data.totalRevenue ?? 0,
          newUsers: json.data.newUsers ?? 0,
          productsSold: json.data.productsSold ?? 0,
        });
      }
    } catch (err) {
      console.log(err);
      setMonthlyStats({
        totalOrders: 0,
        totalRevenue: 0,
        newUsers: 0,
        productsSold: 0,
      });
    }
  };


  return (
    <div className="stats-container">
      <div className="stats-header">
        <h1 className="stats-title">📊 Dashboard Thống Kê</h1>

        <select className="stats-selector" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="day">Theo ngày</option>
          <option value="week">Theo tuần</option>
          <option value="month">Theo tháng</option>
          <option value="year">Theo năm</option>
        </select>
      </div>

      {loading && <p className="loading-text">⏳ Đang tải dữ liệu...</p>}


      {type === "day" && (
        <div className="stats-section">
          <h2 className="section-title">📅 Thống kê theo ngày</h2>

          <input
            type="date"
            className="date-input"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              fetchDay(e.target.value);
            }}
          />

          {dayData ? (
            <div className="day-stats-grid">
              <div className="stats-card">
                <div className="card-icon">🛒</div>
                <div className="card-title">Số đơn hàng</div>
                <h2 className="card-value">{dayData.total_orders}</h2>
              </div>

              <div className="stats-card">
                <div className="card-icon">💰</div>
                <div className="card-title">Doanh thu</div>
                <h2 className="card-value">
                  {dayData.total_revenue?.toLocaleString("vi-VN") || 0}₫
                </h2>
              </div>
              <div className="stats-card">
                <div className="card-icon">👥</div>
                <div className="card-title">Khách hàng mới</div>
                <h2 className="card-value">{dayData.new_users || 0}</h2>
              </div>

              <div className="stats-card">
                <div className="card-icon">📦</div>
                <div className="card-title">Sản phẩm đã bán</div>
                <h2 className="card-value">{dayData.products_sold || 0}</h2>
              </div>            </div>
          ) : (
            !loading && <div className="no-data">Không có dữ liệu cho ngày này</div>
          )}
        </div>
      )}

      {type === "week" && (
        <div className="stats-section">
          <h2 className="section-title">📆 Thống kê theo tuần</h2>

          <input
            type="date"
            className="date-input"
            value={weekDate}
            onChange={(e) => setWeekDate(e.target.value)}
          />

          <button className="stats-button" onClick={fetchWeek}>Xem thống kê</button>

          {weekData.length > 0 ? (
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Số đơn hàng</th>
                  <th>Doanh thu</th>
                  <th>Khách hàng mới</th>
                  <th>Sản phẩm đã bán</th>
                </tr>
              </thead>
              <tbody>
                {weekData.map((item, i) => (
                  <tr key={i}>
                    <td>{new Date(item.date).toLocaleDateString('vi-VN')}</td>
                    <td>{item.total_orders}</td>
                    <td>
                      {item.total_revenue?.toLocaleString("vi-VN")}₫
                    </td>
                    <td>{item.new_users || 0}</td>
                    <td>{item.products_sold || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !loading && <div className="no-data">Không có dữ liệu cho tuần này</div>
          )}
        </div>
      )}

      {type === "month" && (
        <div className="stats-section">
          <h2 className="section-title">📆 Thống kê theo tháng</h2>

          <input
            type="number"
            className="number-input"
            placeholder="Tháng (1-12)"
            min="1"
            max="12"
            onChange={(e) => setMonth(e.target.value)}
          />
          <input
            type="number"
            className="number-input"
            placeholder="Năm"
            onChange={(e) => setYear(e.target.value)}
          />

          <button className="stats-button" onClick={fetchMonth}>Xem thống kê</button>

          {monthData.length > 0 ? (
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Số đơn hàng</th>
                  <th>Doanh thu</th>
                  <th>Khách hàng mới</th>
                  <th>Sản phẩm đã bán</th>
                </tr>
              </thead>
              <tbody>
                {monthData.map((item, i) => (
                  <tr key={i}>
                    <td>{new Date(item.date).toLocaleDateString('vi-VN')}</td>
                    <td>{item.total_orders}</td>
                    <td>
                      {item.total_revenue?.toLocaleString("vi-VN")}₫
                    </td>
                    <td>{item.new_users || 0}</td>
                    <td>{item.products_sold || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !loading && <div className="no-data">Không có dữ liệu cho tháng này</div>
          )}
        </div>
      )}

      {type === "year" && (
        <div className="stats-section">
          <h2 className="section-title">📊 Thống kê theo năm</h2>

          <input
            type="number"
            className="number-input"
            placeholder="Năm"
            onChange={(e) => setYearOnly(e.target.value)}
          />

          <button className="stats-button" onClick={fetchYear}>Xem thống kê</button>

          {yearData.length > 0 ? (
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Tháng</th>
                  <th>Số đơn hàng</th>
                  <th>Doanh thu</th>
                  <th>Khách hàng mới</th>
                  <th>Sản phẩm đã bán</th>
                </tr>
              </thead>
              <tbody>
                {yearData.map((item, i) => (
                  <tr key={i}>
                    <td>Tháng {item.month}</td>
                    <td>{item.total_orders}</td>
                    <td>
                      {item.total_revenue?.toLocaleString("vi-VN")}₫
                    </td>
                    <td>{item.new_users || 0}</td>
                    <td>{item.products_sold || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !loading && <div className="no-data">Không có dữ liệu cho năm này</div>
          )}
        </div>
      )}

      <div className="overview-section">
        <h2 className="overview-title">📈 Tổng quan</h2>

        <div className="overview-grid">

          {/* tuần */}
          <div className="overview-card weekly">
            <h3 className="overview-card-title">📅 Tuần này</h3>
            {weeklyStats ? (
              <div className="overview-stats">
                <div className="overview-stat-item">
                  <span className="overview-stat-label">Số đơn hàng:</span>
                  <span className="overview-stat-value">{weeklyStats.totalOrders}</span>
                </div>
                <div className="overview-stat-item">
                  <span className="overview-stat-label">Doanh thu:</span>
                  <span className="overview-stat-value">{weeklyStats.totalRevenue.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="overview-stat-item">
                  <span className="overview-stat-label">Khách hàng mới:</span>
                  <span className="overview-stat-value">{weeklyStats.newUsers || 0}</span>
                </div>
                <div className="overview-stat-item">
                  <span className="overview-stat-label">Sản phẩm đã bán:</span>
                  <span className="overview-stat-value">{weeklyStats.productsSold || 0}</span>
                </div>
              </div>
            ) : (
              <p className="overview-loading">Đang tải dữ liệu...</p>
            )}
          </div>

          {/* tháng */}
          <div className="overview-card monthly">
            <h3 className="overview-card-title">📆 Tháng này</h3>
            {monthlyStats ? (
              <div className="overview-stats">
                <div className="overview-stat-item">
                  <span className="overview-stat-label">Số đơn hàng:</span>
                  <span className="overview-stat-value">{monthlyStats.totalOrders}</span>
                </div>
                <div className="overview-stat-item">
                  <span className="overview-stat-label">Doanh thu:</span>
                  <span className="overview-stat-value">{monthlyStats.totalRevenue.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="overview-stat-item">
                  <span className="overview-stat-label">Khách hàng mới:</span>
                  <span className="overview-stat-value">{monthlyStats.newUsers || 0}</span>
                </div>
                <div className="overview-stat-item">
                  <span className="overview-stat-label">Sản phẩm đã bán:</span>
                  <span className="overview-stat-value">{monthlyStats.productsSold || 0}</span>
                </div>
              </div>
            ) : (
              <p className="overview-loading">Đang tải dữ liệu...</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminStats;
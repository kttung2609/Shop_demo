import React, { useEffect, useState } from "react";

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

  const [loading, setLoading] = useState(false);

  // 🔥 load ngày hôm nay
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    fetchDay(today);
  }, []);

  // ================= API =================

  const fetchDay = async (d) => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:4000/stats/day?date=${d}` // 🔥 FIX /api
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

  const fetchMonth = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:4000/stats/month?month=${month}&year=${year}`
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
        `http://localhost:4000/stats/year?year=${yearOnly}`
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

  // ================= UI =================

  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 Dashboard Thống Kê</h1>

      {/* chọn loại */}
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="day">Theo ngày</option>
        <option value="month">Theo tháng</option>
        <option value="year">Theo năm</option>
      </select>

      {loading && <p>⏳ Đang tải dữ liệu...</p>}

      {/* ================= DAY ================= */}
      {type === "day" && (
        <div>
          <h2>📅 Thống kê theo ngày</h2>

          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              fetchDay(e.target.value);
            }}
          />

          {dayData ? (
            <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
              <div style={{ padding: "20px", background: "#eee" }}>
                <h3>🛒 Số đơn</h3>
                <h2>{dayData.total_orders}</h2>
              </div>

              <div style={{ padding: "20px", background: "#eee" }}>
                <h3>💰 Doanh thu</h3>
                <h2>
                  {dayData.total_revenue?.toLocaleString("vi-VN") || 0} VND
                </h2>
              </div>
            </div>
          ) : (
            !loading && <p>Không có dữ liệu</p>
          )}
        </div>
      )}

      {/* ================= MONTH ================= */}
      {type === "month" && (
        <div>
          <h2>📆 Thống kê theo tháng</h2>

          <input
            type="number"
            placeholder="Tháng"
            onChange={(e) => setMonth(e.target.value)}
          />
          <input
            type="number"
            placeholder="Năm"
            onChange={(e) => setYear(e.target.value)}
          />

          <button onClick={fetchMonth}>Xem</button>

          {monthData.length > 0 ? (
            <table border="1" style={{ marginTop: "20px" }}>
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Số đơn</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {monthData.map((item, i) => (
                  <tr key={i}>
                    <td>{item.date}</td>
                    <td>{item.total_orders}</td>
                    <td>
                      {item.total_revenue?.toLocaleString("vi-VN")} VND
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !loading && <p>Không có dữ liệu</p>
          )}
        </div>
      )}

      {/* ================= YEAR ================= */}
      {type === "year" && (
        <div>
          <h2>📊 Thống kê theo năm</h2>

          <input
            type="number"
            placeholder="Năm"
            onChange={(e) => setYearOnly(e.target.value)}
          />

          <button onClick={fetchYear}>Xem</button>

          {yearData.length > 0 ? (
            <table border="1" style={{ marginTop: "20px" }}>
              <thead>
                <tr>
                  <th>Tháng</th>
                  <th>Số đơn</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {yearData.map((item, i) => (
                  <tr key={i}>
                    <td>{item.month}</td>
                    <td>{item.total_orders}</td>
                    <td>
                      {item.total_revenue?.toLocaleString("vi-VN")} VND
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !loading && <p>Không có dữ liệu</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminStats;
const express = require("express");
const router = express.Router();
const db = require("../db");


// ==============================
// 📊 1. Thống kê theo NGÀY (CHÍNH)
// ==============================
router.get("/day", (req, res) => {
  const { date } = req.query; // YYYY-MM-DD

  if (!date) {
    return res.json({ success: false, message: "Thiếu date" });
  }

  const sql = `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as total_orders,
      SUM(total_price) as total_revenue
    FROM orders
    WHERE DATE(created_at) = ?
    GROUP BY DATE(created_at)
  `;

  db.query(sql, [date], (err, results) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    res.json({
      success: true,
      data: results[0] || {
        date,
        total_orders: 0,
        total_revenue: 0
      }
    });
  });
});


// ==============================
// 📊 2. Thống kê theo THÁNG
// ==============================
router.get("/month", (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.json({ success: false, message: "Thiếu month hoặc year" });
  }

  const sql = `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as total_orders,
      SUM(total_price) as total_revenue
    FROM orders
    WHERE MONTH(created_at)=? AND YEAR(created_at)=?
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at)
  `;

  db.query(sql, [month, year], (err, results) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    res.json({ success: true, data: results });
  });
});


// ==============================
// 📊 3. Thống kê theo NĂM
// ==============================
router.get("/year", (req, res) => {
  const { year } = req.query;

  if (!year) {
    return res.json({ success: false, message: "Thiếu year" });
  }

  const sql = `
    SELECT 
      MONTH(created_at) as month,
      COUNT(*) as total_orders,
      SUM(total_price) as total_revenue
    FROM orders
    WHERE YEAR(created_at)=?
    GROUP BY MONTH(created_at)
    ORDER BY month
  `;

  db.query(sql, [year], (err, results) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    res.json({ success: true, data: results });
  });
});


// ==============================
// 📊 4. Tổng quan hôm nay (optional)
// ==============================
router.get("/today", (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) as total_orders,
      SUM(total_price) as total_revenue
    FROM orders
    WHERE DATE(created_at) = CURDATE()
  `;

  db.query(sql, (err, results) => {
    if (err) return res.json({ success: false });

    res.json({
      success: true,
      data: results[0]
    });
  });
});


module.exports = router;
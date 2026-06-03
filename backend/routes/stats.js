const express = require("express");
const router = express.Router();
const db = require("../db");



router.get("/day", (req, res) => {
  const { date } = req.query; 

  if (!date) {
    return res.json({ success: false, message: "Thiếu date" });
  }

  const sql = `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as total_orders,
      SUM(total) as total_revenue
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


router.get("/month", (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.json({ success: false, message: "Thiếu month hoặc year" });
  }

  const sql = `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as total_orders,
      SUM(total) as total_revenue
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


router.get("/year", (req, res) => {
  const { year } = req.query;

  if (!year) {
    return res.json({ success: false, message: "Thiếu year" });
  }

  const sql = `
    SELECT 
      MONTH(created_at) as month,
      COUNT(*) as total_orders,
      SUM(total) as total_revenue
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


router.get("/week", (req, res) => {
  const { date } = req.query; // YYYY-MM-DD

  if (!date) {
    return res.json({ success: false, message: "Thiếu date" });
  }

  const sql = `
    SELECT
      DATE(created_at) as date,
      COUNT(*) as total_orders,
      SUM(total) as total_revenue
    FROM orders
    WHERE YEARWEEK(created_at, 1) = YEARWEEK(?, 1)
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at)
  `;

  db.query(sql, [date], (err, results) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    res.json({ success: true, data: results });
  });
});


router.get("/today", (req, res) => {
  const sql = `
    SELECT
      COUNT(*) as total_orders,
      SUM(total) as total_revenue
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



router.get("/daily/day", (req, res) => {
  const { date } = req.query; 

  if (!date) {
    return res.json({ success: false, message: "Thiếu date" });
  }

  const sql = `
    SELECT 
      stat_date as date,
      total_revenue,
      total_orders,
      new_users,
      products_sold
    FROM daily_statistics
    WHERE stat_date = ?
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
        total_revenue: 0,
        new_users: 0,
        products_sold: 0
      }
    });
  });
});


router.get("/daily/month", (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.json({ success: false, message: "Thiếu month hoặc year" });
  }

  const sql = `
    SELECT
      stat_date as date,
      total_revenue,
      total_orders,
      new_users,
      products_sold
    FROM daily_statistics
    WHERE MONTH(stat_date) = ? AND YEAR(stat_date) = ?
    ORDER BY stat_date
  `;

  db.query(sql, [month, year], (err, results) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    res.json({ success: true, data: results });
  });
});

router.get("/daily/year", (req, res) => {
  const { year } = req.query;

  if (!year) {
    return res.json({ success: false, message: "Thiếu year" });
  }

  const sql = `
    SELECT
      MONTH(stat_date) as month,
      SUM(total_revenue) as total_revenue,
      SUM(total_orders) as total_orders,
      SUM(new_users) as new_users,
      SUM(products_sold) as products_sold
    FROM daily_statistics
    WHERE YEAR(stat_date) = ?
    GROUP BY MONTH(stat_date)
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

router.get("/daily/week", (req, res) => {
  const { date } = req.query; // YYYY-MM-DD

  if (!date) {
    return res.json({ success: false, message: "Thiếu date" });
  }

  const sql = `
    SELECT
      stat_date as date,
      total_revenue,
      total_orders,
      new_users,
      products_sold
    FROM daily_statistics
    WHERE YEARWEEK(stat_date, 1) = YEARWEEK(?, 1)
    ORDER BY stat_date
  `;

  db.query(sql, [date], (err, results) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    res.json({ success: true, data: results });
  });
});

router.get("/daily/current-week", (req, res) => {
  const sql = `
    SELECT
      SUM(total_orders) as totalOrders,
      SUM(total_revenue) as totalRevenue,
      SUM(new_users) as newUsers,
      SUM(products_sold) as productsSold
    FROM daily_statistics
    WHERE YEARWEEK(stat_date, 1) = YEARWEEK(CURDATE(), 1)
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    res.json({
      success: true,
      data: results[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        newUsers: 0,
        productsSold: 0
      }
    });
  });
});

router.get("/daily/current-month", (req, res) => {
  const sql = `
    SELECT
      SUM(total_orders) as totalOrders,
      SUM(total_revenue) as totalRevenue,
      SUM(new_users) as newUsers,
      SUM(products_sold) as productsSold
    FROM daily_statistics
    WHERE MONTH(stat_date) = MONTH(CURDATE()) 
      AND YEAR(stat_date) = YEAR(CURDATE())
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    res.json({
      success: true,
      data: results[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        newUsers: 0,
        productsSold: 0
      }
    });
  });
});

router.post("/daily/rebuild", (req, res) => {
  const sql = `
    INSERT INTO daily_statistics (stat_date, total_revenue, total_orders, new_users, products_sold)
    SELECT stat_date, SUM(total_revenue), SUM(total_orders), 0, SUM(products_sold)
    FROM (
      SELECT
        DATE(o.created_at) as stat_date,
        o.total as total_revenue,
        1 as total_orders,
        SUM(oi.quantity) as products_sold
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      GROUP BY o.id
    ) t
    GROUP BY stat_date
    ON DUPLICATE KEY UPDATE
      total_revenue = VALUES(total_revenue),
      total_orders = VALUES(total_orders),
      products_sold = VALUES(products_sold)
  `;

  db.query(sql, (err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, message: "Không thể rebuild daily_statistics" });
    }

    res.json({ success: true, message: "Đã rebuild daily_statistics từ orders" });
  });
});

module.exports = router;
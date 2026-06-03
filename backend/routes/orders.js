const express = require("express");
const router = express.Router();
const db = require("../db");

const modifyDailyStatistics = (statDate, revenueDelta, ordersDelta, productsDelta, callback) => {
  const sql = `
    INSERT INTO daily_statistics
      (stat_date, total_revenue, total_orders, new_users, products_sold)
    VALUES (?, ?, ?, 0, ?)
    ON DUPLICATE KEY UPDATE
      total_revenue = total_revenue + VALUES(total_revenue),
      total_orders = total_orders + VALUES(total_orders),
      products_sold = products_sold + VALUES(products_sold)
  `;

  db.query(sql, [statDate, revenueDelta, ordersDelta, productsDelta], callback);
};



router.post("/add", (req, res) => {

  const { user_id, items, name, phone, email, address, note, status = 'pending' } = req.body;

  if (!items || items.length === 0) {
    return res.json({ success: false, message: "Giỏ hàng trống" });
  }

  if (!name || !phone || !address) {
    return res.json({ success: false, message: "Thiếu thông tin khách hàng" });
  }

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const orderSql = `
    INSERT INTO orders 
    (user_id, total, status, name, phone, email, address, note)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    orderSql,
    [user_id, total, status, name, phone, email, address, note || null],
    (err, result) => {

      if (err) {
        console.log("ORDER ERROR:", err);
        return res.json({ success: false, message: err.message });
      }

      const orderId = result.insertId;

      const itemSql = `
        INSERT INTO order_items 
        (order_id, product_id, name, image, price, quantity)
        VALUES ?
      `;
      
      const values = items.map(item => [
        orderId,
        item.product_id, 
        item.name,
        item.image,
        item.price,
        item.quantity
      ]);
      db.query(itemSql, [values], (err2) => {

        if (err2) {
          console.log("ITEM ERROR:", err2);
          return res.json({ success: false, message: err2.message });
        }

        const totalProducts = items.reduce((sum, item) => sum + item.quantity, 0);
        const statDate = new Date().toISOString().split("T")[0];

        modifyDailyStatistics(statDate, total, 1, totalProducts, (statErr) => {
          if (statErr) {
            console.log("DAILY STAT ERROR:", statErr);
          }

          res.json({
            success: true,
            message: "Đặt hàng thành công",
            order_id: orderId
          });
        });

      });

    }
  );
});


router.get("/", (req, res) => {

  const sql = `
    SELECT 
      o.id,
      o.user_id,
      o.total,
      o.status,
      o.name,
      o.phone,
      o.email,
      o.address,
      o.note,
      o.created_at,

      oi.product_id,
      oi.name AS product_name,
      oi.image,
      oi.price,
      oi.quantity,

      c.name AS category

    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY o.id DESC
  `;

  db.query(sql, (err, results) => {

    if (err) {
      console.log(err);
      return res.json([]);
    }

    const orders = {};

    results.forEach(row => {

      if (!orders[row.id]) {
        orders[row.id] = {
          id: row.id,
          user_id: row.user_id,
          total: Number(row.total),
          status: row.status,
          name: row.name,
          phone: row.phone,
          email: row.email,
          address: row.address,
          note: row.note,
          created_at: row.created_at,
          items: []
        };
      }

      if (row.product_id !== null) {
        orders[row.id].items.push({
          product_id: row.product_id,
          name: row.product_name,
          image: row.image,
          price: row.price,
          quantity: row.quantity,
          category: row.category
        });
      }

    });

    res.json(Object.values(orders));

  });

});


router.put("/update/:id", (req, res) => {

  const { status } = req.body;

  db.query(
    "UPDATE orders SET status=? WHERE id=?",
    [status, req.params.id],
    (err) => {
      if (err) {
        console.log(err);
        return res.json({ success: false });
      }
      res.json({ success: true });
    }
  );

});


router.put("/cancel/:id", (req, res) => {

  const { note } = req.body;

  if (!note) {
    return res.json({ success: false, message: "Thiếu lý do huỷ" });
  }

  const orderId = req.params.id;

  db.query(
    "SELECT total, DATE(created_at) as stat_date FROM orders WHERE id = ?",
    [orderId],
    (err, orderResults) => {
      if (err) {
        console.log(err);
        return res.json({ success: false });
      }

      if (!orderResults.length) {
        return res.json({ success: false, message: "Không tìm thấy đơn hàng" });
      }

      const orderTotal = Number(orderResults[0].total) || 0;
      const statDate = orderResults[0].stat_date;

      db.query(
        "SELECT SUM(quantity) as products_sold FROM order_items WHERE order_id = ?",
        [orderId],
        (itemErr, itemResults) => {
          if (itemErr) {
            console.log(itemErr);
            return res.json({ success: false });
          }

          const productsSold = Number(itemResults[0]?.products_sold || 0);

          modifyDailyStatistics(statDate, -orderTotal, -1, -productsSold, (statErr) => {
            if (statErr) {
              console.log("DAILY STAT ERROR:", statErr);
            }

            db.query(
              "UPDATE orders SET status='cancelled', note=? WHERE id=?",
              [note, orderId],
              (updateErr) => {
                if (updateErr) {
                  console.log(updateErr);
                  return res.json({ success: false });
                }
                res.json({ success: true });
              }
            );
          });
        }
      );
    }
  );

});


module.exports = router;
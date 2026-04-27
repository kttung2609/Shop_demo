const express = require("express");
const router = express.Router();
const db = require("../db");


// ===== TẠO ĐƠN HÀNG =====
router.post("/add", (req, res) => {

  const { user_id, items, name, phone, email, address } = req.body;

  // ❗ validate
  if (!items || items.length === 0) {
    return res.json({ success: false, message: "Giỏ hàng trống" });
  }

  if (!name || !phone || !address) {
    return res.json({ success: false, message: "Thiếu thông tin khách hàng" });
  }

  // 🔥 tính total backend
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const orderSql = `
    INSERT INTO orders 
    (user_id, total, status, name, phone, email, address)
    VALUES (?, ?, 'pending', ?, ?, ?, ?)
  `;

  db.query(
    orderSql,
    [user_id, total, name, phone, email, address],
    (err, result) => {

      if (err) {
        console.log("ORDER ERROR:", err);
        return res.json({ success: false, message: err.message });
      }

      const orderId = result.insertId;

      // 🔥 insert order_items (KHÔNG có category)
      const itemSql = `
        INSERT INTO order_items 
        (order_id, product_id, name, image, price, quantity)
        VALUES ?
      `;
      
      const values = items.map(item => [
        orderId,
        item.product_id,   // ❗ chỉ dùng 1 key
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

        res.json({
          success: true,
          message: "Đặt hàng thành công",
          order_id: orderId
        });

      });

    }
  );
});


// ===== LẤY DANH SÁCH ORDER (CÓ CATEGORY) =====
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


// ===== UPDATE STATUS =====
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


// ===== HUỶ ĐƠN =====
router.put("/cancel/:id", (req, res) => {

  const { note } = req.body;

  if (!note) {
    return res.json({ success: false, message: "Thiếu lý do huỷ" });
  }

  db.query(
    "UPDATE orders SET status='cancelled', note=? WHERE id=?",
    [note, req.params.id],
    (err) => {
      if (err) {
        console.log(err);
        return res.json({ success: false });
      }
      res.json({ success: true });
      
    }
  );

});


module.exports = router;
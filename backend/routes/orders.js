const express = require("express");
const router = express.Router();
const db = require("../db");
const { promisify } = require("util");
const { verifyUser } = require("./auth");

const query = promisify(db.query).bind(db);
const beginTransaction = promisify(db.beginTransaction).bind(db);
const commit = promisify(db.commit).bind(db);
const rollback = promisify(db.rollback).bind(db);

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
  (async () => {
    const { user_id, items, name, phone, email, address, note, status = "pending" } = req.body;
    const normalizedPhone = typeof phone === "string" ? phone.trim() : "";
    const normalizedName = typeof name === "string" ? name.trim() : "";
    const normalizedAddress = typeof address === "string" ? address.trim() : "";

    if (!items || items.length === 0) {
      return res.json({ success: false, message: "Giỏ hàng trống" });
    }

    if (!normalizedName || !normalizedAddress) {
      return res.json({ success: false, message: "Thiếu thông tin khách hàng" });
    }

    const normalizedItems = items
      .map((item) => ({
        product_id: Number(item.product_id),
        name: item.name,
        image: item.image,
        price: Number(item.price),
        quantity: Number(item.quantity),
      }))
      .filter((item) => item.product_id && item.quantity > 0);

    if (normalizedItems.length === 0) {
      return res.json({ success: false, message: "Dữ liệu sản phẩm không hợp lệ" });
    }

    const productMap = new Map();
    for (const item of normalizedItems) {
      productMap.set(item.product_id, (productMap.get(item.product_id) || 0) + item.quantity);
    }

    const productIds = Array.from(productMap.keys());
    const total = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await beginTransaction();

    try {
      const products = await query(
        "SELECT id, quantity, stock FROM products WHERE id IN (?) FOR UPDATE",
        [productIds]
      );

      if (products.length !== productIds.length) {
        throw new Error("Có sản phẩm không tồn tại trong hệ thống");
      }

      for (const product of products) {
        const orderedQuantity = productMap.get(product.id) || 0;
        const availableQuantity = Number(product.quantity ?? product.stock ?? 0);

        if (availableQuantity < orderedQuantity) {
          throw new Error(`Sản phẩm ID ${product.id} không đủ hàng`);
        }
      }

      const orderResult = await query(
        `
          INSERT INTO orders 
          (user_id, total, status, name, phone, email, address, note)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [user_id, total, status, normalizedName, normalizedPhone || null, email, normalizedAddress, note || null]
      );

      const orderId = orderResult.insertId;
      const itemSql = `
        INSERT INTO order_items 
        (order_id, product_id, name, image, price, quantity)
        VALUES ?
      `;

      const values = normalizedItems.map((item) => [
        orderId,
        item.product_id,
        item.name,
        item.image,
        item.price,
        item.quantity,
      ]);

      await query(itemSql, [values]);

      for (const [productId, orderedQuantity] of productMap.entries()) {
        await query(
          "UPDATE products SET quantity = quantity - ?, stock = stock - ? WHERE id = ?",
          [orderedQuantity, orderedQuantity, productId]
        );
      }

      await commit();

      const totalProducts = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);
      const statDate = new Date().toISOString().split("T")[0];

      modifyDailyStatistics(statDate, total, 1, totalProducts, (statErr) => {
        if (statErr) {
          console.log("DAILY STAT ERROR:", statErr);
        }
      });

      return res.json({
        success: true,
        message: "Đặt hàng thành công",
        order_id: orderId,
      });
    } catch (error) {
      await rollback();
      console.log("ORDER CREATE ERROR:", error);
      return res.json({ success: false, message: error.message || "Đặt hàng thất bại" });
    }
  })().catch((error) => {
    console.log("ORDER ROUTE ERROR:", error);
    res.json({ success: false, message: "Đặt hàng thất bại" });
  });
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

router.get("/user", verifyUser, (req, res) => {

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
    WHERE o.user_id = ?
    ORDER BY o.id DESC
  `;

  db.query(sql, [req.user.id], (err, results) => {

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
  (async () => {
    const { note } = req.body;

    if (!note) {
      return res.json({ success: false, message: "Thiếu lý do huỷ" });
    }

    const orderId = req.params.id;

    await beginTransaction();

    try {
      const orderRows = await query(
        "SELECT id, status, total, DATE(created_at) as stat_date FROM orders WHERE id = ? FOR UPDATE",
        [orderId]
      );

      if (!orderRows.length) {
        throw new Error("Không tìm thấy đơn hàng");
      }

      const order = orderRows[0];
      const currentStatus = (order.status || "").toLowerCase();

      if (currentStatus === "cancelled") {
        await rollback();
        return res.json({ success: true, message: "Đơn hàng đã được huỷ trước đó" });
      }

      if (currentStatus === "shipping") {
        throw new Error("Đơn đang giao không thể huỷ");
      }

      const orderItems = await query(
        "SELECT product_id, quantity FROM order_items WHERE order_id = ? FOR UPDATE",
        [orderId]
      );

      if (orderItems.length > 0) {
        for (const item of orderItems) {
          await query(
            "UPDATE products SET quantity = quantity + ?, stock = stock + ? WHERE id = ?",
            [Number(item.quantity) || 0, Number(item.quantity) || 0, item.product_id]
          );
        }
      }

      await query(
        "UPDATE orders SET status='cancelled', note=? WHERE id=?",
        [note, orderId]
      );

      await commit();

      const orderTotal = Number(order.total) || 0;
      const productsSold = orderItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
      const statDate = order.stat_date;

      modifyDailyStatistics(statDate, -orderTotal, -1, -productsSold, (statErr) => {
        if (statErr) {
          console.log("DAILY STAT ERROR:", statErr);
        }
      });

      return res.json({ success: true });
    } catch (error) {
      await rollback();
      console.log("ORDER CANCEL ERROR:", error);
      return res.json({ success: false, message: error.message || "Huỷ đơn thất bại" });
    }
  })().catch((error) => {
    console.log("ORDER CANCEL ROUTE ERROR:", error);
    res.json({ success: false, message: "Huỷ đơn thất bại" });
  });

});


module.exports = router;
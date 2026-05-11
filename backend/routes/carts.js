const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyUser, verifyAdmin } = require("./auth"); // Import đúng tên đã export từ auth.js

//
// ================= CART API =================
//

// 🛒 ADD (Sửa verifyToken thành verifyUser)
router.post("/add", verifyUser, (req, res) => {
  const userID = req.user.id;
  const { productID, quantity = 1 } = req.body;

  const sql = `
    INSERT INTO cart_items (userID, productID, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
  `;

  db.query(sql, [userID, productID, quantity], (err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }
    res.json({ success: true });
  });
});


// 📦 GET CART (USER)
router.get("/", verifyUser, (req, res) => {
  const userID = req.user.id;

  const sql = `
    SELECT 
      c.productID,
      c.quantity,
      p.name,
      p.new_price,
      p.images
    FROM cart_items c
    JOIN products p ON c.productID = p.id
    WHERE c.userID=?
  `;

  db.query(sql, [userID], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
    res.json(results);
  });
});


// 🔼 INCREASE
router.put("/increase", verifyUser, (req, res) => {
  const userID = req.user.id;
  const { productID } = req.body;

  const sql = `
    UPDATE cart_items 
    SET quantity = quantity + 1
    WHERE userID=? AND productID=?
  `;

  db.query(sql, [userID, productID], (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});


// 🔽 DECREASE
router.put("/decrease", verifyUser, (req, res) => {
  const userID = req.user.id;
  const { productID } = req.body;

  const sql = `
    UPDATE cart_items 
    SET quantity = quantity - 1
    WHERE userID=? AND productID=? AND quantity > 1
  `;

  db.query(sql, [userID, productID], (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});


// ❌ DELETE ITEM
router.delete("/delete", verifyUser, (req, res) => {
  const userID = req.user.id;
  const { productID } = req.body;

  const sql = `
    DELETE FROM cart_items 
    WHERE userID=? AND productID=?
  `;

  db.query(sql, [userID, productID], (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});


// 🧹 CLEAR CART
router.delete("/clear", verifyUser, (req, res) => {
  const userID = req.user.id; 

  db.query("DELETE FROM cart_items WHERE userID=?", [userID], (err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }
    res.json({ success: true, message: "Giỏ hàng đã được xóa sạch" });
  });
});


// 👑 ADMIN: xem toàn bộ cart của hệ thống
router.get("/all", verifyAdmin, (req, res) => {
  const sql = `
    SELECT 
      c.userID,
      c.productID,
      c.quantity,
      p.name,
      p.new_price,
      p.images
    FROM cart_items c
    JOIN products p ON c.productID = p.id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.json([]);
    res.json(results);
  });
});

module.exports = router;
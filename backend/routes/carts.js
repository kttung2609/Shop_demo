const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET = "SECRET_KEY";

//
// ===== VERIFY TOKEN =====
//
const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // { id, role }

    next();
  } catch (err) {
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
};

//
// ===== VERIFY ADMIN =====
//
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền admin" });
    }
    next();
  });
};

//
// ================= CART API =================
//

// 🛒 ADD
router.post("/add", verifyToken, (req, res) => {
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
router.get("/", verifyToken, (req, res) => {
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
router.put("/increase", verifyToken, (req, res) => {
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
router.put("/decrease", verifyToken, (req, res) => {
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
router.delete("/delete", verifyToken, (req, res) => {
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
router.delete("/clear", verifyToken, (req, res) => {
  const userID = req.user.id; // Lấy từ verifyToken middleware

  db.query("DELETE FROM cart_items WHERE userID=?", [userID], (err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }
    res.json({ success: true, message: "Giỏ hàng đã được xóa sạch" });
  });
});


// 👑 ADMIN: xem toàn bộ cart
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
const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyUser, verifyAdmin } = require("./auth");

router.post("/add", verifyUser, (req, res) => {
  const userID = req.user.id;
  const { productID, quantity = 1 } = req.body;
  const sql = `INSERT INTO cart_items (userID, productID, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`;
  db.query(sql, [userID, productID, quantity], (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});

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
    WHERE c.userID = ?
  `;

  db.query(sql, [userID], (err, results) => {
    if (err) {
      console.error("Lỗi lấy giỏ hàng:", err);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }
    res.json(results);
  });
});

router.put("/increase", verifyUser, (req, res) => {
  const userID = req.user.id;
  const { productID } = req.body;
  db.query("UPDATE cart_items SET quantity = quantity + 1 WHERE userID=? AND productID=?", [userID, productID], (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});

router.put("/decrease", verifyUser, (req, res) => {
  const userID = req.user.id;
  const { productID } = req.body;
  db.query("UPDATE cart_items SET quantity = quantity - 1 WHERE userID=? AND productID=? AND quantity > 1", [userID, productID], (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});

router.delete("/delete", verifyUser, (req, res) => {
  const userID = req.user.id;
  const productID = req.body.productID || req.query.productID;
  if (!productID) return res.status(400).json({ success: false, message: "Missing productID" });

  db.query("DELETE FROM cart_items WHERE userID=? AND productID=?", [userID, productID], (err, result) => {
    if (err) {
      console.error("Lỗi xóa sản phẩm user cart:", err);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    res.json({ success: true });
  });
});

router.delete("/clear", verifyUser, (req, res) => {
  const userID = req.user.id;
  db.query("DELETE FROM cart_items WHERE userID=?", [userID], (err) => {
    if (err) {
      console.error("Lỗi xóa giỏ hàng user:", err);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }
    res.json({ success: true, message: "Giỏ hàng đã được xóa" });
  });
});

router.get("/all", verifyAdmin, (req, res) => {
  const sql = `SELECT c.userID, c.productID, c.quantity, p.name, p.new_price, p.images FROM cart_items c JOIN products p ON c.productID = p.id`;
  db.query(sql, (err, results) => {
    if (err) return res.json([]);
    res.json(results);
  });
});


router.post("/admin/add", verifyAdmin, (req, res) => {
  const userID = req.user.id;
  const { productID, quantity = 1 } = req.body;
  const sql = `INSERT INTO cart_items (userID, productID, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`;
  db.query(sql, [userID, productID, quantity], (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});

router.get("/admin", verifyAdmin, (req, res) => {
  const userID = req.user.id;
  const sql = `SELECT c.userID, c.productID, c.quantity, p.name, p.new_price, p.images FROM cart_items c JOIN products p ON c.productID = p.id WHERE c.userID=?`;
  db.query(sql, [userID], (err, results) => {
    if (err) return res.status(500).json([]);
    res.json(results);
  });
});

router.delete("/admin/clear", verifyAdmin, (req, res) => {
  const userID = req.user.id;
  db.query("DELETE FROM cart_items WHERE userID=?", [userID], (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true, message: "Admin cart cleared" });
  });
});

router.put("/admin/increase", verifyAdmin, (req, res) => {
  const { userID, productID } = req.body;
  db.query("UPDATE cart_items SET quantity = quantity + 1 WHERE userID=? AND productID=?", [userID, productID], (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});

router.put("/admin/decrease", verifyAdmin, (req, res) => {
  const { userID, productID } = req.body;
  db.query("UPDATE cart_items SET quantity = quantity - 1 WHERE userID=? AND productID=? AND quantity > 1", [userID, productID], (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});

router.delete("/admin/delete", verifyAdmin, (req, res) => {
  const userID = req.user.id;
  const productID = req.query.productID || req.body.productID;
  if (!productID) return res.status(400).json({ success: false, message: "Missing productID" });

  db.query("DELETE FROM cart_items WHERE userID=? AND productID=?", [userID, productID], (err, result) => {
    if (err) {
      console.error("Lỗi xóa sản phẩm admin cart:", err);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    res.json({ success: true });
  });
});

module.exports = router;
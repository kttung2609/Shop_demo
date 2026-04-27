const express = require("express");
const router = express.Router();
const db = require("../db");

// 🛒 Thêm vào giỏ hàng
router.post("/add", (req, res) => {
  const { userID, productID, quantity = 1 } = req.body;

  if (!userID || !productID) {
    return res.json({ success: false, message: "Thiếu dữ liệu" });
  }

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

    res.json({
      success: true,
      message: "Đã thêm vào giỏ hàng",
    });
  });
});

router.get("/:userID", (req, res) => {
  const userID = req.params.userID;

  const sql = `
    SELECT 
      c.productID,
      c.quantity,
      p.name,
      p.old_price,
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
    console.log(results);
    res.json(results);
  });
});


/// 🔼 3. Tăng số lượng
router.put("/increase", (req, res) => {
  const { userID, productID } = req.body;

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


/// 🔽 4. Giảm số lượng
router.put("/decrease", (req, res) => {
  const { userID, productID } = req.body;

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


/// ❌ 5. Xoá sản phẩm
  router.delete("/delete", (req, res) => {
    const { userID, productID } = req.body;

    if (!userID || !productID) {
      return res.json({ success: false, message: "Thiếu dữ liệu" });
    }

    const sql = `
      DELETE FROM cart_items 
      WHERE userID=? AND productID=?
    `;

    db.query(sql, [userID, productID], (err) => {
      if (err) {
        console.log(err);
        return res.json({ success: false });
      }

      res.json({ success: true });
    });
  });

  // 🧹 6. Xoá toàn bộ giỏ hàng của user
  router.delete("/clear/:userID", (req, res) => {
    const userID = req.params.userID;

    if (!userID) {
      return res.json({ success: false, message: "Thiếu userID" });
    }

    const sql = `
      DELETE FROM cart_items 
      WHERE userID=?
    `;

    db.query(sql, [userID], (err) => {
      if (err) {
        console.log(err);
        return res.json({ success: false });
      }

      res.json({ success: true, message: "Đã xoá toàn bộ giỏ hàng" });
    });
  });

  module.exports = router;
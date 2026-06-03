const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyAdmin, verifyUser } = require("./auth"); 

router.post("/add", verifyUser, (req, res) => {
  const userID = req.user.id;
  const { productID, orderID, rating, comment } = req.body;

  if (!productID || !orderID || !rating) {
    return res.status(400).json({ success: false, message: "Thiếu thông tin đánh giá" });
  }

  const checkSql = "SELECT id FROM reviews WHERE user_id = ? AND order_id = ? AND product_id = ?";
  db.query(checkSql, [userID, orderID, productID], (err, results) => {
    if (err) return res.status(500).json({ success: false });
    
    if (results.length > 0) {
      return res.json({ success: false, message: "Bạn đã đánh giá sản phẩm này rồi!" });
    }

    const sql = "INSERT INTO reviews (user_id, product_id, order_id, rating, comment) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [userID, productID, orderID, rating, comment], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ success: false });
      }
      res.json({ success: true, message: "Đánh giá thành công!" });
    });
  });
});


router.get("/product/:id", (req, res) => {
    const sql = `
      SELECT r.*, u.name as userName, u.avatar as userAvatar 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.product_id = ? 
      ORDER BY r.created_at DESC`;
      
    db.query(sql, [req.params.id], (err, results) => {
      if (err) return res.json([]);
      res.json(results);
    });
});

router.post("/reply/:reviewId", verifyAdmin, (req, res) => {
  const { reply } = req.body;
  const reviewId = req.params.reviewId;

  const sql = "UPDATE reviews SET reply = ?, replied_at = NOW() WHERE id = ?";
  db.query(sql, [reply, reviewId], (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true, message: "Đã gửi phản hồi!" });
  });
});

module.exports = router; 
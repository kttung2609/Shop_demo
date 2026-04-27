const express = require("express");
const router = express.Router();
const db = require("../db");


// ===== GET ALL CATEGORIES =====
router.get("/", (req, res) => {
  const sql = "SELECT * FROM categories ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    res.json(result);
  });
});


// ===== ADD CATEGORY =====
router.post("/add", (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.json({
      success: false,
      message: "Tên category không được để trống",
    });
  }

  // 👉 fix lỗi bạn viết sai: replace (không phải reqlace)
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  const sql = "INSERT INTO categories (name, slug) VALUES (?, ?)";

  db.query(sql, [name, slug], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    res.json({
      success: true,
      category: {
        id: result.insertId,
        name,
        slug,
      },
    });
  });
});


// ===== UPDATE CATEGORY =====
router.put("/update/:id", (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.json({
      success: false,
      message: "Tên category không hợp lệ",
    });
  }

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  const sql = "UPDATE categories SET name=?, slug=? WHERE id=?";

  db.query(sql, [name, slug, id], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    res.json({
      success: true,
      message: "Cập nhật thành công",
    });
  });
});


// ===== DELETE CATEGORY =====
router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM categories WHERE id=?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    res.json({
      success: true,
      message: "Xóa thành công",
    });
  });
});


module.exports = router;
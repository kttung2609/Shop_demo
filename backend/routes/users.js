const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const fs = require("fs");

// ===== TẠO FOLDER =====
if (!fs.existsSync("uploads/avatars")) {
  fs.mkdirSync("uploads/avatars", { recursive: true });
}

// ===== CONFIG UPLOAD =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ===== GET USERS =====
router.get("/", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.json({ success: false });
    res.json(result);
  });
});

// ===== UPLOAD AVATAR =====
router.post("/upload-avatar", upload.single("avatar"), (req, res) => {
  res.json({
    success: true,
    filename: req.file.filename
  });
});

// ===== ADD USER =====
router.post("/add", (req, res) => {
  const { name, email, password, avatar, role } = req.body;

  const sql = `
    INSERT INTO users (name, email, password, avatar, role)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, email, password, avatar, role], (err, result) => {
    if (err) return res.json({ success: false });

    res.json({
      success: true,
      user: {
        id: result.insertId,
        name,
        email,
        avatar,
        role
      }
    });
  });
});

// ===== UPDATE USER =====
router.put("/update/:id", (req, res) => {
  const { name, email, avatar, role } = req.body;
  const id = req.params.id;

  const sql = `
    UPDATE users 
    SET name=?, email=?, avatar=?, role=? 
    WHERE id=?
  `;

  db.query(sql, [name, email, avatar, role, id], (err) => {
    if (err) return res.json({ success: false });

    res.json({ success: true });
  });
});

// ===== DELETE =====
router.delete("/delete/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id=?", [req.params.id], (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});

module.exports = router;
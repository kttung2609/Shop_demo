const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ===== ĐĂNG KÝ =====
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const jwt = require("jsonwebtoken");
  try {
    const hash = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')";

    db.query(sql, [name, email, hash], (err) => {
      if (err) {
        return res.json({
          success: false,
          message: "Email đã tồn tại",
        });
      }

      res.json({
        success: true,
        message: "Đăng ký thành công",
      });
    });
  } catch (err) {
    res.json({ success: false });
  }
});


// ===== ĐĂNG NHẬP (CHUNG CHO ADMIN + USER) =====
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=?";
  db.query(sql, [email], async (err, result) => {
    if (err) return res.json({ success: false });

    if (result.length === 0) {
      return res.json({
        success: false,
        message: "Sai email hoặc mật khẩu",
      });
    }

    const user = result[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({
        success: false,
        message: "Sai email hoặc mật khẩu",
      });
    }
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role.trim().toLowerCase(),
      },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role.trim().toLowerCase(),
      },
    });
  });
});
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(403).json({ message: "No token" });

  jwt.verify(token, "SECRET_KEY", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    req.user = decoded;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Bạn không có quyền" });
  }
  next();
};

module.exports = router;
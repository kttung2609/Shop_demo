const express = require("express");
const router = express.Router();
const db = require("../db");


// ===== ĐĂNG KÝ =====
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  // mặc định role = user
  const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')";

  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.log(err);
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
});


// ===== ĐĂNG NHẬP (CHUNG CHO ADMIN + USER) =====
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=? LIMIT 1";
  debugger
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    if (result.length === 0) {
      return res.json({
        success: false,
        message: "Sai email hoặc mật khẩu",
      });
    }

    const user = result[0];

    // 🔥 check password riêng
    if (user.password !== password) {
      return res.json({
        success: false,
        message: "Sai email hoặc mật khẩu",
      });
    }

    let redirect = "";

    if (user.role === "admin") {
      redirect = "http://localhost:5173";
    } else {
      redirect = "http://localhost:5174";
    }

    // return res.json({
    //   success: true,
    //   user,
    //   role: user.role,
    //   redirect,
    // });
    console.log("123");
    
    return res.json({
        success: true,
        message: "tung",
      });
  });
});


module.exports = router;
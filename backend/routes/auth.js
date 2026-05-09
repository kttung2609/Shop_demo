const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET = "SECRET_KEY";

//
// ================= SIGNUP =================
//
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  const sql = `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, 'user')
  `;

  db.query(sql, [name, email, password], (err) => {
    if (err) {
      return res.json({ success: false, message: "Email đã tồn tại" });
    }
    res.json({ success: true });
  });
});

//
// ================= LOGIN =================
//
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    (err, results) => {
      if (err || results.length === 0) {
        return res.json({ success: false, message: "Sai email" });
      }

      const user = results[0];

      // 👉 SO SÁNH TRỰC TIẾP
      if (password !== user.password) {
        return res.json({ success: false, message: "Sai mật khẩu" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
      });

      res.json({
        success: true,
        role: user.role,
      });
    }
  );
});

//
// ================= LOGOUT =================
//
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

//
// ================= GET CURRENT USER =================
//
router.get("/me", (req, res) => {
  const token = req.cookies?.token;

  if (!token) return res.status(401).json(null);

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json(null);

    // Lấy thêm name và avatar từ DB
    db.query("SELECT id, name, email, role, avatar FROM users WHERE id = ?", [decoded.id], (err, results) => {
      if (err || results.length === 0) return res.status(404).json(null);
      
      const user = results[0];
      res.json(user); // Trả về đầy đủ thông tin
    });
  });
});


//
// ================= MIDDLEWARE =================
//

// 👉 user đăng nhập là được
const verifyUser = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) return res.status(401).json({ message: "No token" });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = decoded;
    next();
  });
};

// 👉 chỉ admin
const verifyAdmin = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) return res.status(401).json({ message: "No token" });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err || decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded;
    next();
  });
};

//
// ================= EXPORT =================
//
module.exports = router;
module.exports.verifyUser = verifyUser;
module.exports.verifyAdmin = verifyAdmin;
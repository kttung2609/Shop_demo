const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET = "SECRET_KEY";

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email=?", [email], (err, results) => {
    if (err || results.length === 0) return res.json({ success: false, message: "Email không tồn tại" });
    const user = results[0];
    if (password !== user.password) return res.json({ success: false, message: "Sai mật khẩu" });

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "7d" });
    const cookieName = user.role === "admin" ? "admin_token" : "token";
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction ? true : false,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    };

    res.cookie(cookieName, token, cookieOptions);
    res.json({ success: true, role: user.role });
  });
});

router.get("/me", (req, res) => {
  const role = req.query.role;
  const token = role === "admin" ? req.cookies?.admin_token : req.cookies?.token;
  if (!token) return res.status(401).json(null);
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err || decoded.role !== role) return res.status(403).json(null);
    db.query("SELECT id, name, email, role, avatar FROM users WHERE id = ?", [decoded.id], (err, results) => {
      res.json(results[0]);
    });
  });
});

router.get("/me/user", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json(null);
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err || decoded.role !== "user") return res.status(403).json(null);
    db.query("SELECT id, name, email, role, avatar FROM users WHERE id = ?", [decoded.id], (err, results) => {
      res.json(results[0]);
    });
  });
});

router.get("/me/admin", (req, res) => {
  const token = req.cookies?.admin_token;
  if (!token) return res.status(401).json(null);
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err || decoded.role !== "admin") return res.status(403).json(null);
    db.query("SELECT id, name, email, role, avatar FROM users WHERE id = ?", [decoded.id], (err, results) => {
      res.json(results[0]);
    });
  });
});

const isProduction = process.env.NODE_ENV === "production";
const clearCookieOptions = {
  path: "/",
  httpOnly: true,
  secure: isProduction ? true : false,
  sameSite: isProduction ? "none" : "lax",
};

router.post("/logout", (req, res) => {
  res.clearCookie("token", clearCookieOptions);
  res.clearCookie("admin_token", clearCookieOptions);
  res.json({ success: true });
});
router.post("/logout/user", (req, res) => {
  res.clearCookie("token", clearCookieOptions);
  res.json({ success: true });
});
router.post("/logout/admin", (req, res) => {
  res.clearCookie("admin_token", clearCookieOptions);
  res.json({ success: true });
});

const verifyUser = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err || decoded.role !== "user") return res.status(403).json({ message: "Forbidden" });
    req.user = decoded;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  const token = req.cookies?.admin_token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err || decoded.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    req.user = decoded;
    next();
  });
};

module.exports = router;
module.exports.verifyUser = verifyUser;
module.exports.verifyAdmin = verifyAdmin;
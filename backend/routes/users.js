const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const fs = require("fs");
const bcrypt = require("bcrypt");

if (!fs.existsSync("uploads/avatars")) {
  fs.mkdirSync("uploads/avatars", { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

const hashPassword = async (password) => {
  if (!password) return null;
  if (typeof password === "string" && password.startsWith("$2")) {
    return password;
  }
  return bcrypt.hash(password, 10);
};

router.get("/", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.json({ success: false });
    res.json(result);
  });
});

router.post("/upload-avatar", upload.single("avatar"), (req, res) => {
  res.json({
    success: true,
    filename: req.file.filename
  });
});

router.post("/add", async (req, res) => {
  const { name, email, password, avatar } = req.body;

  if (!password) {
    return res.json({ success: false, message: "Mật khẩu là bắt buộc" });
  }

  try {
    const hashedPassword = await hashPassword(password);
    const sql = `
      INSERT INTO users (name, email, password, avatar, role, email_verified, email_verified_at)
      VALUES (?, ?, ?, ?, ?, 1, NOW())
    `;

    db.query(sql, [name, email, hashedPassword, avatar, "user"], (err, result) => {
      if (err) return res.json({ success: false });

      res.json({
        success: true,
        user: {
          id: result.insertId,
          name,
          email,
          avatar,
          role: "user"
        }
      });
    });
  } catch (error) {
    res.json({ success: false, message: "Không thể tạo tài khoản" });
  }
});

router.put("/update/:id", async (req, res) => {
  const { name, email, phone, avatar, password } = req.body;
  const id = req.params.id;

  try {
    const updates = [];
    const values = [];

    if (typeof name !== "undefined") {
      updates.push("name=?");
      values.push(name);
    }

    if (typeof email !== "undefined") {
      updates.push("email=?");
      values.push(email);
      updates.push("email_verified=0");
      updates.push("email_verified_at=NULL");
      updates.push("email_verification_token=NULL");
      updates.push("email_verification_expires=NULL");
    }

    if (typeof phone !== "undefined") {
      updates.push("phone=?");
      values.push(phone);
    }

    if (typeof avatar !== "undefined") {
      updates.push("avatar=?");
      values.push(avatar);
    }

    if (typeof password === "string" && password.trim()) {
      const hashedPassword = await hashPassword(password.trim());
      updates.push("password=?");
      values.push(hashedPassword);
    }

    if (!updates.length) {
      return res.json({ success: false, message: "Không có dữ liệu cập nhật" });
    }

    const sql = `
      UPDATE users 
      SET ${updates.join(", ")}
      WHERE id=?
    `;

    values.push(id);

    db.query(sql, values, (err) => {
      if (err) return res.json({ success: false });

      res.json({ success: true });
    });
  } catch (error) {
    res.json({ success: false, message: "Không thể cập nhật thành viên" });
  }
});

router.delete("/delete/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id=?", [req.params.id], (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});

module.exports = router;
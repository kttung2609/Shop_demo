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
    db.query("SELECT id, name, email, phone, avatar, role FROM users WHERE id=? LIMIT 1", [id], async (lookupErr, rows) => {
      if (lookupErr) {
        console.log(lookupErr);
        return res.status(500).json({ success: false, message: "Không thể tải dữ liệu người dùng" });
      }

      if (!rows || rows.length === 0) {
        return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
      }

      const currentUser = rows[0];
      const updates = [];
      const values = [];
      const nextName = typeof name === "string" ? name.trim() : undefined;
      const nextEmail = typeof email === "string" ? email.trim().toLowerCase() : undefined;
      const nextPhone = typeof phone === "string" ? phone.trim() : undefined;
      const nextAvatar = typeof avatar === "string" ? avatar.trim() : undefined;

      if (typeof nextName === "string" && nextName !== currentUser.name) {
        updates.push("name=?");
        values.push(nextName);
      }

      if (typeof nextEmail === "string" && nextEmail !== (currentUser.email || "").trim().toLowerCase()) {
        updates.push("email=?");
        values.push(nextEmail);

        if (currentUser.role !== "admin") {
          updates.push("email_verified=0");
          updates.push("email_verified_at=NULL");
          updates.push("email_verification_token=NULL");
          updates.push("email_verification_expires=NULL");
        }
      }

      if (typeof nextPhone === "string" && nextPhone !== (currentUser.phone || "").trim()) {
        updates.push("phone=?");
        values.push(nextPhone);
      }

      if (typeof nextAvatar === "string" && nextAvatar !== (currentUser.avatar || "").trim()) {
        updates.push("avatar=?");
        values.push(nextAvatar);
      }

      if (typeof password === "string" && password.trim()) {
        const hashedPassword = await hashPassword(password.trim());
        updates.push("password=?");
        values.push(hashedPassword);
      }

      if (!updates.length) {
        return res.json({ success: true, message: "Không có thay đổi để cập nhật" });
      }

      const sql = `
        UPDATE users
        SET ${updates.join(", ")}
        WHERE id=?
      `;

      values.push(id);

      db.query(sql, values, (err) => {
        if (err) {
          console.log("Update user failed:", err);
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ success: false, message: "Email này đã tồn tại" });
          }

          return res.status(500).json({ success: false, message: err.message || "Không thể cập nhật thành viên" });
        }

        res.json({ success: true });
      });
    });
  } catch (error) {
    console.log("Update user exception:", error);
    res.status(500).json({ success: false, message: error.message || "Không thể cập nhật thành viên" });
  }
});

router.delete("/delete/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id=?", [req.params.id], (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});

module.exports = router;
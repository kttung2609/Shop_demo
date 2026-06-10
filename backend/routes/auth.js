const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SECRET = "SECRET_KEY";

const isHashedPassword = (value) => typeof value === "string" && value.startsWith("$2");

const verifyPassword = async (plainPassword, storedPassword) => {
  if (isHashedPassword(storedPassword)) {
    return bcrypt.compare(plainPassword, storedPassword);
  }

  return plainPassword === storedPassword;
};

router.post("/signup", async (req, res) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body.password === "string" ? req.body.password.trim() : "";

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ họ tên, email và mật khẩu" });
  }

  db.query("SELECT id FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: "Không thể kiểm tra tài khoản" });
    }

    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "Email này đã được đăng ký" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')",
        [name, email, hashedPassword],
        (insertErr, result) => {
          if (insertErr) {
            console.log(insertErr);
            return res.status(500).json({ success: false, message: "Không thể tạo tài khoản" });
          }

          return res.json({
            success: true,
            message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
            user: {
              id: result.insertId,
              name,
              email,
              role: "user",
            },
          });
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Không thể tạo tài khoản" });
    }
  });
});

router.post("/login", (req, res) => {
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body.password === "string" ? req.body.password.trim() : "";

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ email và mật khẩu" });
  }

  db.query("SELECT * FROM users WHERE LOWER(TRIM(email)) = ? LIMIT 1", [email], (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ success: false, message: "Email không tồn tại" });
    const user = results[0];

    verifyPassword(password, user.password)
      .then((match) => {
        if (!match) return res.status(401).json({ success: false, message: "Sai mật khẩu" });

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
      })
      .catch(() => res.status(500).json({ success: false, message: "Không thể xác thực tài khoản" }));
  });
});

router.get("/me", (req, res) => {
  const role = req.query.role;
  const token = role === "admin" ? req.cookies?.admin_token : req.cookies?.token;
  if (!token) return res.status(401).json(null);
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err || decoded.role !== role) return res.status(403).json(null);
    db.query("SELECT id, name, email, role, avatar FROM users WHERE id = ?", [decoded.id], (err, results) => {
      if (err || !results || results.length === 0) {
        return res.status(500).json(null);
      }

      return res.json(results?.[0] ?? null);
    });
  });
});

router.get("/me/user", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json(null);
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err || decoded.role !== "user") return res.status(403).json(null);
    db.query("SELECT id, name, email, role, avatar, phone FROM users WHERE id = ?", [decoded.id], (err, results) => {
      if (err || !results || results.length === 0) {
        return res.status(500).json(null);
      }

      return res.json(results?.[0] ?? null);
    });
  });
});

router.get("/me/admin", (req, res) => {
  const token = req.cookies?.admin_token;
  if (!token) return res.status(401).json(null);
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err || decoded.role !== "admin") return res.status(403).json(null);
    db.query("SELECT id, name, email, role, avatar, phone FROM users WHERE id = ?", [decoded.id], (err, results) => {
      if (err || !results || results.length === 0) {
        return res.status(500).json(null);
      }

      return res.json(results?.[0] ?? null);
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

router.post("/change-password", verifyUser, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới" });
  }

  db.query("SELECT password FROM users WHERE id=?", [req.user.id], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ success: false, message: "Không thể xác thực tài khoản" });
    }

    try {
      const user = results[0];
      const isMatch = await verifyPassword(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Mật khẩu cũ không chính xác" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      db.query("UPDATE users SET password=? WHERE id=?", [hashedPassword, req.user.id], (updateErr) => {
        if (updateErr) {
          return res.status(500).json({ success: false, message: "Không thể cập nhật mật khẩu" });
        }

        res.json({ success: true, message: "Đổi mật khẩu thành công" });
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Không thể cập nhật mật khẩu" });
    }
  });
});

function verifyUser(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err || decoded.role !== "user") return res.status(403).json({ message: "Forbidden" });
    req.user = decoded;
    next();
  });
}

function verifyAdmin(req, res, next) {
  const token = req.cookies?.admin_token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err || decoded.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    req.user = decoded;
    next();
  });
}

module.exports = router;
module.exports.verifyUser = verifyUser;
module.exports.verifyAdmin = verifyAdmin;
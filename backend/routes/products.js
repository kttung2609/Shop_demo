const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const fs = require("fs");
const path = require("path");


// ===== Upload config =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".jfif") ext = ".jpg";
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// ===== HELPER =====
const parseImages = (product) => {
  try {
    return {
      ...product,
      images:
        typeof product.images === "string"
          ? JSON.parse(product.images || "[]")
          : product.images || [],
    };
  } catch {
    return { ...product, images: [] };
  }
};

// ===== GET ALL =====
router.get("/", (req, res) => {
  const { category, brand, page = 1, limit = 10 } = req.query;

  let sql = "SELECT * FROM products WHERE 1=1";
  let params = [];

  // ===== FILTER CATEGORY =====
  if (category) {
    sql += " AND category_id = ?";
    params.push(Number(category));
  }

  // ===== FILTER BRAND =====
  if (brand && brand !== "all") {
    sql += " AND brand_id = ?";
    params.push(Number(brand));
  }

  // ===== ORDER =====
  sql += " ORDER BY created_at DESC";

  db.query(sql, params, (err, results) => {
    if (err) {
      console.log("SQL ERROR:", err);
      return res.json({ total: 0, data: [] });
    }

    const data = results.map(parseImages);

    // ===== PAGINATION =====
    const start = (page - 1) * limit;
    const end = start + Number(limit);

    res.json({
      total: data.length,
      data: data.slice(start, end),
    });
  });
});

// ===== GET BY ID =====
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM products WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Server error" });
      if (result.length === 0)
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      res.json(parseImages(result[0]));
    }
  );
});

// ===== ADD PRODUCT =====
router.post("/add", upload.array("images", 5), (req, res) => {
  const { name, category, new_price, old_price, quantity } = req.body;

  const category_id = Number(category);
  const imageList = req.files.map((f) => f.filename);

  db.query(
    `INSERT INTO products (name, category_id, new_price, old_price, quantity, images)
     VALUES (?, ?, ?, ?, ?)`,
    [name, category_id, new_price, old_price, Number(quantity || 0), JSON.stringify(imageList)],
    (err) => {
      if (err) {
        console.log("SQL ERROR:", err);
        return res.json({ success: false });
      }
      res.json({ success: true });
    }
  );
});

// ===== UPDATE PRODUCT =====
router.put("/update/:id", upload.array("images", 5), (req, res) => {
  const { name, category, old_price, new_price , quantity} = req.body;
  const id = req.params.id;

  const category_id = Number(category);

  let oldImages = [];
  try {
    oldImages = JSON.parse(req.body.oldImages || "[]");
  } catch {}

  // ===== CÓ ẢNH MỚI =====
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((f) => f.filename);

    // xoá ảnh cũ
    oldImages.forEach((img) => {
      const filePath = `uploads/${img}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    db.query(
      `UPDATE products 
       SET name=?, category_id=?, old_price=?, new_price=?, quantity=?, images=? 
       WHERE id=?`,
      [
        name,
        category_id,
        old_price,
        new_price,
        Number(quantity),
        JSON.stringify(newImages),
        id,
      ],
      (err) => {
        if (err) {
          console.log("SQL ERROR:", err);
          return res.json({ success: false });
        }
        res.json({ success: true });
      }
    );
  }

  // ===== KHÔNG CÓ ẢNH MỚI =====
  else {
    db.query(
      `UPDATE products 
       SET name=?, category_id=?, old_price=?, new_price=?, quantity=?, images=? 
       WHERE id=?`,
      [
        name,
        category_id,
        old_price,
        new_price,
        Number(quantity),
        JSON.stringify(oldImages),
        id,
      ],
      (err) => {
        if (err) {
          console.log("SQL ERROR:", err);
          return res.json({ success: false });
        }
        res.json({ success: true });
      }
    );
  }
});

// ===== DELETE =====
router.delete("/delete/:id", (req, res) => {
  db.query("DELETE FROM products WHERE id=?", [req.params.id], (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});

module.exports = router;
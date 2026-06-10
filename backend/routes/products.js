const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// ==========================================
// 1. CẤU HÌNH UPLOAD ẢNH (MULTER)
// ==========================================
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

// ==========================================
// 2. HÀM BỔ TRỢ (HELPER) - CHỈ PARSE ẢNH
// ==========================================
const parseProduct = (product) => {
  if (!product) return null;
  try {
    return {
      ...product,
      // Chuyển chuỗi JSON images từ DB thành mảng để Frontend dễ dùng
      images:
        typeof product.images === "string"
          ? JSON.parse(product.images || "[]")
          : product.images || [],
    };
  } catch (err) {
    return { ...product, images: [] };
  }
};

// ==========================================
// 3. API LẤY DANH SÁCH SẢN PHẨM (CÓ LỌC & PHÂN TRANG)
// ==========================================
router.get("/", (req, res) => {
  const { category, brand, q, page = 1, limit = 15 } = req.query;

  let sql = `
    SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    WHERE 1=1
  `;
  let params = [];

  if (category) {
    sql += " AND p.category_id = ?";
    params.push(Number(category));
  }

  if (brand && brand !== "all") {
    sql += " AND p.brand_id = ?";
    params.push(Number(brand));
  }

  if (q) {
    const searchTerm = `%${q}%`;
    sql += " AND (p.name LIKE ? OR p.description LIKE ?)";
    params.push(searchTerm, searchTerm);
  }

  sql += " ORDER BY p.created_at DESC";

  db.query(sql, params, (err, results) => {
    if (err) {
      console.log("SQL ERROR:", err);
      return res.status(500).json({ total: 0, data: [] });
    }

    const allData = results.map(parseProduct);
    
    // Phân trang
    const start = (Number(page) - 1) * Number(limit);
    const end = start + Number(limit);
    const paginatedData = allData.slice(start, end);

    res.json({
      total: allData.length,
      data: paginatedData,
    });
  });
});

// ==========================================
// 4. API LẤY CHI TIẾT 1 SẢN PHẨM (THEO ID)
// ==========================================
router.get("/:id", (req, res) => {
  db.query("SELECT * FROM products WHERE id=?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Server error" });
    if (result.length === 0) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    
    res.json(parseProduct(result[0]));
  });
});

// ==========================================
// 5. API THÊM SẢN PHẨM MỚI
// ==========================================
router.post("/add", upload.array("images", 5), (req, res) => {
  const { 
    name, category, brand_id, series_id, weight, max_tension, 
    balance_point, stiffness, material, new_price, old_price, quantity, description 
  } = req.body;

  // Tạo slug tự động từ tên
  const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  
  // Lấy danh sách tên file ảnh đã upload
  const imageList = req.files.map((f) => f.filename);

  const sql = `
    INSERT INTO products 
    (name, slug, category_id, brand_id, series_id, weight, max_tension, balance_point, stiffness, material, new_price, old_price, stock, quantity, description, images)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name, slug, Number(category), Number(brand_id) || null, Number(series_id) || null,
    weight, max_tension, balance_point, stiffness, material,
    new_price, old_price, Number(quantity), Number(quantity),
    description, JSON.stringify(imageList)
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.log("INSERT ERROR:", err);
      return res.json({ success: false, message: "Lỗi lưu Database" });
    }
    res.json({ success: true });
  });
});

// ==========================================
// 6. API CẬP NHẬT SẢN PHẨM
// ==========================================
router.put("/update/:id", upload.array("images", 5), (req, res) => {
  const { 
    name, category, brand_id, series_id, weight, max_tension, 
    balance_point, stiffness, material, new_price, old_price, quantity, added_quantity, description 
  } = req.body;
  const id = req.params.id;

  let imagesToSave;
  

  if (req.files && req.files.length > 0) {
    imagesToSave = JSON.stringify(req.files.map((f) => f.filename));
    
    try {
      const oldImgs = JSON.parse(req.body.oldImages || "[]");
      oldImgs.forEach(img => {
        if (fs.existsSync(`uploads/${img}`)) fs.unlinkSync(`uploads/${img}`);
      });
    } catch (e) {}
  } else {
    imagesToSave = req.body.oldImages || "[]";
  }

  const currentQuantity = Number(quantity) || 0;
  const incomingQuantity = Number(added_quantity) || 0;
  const updatedQuantity = currentQuantity + incomingQuantity;

  const sql = `
    UPDATE products SET 
    name=?, category_id=?, brand_id=?, series_id=?, weight=?, max_tension=?, 
    balance_point=?, stiffness=?, material=?, new_price=?, old_price=?, 
    stock=?, quantity=?, description=?, images=?
    WHERE id=?
  `;

  const values = [
    name, Number(category), Number(brand_id) || null, Number(series_id) || null,
    weight, max_tension, balance_point, stiffness, material,
    new_price, old_price, updatedQuantity, updatedQuantity,
    description, imagesToSave, id
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.log("UPDATE ERROR:", err);
      return res.json({ success: false });
    }
    res.json({ success: true });
  });
});


router.delete("/delete/:id", (req, res) => {
  db.query("DELETE FROM products WHERE id=?", [req.params.id], (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});

module.exports = router;
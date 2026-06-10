const express = require('express');
const router = express.Router();
const db = require('../db');

let hasSlugColumnCache = null;

const normalizeName = (value) => value.trim();

const createSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');

const hasSlugColumn = () => {
  if (hasSlugColumnCache !== null) {
    return Promise.resolve(hasSlugColumnCache);
  }

  return new Promise((resolve, reject) => {
    db.query("SHOW COLUMNS FROM brands LIKE 'slug'", (err, results) => {
      if (err) {
        return reject(err);
      }

      hasSlugColumnCache = Array.isArray(results) && results.length > 0;
      resolve(hasSlugColumnCache);
    });
  });
};

// GET /api/brands - return list of brands
router.get('/', (req, res) => {
  db.query('SELECT id, name FROM brands ORDER BY id DESC', (err, results) => {
    if (err) {
      console.error('BRANDS SELECT ERROR', err);
      return res.status(500).json({ success: false, data: [] });
    }
    res.json(results);
  });
});

router.post('/add', (req, res) => {
  const { name } = req.body;
  const brandName = normalizeName(name || '');

  if (!brandName) {
    return res.status(400).json({ success: false, message: 'Tên brand không được rỗng' });
  }

  const slug = createSlug(brandName);

  hasSlugColumn()
    .then((slugSupported) => {
      const sql = slugSupported
        ? 'INSERT INTO brands (name, slug) VALUES (?, ?)'
        : 'INSERT INTO brands (name) VALUES (?)';
      const params = slugSupported ? [brandName, slug] : [brandName];

      db.query(sql, params, (err, result) => {
        if (err) {
          console.error('BRAND INSERT ERROR', err);
          return res.status(500).json({
            success: false,
            message: err.message || 'Không thể lưu thương hiệu',
          });
        }

        res.json({ success: true, brand: { id: result.insertId, name: brandName, slug } });
      });
    })
    .catch((err) => {
      console.error('BRAND SCHEMA CHECK ERROR', err);
      res.status(500).json({ success: false, message: 'Không thể kiểm tra cấu trúc bảng thương hiệu' });
    });
});

router.put('/update/:id', (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  const brandName = normalizeName(name || '');

  if (!brandName) {
    return res.status(400).json({ success: false, message: 'Tên brand không hợp lệ' });
  }

  const slug = createSlug(brandName);

  hasSlugColumn()
    .then((slugSupported) => {
      const sql = slugSupported
        ? 'UPDATE brands SET name=?, slug=? WHERE id=?'
        : 'UPDATE brands SET name=? WHERE id=?';
      const params = slugSupported ? [brandName, slug, id] : [brandName, id];

      db.query(sql, params, (err) => {
        if (err) {
          console.error('BRAND UPDATE ERROR', err);
          return res.status(500).json({ success: false, message: err.message || 'Không thể cập nhật thương hiệu' });
        }

        res.json({ success: true });
      });
    })
    .catch((err) => {
      console.error('BRAND SCHEMA CHECK ERROR', err);
      res.status(500).json({ success: false, message: 'Không thể kiểm tra cấu trúc bảng thương hiệu' });
    });
});

router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM brands WHERE id=?', [id], (err) => {
    if (err) {
      console.error('BRAND DELETE ERROR', err);
      return res.json({ success: false });
    }
    res.json({ success: true });
  });
});

module.exports = router;

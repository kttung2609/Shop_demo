const express = require('express');
const router = express.Router();
const db = require('../db');

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
  if (!name || !name.trim()) return res.json({ success: false, message: 'Tên brand không được rỗng' });
  const slug = name.toLowerCase().trim().replace(/\s+/g, '-');
  db.query('INSERT INTO brands (name, slug) VALUES (?, ?)', [name, slug], (err, result) => {
    if (err) {
      console.error('BRAND INSERT ERROR', err);
      return res.json({ success: false });
    }
    res.json({ success: true, brand: { id: result.insertId, name, slug } });
  });
});

router.put('/update/:id', (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  if (!name || !name.trim()) return res.json({ success: false, message: 'Tên brand không hợp lệ' });
  const slug = name.toLowerCase().trim().replace(/\s+/g, '-');
  db.query('UPDATE brands SET name=?, slug=? WHERE id=?', [name, slug, id], (err) => {
    if (err) {
      console.error('BRAND UPDATE ERROR', err);
      return res.json({ success: false });
    }
    res.json({ success: true });
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

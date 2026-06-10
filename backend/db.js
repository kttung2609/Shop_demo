const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Admin@123',
    database: 'ecommerce_db'
});

db.connect((err) => {
    if (err) {
        console.log("Kết nối MySQL thất bại");
    } else {
        console.log("Kết nối MySQL thành công");
    }
});

db.query("ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL", (err) => {
    if (err && err.code !== "ER_DUP_FIELDNAME") {
        console.log("Không thể đảm bảo cột phone cho users");
    }
});

db.query("ALTER TABLE users ADD COLUMN email_verified TINYINT(1) NOT NULL DEFAULT 0", (err) => {
    if (err && err.code !== "ER_DUP_FIELDNAME") {
        console.log("Không thể đảm bảo cột email_verified cho users");
    }
});

db.query("ALTER TABLE users ADD COLUMN email_verified_at DATETIME NULL", (err) => {
    if (err && err.code !== "ER_DUP_FIELDNAME") {
        console.log("Không thể đảm bảo cột email_verified_at cho users");
    }
});

db.query("ALTER TABLE users ADD COLUMN email_verification_token VARCHAR(255) NULL", (err) => {
    if (err && err.code !== "ER_DUP_FIELDNAME") {
        console.log("Không thể đảm bảo cột email_verification_token cho users");
    }
});

db.query("ALTER TABLE users ADD COLUMN email_verification_expires DATETIME NULL", (err) => {
    if (err && err.code !== "ER_DUP_FIELDNAME") {
        console.log("Không thể đảm bảo cột email_verification_expires cho users");
    }
});

module.exports = db;
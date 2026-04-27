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

module.exports = db;
const bcrypt = require("bcrypt");
const db = require("./db");

(async () => {
  const hash = await bcrypt.hash("123456", 10);

  const sql = "UPDATE users SET password=?";

  db.query(sql, [hash], (err) => {
    if (err) console.log(err);
    else console.log("Đã hash lại toàn bộ password");
    process.exit();
  });
})();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth'); // THÊM
const categoryRoutes = require("./routes/Categories");
const userRoutes = require("./routes/users");
const orderRoutes = require("./routes/orders");
const loginRouter = require("./routes/login");
const cartRoutes = require("./routes/carts")
const productRoutes = require('./routes/products');
const statsRoutes = require('./routes/stats');
const fs = require("fs");
const path = require("path");



const app = express();

app.use(cors());
app.use(bodyParser.json());
// app.use("/api/login", loginRouter);
app.use("/orders", orderRoutes);
// console.log("ORDER ROUTE LOADED");
app.use("/api/categories", categoryRoutes);
app.use('/products', productRoutes);
app.use('/auth', authRoutes); 
app.use('/uploads', express.static('uploads'));
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/stats", statsRoutes);
app.get("/api/images", (req, res) => {
  const folderPath = path.join(__dirname, "uploads");

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Không đọc được folder" });
    }

    res.json(files);
  });
});
app.listen(4000, () => {
    console.log("Server chạy tại http://localhost:4000");
});
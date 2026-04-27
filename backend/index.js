const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products"); 
const userRoutes = require("./routes/users");


// app.use("/api/users", userRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);

// // ===== STATIC FILE =====
// app.use("/uploads", express.static("uploads"));

// // ===== TEST =====
// app.get("/", (req, res) => {
//   res.send("Backend is running 🚀");
// });

// ===== START SERVER =====
app.listen(4000, () => {
  console.log("Server chạy tại http://localhost:4000");
});
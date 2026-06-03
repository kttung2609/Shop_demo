const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products"); 
const userRoutes = require("./routes/users");



app.listen(4000, () => {
  console.log("Server chạy tại http://localhost:4000");
});
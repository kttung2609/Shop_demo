import React from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminLogin from "./Components/AdminLogin/Adminlogin";
import ProtectedRoute from "./Components/ProtectedRoute"; // Sửa lại path nếu cần
import Popular from './Components/AdminPopular/AdminPopular';
import Sidebar from './Components/Sidebar/Sidebar';
import Navbar from './Components/Navbar/Navbar';
import Users from './Components/Users/Users';
import Orders from './Components/Orders/Orders';
import AddProduct from './Components/AddProduct/AddProduct';
import UpdateProduct from './Components/UpdateProduct/UpdateProduct';
import AdminProductPage from './Components/ProductDisplayAdmin/ProductDisplayAdmin';
import ProductAdmin from './Pages/ProductAdmin'; // Trang chi tiết sp admin
import './App.css'; // File CSS quan trọng để dàn trang

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="admin-app">
      {/* 1. Chỉ hiện Navbar nếu không phải trang login */}
      {!isLoginPage && <Navbar />}

      <div className="admin-main-content">
        {/* 2. Chỉ hiện Sidebar nếu không phải trang login */}
        {!isLoginPage && <Sidebar />}

        {/* 3. Vùng hiển thị nội dung các trang */}
        <div className={isLoginPage ? "auth-container" : "page-container"}>
          <Routes>
            <Route path="/login" element={<AdminLogin />} />

            {/* Các trang bảo mật bọc trong ProtectedRoute */}
            <Route path="/listproduct" element={<ProtectedRoute><Popular /></ProtectedRoute>} />
            <Route path="/addproduct" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
            <Route path="/update/:id" element={<ProtectedRoute><UpdateProduct /></ProtectedRoute>} />
            <Route path="/product/:productId" element={<ProtectedRoute><ProductAdmin /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            
            {/* Nếu vào link trống thì đá về listproduct */}
            <Route path="/" element={<Navigate to="/listproduct" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
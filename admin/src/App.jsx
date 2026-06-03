import React from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import Category from "./Components/Category/Categories";
import Brands from './Components/Brands/Brands';
import CartItems from "./Components/CartItems/CartItems";
import Checkout from "./Components/Checkout/Checkout";
import AdminStats from "./Components/AdminStats/AdminStats";
import './App.css'; // File CSS quan trọng để dàn trang

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="admin-app">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {!isLoginPage && <Navbar />}

      <div className="admin-main-content">
        {!isLoginPage && <Sidebar />}

        <div className={isLoginPage ? "auth-container" : "page-container"}>
          <Routes>
            <Route path="/login" element={<AdminLogin />} />

            <Route path="/listproduct" element={<ProtectedRoute><Popular /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Popular /></ProtectedRoute>} />
            <Route path="/addproduct" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
            <Route path="/update/:id" element={<ProtectedRoute><UpdateProduct /></ProtectedRoute>} />
            <Route path="/product/:productId" element={<ProtectedRoute><ProductAdmin /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><CartItems /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><Category /></ProtectedRoute>} />
            <Route path="/brands" element={<ProtectedRoute><Brands /></ProtectedRoute>} />
            <Route path="/stats" element={<ProtectedRoute><AdminStats /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/listproduct" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
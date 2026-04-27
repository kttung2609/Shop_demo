import React, { useEffect } from "react";
import "./Admin.css";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { Routes, Route, useNavigate } from "react-router-dom";

import AddProduct from "../../Components/AddProduct/AddProduct";
import ListProduct from "../../Components/ListProduct/ListProduct";
import Category from "../../Components/Category/Categories";
import Users from "../../Components/Users/Users";
import Orders from "../../Components/Orders/Orders";
import ProtectedRoute from "../../Components/ProtectedRoute";
import UpdateProduct from "../../Components/UpdateProduct/UpdateProduct";
import AdminStats from "../../Components/AdminStats/AdminStats";
import ProductAdmin from "../../Pages/ProductAdmin";
import CartAdmin from"../../Components/CartItems/CartItems"
import CartItems from "../../Components/CartItems/CartItems";
import Checkout from "../../Components/Checkout/Checkout"
const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem("admin");

    // if (!admin) {
    //   navigate("/login");
    // }
  }, []);

  return (
    <div className="Admin">
      <Sidebar />
      
      <Routes>
        <Route
          path="stats"
          element={
            <ProtectedRoute>
              <AdminStats />
            </ProtectedRoute>
          }
        />
        <Route
          path="listproduct"
          element={
            <ProtectedRoute>
              <ListProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="addproduct"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="Categories"
          element={
            <ProtectedRoute>
              <Category />
            </ProtectedRoute>
          }
        />

        <Route
          path="Users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="Orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <CartAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/cart" element={<CartAdmin />} /> */}
        <Route path="/product/:id" element={<ProductAdmin />} />
        <Route path="/update/:id" element={<UpdateProduct />} />
      </Routes>
    </div>
  );
};


export default Admin;
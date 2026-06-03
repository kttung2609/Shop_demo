import React, { useState, useEffect, useContext } from "react";
import "./LoginSignup.css";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { toast } from "react-toastify";

const LoginSignup = () => {
  const { fetchUserData } = useContext(ShopContext);
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const checkUserAuth = async () => {
    try {
      const res = await fetch("http://localhost:4000/auth/me?role=user", { credentials: "include" });
      const data = await res.json();
      if (data && data.role === "user") {
        navigate("/");
      }
    } catch (err) {
    }
  };

  useEffect(() => {
    checkUserAuth();
    const handlePageShow = (event) => {
      if (event.persisted) {
        checkUserAuth();
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [navigate]);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    const res = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: formData.email, password: formData.password }),
    });
    const data = await res.json();
    if (data.success) {
      if (data.role === "user") {
        await fetchUserData();
        navigate("/");
      } else {
        toast.warning("Tài khoản admin không thể đăng nhập trang khách hàng");
      }
    } else {
      toast.error(data.message);
    }
  };

  const signup = async () => {
    const res = await fetch("http://localhost:4000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Đăng ký thành công!");
      setState("Login");
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>{state === "Login" ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}</h1>
          <p>Chào mừng bạn đến với Badminton Shop</p>
        </div>
        <div className="auth-fields">
          {state === "Sign Up" && (
            <div className="input-group">
              <User className="input-icon" size={20} />
              <input name="name" onChange={changeHandler} type="text" placeholder="Họ và tên" />
            </div>
          )}
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input name="email" onChange={changeHandler} type="email" placeholder="Địa chỉ Email" />
          </div>
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input name="password" onChange={changeHandler} type="password" placeholder="Mật khẩu" />
          </div>
        </div>
        <button className="auth-btn" onClick={() => (state === "Login" ? login() : signup())}>
          {state === "Login" ? "ĐĂNG NHẬP" : "TẠO TÀI KHOẢN"}
          <ArrowRight size={20} />
        </button>
        <div className="auth-switch">
          {state === "Sign Up" ? (
            <p>Đã có tài khoản? <span onClick={() => setState("Login")}>Đăng nhập</span></p>
          ) : (
            <p>Chưa có tài khoản? <span onClick={() => setState("Sign Up")}>Đăng ký ngay</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
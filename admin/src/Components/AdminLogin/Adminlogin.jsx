import React, { useState, useEffect } from "react";
import "./AdminLogin.css";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck, ArrowRight } from "lucide-react";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data && data.role === "admin") {
          navigate("/listproduct");
        }
      })
      .catch(() => {});
  }, [navigate]);

  const login = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success) {
      if (data.role === "admin") {
        window.location.href = "/listproduct";
      } else {
        setError("Tài khoản không có quyền quản trị");
      }
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="login-header">
          <ShieldCheck size={50} color="#ff4d4f" />
          <h2>ADMIN PANEL</h2>
        </div>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={login}>
          <div className="input-group">
            <Mail size={20} />
            <input name="email" type="email" placeholder="Admin Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="input-group">
            <Lock size={20} />
            <input name="password" type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" className="btn-login-admin">ĐĂNG NHẬP <ArrowRight size={20}/></button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
import React, { useState } from "react";
import "./LoginSignup.css";
import { Mail, Lock, User, ArrowRight } from "lucide-react"; // Cài lucide-react nếu chưa có

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    
    const res = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await res.json();
    console.log("DATA LOGIN:", data);
    console.log("ROLE RAW:", data.user.role);
    if (data.success) {
      // luôn chuẩn hóa role
      const role = data.user?.role?.trim().toLowerCase();

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("ROLE:", role); // debug

      if (role === "admin") {
        window.location.href = `http://localhost:5173?token=${data.token}`;
      } else {
        window.location.href = `http://localhost:5174?token=${data.token}`;
      }
    } else {
      alert(data.message);
    }
  };
  const signup = async () => {
    const res = await fetch("http://localhost:4000/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success) {
      alert("Đăng ký thành công!");
      setState("Login");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>{state === "Login" ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}</h1>
          <p>{state === "Login" ? "Chào mừng bạn quay trở lại!" : "Trở thành thành viên của shop ngay hôm nay"}</p>
        </div>

        <div className="auth-fields">
          {state === "Sign Up" && (
            <div className="input-group">
              <User className="input-icon" size={20} />
              <input
                name="name"
                onChange={changeHandler}
                type="text"
                placeholder="Họ và tên của bạn"
              />
            </div>
          )}

          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input
              name="email"
              onChange={changeHandler}
              type="email"
              placeholder="Địa chỉ Email"
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input
              name="password"
              onChange={changeHandler}
              type="password"
              placeholder="Mật khẩu"
            />
          </div>
        </div>

        {state === "Login" && (
          <div className="forgot-password">
            <span>Quên mật khẩu?</span>
          </div>
        )}

        <button
          className="auth-btn"
          onClick={() => {
            state === "Login" ? login() : signup();
          }}
        >
          {state === "Login" ? "ĐĂNG NHẬP" : "TẠO TÀI KHOẢN"}
          <ArrowRight size={20} />
        </button>

        <div className="auth-switch">
          {state === "Sign Up" ? (
            <p>
              Bạn đã có tài khoản?{" "}
              <span onClick={() => setState("Login")}>Đăng nhập tại đây</span>
            </p>
          ) : (
            <p>
              Bạn chưa có tài khoản?{" "}
              <span onClick={() => setState("Sign Up")}>Đăng ký ngay</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
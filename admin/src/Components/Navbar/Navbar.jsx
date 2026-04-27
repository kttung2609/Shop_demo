import React, { useEffect, useState } from "react";
import "./Navbar.css";
import navlogo from "../../assets/nav-logo.svg";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser)); // ✅ đúng
    }
  }, []);
  const goToUserApp = (path) => {
    const token = localStorage.getItem("token");
    window.location.href = `http://localhost:5174${path}?token=${token}`;
  };
  return (
    <div className="navbar">
      <img src={navlogo} alt="" className="nav-logo" />

      {user ? (
        <img
          src={user.avatar || "https://via.placeholder.com/40"}
          className="nav-avatar"
          alt=""
          onClick={() => goToUserApp("/profile")}
        />
      ) : (
        <button onClick={() => goToUserApp("/login")}>
          Login
        </button>
      )}
    </div>
  );
};

export default Navbar;
import React, { useEffect, useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      window.location.href = "/login";
    } else {
      setUser(savedUser);
    }
  }, []);

  if (!user) {
    return <div className="profile-loading">Đang tải...</div>;
  }

  return (
    <div className="profile">
      <div className="profile-container">
        
        <div className="profile-avatar">
          <img
            src={
              user.avatar
                ? user.avatar
                : "https://via.placeholder.com/150"
            }
            alt="avatar"
          />
        </div>

        <h2 className="profile-name">{user.name}</h2>

        <div className="profile-info">
          <div className="profile-item">
            <span>Email:</span>
            <p>{user.email}</p>
          </div>

          <div className="profile-item">
            <span>ID:</span>
            <p>{user.id}</p>
          </div>
        </div>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("auth-token");
            localStorage.removeItem("user");
            window.location.replace("/login");
          }}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Profile;
import React, { useEffect, useState } from "react";
import "./CartItems.css";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";

const CartItems = () => {
  const [user, setUser] = useState(null);
  const [carts, setCarts] = useState([]);
  const navigate = useNavigate();

  // ===== CHECK ADMIN =====
  useEffect(() => {
    fetch("http://localhost:4000/auth/me", {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (data.role !== "admin") {
          window.location.href = "http://localhost:5174";
        } else {
          setUser(data);
        }
      })
      .catch(() => {
        window.location.href = "http://localhost:5174/login";
      });
  }, []);

  // ===== LOAD ALL CART =====
  const fetchCarts = async () => {
    const res = await fetch("http://localhost:4000/api/cart");
    const data = await res.json();
    setCarts(data);
  };

  useEffect(() => {
    if (user) fetchCarts();
  }, [user]);

  const increase = async (userID, productID) => {
    await fetch("http://localhost:4000/api/cart/increase", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID, productID }),
    });
    fetchCarts();
  };

  const decrease = async (userID, productID) => {
    await fetch("http://localhost:4000/api/cart/decrease", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID, productID }),
    });
    fetchCarts();
  };

  const removeItem = async (userID, productID) => {
    await fetch("http://localhost:4000/api/cart/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID, productID }),
    });
    fetchCarts();
  };

  return (
    <div>
      <h1>ADMIN - CART LIST</h1>

      {carts.map(item => {
        const images = JSON.parse(item.images || "[]");

        return (
          <div key={item.id} style={{ marginBottom: "10px" }}>
            <img
              src={`http://localhost:4000/uploads/${images[0]}`}
              width="50"
            />

            <span>{item.name}</span>
            <span> | User: {item.userID}</span>

            <button onClick={() => decrease(item.userID, item.productID)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => increase(item.userID, item.productID)}>+</button>

            <button onClick={() => removeItem(item.userID, item.productID)}>
              <Trash2 size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default CartItems;
import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {

  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState([]); // 👈 đổi sang array

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {

    // ===== GIỮ NGUYÊN LOAD PRODUCT =====
    fetch("http://localhost:4000/products")
      .then((res) => res.json())
      .then((data) => setAll_Product(data));

    fetchCart();

  }, []);

  const clearCart = () => {
    setCartItems([]);
  };
  // ================= LOAD CART =================
  const fetchCart = async () => {
    if (!user) return;

    const res = await fetch(`http://localhost:4000/api/cart/${user.id}`);
    
    if (!res.ok) {
      console.log("API lỗi:", res.status);
      return;
    }

    const text = await res.text();

    if (!text) {
      setCartItems([]);
      return;
    }

    const data = JSON.parse(text);
    setCartItems(data);
  };

  // ================= ADD =================
  const addToCart = async (productID) => {
    if (!user) {
      alert("Bạn cần đăng nhập");
      return;
    }

    await fetch("http://localhost:4000/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userID: user.id,
        productID,
        quantity: 1
      })
    });

    fetchCart();
  };

  // ================= REMOVE =================
  const removeFromCart = async (productID) => {   

    await fetch("http://localhost:4000/api/cart/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: user.id, productID })
    });

    fetchCart();
  };
  // ================= INCREASE =================
  const increase = async (productID) => {
    await fetch("http://localhost:4000/api/cart/increase", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: user.id,
        productID
      })
    });

    fetchCart();
  };

// ================= DECREASE =================
  const decrease = async (productID) => {
    await fetch("http://localhost:4000/api/cart/decrease", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: user.id,
        productID
      })
    });

    fetchCart();
  };

  // ================= COUNT =================
  const getTotalCartItems = () => {
    let total = 0;

    cartItems.forEach(item => {
      total += item.quantity;
    });

    return total;
  };

  // ================= TOTAL PRICE =================
  const getTotalCartAmount = () => {
    let total = 0;

    cartItems.forEach(item => {
      total += item.new_price * item.quantity;
    });

    return total;
  };

  const contextValue = {
    all_product,          // 👈 GIỮ NGUYÊN
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartItems,
    getTotalCartAmount,
    increase,
    decrease,
    clearCart
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
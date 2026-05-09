import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/cart", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
      }
    } catch (err) { }
  };

  const fetchUserData = async () => {
    try {
      const res = await fetch("http://localhost:4000/auth/me", { credentials: "include" });
      if (res.ok) {
        const userData = await res.json();
        if (userData && userData.role === "user") {
          setUser(userData);
          return userData;
        }
      }
      setUser(null);
      return null;
    } catch (err) { 
      setUser(null); 
      return null;
    }
  };

  useEffect(() => {
    fetch("http://localhost:4000/products")
      .then(res => res.json())
      .then(data => setAll_Product(data.data || data));

    fetchUserData().then(userData => { 
      if (userData) fetchCart(); 
    });
  }, []);

  const addToCart = async (productID) => {
    if (!user) return alert("Vui lòng đăng nhập để mua hàng!");
    const res = await fetch("http://localhost:4000/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productID, quantity: 1 }),
    });
    if (res.ok) fetchCart();
  };

  const removeFromCart = async (productID) => {
    const res = await fetch("http://localhost:4000/api/cart/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productID }),
    });
    if (res.ok) fetchCart();
  };

  const contextValue = {
    all_product, cartItems, setCartItems, user, setUser,
    addToCart, removeFromCart, fetchCart, fetchUserData,
    getTotalCartItems: () => cartItems.reduce((total, item) => total + item.quantity, 0),
    getTotalCartAmount: () => cartItems.reduce((total, item) => total + (item.new_price * item.quantity), 0),
  };

  return <ShopContext.Provider value={contextValue}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
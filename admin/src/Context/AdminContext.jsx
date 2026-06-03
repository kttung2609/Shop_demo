import React, { createContext, useEffect, useState } from "react";

export const AdminContext = createContext(null);

const AdminContextProvider = (props) => {
  const [admin, setAdmin] = useState(null);

  const fetchAdminData = async () => {
    try {
      const res = await fetch("http://localhost:4000/auth/me/admin", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setAdmin(data);
        return data;
      }
      setAdmin(null);
    } catch (err) { setAdmin(null); }
    return null;
  };

  useEffect(() => { fetchAdminData(); }, []);

  return (
    <AdminContext.Provider value={{ admin, setAdmin, fetchAdminData }}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
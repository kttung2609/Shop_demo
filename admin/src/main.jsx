import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import AdminContextProvider from "./Context/AdminContext.jsx"; // Dùng bản Admin này

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AdminContextProvider>
  </React.StrictMode>,
)
// App.tsx

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/footer";
import Header from "./components/header";
import Account from "./pages/Account";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Catalog from "./pages/Catalog";
import ProductPage from "./pages/ProductPage";
import Bag from "./pages/Bag";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import { ThemeProvider } from "./context/ThemeContext";
import { jwtDecode } from "jwt-decode"; // For decoding JWT tokens

type DecodedToken = {
  email: string;
  role: "admin" | "user";
};

function App() {
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      setUser(decodedToken);
    }
  }, []);

  const logout = () => {
    setUser(null); // Clear user state
    localStorage.removeItem("token"); // Remove token from localStorage
  };

  return (
    <ThemeProvider>
      <Router>
        <Header user={user} logout={logout} /> {/* Pass logout function */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Account" element={<Account />} />
          <Route path="/Catalog" element={<Catalog />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/products/:productId" element={<ProductPage />} />
          <Route path="/Bag" element={<Bag />} />
          <Route path="/Checkout" element={<Checkout />} />
          <Route path="/Admin" element={<Admin />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;

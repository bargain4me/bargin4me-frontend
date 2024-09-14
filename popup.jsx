// popup.js
import React, { useState } from "react";
import LoginPage from "./pages/login/Login";
import HomePage from "./pages/Home";

const IndexPopup = () => {
  const [currentPage, setCurrentPage] = useState("login");

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <LoginPage onLoginSuccess={() => setCurrentPage("home")} />;
      case "home":
        return <HomePage />;
      default:
        return <LoginPage onLoginSuccess={() => setCurrentPage("home")} />;
    }
  };

  return <div style={{ padding: 16 }}>{renderPage()}</div>;
};

export default IndexPopup;

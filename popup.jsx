// popup.js
import React, { useState } from "react";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home"; // Assuming you have a HomePage component

const IndexPopup = () => {
  const [currentPage, setCurrentPage] = useState("login");

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return (
          <SignIn
            onLoginSuccess={() => setCurrentPage("home")}
          />
        );
      case "home":
        return <Home/>;
      default:
        return (
          <SignIn
            onLoginSuccess={() => setCurrentPage("home")}
          />
        );
    }
  };

  return <div>{renderPage()}</div>;
};

export default IndexPopup;

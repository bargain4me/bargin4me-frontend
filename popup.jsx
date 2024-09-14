// popup.js
import React, { useState } from "react"

import Home from "./pages/Home" // Assuming you have a HomePage component
import SignIn from "./pages/SignIn"

const IndexPopup = () => {
  const [currentPage, setCurrentPage] = useState("login")

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <SignIn onLoginSuccess={() => setCurrentPage("home")} />
      case "home":
        return <Home />
      default:
        return <SignIn onLoginSuccess={() => setCurrentPage("home")} />
    }
  }

  return (
    <div
      style={{
        width: "300px", // Set desired width
        height: "400px", // Set desired height
        margin: 0,
        padding: 0,
        overflow: "auto" // Handle overflow
      }}>
      {renderPage()}
    </div>
  )
}

export default IndexPopup
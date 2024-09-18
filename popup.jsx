// popup.js
import React, { useEffect, useState } from "react"

import Home from "./pages/Home"
import ListingDetail from "./pages/Home/ListingDetail"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import { supabase } from "./supabaseClient" // Adjust the path as necessary

const IndexPopup = () => {
  const [currentPage, setCurrentPage] = useState("login")
  const [selectedListing, setSelectedListing] = useState(null) // State to hold selected listing details

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setCurrentPage("home")
      }
    }

    checkSession()
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setCurrentPage("login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Function to navigate to the ListingDetail page with selected listing details
  const handleViewListing = (listing) => {
    setSelectedListing(listing)
    setCurrentPage("listingDetail")
  }

  const handleBackToListings = () => {
    setSelectedListing(null)
    setCurrentPage("home")
  }

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return (
          <SignIn
            onLoginSuccess={() => setCurrentPage("home")}
            onNavigateToSignUp={() => setCurrentPage("signup")}
          />
        )
      case "signup":
        return (
          <SignUp
            onSignUpSuccess={() => setCurrentPage("home")}
            onNavigateToSignIn={() => setCurrentPage("login")}
          />
        )
      case "home":
        return (
          <Home onLogout={handleLogout} onViewListing={handleViewListing} />
        )
      case "listingDetail":
        return (
          <ListingDetail
            onBack={handleBackToListings}
            {...selectedListing} // Spread the selected listing details as props
          />
        )
      default:
        return (
          <SignIn
            onLoginSuccess={() => setCurrentPage("home")}
            onNavigateToSignUp={() => setCurrentPage("signup")}
          />
        )
    }
  }

  return (
    <div
      style={{
        width: "400px",
        height: "500px",
        margin: 0,
        padding: 0,
        overflow: "auto"
      }}>
      {renderPage()}
    </div>
  )
}

export default IndexPopup

// // popup.js
// import React, { useState } from "react"

// import Home from "./pages/Home" // Assuming you have a HomePage component
// import SignIn from "./pages/SignIn"

// const IndexPopup = () => {
//   const [currentPage, setCurrentPage] = useState("login")
//   console.log("testing")
//   const renderPage = () => {
//     switch (currentPage) {
//       case "login":
//         return <SignIn onLoginSuccess={() => setCurrentPage("home")} />
//       case "home":
//         return <Home />
//       default:
//         return <SignIn onLoginSuccess={() => setCurrentPage("home")} />
//     }
//   }

//   return (
//     <div
//       style={{
//         width: "300px", // Set desired width
//         height: "400px", // Set desired height
//         margin: 0,
//         padding: 0,
//         overflow: "auto" // Handle overflow
//       }}>
//       {renderPage()}
//     </div>
//   )
// }

// export default IndexPopup

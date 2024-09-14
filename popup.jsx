// popup.js
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Adjust the path as necessary

import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

const IndexPopup = () => {
  const [currentPage, setCurrentPage] = useState('login');

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setCurrentPage('home');
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentPage('login');
    } catch (error) {
      console.error('Error signing out:', error);
      // Optionally, handle the error (e.g., show a message to the user)
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <SignIn
            onLoginSuccess={() => setCurrentPage('home')}
            onNavigateToSignUp={() => setCurrentPage('signup')}
          />
        );
      case 'signup':
        return (
          <SignUp
            onSignUpSuccess={() => setCurrentPage('home')}
            onNavigateToSignIn={() => setCurrentPage('login')}
          />
        );
      case 'home':
        return <Home onLogout={handleLogout} />;
      default:
        return (
          <SignIn
            onLoginSuccess={() => setCurrentPage('home')}
            onNavigateToSignUp={() => setCurrentPage('signup')}
          />
        );
    }
  };

  return (
    <div
      style={{
        width: '300px',
        height: '400px',
        margin: 0,
        padding: 0,
        overflow: 'auto',
      }}
    >
      {renderPage()}
    </div>
  );
};

export default IndexPopup;


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
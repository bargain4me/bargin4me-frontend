// LoginPage.js
import React, { useState } from "react";

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Implement your login logic here
    // On successful login, call onLoginSuccess()
    onLoginSuccess();
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        style={{ width: "100%", marginBottom: 8 }}
      />
      <button onClick={handleLogin} style={{ width: "100%" }}>
        Login
      </button>
    </div>
  );
};

export default LoginPage;

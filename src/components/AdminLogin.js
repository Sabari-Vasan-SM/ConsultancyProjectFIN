import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState("admin");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      if (loginType === "admin") {
        if (email === "admin@velavan.com" && password === "admin123") {
          navigate("/home");
        } else {
          setError("Invalid Admin Email or Password");
        }
      } else {
        if (email === "stock@velavan.com" && password === "stock123") {
          navigate("/stock");
        } else {
          setError("Invalid Stock Manager Email or Password");
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">
            {loginType === "admin" ? "Admin Portal" : "Stock Management"}
          </h2>
          <p className="login-subtitle">Sign in to continue</p>
        </div>

        <div className="login-toggle">
          <button
            className={`toggle-btn ${loginType === "admin" ? "active" : ""}`}
            onClick={() => {
              setLoginType("admin");
              setError("");
            }}
          >
            Admin
          </button>
          <button
            className={`toggle-btn ${loginType === "stock" ? "active" : ""}`}
            onClick={() => {
              setLoginType("stock");
              setError("");
            }}
          >
            Stock Manager
          </button>
          <div className={`toggle-indicator ${loginType}`}></div>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder=" "
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="input-label">Email</label>
            <span className="input-highlight"></span>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder=" "
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="input-label">Password</label>
            <span className="input-highlight"></span>
          </div>

          {error && (
            <div className="error-message" key={error}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`login-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
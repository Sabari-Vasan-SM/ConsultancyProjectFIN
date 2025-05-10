import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState("customer");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call with timeout for customer login
    setTimeout(() => {
      if (loginType === "customer" && email === "user@gmail.com" && password === "user") {
        navigate("/home");
      } else if (loginType === "customer") {
        setError("Invalid Email or Password");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleRedirect = () => {
    window.location.href = "https://billing-stock-management-system.vercel.app/";
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">
            {loginType === "customer" ? "Customer Portal" : "Stock Management"}
          </h2>
          <p className="login-subtitle">Sign in to continue</p>
        </div>

        {/* Toggle between Customer Portal and Stock Management */}
        <div className="login-toggle">
          <button
            className={`toggle-btn ${loginType === "customer" ? "active" : ""}`}
            onClick={() => {
              setLoginType("customer");
              setError(""); // Clear error
            }}
          >
            Customer
          </button>
          <button
            className={`toggle-btn ${loginType === "stock" ? "active" : ""}`}
            onClick={() => {
              setLoginType("stock");
              setError(""); // Clear error
            }}
          >
            Stock Management
          </button>
          <div className={`toggle-indicator ${loginType}`}></div>
        </div>

        {/* Form for Customer Login */}
        {loginType === "customer" && (
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
              {isLoading ? <span className="spinner"></span> : "Login"}
            </button>
          </form>
        )}

        {/* Button for Stock Management */}
        {loginType === "stock" && (
          <div className="stock-management">
            <button onClick={handleRedirect} className="redirect-button">
              Login as Owner
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerLogin;

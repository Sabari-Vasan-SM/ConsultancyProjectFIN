import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const hasCapital = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLengthValid = password.length <= 15;
    return hasCapital && hasSpecial && isLengthValid;
  };

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return "";
    if (password.length < 6) return "Weak";

    const hasCapital = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (hasCapital && hasNumber && hasSpecial && password.length >= 8) {
      return "Strong";
    } else if ((hasCapital || hasSpecial) && password.length >= 6) {
      return "Medium";
    }
    return "Weak";
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!validatePassword(password)) {
      setError(
        "Password must have at least one capital letter, one special character, and be no longer than 15 characters."
      );
      setIsLoading(false);
      return;
    }

    // Simulate API login
    setTimeout(() => {
      if (loginType === "customer") {
        navigate("/home");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleRedirect = () => {
    window.location.href = "https://billing-and-stock-management-11.vercel.app/";
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
              setError("");
            }}
          >
            Customer
          </button>
          <button
            className={`toggle-btn ${loginType === "stock" ? "active" : ""}`}
            onClick={() => {
              setLoginType("stock");
              setError("");
            }}
          >
            Stock Management
          </button>
          <div className={`toggle-indicator ${loginType}`}></div>
        </div>

        {/* Customer Login Form */}
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

            <div className="input-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder=" "
                className="login-input"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordStrength(checkPasswordStrength(e.target.value));
                }}
              />
              <label className="input-label">Password</label>
              <span className="input-highlight"></span>
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🔒" : "🔓"}
              </button>
            </div>

            {password && (
              <div className={`password-strength ${passwordStrength.toLowerCase()}`}>
                Strength: {passwordStrength}
              </div>
            )}

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

        {/* Stock Management Redirect */}
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

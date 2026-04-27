import React, { useState } from "react";
import axios from "axios";

function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL =
    "https://personalized-news-aggregator-with-bias.onrender.com/api/users";

  // 🔐 Login
  const loginUser = () => {
    setLoading(true);

    axios
      .post(`${BASE_URL}/login`, {
        email,
        password,
      })
      .then((res) => {
        localStorage.setItem("token", res.data);
        onLogin();
      })
      .catch(() => alert("Invalid credentials. Please try again."))
      .finally(() => setLoading(false));
  };

  // 👤 Register
  const registerUser = () => {
    setLoading(true);

    axios
      .post(`${BASE_URL}/register`, {
        name,
        email,
        password,
      })
      .then(() => {
        alert("Account created successfully ✅");

        setIsRegister(false);
        setName("");
        setEmail("");
        setPassword("");
      })
      .catch(() => alert("Registration failed. Please try again."))
      .finally(() => setLoading(false));
  };

  const features = [
    {
      icon: "😊",
      name: "Sentiment Analysis",
      desc: "Real-time emotional scoring for articles",
    },
    {
      icon: "⚖️",
      name: "Bias Detection",
      desc: "Detect political/editorial slant",
    },
    {
      icon: "🚨",
      name: "Fake News Check",
      desc: "AI-powered credibility verification",
    },
    {
      icon: "📊",
      name: "Smart Dashboard",
      desc: "Live analytics on your news feed",
    },
    {
      icon: "👤",
      name: "Personalized Feed",
      desc: "Curated news based on interests",
    },
    {
      icon: "🌙",
      name: "Dark Mode",
      desc: "Comfortable night reading UI",
    },
  ];

  return (
    <div className="login-page">
      {/* Background */}
      <div className="login-bg-grid"></div>
      <div className="login-bg-glow"></div>

      {/* Header */}
      <header className="login-masthead">
        <div className="login-masthead-rule">
          <div className="login-masthead-rule-line"></div>
          <div className="login-masthead-rule-diamond"></div>
          <div className="login-masthead-rule-line"></div>
        </div>

        <h1 className="login-title">
          Personalized <span>News Aggregator</span>
        </h1>

        <p className="login-subtitle">
          AI Powered News Analysis Platform
        </p>
      </header>

      {/* Main Section */}
      <div className="login-wrapper">

        {/* Auth Card */}
        <div className="login-card">
          <h2 className="login-card-title">
            {isRegister ? "Create Account" : "Sign In"}
          </h2>

          <p className="login-card-sub">
            {isRegister
              ? "Join the platform"
              : "Access your smart dashboard"}
          </p>

          {/* Name */}
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name</label>

              <input
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>

            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !isRegister &&
                loginUser()
              }
            />
          </div>

          {/* Submit */}
          <button
            className="login-submit-btn"
            onClick={isRegister ? registerUser : loginUser}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : isRegister
              ? "Create Account"
              : "Sign In"}
          </button>

          {/* Toggle */}
          <div className="login-toggle">
            <p className="login-toggle-text">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}
            </p>

            <button
              className="login-toggle-btn"
              onClick={() =>
                setIsRegister(!isRegister)
              }
            >
              {isRegister
                ? "Go to Sign In"
                : "Create Account"}
            </button>
          </div>
        </div>

        {/* Features Card */}
        <div className="feature-card">
          <h2 className="feature-card-title">
            Platform Features
          </h2>

          <p className="feature-card-sub">
            What you get with access
          </p>

          <div className="feature-list">
            {features.map((item, index) => (
              <div
                className="feature-item"
                key={index}
              >
                <div className="feature-item-icon">
                  {item.icon}
                </div>

                <div>
                  <div className="feature-item-name">
                    {item.name}
                  </div>

                  <div className="feature-item-desc">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
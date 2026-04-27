import React, { useState } from "react";
import axios from "axios";

function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUser = () => {
    setLoading(true);
    axios
      .post("http://localhost:8080/api/users/login", { email, password })
      .then((res) => {
        localStorage.setItem("token", res.data);
        onLogin();
      })
      .catch(() => alert("Invalid credentials. Please try again."))
      .finally(() => setLoading(false));
  };

  const registerUser = () => {
    setLoading(true);
    axios
      .post("http://localhost:8080/api/users/register", { name, email, password })
      .then(() => {
        alert("Account created successfully.");
        setIsRegister(false);
        setName(""); setEmail(""); setPassword("");
      })
      .catch(() => alert("Registration failed. Please try again."))
      .finally(() => setLoading(false));
  };

  const features = [
    { icon: "😊", name: "Sentiment Analysis", desc: "Real-time emotional tone scoring on every article" },
    { icon: "⚖️", name: "Bias Detection",     desc: "Political and editorial slant identification" },
    { icon: "🚨", name: "Fake News Check",    desc: "AI-powered credibility verification engine" },
    { icon: "📊", name: "Smart Dashboard",    desc: "Live analytics across your personalized feed" },
    { icon: "👤", name: "Personalized Feed",  desc: "Topic-based curation tailored to your interests" },
    { icon: "🌙", name: "Dark Mode",          desc: "Easy-on-the-eyes night reading experience" },
  ];

  return (
    <div className="login-page">
      {/* Background Grid */}
      <div className="login-bg-grid" />
      <div className="login-bg-glow" />

      {/* Masthead */}
      <header className="login-masthead">
        <div className="login-masthead-rule">
          <div className="login-masthead-rule-line" />
          <div className="login-masthead-rule-diamond" />
          <div className="login-masthead-rule-line" />
        </div>
        <h1 className="login-title">
          The <span>Intelligence</span> Bureau
        </h1>
        <p className="login-subtitle">AI-Powered News Analysis Platform</p>
      </header>

      {/* Cards */}
      <div className="login-wrapper">

        {/* Auth Card */}
        <div className="login-card">
          <h2 className="login-card-title">
            {isRegister ? "Create Account" : "Sign In"}
          </h2>
          <p className="login-card-sub">
            {isRegister ? "Join the bureau" : "Access your feed"}
          </p>

          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isRegister && loginUser()}
            />
          </div>

          <button
            className="login-submit-btn"
            onClick={isRegister ? registerUser : loginUser}
            disabled={loading}
          >
            {loading ? "Processing..." : isRegister ? "Create Account" : "Sign In"}
          </button>

          <div className="login-toggle">
            <p className="login-toggle-text">
              {isRegister ? "Already have an account?" : "Don't have an account?"}
            </p>
            <button
              className="login-toggle-btn"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Go to Sign In" : "Create Account"}
            </button>
          </div>
        </div>

        {/* Features Card */}
        <div className="feature-card">
          <h2 className="feature-card-title">Platform Features</h2>
          <p className="feature-card-sub">What you get with access</p>

          <div className="feature-list">
            {features.map((f, i) => (
              <div className="feature-item" key={i}>
                <div className="feature-item-icon">{f.icon}</div>
                <div>
                  <div className="feature-item-name">{f.name}</div>
                  <div className="feature-item-desc">{f.desc}</div>
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
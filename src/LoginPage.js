import React, { useState } from "react";
import axios from "axios";

function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔐 Login
  const loginUser = () => {
    axios.post("http://localhost:8080/api/users/login", {
      email,
      password
    })
    .then((res) => {
      localStorage.setItem("token", res.data);
      onLogin();
    })
    .catch(() => alert("Invalid Login"));
  };

  // 👤 Register
  const registerUser = () => {
    axios.post("http://localhost:8080/api/users/register", {
      name,
      email,
      password
    })
    .then(() => {
      alert("Registered Successfully ✅");
      setIsRegister(false);
      setName("");
      setEmail("");
      setPassword("");
    })
    .catch(() => alert("Registration Failed ❌"));
  };

  return (
    <div className="login-page">
      <header className="hero">
        <h1>📰 Personalized News Aggregator</h1>
        <p>AI Powered News Analysis Platform</p>
      </header>

      <div className="login-wrapper">

        {/* Auth Card */}
        <div className="login-card">
          <h2>{isRegister ? "👤 Register" : "🔐 Login"}</h2>

          {isRegister && (
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {isRegister ? (
            <button onClick={registerUser}>
              Register
            </button>
          ) : (
            <button onClick={loginUser}>
              Login
            </button>
          )}

          <p style={{ marginTop: "15px" }}>
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}
          </p>

          <button
            onClick={() => setIsRegister(!isRegister)}
            style={{
              background: "#1565c0",
              marginTop: "8px"
            }}
          >
            {isRegister ? "Go to Login" : "Create Account"}
          </button>
        </div>

        {/* Feature Card */}
        <div className="feature-card">
          <h2>🚀 Project Features</h2>
          <p>😊 Sentiment Analysis</p>
          <p>⚖️ Bias Detection</p>
          <p>🚨 Fake News Check</p>
          <p>📊 Smart Dashboard</p>
          <p>👤 Personalized Feed</p>
          <p>🌙 Dark Mode</p>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
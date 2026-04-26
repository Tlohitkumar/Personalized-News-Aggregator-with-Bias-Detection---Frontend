import React, { useState } from "react";
import axios from "axios";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  return (
    <div className="login-page">
      <header className="hero">
        <h1>📰 Personalized News Aggregator</h1>
        <p>AI Powered News Analysis Platform</p>
      </header>

      <div className="login-wrapper">
        <div className="login-card">
          <h2>🔐 Login</h2>

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

          <button onClick={loginUser}>Login</button>
        </div>

        <div className="feature-card">
          <h2>🚀 Project Features</h2>
          <p>😊 Sentiment Analysis</p>
          <p>⚖️ Bias Detection</p>
          <p>🚨 Fake News Check</p>
          <p>📊 Smart Dashboard</p>
          <p>👤 Personalized Feed</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
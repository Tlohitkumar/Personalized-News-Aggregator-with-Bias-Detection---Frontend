import React, { useState } from "react";
import { loginUser } from "./services/userService";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    loginUser({ email, password })
      .then(res => {
        localStorage.setItem("token", res.data);
        alert("Login Success");
      })
      .catch(err => {
        alert("Login Failed ❌");
        console.log(err);
      });
  }; // ✅ MISSING BRACKET FIXED

  return (
    <div>
      <h2>Login</h2>

      <input 
        type="email" 
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input 
        type="password" 
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default App;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const formData = new URLSearchParams({
        username: username,
        password: password,
      });

      const response = await axios.post(
        "http://localhost:8080/login",
        formData,
        {
          headers: { "Content-type": "application/x-www-form-urlencoded" },
        }
      );
      // Pass user data to the parent component
      const user = response.data;
      props.LOGin(user.userid, user.username, user.admin);
      // Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login Failed");
    }
  };

  return (
    <div
      className="container mt-5 p-4"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.7)", // Adjust the alpha value for the glass effect
        borderRadius: "8px",
        width: "300px", // Set the width to make it smaller
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", // Add a subtle shadow
      }}
    >
      <h2>Login</h2>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-control mb-2"
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control mb-2"
        />
      </label>
      <button onClick={handleLogin} className="btn btn-primary">
        Login
      </button>
    </div>
  );
};

export default Login;

import React, { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./loginPanel.css";

function LoginPanel({ onLogin }) {
  let navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState("");

  const handleLogin = useCallback((e) => {
    e.preventDefault(); // Zapobiega domyślnemu zachowaniu formularza (przeładowanie strony)

    axios
      .post(
        `http://localhost:8080/api/auth/login`,
        { username, password }, // Dane do wysłania jako obiekt
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Response from server:", response);
        if (response.data && response.data.token) {
          Cookies.set("accessTokenFront", response.data.token, { expires: 1, path: '/' }); // Zapisz ciasteczko z okresem ważności 1 dzień
          onLogin(true);
                    
        } else {
          console.error("No token in server response.");
        }
        setInfo("Logged in successfully!");
        //onLogin(true); // Aktualizuj stan logowania
        navigate("/api/home");
      })
      .catch((error) => {
        if (error.response) {
          console.log("Server responded with an error:", error.response.data);
          if (error.response.status === 401) {
            alert("Invalid email or password. Please try again.");
            sessionStorage.clear();
          } else {
            alert("An error occurred. Please try again later.");
          }
        }
        console.log(error);
      });
  }, [username, password, onLogin, navigate]);

  return (
    <>
      <div className="main-container">
        <div className="signInForm">
        <h3>
            <span className="welcome-text">Welcome to </span>
            <span className="argonout-text">Argonout Game!</span>
        </h3>
          <h5>Login in to continue</h5>
          <br/>
          <br/>
          <form className="form-container" onSubmit={handleLogin}>
            <input
              className="text-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <input
              className="text-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="another-option-btn">
              Don't have an account?&nbsp;
              <Link to="/auth/register" className="register-link">Sign up!</Link>
            </div>
            <br/>
            {info && <p className="error-message">{info}</p>}
            <button
              className="submit-btn"
              type="submit"
              id="SignInButton"
              name="SignInButton"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPanel;

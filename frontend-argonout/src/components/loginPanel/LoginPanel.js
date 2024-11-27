import React, { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "./../../contexts/UserContext";
import axios from "axios";
import Cookies from "js-cookie";
import "./loginPanel.css";

function LoginPanel({ onLogin }) {
  const { user } = useUser();
  let navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState("");

  const handleLogin = useCallback(
    (e) => {
      e.preventDefault();

      axios
        .post(
          `http://localhost:8080/api/auth/login`,
          { username, password },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.data && response.data.token) {
            Cookies.set("accessTokenFront", response.data.token, {
              expires: 1,
              path: "/",
            });
            onLogin(true);
          } else {
            console.error("Brak tokenu w odpowiedzi z serwera.");
          }
          setInfo("Zalogowano pomyślnie!");
          navigate("/api/home");
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              alert("Niepoprawny login lub hasło. Spróbuj ponownie.");
              sessionStorage.clear();
            } else {
              alert("Wystąpił nieznany błąd. Spróbuj ponownie później.");
            }
          }
          console.log(error);
        });
    },
    [username, password, onLogin, navigate]
  );

  return (
    <div className="main-container">
      <div className="login-right">
        <h3>
          <span className="welcome-text">Witaj w </span>
          <span className="argonout-text">Argonout!</span>
        </h3>
        <h7>Zaloguj się, aby kontynuować</h7>
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
            Nie masz jeszcze konta?&nbsp;
            <Link to="/auth/register" className="login-register-link">
              Zarejestruj się!
            </Link>
          </div>
          {info && <p className="error-message">{info}</p>}
          <button
            className="submit-btn"
            type="submit"
            id="SignInButton"
            name="SignInButton"
          >
            Zaloguj
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPanel;

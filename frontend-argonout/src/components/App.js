import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import HomePage from "./appContent/HomePanel";
import LoginPanel from "./loginPanel/LoginPanel";
import RegisterPage from "./loginPanel/RegisterPanel";
import Cookies from "js-cookie";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("accessTokenFront")); 

  useEffect(() => {
    setIsLoggedIn(!!Cookies.get("accessTokenFront"));
  }, []);

  const renderLoginPage = () => {
    return isLoggedIn ? (
      <Navigate to="/api/home" />
    ) : (
      <LoginPanel onLogin={setIsLoggedIn} />
    );
  };

  const renderRegisterPage = () => {
    return isLoggedIn ? <Navigate to="/api/home" /> : <RegisterPage />;
  };

  const renderHomePage = () => {
    return isLoggedIn ? <HomePage /> : <Navigate to="/api/auth/login" />;
  };


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/api/auth/login" element={renderLoginPage()} />
          <Route path="/api/auth/register" element={renderRegisterPage()} />
          <Route path="/api/home" element={renderHomePage()} />
          <Route path="/api/logout" element={renderHomePage()} />
          <Route
            path="*"
            element={
              isLoggedIn ? (
                <Navigate to="/api/home" />
              ) : (
                <Navigate to="/api/auth/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

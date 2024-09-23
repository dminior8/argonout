import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import axios from 'axios';
import Cookies from "js-cookie";
import { UserProvider } from './userProfile/UserContext';
import { routes } from "../routes/Routes";
import "./app.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("accessTokenFront"));

  useEffect(() => {
    setIsLoggedIn(!!Cookies.get("accessTokenFront"));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessTokenFront')}`,
        },
      });
      Cookies.remove('accessTokenFront');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <Router>
      <UserProvider>
        <div className="App">
          <Routes>
            {routes(isLoggedIn, setIsLoggedIn)}
          </Routes>
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import Cookies from "js-cookie";
import { UserProvider } from '../contexts/UserContext';
import { routes } from "../routes/Routes";
import "./app.css";
import { GameProvider } from "../contexts/GameContext";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("accessTokenFront"));
  

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!Cookies.get("accessTokenFront"));
    };
  
    const intervalId = setInterval(checkLoginStatus, 5000);
  
    return () => clearInterval(intervalId); 
  }, []);

  return (
    <GameProvider>
    <Router>
      <UserProvider>
        
          <div className="App">
            <Routes>
              {routes(isLoggedIn, setIsLoggedIn)}
            </Routes>
          </div>
      </UserProvider>
    </Router>
    </GameProvider>
  );
}

export default App;

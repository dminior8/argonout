import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import Sidebar from "../sidebar/Sidebar";
import "./appContent.css";

const HomePage = () => {
  const [main, setMain] = useState([]);
  const [user, setUser] = useState({ username: '', balance: 0 });
  const { productId } = useParams();
  let mainResponse;

  const fetchData = async () => {
    try {
      const token = Cookies.get("accessTokenFront");
      console.log("Access Token:", token);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="AppContent">
      <div className="main-content">
        <Sidebar /> {/* Dodajemy Sidebar */}
        <div className="container-fluid">
          <div className="right-top-container">
            <div className="right-top-item">
              <div className="d-flex align-items-center">
                <img src="/icons/star_8605046.png" alt="Icon" className="points-icon" />
                <span>LICZBA PUNKTÓW</span>
                <div className="points">900</div>
              </div>
            </div>
            <div className="right-top-item">
            <div className="top-row">
              <div className="first-element">
                <span>Srebrna Liga</span>
              </div>
              <div className="second-element">
                <Link to="/api/leaderboard" className="leaderboard-link">Pokaż ranking</Link>
              </div>
            </div>
            <div className="third-element">
              <span>Zawartość drugiego elementu</span>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

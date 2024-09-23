import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import Sidebar from "../sidebar/Sidebar";
import { useUser } from '../userProfile/UserContext';
import "./homePanel.css";

const HomePage = () => {
  const { user } = useUser(); // Use user context

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
                <span>{user?.role === 'USER' ? 'Srebrna Liga' : 'Inna Liga'}</span>
              </div>
              <div className="second-element">
                <Link to="/api/leaderboard" className="leaderboard-link">Pokaż ranking</Link>
              </div>
            </div>
            <div className="third-element">
              <span>Zdobyłeś w tym miesiącu 99 XP</span>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

import { useUser } from '../../contexts/UserContext';
import "./miniStats.css";


const MiniStats = ({isRanking, position}) => {
  const { user } = useUser();
  

  if (!user) {
    return null; // Opcjonalnie można wyświetlić spinner lub inny placeholder
  }

  return (
            <div className="right-top-container">
                <div style={{height:"4rem"}} className="right-top-item">
                    <div className="d-flex align-items-center">
                    <img src="/icons/star_8605046.png" alt="Icon" className="points-icon" />
                    <span>LICZBA PUNKTÓW</span>
                    <div className="points">{user.points}</div>
                    </div>
                </div>
                <div style={{display: isRanking ? "none" : "block"}} className="right-top-item">
                    <div className="top-row">
                        <div style={{marginLeft: "10pt"}} className="first-element">
                            <span>{user.league ? user.league.name : "Liga nieznana"}</span>
                        </div>
                        <div className="second-element">
                            <Link to="/leaderboard" className="leaderboard-link">Pokaż ranking</Link>
                        </div>
                    </div>
                    <div className="third-element">
                        <span>Zdobyłeś w tym miesiącu {user.points} punktów</span>
                    </div>
                </div>
                <div 
                style={{height: "10rem", flexDirection:"column", textAlign: "center", padding: "10pt", display: isRanking ? "block" : "none"}} 
                className="right-top-item"
                >
                    <div style={{
                        padding:"5pt", 
                        fontSize: "15pt", 
                        borderBottom:"#2F7A7E 1px solid"
                         
                        }} className="first-element-ranking">
                        <span>Zajmujesz miejsce <b>#{position !== null ? position : "..."}</b></span>
                    </div>

                    <div style={{marginTop:"10pt", fontSize: "11pt"}}>
                        <div>
                            Do awansu zostało 
                        </div>
                        <div className="ranking-points">
                            {user.league ? user.league.maxPoints - user.points + 1 : "..."} punktów
                        </div>
                    </div>
                </div>
            </div>
  );
};

export default MiniStats;

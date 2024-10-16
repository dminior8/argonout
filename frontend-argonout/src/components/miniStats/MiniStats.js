import React from "react";
import { Link } from "react-router-dom";

import { useUser } from '../../contexts/UserContext';


const MiniStats = () => {
  const { user } = useUser();

  return (
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
  );
};

export default MiniStats;

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import './sidebar.css'; // Import stylów dla Sidebar

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>
        <Link to="/home">
        <img src="/logo.png" alt="Logo" className="sidebar-logo" /> 
        </Link>
      </h2>
      <br/>
      <br/>
      <ul>
        <li>
          <Button
            variant="outlined"
            startIcon={<img src="/icons/home_4917086.png"  alt="Icon" className="button-icon" />} 
            >
            <Link to="/home">Graj</Link>
          </Button>

        </li>
        <li>
        <Button
            variant="outlined"
            startIcon={<img src="/icons/rocket_1012233.png"  alt="Icon" className="button-icon" />} 
            >
            <Link to="/home">Tryb wyzwania</Link>
          </Button>
        </li>
        <li>
        <Button
            variant="outlined"
            startIcon={<img src="/icons/trophy_11114779.png"  alt="Icon" className="button-icon" />} 
            >
            <Link to="/leaderboard">Ranking</Link>
          </Button>
        </li>
        <li>
        <Button
            variant="outlined"
            startIcon={<img src="/icons/note_2356169.png"  alt="Icon" className="button-icon" />} 
            >
            <Link to="/forum">Forum</Link>
          </Button>
        </li>
        <li>
        <Button
            variant="outlined"
            startIcon={<img src="/icons/folder_5679940.png"  alt="Icon" className="button-icon" />}
            >
            <Link to="/settings">Ustawienia</Link>
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
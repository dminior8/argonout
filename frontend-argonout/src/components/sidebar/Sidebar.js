import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import axios from 'axios';
import Cookies from "js-cookie";
import { useUser } from '../userProfile/UserContext';
import './sidebar.css'; // Import stylów dla Sidebar

const Sidebar = () => {
  const { user } = useUser(); // Use user context
  const [isOpen, setIsOpen] = useState(true); // Stan do zarządzania widocznością paska bocznego

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Przełączanie widoczności paska bocznego
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessTokenFront')}`,
        },
      });
      Cookies.remove('accessTokenFront');
      window.location.reload(true);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <>
      <button className="sidebar-button" onClick={toggleSidebar}>
        ☰ {/* Ikona hamburgera */}
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
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
              startIcon={<img src="/icons/home_4917086.png" alt="Icon" className="button-icon" />}
            >
              <Link to="/home">Graj</Link>
            </Button>
          </li>
          <li>
            <Button
              variant="outlined"
              startIcon={<img src="/icons/rocket_1012233.png" alt="Icon" className="button-icon" />}
            >
              <Link to="/adventure">Tryb wyzwania</Link>
            </Button>
          </li>
          <li>
            <Button
              variant="outlined"
              startIcon={<img src="/icons/trophy_11114779.png" alt="Icon" className="button-icon" />}
            >
              <Link to="/leaderboard">Ranking</Link>
            </Button>
          </li>
          <li>
            <Button
              variant="outlined"
              startIcon={<img src="/icons/note_2356169.png" alt="Icon" className="button-icon" />}
            >
              <Link to="/forum">Forum</Link>
            </Button>
          </li>

          {user?.role === 'ADMIN' ? (
            <li>
              <Button
                variant="outlined"
                startIcon={<img src="/icons/briefcase_6616238.png" alt="Icon" className="button-icon" />}
              >
                <Link to="/api/management">Zarządzanie</Link>
              </Button>
            </li>
          ) : null}

          <li>
            <Button
              variant="outlined"
              startIcon={<img src="/icons/folder_5679940.png" alt="Icon" className="button-icon" />}
            >
              <Link to="/api/users/me">Ustawienia</Link>
            </Button>
          </li>

          <li>
            <Button
              variant="outlined"
              startIcon={<img src="/icons/exit_11820530.png" alt="Icon" className="button-icon" />}
              onClick={handleLogout}
            >
              Wyloguj
            </Button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;

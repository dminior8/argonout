import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import axios from 'axios';
import Cookies from "js-cookie";
import { useUser } from '../../contexts/UserContext';
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
      <div className={`sidebar ${isOpen ? 'open' : '' }`}>
        <h2>
          <Link to="/home">
            <img src="/logo.png" alt="Logo" className="sidebar-logo" /> 
          </Link>
        </h2>
        <br/>
        <br/>
        <ul>
          <li>
          <Link to="/home">
              <Button
                variant="outlined"
                startIcon={<img src="/icons/home_4917086.png" alt="Icon" className="button-icon" />}
              >
                Graj
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/adventure">
              <Button
                variant="outlined"
                startIcon={<img src="/icons/rocket_1012233.png" alt="Icon" className="button-icon" />}
              >
                Tryb wyzwania
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/leaderboard">
              <Button
                variant="outlined"
                startIcon={<img src="/icons/trophy_11114779.png" alt="Icon" className="button-icon" />}
              >
                Ranking
              </Button>
            </Link>
          </li>
          <li>
          <Link to="/forum">
            <Button
              variant="outlined"
              startIcon={<img src="/icons/note_2356169.png" alt="Icon" className="button-icon" />}
            >
              Forum
            </Button>
          </Link>
          </li>

          {user?.role === 'ADMIN' ? (
            <li>
              <Link to="/management">
                <Button
                  variant="outlined"
                  startIcon={<img src="/icons/briefcase_6616238.png" alt="Icon" className="button-icon" />}
                >
                  Zarządzanie
                </Button>
              </Link>
            </li>
          )  : null}

          <li>
          <Link to="/users/me">
            <Button
              variant="outlined"
              startIcon={<img src="/icons/folder_5679940.png" alt="Icon" className="button-icon" />}
            >
              Ustawienia
            </Button>
          </Link>
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

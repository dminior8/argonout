import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { useUser } from '../../../contexts/UserContext'; // Importujemy nasz kontekst użytkownika
import './managementMenu.css'; // Importujemy stylizacje
import Sidebar from '../../sidebar/Sidebar';

const ManagementMenu = () => {
  const { user } = useUser(); // Pobieramy dane użytkownika z kontekstu

  if (user?.role !== 'ADMIN') {
    return null; // Nie pokazujemy komponentu jeśli użytkownik nie jest administratorem
  }

  return (
    <div className="AppContent">
      <div className="main-content">
        <Sidebar />
        <div className="container-fluid">
          <div className="management-menu">
            <div className="menu-items">
              <Button
                className="menu-button"
                component={Link}
                to="/api/users"
              >
                Użytkownicy
              </Button>

              <Button
                className="menu-button"
                component={Link}
                to="/messages"
              >
                Wiadomości
              </Button>

              <Button
                className="menu-button"
                component={Link}
                to="/tours"
              >
                Miejsca
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementMenu;

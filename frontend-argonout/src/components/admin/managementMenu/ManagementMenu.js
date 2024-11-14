import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { useUser } from '../../../contexts/UserContext';
import './managementMenu.css';
import Sidebar from '../../sidebar/Sidebar';

const ManagementMenu = () => {
  const { user } = useUser(); 

  if (user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="AppContent">
      <div className="main-content">
        <Sidebar />
        <div className="container-fluid">
          <div className="management-menu">
            <h2>Panel Zarządzania</h2>
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
                to="/management/messages"
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

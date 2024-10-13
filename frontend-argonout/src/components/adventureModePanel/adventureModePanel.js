import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from 'axios';

import Sidebar from "../sidebar/Sidebar";
import BasicMap from "../map/BasicMap";
import MiniStats from "../miniStats/MiniStats";
import { useUser } from '../userProfile/UserContext';
// import './homePanel.css';


const AdventureModePanel = () => {
  const { user } = useUser();

  return (
    <div className="AppContent">
        <Sidebar />
        <MiniStats />
        <BasicMap/>
    </div>
  );
};

export default AdventureModePanel;

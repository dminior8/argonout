// routes.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import HomePage from '../components/homePanel/HomePanel';
import LoginPanel from '../components/loginPanel/LoginPanel';
import RegisterPage from '../components/loginPanel/RegisterPanel';
import UserProfile from '../components/userProfile/UserProfile';
import ManagementMenu from '../components/admin/managementMenu/ManagementMenu';
import AdventureModePanel from '../components/adventureModePanel/AdventureModePanel';
import LeaderboardPanel from '../components/leaderboard/LeaderboardPanel';
import MessagesPanel from '../components/messages/MessagesPanel';
import ReceivedMessagesPanel from '../components/admin/receivedMessagesPanel/ReceivedMessagesPanel';
import RouteEditorPanel from '../components/admin/routeEditorPanel/RouteEditorPanel';
import ProtectedRoute from './ProtectedRoute';

export const routes = (isLoggedIn, onLogin) => (
  <>
    <Route
      path="/auth/login"
      element={isLoggedIn ? <Navigate to="/home" /> : <LoginPanel onLogin={onLogin} />}
    />
    <Route
      path="/auth/register"
      element={isLoggedIn ? <Navigate to="/home" /> : <RegisterPage />}
    />
    <Route
      path="/home"
      element={
        <ProtectedRoute>
          {isLoggedIn ? <HomePage /> : <Navigate to="/auth/login" />}
        </ProtectedRoute>
      }
    />
    <Route
      path="/adventure"
      element={isLoggedIn ? <AdventureModePanel /> : <Navigate to="/auth/login" />}
    />
    <Route
      path="/leaderboard"
      element={isLoggedIn ? <LeaderboardPanel /> : <Navigate to="/auth/login" />}
    />
    <Route
      path="/messages"
      element={isLoggedIn ? <MessagesPanel /> : <Navigate to="/auth/login" />}
    />
    <Route
      path="/users/me"
      element={isLoggedIn ? <UserProfile /> : <Navigate to="/auth/login" />}
    />
    <Route
      path="/management"
      element={isLoggedIn ? <ManagementMenu /> : <Navigate to="/auth/login" />}
    />
    <Route
      path="/management/messages"
      element={isLoggedIn ? <ReceivedMessagesPanel /> : <Navigate to="/auth/login" />}
    />
    <Route
      path="/management/routes"
      element={isLoggedIn ? <RouteEditorPanel /> : <Navigate to="/auth/login" />}
    />
    <Route
      path="/users/all"
      element={isLoggedIn ? <HomePage /> : <Navigate to="/auth/login" />}
    />
    <Route
      path="*"
      element={<Navigate to={isLoggedIn ? "/home" : "/auth/login"} />}
    />
  </>
);

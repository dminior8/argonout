// routes.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import HomePage from '../components/homePanel/HomePanel';
import LoginPanel from '../components/loginPanel/LoginPanel';
import RegisterPage from '../components/loginPanel/RegisterPanel';
import UserProfile from '../components/userProfile/UserProfile';
import ManagementMenu from '../components/admin/managementMenu/ManagementMenu';

export const routes = (isLoggedIn, onLogin) => (
  <>
    <Route
      path="/api/auth/login"
      element={isLoggedIn ? <Navigate to="/api/home" /> : <LoginPanel onLogin={onLogin} />}
    />
    <Route
      path="/api/auth/register"
      element={isLoggedIn ? <Navigate to="/api/home" /> : <RegisterPage />}
    />
    <Route
      path="/api/home"
      element={isLoggedIn ? <HomePage /> : <Navigate to="/api/auth/login" />}
    />
    <Route
      path="/api/users/me"
      element={isLoggedIn ? <UserProfile /> : <Navigate to="/api/auth/login" />}
    />
    <Route
      path="/api/management"
      element={isLoggedIn ? <ManagementMenu /> : <Navigate to="/api/auth/login" />}
    />
    <Route
      path="/api/users/all"
      element={isLoggedIn ? <HomePage /> : <Navigate to="/api/auth/login" />}
    />
    <Route
      path="*"
      element={<Navigate to={isLoggedIn ? "/api/home" : "/api/auth/login"} />}
    />
  </>
);

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { useAccount } from '/imports/startup/hooks';

import MainLayout from './layouts/MainLayout';
import GeneralLayout from './layouts/GeneralLayout';

import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/login/Login';

const PrivateRoute = ({ component: Component }) => {

  const { isLoggedIn, isLoggingIn } = useAccount();

  if (!isLoggingIn && !isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <Component />
}

const ProtectedLogging = ({ component: Component }) => {
  const { isLoggedIn } = useAccount();

  if (!isLoggedIn) {
    return <Component />
  }

  return <Navigate to="/" />;
}

export const App = () => (
  <>
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<PrivateRoute component={Dashboard} />} />          
        </Route>
        <Route element={<GeneralLayout />}>
          <Route path="/login" element={<ProtectedLogging component={Login} />} />
        </Route>
      </Routes>
    </Router>
  </>
);

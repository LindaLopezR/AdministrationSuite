import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { useAccount } from '/imports/startup/hooks';

import MainLayout from './layouts/MainLayout';
import GeneralLayout from './layouts/GeneralLayout';

import AuditCompliance from './pages/companyDetail/auditCompliance/AuditCompliance';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/login/Login';
import OnTime from './pages/companyDetail/onTime/OnTime';
import Participation from './pages/companyDetail/participation/Participation';
import Score from './pages/companyDetail/score/Score';

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
          <Route path="/companyDetail/:id" element={<PrivateRoute component={Participation} />} />
          <Route path="/companyDetail/auditCompliance/:id" element={<PrivateRoute component={AuditCompliance} />} />
          <Route path="/companyDetail/onTime/:id" element={<PrivateRoute component={OnTime} />} />
          <Route path="/companyDetail/score/:id" element={<PrivateRoute component={Score} />} />
        </Route>
        <Route element={<GeneralLayout />}>
          <Route path="/login" element={<ProtectedLogging component={Login} />} />
        </Route>
      </Routes>
    </Router>
  </>
);

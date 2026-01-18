
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Shell } from './components/layout/Shell';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Persons } from './pages/Persons';
import { Lands } from './pages/Lands';
import { Houses } from './pages/Houses';
import { Certificates } from './pages/Certificates';
import { Community } from './pages/Community';
import { Requests } from './pages/Requests';
import { Complaints } from './pages/Complaints';
import { Events } from './pages/Events';
import { Conferences } from './pages/Conferences';
import { Messages } from './pages/Messages';
import { VirtualVillage } from './pages/VirtualVillage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'GRAMA_NILADHARI' | 'VILLAGER' | null>(null);

  const handleLogin = (role: 'GRAMA_NILADHARI' | 'VILLAGER') => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Shell userRole={userRole || ''} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/village-map" element={<VirtualVillage />} />
          <Route path="/persons" element={<Persons />} />
          <Route path="/lands" element={<Lands />} />
          <Route path="/houses" element={<Houses />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/community" element={<Community />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/events" element={<Events />} />
          <Route path="/conferences" element={<Conferences />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Shell>
    </Router>
  );
};

export default App;

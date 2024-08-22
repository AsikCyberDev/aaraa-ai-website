import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ChatbotLogin from './components/ChatbotLogin';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        {isAuthenticated && <Navbar onLogout={handleLogout} />}
        <Layout.Content>
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated
                  ? <Navigate to="/dashboard" replace />
                  : <ChatbotLogin onLogin={handleLogin} />
              }
            />
            <Route
              path="/*"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </Layout.Content>
      </Layout>
    </Router>
  );
};

export default App;
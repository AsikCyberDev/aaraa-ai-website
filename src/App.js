import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ChatbotLogin from './components/ChatbotLogin';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

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

  const handleLoginToggle = (checked) => {
    setIsLogin(checked);
  };

  return (
    <Router>
      <Layout className="app-layout">
        <Navbar
          onLogout={handleLogout}
          isAuthenticated={isAuthenticated}
          onLoginToggle={handleLoginToggle}
          isLogin={isLogin}
        />
        <Layout.Content className="app-content">
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <ChatbotLogin onLogin={handleLogin} isLogin={isLogin} />
                )
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
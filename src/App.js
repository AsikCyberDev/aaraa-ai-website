import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import ChatBotWrapper from './ChatBotWrapper';
import ChatbotLogin from './components/ChatbotLogin';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';

const AppContent = ({ isAuthenticated, handleLogin, handleLogout, handleLoginToggle, isLogin }) => {
  const location = useLocation();

  return (
    <Layout className="app-layout">
      <Navbar
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
        onLoginToggle={handleLoginToggle}
        isLogin={isLogin}
        currentPath={location.pathname}
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
        {/* ChatBotWrapper integration */}
        <ChatBotWrapper
          endpoint="https://github-aaraa-ai.vercel.app/api/chat"
          heading="AI Assistant"
          theme="dark"
          initialModel="gpt-4o"
          initialTemperature={0.7}
          initialMaxTokens={2048}
          initialTopP={0.9}
        />
      </Layout.Content>
    </Layout>
  );
};

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
      <AppContent
        isAuthenticated={isAuthenticated}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        handleLoginToggle={handleLoginToggle}
        isLogin={isLogin}
      />
    </Router>
  );
};

export default App;

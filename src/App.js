import { Layout } from 'antd';

import 'devextreme/dist/css/dx.light.css';
import React, { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import './styles.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Layout className="layout">
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
          } />
          <Route path="/*" element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
import React, { useState } from 'react';
import { Layout } from 'antd';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Profile from './Profile';
import MyChatbots from './MyChatbots';
import UploadDocuments from './UploadDocuments';
import Analytics from './Analytics';

const { Content } = Layout;

function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="dashboard-layout">
      <Navbar onCollapse={onCollapse} collapsed={collapsed} />
      <Content className="site-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chatbots" element={<MyChatbots />} />
          <Route path="/upload" element={<UploadDocuments />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Content>
    </Layout>
  );
}

export default Dashboard;
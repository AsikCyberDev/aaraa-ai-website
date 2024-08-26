import { Layout } from 'antd';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Analytics from './Analytics';
import MyChatbots from './MyChatbots';
import Profile from './Profile';
import Projects from './Projects';
import UploadDocuments from './UploadDocuments';

const { Content } = Layout;

function Dashboard() {
  return (
    <Content className="dashboard-content">
      <Routes>
        <Route path="/dashboard" element={<Profile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/chatbots" element={<MyChatbots />} />
        <Route path="/upload" element={<UploadDocuments />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/" element={<Profile />} />
      </Routes>
    </Content>
  );
}

export default Dashboard;
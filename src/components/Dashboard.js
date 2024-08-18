import {
  BarChartOutlined,
  RobotOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import MyChatbots from './MyChatbots';
import Profile from './Profile';
import UploadDocuments from './UploadDocuments';


const { Header, Content, Sider } = Layout;

function Dashboard() {
  const [selectedKey, setSelectedKey] = useState('1');

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <Profile />;
      case '2':
        return <MyChatbots />;
      case '3':
  return <UploadDocuments />;
      case '4':
        return <h2>Analytics (Coming Soon)</h2>;
      default:
        return <Profile />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="header" style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">Dashboard</Menu.Item>
          <Menu.Item key="2">Chatbots</Menu.Item>
          <Menu.Item key="3">Analytics</Menu.Item>
        </Menu>
      </Header>
      <Layout style={{ marginTop: 64 }}>
        <Sider width={200} className="site-layout-background" style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
            onSelect={({ key }) => setSelectedKey(key)}
          >
            <Menu.Item key="1" icon={<UserOutlined />}>
              Profile
            </Menu.Item>
            <Menu.Item key="2" icon={<RobotOutlined />}>
              My Chatbots
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              Upload Documents
            </Menu.Item>
            <Menu.Item key="4" icon={<BarChartOutlined />}>
              Analytics
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px', marginLeft: 200 }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              overflow: 'initial'
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Dashboard;
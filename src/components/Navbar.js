import {
  BarChartOutlined,
  DashboardOutlined,
  LogoutOutlined,
  RobotOutlined,
  UploadOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu, message } from 'antd';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const { Header } = Layout;

const Navbar = ({ onCollapse, collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([getCurrentMenuKey(location.pathname)]);

  function getCurrentMenuKey(pathname) {
    const pathToKey = {
      '/dashboard': '1',
      '/chatbots': '2',
      '/upload': '3',
      '/analytics': '4',
      '/profile': '5',
    };
    return pathToKey[pathname] || '1';
  }

  const handleMenuClick = (e) => {
    setSelectedKeys([e.key]);
    switch (e.key) {
      case '1':
        navigate('/dashboard');
        break;
      case '2':
        navigate('/chatbots');
        break;
      case '3':
        navigate('/upload');
        break;
      case '4':
        navigate('/analytics');
        break;
      case '5':
        navigate('/profile');
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    // Implement logout logic here
    message.success('Logged out successfully');
    navigate('/');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="0" icon={<UserOutlined />}>
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="header">
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" selectedKeys={selectedKeys} onClick={handleMenuClick}>
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          Dashboard
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
      <div className="user-menu">
        <Dropdown overlay={userMenu} trigger={['click']}>
          <button
            className="ant-dropdown-link"
            onClick={(e) => e.preventDefault()}
            aria-label="User menu"
          >
            <Avatar icon={<UserOutlined />} />
            <span>John Doe</span>
          </button>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Navbar;
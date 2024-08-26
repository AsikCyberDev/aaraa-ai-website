import {
  BarChartOutlined,
  DashboardOutlined,
  HomeOutlined,
  LogoutOutlined,
  ProjectOutlined,
  RobotOutlined,
  SettingOutlined,
  UploadOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  Avatar,
  Dropdown,
  Layout,
  Menu,
  Switch,
  message
} from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const { Header } = Layout;

const Navbar = ({ onLogout, isAuthenticated, onLoginToggle, currentPath }) => {
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState([getCurrentMenuKey(currentPath)]);
  const [userName, setUserName] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    setSelectedKeys([getCurrentMenuKey(currentPath)]);
  }, [currentPath]);

  useEffect(() => {
    if (isAuthenticated) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.name) {
        setUserName(user.name);
      }
    }
  }, [isAuthenticated]);

  function getCurrentMenuKey(pathname) {
    const pathToKey = {
      '/dashboard': '1',
      '/projects': '2',
      '/chatbots': '3',
      '/upload': '4',
      '/analytics': '5',
      '/profile': '6',
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
        navigate('/projects');
        break;
      case '3':
        navigate('/chatbots');
        break;
      case '4':
        navigate('/upload');
        break;
      case '5':
        navigate('/analytics');
        break;
      case '6':
        navigate('/profile');
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    if (typeof onLogout === 'function') {
      onLogout();
      message.success('Logged out successfully');
    } else {
      console.error('onLogout is not a function');
    }
  };

  const handleLoginToggle = (checked) => {
    setIsLogin(checked);
    if (typeof onLoginToggle === 'function') {
      onLoginToggle(checked);
    }
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

  const settingsMenu = (
    <Menu>
      <Menu.Item key="theme">
        Theme: <ThemeToggle />
      </Menu.Item>
      {!isAuthenticated && (
        <Menu.Item key="loginToggle">
          <span style={{ marginRight: '8px' }}>
            {isLogin ? 'Switch to Signup' : 'Switch to Login'}
          </span>
          <Switch
            checked={isLogin}
            onChange={handleLoginToggle}
            checkedChildren="Login"
            unCheckedChildren="Signup"
          />
        </Menu.Item>
      )}
    </Menu>
  );

  const headerStyle = {
    position: 'fixed',
    zIndex: 1,
    width: '100%',
    padding: '0 20px',
    background: 'var(--background-color)',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const logoStyle = {
    color: 'var(--primary-color)',
    fontSize: '20px',
    fontWeight: 'bold',
    marginRight: '24px'
  };

  const menuStyle = {
    flex: 1,
    background: 'transparent',
    borderBottom: 'none'
  };

  const menuItemStyle = {
    color: 'var(--text-color)'
  };

  const rightSectionStyle = {
    display: 'flex',
    alignItems: 'center'
  };

  const dropdownButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'var(--text-color)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  };

  return (
    <Header style={headerStyle}>
      <div className="logo" style={logoStyle}>
        Aaraa.Ai
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={selectedKeys}
        onClick={handleMenuClick}
        style={menuStyle}
      >
        <Menu.Item key="home" icon={<HomeOutlined />} style={menuItemStyle}>
          <a href="https://aaraa.ai" target="_blank" rel="noopener noreferrer">Portfolio</a>
        </Menu.Item>
        {isAuthenticated ? (
          <>
            <Menu.Item key="1" icon={<DashboardOutlined />} style={menuItemStyle}>Dashboard</Menu.Item>
            <Menu.Item key="2" icon={<ProjectOutlined />} style={menuItemStyle}>Projects</Menu.Item>
            <Menu.Item key="3" icon={<RobotOutlined />} style={menuItemStyle}>My Chatbots</Menu.Item>
            <Menu.Item key="4" icon={<UploadOutlined />} style={menuItemStyle}>Upload Documents</Menu.Item>
            <Menu.Item key="5" icon={<BarChartOutlined />} style={menuItemStyle}>Analytics</Menu.Item>
          </>
        ) : null}
      </Menu>
      <div style={rightSectionStyle}>
        <Dropdown overlay={settingsMenu} trigger={['click']}>
          <button
            className="ant-dropdown-link"
            onClick={(e) => e.preventDefault()}
            aria-label="Settings menu"
            style={{ ...dropdownButtonStyle, marginRight: '16px' }}
          >
            <SettingOutlined style={{ fontSize: '18px' }} />
          </button>
        </Dropdown>
        {isAuthenticated && (
          <Dropdown overlay={userMenu} trigger={['click']}>
            <button
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
              aria-label="User menu"
              style={dropdownButtonStyle}
            >
              <Avatar icon={<UserOutlined />} style={{ marginRight: '8px' }} />
              <span>{userName || 'User'}</span>
            </button>
          </Dropdown>
        )}
      </div>
    </Header>
  );
};

export default Navbar;
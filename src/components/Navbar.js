import {
  BarChartOutlined,
  DashboardOutlined,
  LogoutOutlined,
  ProjectOutlined,
  RobotOutlined,
  UploadOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const { Header } = Layout;

const Navbar = ({ onLogout, isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([getCurrentMenuKey(location.pathname)]);
  const [userName, setUserName] = useState('');

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
    <Header className="header" style={{ padding: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
        <div className="logo" style={{ width: '120px', height: '31px', background: 'rgba(255, 255, 255, 0.2)', margin: '16px 24px 16px 24px' }} />
        {isAuthenticated && (
          <>
            <div style={{ flex: 1 }}>
              <Menu theme="dark" mode="horizontal" selectedKeys={selectedKeys} onClick={handleMenuClick}>
                <Menu.Item key="1" icon={<DashboardOutlined />}>
                  Dashboard
                </Menu.Item>
                <Menu.Item key="2" icon={<ProjectOutlined />}>
                  Projects
                </Menu.Item>
                <Menu.Item key="3" icon={<RobotOutlined />}>
                  My Chatbots
                </Menu.Item>
                <Menu.Item key="4" icon={<UploadOutlined />}>
                  Upload Documents
                </Menu.Item>
                <Menu.Item key="5" icon={<BarChartOutlined />}>
                  Analytics
                </Menu.Item>
              </Menu>
            </div>
            <div className="user-menu" style={{ marginLeft: 'auto', marginRight: '24px' }}>
              <Dropdown overlay={userMenu} trigger={['click']}>
                <button
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                  aria-label="User menu"
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                >
                  <Avatar icon={<UserOutlined />} style={{ marginRight: '8px' }} />
                  <span>{userName || 'User'}</span>
                </button>
              </Dropdown>
            </div>
          </>
        )}
      </div>
    </Header>
  );
};

export default Navbar;
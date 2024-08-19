import { FacebookOutlined, GithubOutlined, GoogleOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Divider, Form, Input, Modal, Space, Tabs, message } from 'antd';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

const { TabPane } = Tabs;

const LoginComponent = ({ onLogin }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    message.success('Login successful');
    onLogin();
  };

  const onSocialLogin = (platform) => {
    console.log(`Logging in with ${platform}`);
    message.info(`${platform} login initiated`);
    // Implement actual social login logic here
  };

  const onForgotPassword = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    message.info('Password reset email sent');
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          style={{
            width: 400,
            borderRadius: '15px',
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            background: 'rgba(255, 255, 255, 0.9)'
          }}
        >
          <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
            <TabPane tab="Login" key="1">
              <Form
                name="normal_login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Password"
                  />
                </Form.Item>
                <Form.Item>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <Button type="link" onClick={onForgotPassword} style={{ float: 'right' }}>
                    Forgot password
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                    Log in
                  </Button>
                </Form.Item>
                <Divider>Or login with</Divider>
                <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
                  <Button icon={<GoogleOutlined />} onClick={() => onSocialLogin('Google')} shape="circle" />
                  <Button icon={<FacebookOutlined />} onClick={() => onSocialLogin('Facebook')} shape="circle" />
                  <Button icon={<GithubOutlined />} onClick={() => onSocialLogin('GitHub')} shape="circle" />
                </Space>
              </Form>
            </TabPane>
            <TabPane tab="Register" key="2">
              <Form
                name="register"
                onFinish={(values) => console.log('Register:', values)}
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Please input your Email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>
                <Form.Item
                  name="newUsername"
                  rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                  name="newPassword"
                  rules={[
                    { required: true, message: 'Please input your Password!' },
                    { min: 8, message: 'Password must be at least 8 characters long!' }
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                    Register
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </Card>
      </motion.div>
      <Modal
        title="Reset Password"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <p>Enter your email address to reset your password:</p>
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Modal>
    </div>
  );
};

export default LoginComponent;
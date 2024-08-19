import { FacebookOutlined, GithubOutlined, GoogleOutlined, LockOutlined, MailOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Space, Switch, message } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import backgroundImage from './background-ai.jpg';


const ChatbotLogin = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const initialMessageSent = useRef(false);

  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { text, sender }]);
  };

  const onFinish = (values) => {
    const action = isLogin ? 'Logging in' : 'Signing up';
    addMessage(`${action}...`, 'user');
    setTimeout(() => {
      addMessage(`${action} successful!`, 'bot');
      message.success(`${action} successful!`);
      onLogin();
    }, 1000);
  };

  const onSocialLogin = (platform) => {
    addMessage(`Logging in with ${platform}...`, 'user');
    message.info(`${platform} login initiated`);
  };

  useEffect(() => {
    if (!initialMessageSent.current) {
      addMessage("Welcome! Please log in or sign up to continue.", 'bot');
      const message = isLogin
        ? "Please enter your username and password to log in."
        : "Please provide your email, username, and password to sign up.";
      addMessage(message, 'bot');
      initialMessageSent.current = true;
    }
  }, [isLogin]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          width: '400px',
          height: '600px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{
          backgroundColor: '#1890ff',
          color: 'white',
          padding: '15px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '18px'
        }}>
          Chatbot Login
        </div>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '15px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{
                  alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
                  backgroundColor: msg.sender === 'bot' ? '#e6f7ff' : '#f0f0f0',
                  padding: '10px 15px',
                  borderRadius: '18px',
                  marginBottom: '10px',
                  maxWidth: '70%',
                }}
              >
                {msg.text}
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>
        <Form
          name="login_signup"
          onFinish={onFinish}
          style={{ padding: '15px' }}
        >
          {!isLogin && (
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your Email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
          )}
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
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="primary" htmlType="submit" icon={<SendOutlined />} style={{ width: '100%' }}>
                {isLogin ? 'Log in' : 'Sign up'}
              </Button>
            </motion.div>
          </Form.Item>
          <Divider>Or login with</Divider>
          <Space size="middle" style={{ width: '100%', justifyContent: 'center', marginBottom: '15px' }}>
            {['Google', 'Facebook', 'GitHub'].map((platform) => (
              <motion.div key={platform} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <Button
                  icon={platform === 'Google' ? <GoogleOutlined /> : platform === 'Facebook' ? <FacebookOutlined /> : <GithubOutlined />}
                  onClick={() => onSocialLogin(platform)}
                  shape="circle"
                  style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
                />
              </motion.div>
            ))}
          </Space>
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{isLogin ? 'New user?' : 'Already have an account?'}</span>
              <Switch
                checkedChildren="Login"
                unCheckedChildren="Signup"
                checked={isLogin}
                onChange={(checked) => setIsLogin(checked)}
              />
            </div>
          </Form.Item>
        </Form>
      </motion.div>
    </div>
  );
};

export default ChatbotLogin;
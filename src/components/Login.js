import React, { useState, useEffect, useRef } from 'react';
import { SendOutlined, SmileOutlined, LoadingOutlined, LockOutlined, GoogleOutlined, FacebookOutlined, GithubOutlined } from '@ant-design/icons';
import { Button, message, Switch, Typography } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

const { Title } = Typography;

const ChatbotLogin = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentField, setCurrentField] = useState('username');
  const messagesEndRef = useRef(null);

  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { text, sender }]);
  };

  const onInputSubmit = () => {
    if (inputValue.trim() !== '') {
      addMessage(currentField === 'password' ? '*'.repeat(inputValue.length) : inputValue, 'user');
      setInputValue('');

      if (currentField === 'username') {
        setCurrentField('password');
        addMessage('Please enter your password:', 'bot');
      } else if (currentField === 'password') {
        if (isLogin) {
          login();
        } else {
          setCurrentField('email');
          addMessage('Please enter your email:', 'bot');
        }
      } else if (currentField === 'email') {
        signup();
      }
    }
  };

  const login = () => {
    addMessage('Logging in...', 'bot');
    setIsLoading(true);
    setTimeout(() => {
      addMessage('Login successful! Welcome back to the AI Chatbot.', 'bot');
      message.success('Login successful!');
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const signup = () => {
    addMessage('Signing up...', 'bot');
    setIsLoading(true);
    setTimeout(() => {
      addMessage('Signup successful! Thank you for joining the AI Chatbot community.', 'bot');
      message.success('Signup successful!');
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const socialLogin = (platform) => {
    const emoji = platform === 'Google' ? '🌐' : platform === 'Facebook' ? '🪧' : '🐱';
    addMessage(`Logging in with ${platform} ${emoji}`, 'user');
    setIsLoading(true);
    setTimeout(() => {
      addMessage(`Login with ${platform} successful! Welcome to the AI Chatbot.`, 'bot');
      message.success(`Login with ${platform} successful!`);
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  useEffect(() => {
    addMessage('Welcome to the AI Chatbot! I\'m here to assist you. Please enter your username to get started.', 'bot');
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      overflow: 'hidden',
      position: 'relative',
      backgroundImage: 'url("https://images.unsplash.com/photo-1536183922588-166604504d5e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1349&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          width: '100%',
          maxWidth: '400px',
          height: '600px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
          background: 'linear-gradient(135deg, #1890ff, #40a9ff)', 
          color: 'white', 
          padding: '20px', 
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '20px'
        }}>
          <Title level={3} style={{ color: 'white', marginBottom: 0 }}>AI Chatbot Login</Title>
        </div>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: 'linear-gradient(to bottom, rgba(230, 247, 255, 0.8), rgba(240, 240, 240, 0.8))',
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
                  backgroundColor: msg.sender === 'bot' ? 'rgba(24, 144, 255, 0.1)' : 'rgba(240, 240, 240, 0.8)',
                  padding: '12px 18px',
                  borderRadius: '20px',
                  marginBottom: '12px',
                  maxWidth: '70%',
                  fontSize: '16px',
                }}
              >
                {msg.text}
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>
        <div style={{ padding: '20px', display: 'flex', alignItems: 'center' }}>
          <div style={{
            flex: 1,
            padding: '12px',
            borderRadius: '24px',
            backgroundColor: 'white',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
          }}>
            {currentField === 'password' && <LockOutlined style={{ marginRight: '8px', color: 'rgba(0, 0, 0, 0.3)' }} />}
            <input
              type={currentField === 'password' ? 'password' : 'text'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onInputSubmit();
                }
              }}
              placeholder={currentField === 'username' ? 'Enter your username' : currentField === 'password' ? 'Enter your password' : 'Enter your email'}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '16px',
              }}
            />
          </div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={isLoading ? <LoadingOutlined /> : <SendOutlined />}
              onClick={onInputSubmit}
              disabled={isLoading}
              style={{ marginLeft: '12px' }}
            />
          </motion.div>
        </div>
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px' }}>{isLogin ? 'New user? Sign up now and explore the AI Chatbot!' : 'Already have an account? Log in and continue your AI Chatbot journey.'}</span>
          <Switch
            checkedChildren={<SmileOutlined />}
            unCheckedChildren={<SmileOutlined />}
            checked={isLogin}
            onChange={(checked) => {
              setIsLogin(checked);
              setCurrentField(checked ? 'username' : 'email');
              setMessages([]);
              addMessage(`Please enter your ${checked ? 'username' : 'email'} to ${checked ? 'log in' : 'sign up'}.`, 'bot');
            }}
          />
        </div>
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px' }}>Or log in with:</span>
          <div>
            {['Google', 'Facebook', 'GitHub'].map((platform) => (
              <Button
                key={platform}
                icon={
                  platform === 'Google' ? <GoogleOutlined /> :
                  platform === 'Facebook' ? <FacebookOutlined /> :
                  <GithubOutlined />
                }
                onClick={() => socialLogin(platform)}
                style={{ marginLeft: '8px' }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatbotLogin;
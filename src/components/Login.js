import React, { useState, useEffect, useRef } from 'react';
import { SendOutlined, SmileOutlined, LoadingOutlined } from '@ant-design/icons';
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
      addMessage(inputValue, 'user');
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
      addMessage('Login successful!', 'bot');
      message.success('Login successful!');
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const signup = () => {
    addMessage('Signing up...', 'bot');
    setIsLoading(true);
    setTimeout(() => {
      addMessage('Signup successful!', 'bot');
      message.success('Signup successful!');
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  useEffect(() => {
    addMessage('Welcome! Please enter your username to get started.', 'bot');
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
      backgroundImage: 'url(./components/background-ai.jpg)',
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
          <Title level={4} style={{ color: 'white', marginBottom: 0 }}>Chatbot Login</Title>
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
        <div style={{ padding: '15px', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onInputSubmit();
              }
            }}
            placeholder={currentField === 'username' ? 'Username' : currentField === 'password' ? 'Password' : 'Email'}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '20px',
              border: 'none',
              marginRight: '10px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
          />
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              type="primary"
              shape="circle"
              icon={isLoading ? <LoadingOutlined /> : <SendOutlined />}
              onClick={onInputSubmit}
              disabled={isLoading}
            />
          </motion.div>
        </div>
        <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{isLogin ? 'New user?' : 'Already have an account?'}</span>
          <Switch
            checkedChildren={<SmileOutlined />}
            unCheckedChildren={<SmileOutlined />}
            checked={isLogin}
            onChange={(checked) => {
              setIsLogin(checked);
              setCurrentField('username');
              setMessages([]);
              addMessage(`Please enter your ${checked ? 'username' : 'email'} to get started.`, 'bot');
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ChatbotLogin;
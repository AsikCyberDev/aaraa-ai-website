import {
  LoadingOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SendOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { Button, Input, Select, Switch, Typography, message } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { SIGNIN_MUTATION, SIGNUP_MUTATION } from '../graphql/queries';
import ThemeToggle from './ThemeToggle';
import { isAuthenticated } from './authUtils';
import countryCodes from './countryCodes';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const ChatbotLogin = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentField, setCurrentField] = useState('email');
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    mobile: '',
    countryCode: '+1',
    password: '',
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const isInitialMount = useRef(true);

  const [signInMutation] = useMutation(SIGNIN_MUTATION);
  const [signUpMutation] = useMutation(SIGNUP_MUTATION);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (!isAuthenticated()) {
        addMessage(
          'Welcome to the Aaraa.Ai Chatbot Studio! Please enter your email to get started.',
          'bot'
        );
      } else {
        onLogin();
      }
    }
  }, [onLogin]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentField]);

  const addMessage = (text, sender) => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const validateMobile = (mobile) => {
    const re = /^\d{10}$/;
    return re.test(String(mobile));
  };

  const onInputSubmit = () => {
    if (inputValue.trim() !== '') {
      if (isLogin) {
        if (currentField === 'email' && !validateEmail(inputValue)) {
          addMessage('Please enter a valid email address.', 'bot');
          return;
        }
        addMessage(
          currentField === 'password' ? '*'.repeat(inputValue.length) : inputValue,
          'user'
        );
        handleLoginInput();
      } else {
        if (currentField === 'email' && !validateEmail(inputValue)) {
          addMessage('Please enter a valid email address.', 'bot');
          return;
        }
        if (currentField === 'mobile' && !validateMobile(inputValue)) {
          addMessage('Please enter a valid 10-digit mobile number.', 'bot');
          return;
        }
        addMessage(
          currentField === 'password' ? '*'.repeat(inputValue.length) : inputValue,
          'user'
        );
        handleSignupInput();
      }
    }
  };

  const handleSignupInput = () => {
    switch (currentField) {
      case 'name':
        setSignupData((prev) => ({ ...prev, name: inputValue }));
        setCurrentField('email');
        addMessage('Please enter your email:', 'bot');
        setInputValue('');
        break;
      case 'email':
        setSignupData((prev) => ({ ...prev, email: inputValue }));
        setCurrentField('mobile');
        addMessage('Please enter your mobile number:', 'bot');
        setInputValue('');
        break;
      case 'mobile':
        setSignupData((prev) => ({ ...prev, mobile: inputValue }));
        setCurrentField('password');
        addMessage('Please enter your password:', 'bot');
        setInputValue('');
        break;
      case 'password':
        setSignupData((prev) => ({ ...prev, password: inputValue }));
        signup();
        break;
      default:
        console.error('Unexpected field in signup process:', currentField);
        addMessage('An error occurred. Please try again.', 'bot');
        setCurrentField('name');
        setInputValue('');
        break;
    }
  };

  const handleLoginInput = () => {
    if (currentField === 'email') {
      setLoginData((prev) => ({ ...prev, email: inputValue }));
      setCurrentField('password');
      addMessage('Please enter your password:', 'bot');
      setInputValue('');
    } else if (currentField === 'password') {
      login(loginData.email, inputValue);
    }
  };

  const login = async (email, password) => {
    if (!email || !password) {
      addMessage('Please provide both email and password.', 'bot');
      setCurrentField('email');
      setInputValue('');
      return;
    }

    addMessage('Logging in...', 'bot');
    setIsLoading(true);
    try {
      const { data } = await signInMutation({
        variables: {
          input: {
            email: email,
            password: password,
          },
        },
      });
      if (data.signIn && data.signIn.token) {
        localStorage.setItem('token', data.signIn.token);
        const userDetails = {
          id: data.signIn.id,
          name: data.signIn.name,
          email: data.signIn.email,
        };
        localStorage.setItem('user', JSON.stringify(userDetails));
        addMessage(`Login successful! Welcome back, ${data.signIn.name}.`, 'bot');
        message.success('Login successful!');
        if (typeof onLogin === 'function') {
          onLogin();
        } else {
          navigate('/dashboard');
        }
      } else {
        throw new Error('Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      addMessage(`An error occurred during login: ${error.message}`, 'bot');
      message.error(`Login error: ${error.message}`);
      console.error('Login error:', error);
      setCurrentField('email');
      setLoginData({ email: '', password: '' });
      setInputValue('');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async () => {
    addMessage('Signing up...', 'bot');
    setIsLoading(true);
    try {
      const { data } = await signUpMutation({
        variables: {
          input: {
            name: signupData.name,
            email: signupData.email,
            mobile: signupData.countryCode + signupData.mobile,
            password: signupData.password,
          },
        },
      });

      if (data && data.signUp) {
        addMessage('Signup successful! Please log in with your new account.', 'bot');
        message.success('Signup successful! Please log in.');
        setIsLogin(true);
        setCurrentField('email');
        setLoginData({ email: signupData.email, password: '' });
        setInputValue(signupData.email);
        addMessage('Please enter your email to log in:', 'bot');
      } else {
        throw new Error('Signup failed. Please try again.');
      }
    } catch (error) {
      addMessage(`An error occurred during signup: ${error.message}`, 'bot');
      message.error(`Signup error: ${error.message}`);
      console.error('Signup error:', error);
      setCurrentField('name');
      setInputValue('');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const socialButtonText = isLogin ? "Log in with" : "Sign up with";

  return (
    <div className="chatbot-login-container">
      <Particles id="tsparticles" />
      <div className="content-wrapper">
        <div className="login-container">
          <div className="login-toggle">
            <ThemeToggle />
            <Switch
              checkedChildren="Login"
              unCheckedChildren="Signup"
              checked={isLogin}
              onChange={(checked) => {
                setIsLogin(checked);
                setCurrentField(checked ? 'email' : 'name');
                setMessages([]);
                addMessage(
                  `Please enter your ${checked ? 'email' : 'name'} to ${checked ? 'log in' : 'sign up'
                  }.`,
                  'bot'
                );
              }}
            />
          </div>
          <div className="login-box">
            <Title level={2} className="title-text">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {isLogin ? 'Welcome Back!' : 'Join Us Today'}
              </motion.div>
            </Title>
            <Paragraph className="paragraph-text">
              {isLogin
                ? 'Log in to access your personalized AI assistant and explore a world of possibilities.'
                : 'Sign up to create your own AI assistant and start your journey into the future of technology.'}
            </Paragraph>
            <Text className="text">{socialButtonText}</Text>
            <div className="social-buttons">
              <Button
                className="social-button google"
                onClick={() => console.log("Google login")}
              >
                <img src="google-icon.png" alt="Google icon" />
                {socialButtonText} Google
              </Button>
              <Button
                className="social-button facebook"
                onClick={() => console.log("Facebook login")}
              >
                <img src="facebook-icon.png" alt="Facebook icon" />
                {socialButtonText} Facebook
              </Button>
              <Button
                className="social-button github"
                onClick={() => console.log("GitHub login")}
              >
                <img src="github-icon.png" alt="GitHub icon" />
                {socialButtonText} GitHub
              </Button>
            </div>
          </div>
          <div className="features">
            <Title level={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Why Choose Our AI Assistant?
              </motion.div>
            </Title>
            <ul>
              <li>Personalized experience tailored to your needs</li>
              <li>24/7 availability for all your queries</li>
              <li>Continuous learning and improvement</li>
              <li>Seamless integration with your daily tasks</li>
            </ul>
          </div>
        </div>
        <div className="chatbot-container">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="chatbot-window"
          >
            <div className="chatbot-header">
              <motion.div
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
              </motion.div>
              <Title level={4}>Aaraa.Ai Chatbot Studio</Title>
              <Text className="tagline">AI for everyone, designed by You!</Text>
            </div>

            <div className="chat-messages">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`message ${msg.sender}`}
                  >
                    {msg.text}
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </div>

            <div className="input-area">
              <Input
                ref={inputRef}
                placeholder={
                  currentField === 'name'
                    ? 'Enter your name'
                    : currentField === 'mobile'
                      ? 'Enter your mobile number'
                      : currentField === 'email'
                        ? 'Enter your email'
                        : currentField === 'password'
                          ? 'Enter your password'
                          : 'Type your message...'
                }
                type={currentField === 'password' ? 'password' : 'text'}
                prefix={
                  currentField === 'name' ? (
                    <UserOutlined />
                  ) : currentField === 'mobile' ? (
                    <PhoneOutlined />
                  ) : currentField === 'email' ? (
                    <MailOutlined />
                  ) : currentField === 'password' ? (
                    <LockOutlined />
                  ) : null
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={onInputSubmit}
                className="input-field"
                addonBefore={
                  currentField === 'mobile' ? (
                    <Select
                      value={signupData.countryCode}
                      style={{ width: 100 }}
                      onChange={(value) =>
                        setSignupData((prev) => ({ ...prev, countryCode: value }))
                      }
                      showSearch
                      optionFilterProp="children"
                    >
                      {countryCodes.map((country) => (
                        <Option key={country.code} value={country.dial_code}>
                          <span role="img" aria-label={country.name}>
                            {country.emoji}
                          </span>
                          {country.dial_code}
                        </Option>
                      ))}
                    </Select>
                  ) : null
                }
              />
              <Button
                type="primary"
                icon={isLoading ? <LoadingOutlined /> : <SendOutlined />}
                onClick={onInputSubmit}
                disabled={isLoading}
                className="send-button"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotLogin;

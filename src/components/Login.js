import { FacebookOutlined, GithubOutlined, GoogleOutlined, HomeOutlined, LoadingOutlined, LockOutlined, MailOutlined, ManOutlined, PhoneOutlined, RobotOutlined, SendOutlined, SmileOutlined, UserOutlined, WomanOutlined } from '@ant-design/icons';
import { gql, useMutation } from '@apollo/client';
import { Button, Input, Select, Switch, Typography, message } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { isAuthenticated, setToken } from './authUtils'; // Import the new utilities


const { Title, Text } = Typography;
const { Option } = Select;

// Updated GraphQL mutations
const SIGNIN_MUTATION = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      token
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      id
      name
      email
      mobile
      address
      sex
      token
    }
  }
`;

const ChatbotLogin = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentField, setCurrentField] = useState('email');
  const [signupData, setSignupData] = useState({
    name: '',
    sex: '',
    mobile: '',
    countryCode: '+1',
    email: '',
    address: '',
    password: '',
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const messagesEndRef = useRef(null);
  const isInitialMount = useRef(true);


  const [signInMutation] = useMutation(SIGNIN_MUTATION);
  const [signupMutation] = useMutation(SIGNUP_MUTATION);


  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (!isAuthenticated()) {
        addMessage('Welcome to the AI Chatbot! I\'m here to assist you. Please enter your email to get started.', 'bot');
      } else {
        onLogin();
      }
    }
  }, [onLogin]);

  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { text, sender }]);
  };



  const onInputSubmit = () => {
    if (inputValue.trim() !== '') {
      addMessage(currentField === 'password' ? '*'.repeat(inputValue.length) : inputValue, 'user');
      setInputValue('');

      if (isLogin) {
        if (currentField === 'email') {
          setLoginData(prev => ({ ...prev, email: inputValue }));
          setCurrentField('password');
          addMessage('Please enter your password:', 'bot');
        } else if (currentField === 'password') {
          setLoginData(prev => ({ ...prev, password: inputValue }));
          login();
        }
      } else {
        if (currentField === 'name') {
          setSignupData(prev => ({ ...prev, name: inputValue }));
          setCurrentField('sex');
          addMessage('Please select your sex:', 'bot');
        } else if (currentField === 'mobile') {
          setSignupData(prev => ({ ...prev, mobile: inputValue }));
          setCurrentField('email');
          addMessage('Please enter your email:', 'bot');
        } else if (currentField === 'email') {
          setSignupData(prev => ({ ...prev, email: inputValue }));
          setCurrentField('address');
          addMessage('Please enter your address:', 'bot');
        } else if (currentField === 'address') {
          setSignupData(prev => ({ ...prev, address: inputValue }));
          setCurrentField('password');
          addMessage('Please enter your password:', 'bot');
        } else if (currentField === 'password') {
          setSignupData(prev => ({ ...prev, password: inputValue }));
          signup();
        }
      }
    }
  };

  const login = async () => {
    addMessage('Logging in...', 'bot');
    setIsLoading(true);
    try {
      const { data } = await signInMutation({
        variables: {
          input: {
            email: loginData.email,
            password: loginData.password
          }
        }
      });
      if (data.signIn && data.signIn.token) {
        setToken(data.signIn.token); // Store the token
        addMessage('Login successful! Welcome back to the AI Chatbot.', 'bot');
        message.success('Login successful!');
        onLogin(); // Redirect to main app
      } else {
        addMessage('Login failed. Please check your credentials and try again.', 'bot');
        message.error('Login failed');
      }
    } catch (error) {
      addMessage('An error occurred during login. Please try again.', 'bot');
      message.error('Login error');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const signup = async () => {
    addMessage('Signing up...', 'bot');
    setIsLoading(true);
    try {
      const { data } = await signupMutation({
        variables: {
          input: {
            name: signupData.name,
            sex: signupData.sex,
            mobile: signupData.countryCode + signupData.mobile,
            email: signupData.email,
            address: signupData.address,
            password: signupData.password
          }
        }
      });
      if (data.signUp) {
        addMessage('Signup successful! You can now log in with your credentials.', 'bot');
        message.success('Signup successful!');
        onLogin(data.signUp.token);
      } else {
        addMessage('Signup failed. Please check your information and try again.', 'bot');
        message.error('Signup failed');
      }
    } catch (error) {
      addMessage('An error occurred during signup. Please try again.', 'bot');
      message.error('Signup error');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = (platform) => {
    const emoji = platform === 'Google' ? '🌐' : platform === 'Facebook' ? '🪧' : '🐱';
    addMessage(`Logging in with ${platform} ${emoji}`, 'user');
    setIsLoading(true);
    // Note: Implement actual social login logic here
    setTimeout(() => {
      addMessage(`Login with ${platform} successful! Welcome to the AI Chatbot.`, 'bot');
      message.success(`Login with ${platform} successful!`);
      setIsLoading(false);
      onLogin();
    }, 1500);
  };


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
      backgroundImage: 'url("https://images.unsplash.com/photo-1586775490184-b79f0621891f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
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
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2), 0 0 100px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 1,
          border: '1px solid rgba(255,255,255,0.3)',
        }}
      >
        <div style={{
          background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
          color: 'white',
          padding: '20px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            right: '-50%',
            bottom: '-50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
            animation: 'pulse 5s infinite',
          }} />
          <RobotOutlined style={{ fontSize: '36px', marginBottom: '10px' }} />
          <Title level={3} style={{ color: 'white', marginBottom: 0, position: 'relative' }}>
            {isLogin ? "Aaraa.Ai Design Studio" : "AI for everyone, designed by You!"}
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', position: 'relative' }}>
            {isLogin ? "AI for everyone, designed by You!" : "Create your account and chat with the future"}
          </Text>
        </div>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: 'linear-gradient(to bottom, rgba(230, 247, 255, 0.8), rgba(240, 240, 240, 0.8))',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%239C92AC" fill-opacity="0.1" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.5,
          }} />
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
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  position: 'relative',
                  zIndex: 1,
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
            {isLogin ? (
              currentField === 'password' ? (
                <Input
                  type="password"
                  placeholder="Enter your password"
                  prefix={<LockOutlined style={{ marginRight: '8px', color: 'rgba(0, 0, 0, 0.3)' }} />}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      onInputSubmit();
                    }
                  }}
                />
              ) : (
                <Input
                  placeholder="Enter your email"
                  prefix={<MailOutlined style={{ marginRight: '8px', color: 'rgba(0, 0, 0, 0.3)' }} />}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      onInputSubmit();
                    }
                  }}
                />
              )
            ) : (
              currentField === 'sex' ? (
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select your sex"
                  onChange={(value) => {
                    setSignupData(prev => ({ ...prev, sex: value }));
                    setCurrentField('mobile');
                    addMessage('Please enter your mobile number:', 'bot');
                  }}
                >
                  <Option value="Male"><ManOutlined /> Male</Option>
                  <Option value="Female"><WomanOutlined /> Female</Option>
                  <Option value="Other">Other</Option>
                </Select>
              ) : currentField === 'mobile' ? (
                <>
                  <Select
                    style={{ width: '30%', marginRight: '8px' }}
                    value={signupData.countryCode}
                    onChange={(value) => setSignupData(prev => ({ ...prev, countryCode: value }))}
                  >
                    <Option value="+1">🇺🇸 +1</Option>
                    <Option value="+44">🇬🇧 +44</Option>
                    <Option value="+91">🇮🇳 +91</Option>
                    <Option value="+86">🇨🇳 +86</Option>
                  </Select>
                  <Input
                    style={{ width: '70%' }}
                    placeholder="Enter your mobile number"
                    prefix={<PhoneOutlined style={{ marginRight: '8px', color: 'rgba(0, 0, 0, 0.3)' }} />}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        onInputSubmit();
                      }
                    }}
                  />
                </>
              ) : (
                <Input
                  placeholder={
                    currentField === 'name' ? 'Enter your name' :
                      currentField === 'email' ? 'Enter your email' :
                        currentField === 'address' ? 'Enter your address' :
                          'Enter your password'
                  }
                  type={currentField === 'password' ? 'password' : 'text'}
                  prefix={
                    currentField === 'name' ? <UserOutlined style={{ marginRight: '8px', color: 'rgba(0, 0, 0, 0.3)' }} /> :
                      currentField === 'email' ? <MailOutlined style={{ marginRight: '8px', color: 'rgba(0, 0, 0, 0.3)' }} /> :
                        currentField === 'address' ? <HomeOutlined style={{ marginRight: '8px', color: 'rgba(0, 0, 0, 0.3)' }} /> :
                          <LockOutlined style={{ marginRight: '8px', color: 'rgba(0, 0, 0, 0.3)' }} />
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      onInputSubmit();
                    }
                  }}
                />
              )
            )}
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
              setCurrentField(checked ? 'username' : 'name');
              setMessages([]);
              addMessage(`Please enter your ${checked ? 'username' : 'name'} to ${checked ? 'log in' : 'sign up'}.`, 'bot');
            }}
          />
        </div>
        {isLogin && (
          <div style={{ padding: '0 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        )}
      </motion.div>
    </div>
  );
};

export default ChatbotLogin;
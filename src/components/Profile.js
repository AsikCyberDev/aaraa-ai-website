import {
  BankOutlined,
  BarChartOutlined, BellOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  CopyOutlined, CrownOutlined, EditOutlined,
  HistoryOutlined,
  IdcardOutlined,
  KeyOutlined, LockOutlined,
  MailOutlined,
  MessageOutlined,
  PlusOutlined, RobotOutlined,
  SaveOutlined, SendOutlined,
  ThunderboltOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  Avatar, Button, Card, Col, Descriptions, Divider, Form, Input, List,
  Modal, Progress, Row, Space,
  Spin,
  Statistic, Table, Tabs, Tag, Timeline,
  Tooltip, Typography, message
} from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

function Profile() {
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setUser({
        name: 'John Doe',
        email: 'john.doe@example.com',
        company: 'Acme Corp',
        role: 'AI Chatbot Engineer',
        chatbotsCreated: 15,
        totalInteractions: 50000,
        subscription: {
          plan: 'AI Master',
          renewalDate: '2023-12-31',
          status: 'Active',
          features: ['Unlimited chatbots', 'Advanced NLP', 'Multi-language support', 'Custom AI training'],
        },
        tokenUsage: {
          used: 750000,
          limit: 1000000,
        },
        activeChatbots: 8,
        lastLogin: '2023-05-15 14:30:00',
        apiKeys: [
          { id: 1, key: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', created: '2023-01-01', lastUsed: '2023-05-15' },
          { id: 2, key: 'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy', created: '2023-03-15', lastUsed: '2023-05-14' },
        ],
        recentActivity: [
          { action: 'Trained new AI model', date: '2023-05-14 10:30:00' },
          { action: 'Launched multilingual support bot', date: '2023-05-13 16:45:00' },
          { action: 'Optimized NLP algorithms', date: '2023-05-12 09:15:00' },
        ],
        chatbotPerformance: [
          { id: 1, name: 'AI Support Wizard', interactions: 25000, satisfactionRate: 97 },
          { id: 2, name: 'Sales AI Assistant', interactions: 15000, satisfactionRate: 92 },
          { id: 3, name: 'Product Genius Bot', interactions: 10000, satisfactionRate: 95 },
        ],
      });
      setLoading(false);
    }, 1500);
  }, []);

  const showModal = () => {
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleOk = (values) => {
    setUser({ ...user, ...values });
    setIsModalVisible(false);
    message.success('Profile updated successfully');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'green';
      case 'pending':
        return 'orange';
      case 'expired':
        return 'red';
      default:
        return 'default';
    }
  };

  const chatbotColumns = [
    {
      title: 'Chatbot Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <RobotOutlined style={{ color: '#1890ff' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Interactions',
      dataIndex: 'interactions',
      key: 'interactions',
      render: (value) => (
        <Text>{value.toLocaleString()}</Text>
      ),
    },
    {
      title: 'Satisfaction Rate',
      dataIndex: 'satisfactionRate',
      key: 'satisfactionRate',
      render: (rate) => (
        <Progress
          percent={rate}
          size="small"
          status={rate >= 90 ? 'success' : 'normal'}
          format={(percent) => `${percent}%`}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} size="small" onClick={() => handleEditChatbot(record)} />
          </Tooltip>
          <Tooltip title="View Details">
            <Button icon={<BarChartOutlined />} size="small" onClick={() => handleViewChatbotDetails(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const copyApiKey = (key) => {
    navigator.clipboard.writeText(key);
    message.success('API key copied to clipboard');
  };

  const handleEditChatbot = (chatbot) => {
    message.info(`Editing chatbot: ${chatbot.name}`);
    // Implement edit chatbot logic here
  };

  const handleViewChatbotDetails = (chatbot) => {
    message.info(`Viewing details for chatbot: ${chatbot.name}`);
    // Implement view chatbot details logic here
  };

  const handleGenerateNewApiKey = () => {
    const newKey = 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'; // In a real app, this would be generated on the server
    const newApiKey = {
      id: user.apiKeys.length + 1,
      key: newKey,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
    };
    setUser({ ...user, apiKeys: [...user.apiKeys, newApiKey] });
    message.success('New API key generated');
  };

  const handleRevokeApiKey = (keyId) => {
    setUser({ ...user, apiKeys: user.apiKeys.filter(key => key.id !== keyId) });
    message.success('API key revoked');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading your AI dashboard..." />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ background: '#f0f2f5', padding: '24px' }}
    >
      <Card
        hoverable
        cover={
          <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
            <img
              alt="profile-background"
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80"
              style={{ width: '100%', filter: 'blur(5px)' }}
            />
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.4)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Title level={1} style={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                AI Chatbot Dashboard
              </Title>
            </div>
          </div>
        }
      >
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} sm={8} md={6} lg={4}>
            <Avatar size={120} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          </Col>
          <Col xs={24} sm={16} md={18} lg={20}>
            <Space direction="vertical" size={0}>
              <Title level={2} style={{ marginBottom: 0 }}>{user.name}</Title>
              <Text type="secondary">{user.role}</Text>
              <Text>{user.email}</Text>
              <Text>{user.company}</Text>
            </Space>
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="Chatbots Created" value={user.chatbotsCreated} prefix={<RobotOutlined style={{ color: '#1890ff' }} />} />
          </Col>
          <Col span={6}>
            <Statistic title="Total Interactions" value={user.totalInteractions} prefix={<MessageOutlined style={{ color: '#52c41a' }} />} />
          </Col>
          <Col span={6}>
            <Statistic title="Active Chatbots" value={user.activeChatbots} prefix={<ThunderboltOutlined style={{ color: '#faad14' }} />} />
          </Col>
          <Col span={6}>
            <Statistic title="Last Login" value={user.lastLogin} prefix={<HistoryOutlined style={{ color: '#722ed1' }} />} />
          </Col>
        </Row>
        <Divider />
        <Button type="primary" onClick={showModal} icon={<EditOutlined />}>
          Edit Profile
        </Button>
      </Card>

      <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginTop: 24 }}>
        <TabPane tab={<span><BarChartOutlined />Dashboard</span>} key="1">
          <Row gutter={16}>
            <Col span={16}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <Title level={4}>Chatbot Performance</Title>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={user.chatbotPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="interactions" fill="#8884d8" name="Interactions" />
                      <Bar yAxisId="right" dataKey="satisfactionRate" fill="#82ca9d" name="Satisfaction Rate (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            </Col>
            <Col span={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <Title level={4}><CrownOutlined style={{ color: '#faad14' }} /> AI Subscription</Title>
                  <Descriptions column={1}>
                    <Descriptions.Item label="Plan">
                      <Tag color="blue">{user.subscription.plan}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Renewal">{user.subscription.renewalDate}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                      <Tag color={getStatusColor(user.subscription.status)}>{user.subscription.status}</Tag>
                    </Descriptions.Item>
                  </Descriptions>
                  <Divider />
                  <Title level={5}>AI Features</Title>
                  <List
                    size="small"
                    dataSource={user.subscription.features}
                    renderItem={item => (
                      <List.Item>
                        <Text type="secondary"><CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />{item}</Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </motion.div>
            </Col>
          </Row>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card style={{ marginTop: 16 }}>
              <Title level={4}>AI Token Usage</Title>
              <Progress
                percent={Math.round((user.tokenUsage.used / user.tokenUsage.limit) * 100)}
                status="active"
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
              <Paragraph>
                {user.tokenUsage.used.toLocaleString()} / {user.tokenUsage.limit.toLocaleString()} AI tokens used
              </Paragraph>
            </Card>
          </motion.div>
        </TabPane>
        <TabPane tab={<span><RobotOutlined />AI Chatbots</span>} key="2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <Table dataSource={user.chatbotPerformance} columns={chatbotColumns} rowKey="id" />
            </Card>
          </motion.div>
        </TabPane>
        <TabPane tab={<span><KeyOutlined />API Keys</span>} key="3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <List
                itemLayout="horizontal"
                dataSource={user.apiKeys}
                renderItem={item => (
                  <List.Item actions={[
                    <Tooltip title="Copy API Key">
                      <Button icon={<CopyOutlined />} onClick={() => copyApiKey(item.key)} />
                    </Tooltip>,
                    <Tooltip title="Revoke Key">
                      <Button icon={<LockOutlined />} danger onClick={() => handleRevokeApiKey(item.id)} />
                    </Tooltip>
                  ]}>
                    <List.Item.Meta
                      title={<Text copyable={{ text: item.key }}>{item.key.substr(0, 8)}...{item.key.substr(-8)}</Text>}
                      description={`Created: ${item.created} | Last Used: ${item.lastUsed}`}
                    />
                  </List.Item>
                )}
              />
              <Button type="primary" icon={<PlusOutlined />} style={{ marginTop: 16 }} onClick={handleGenerateNewApiKey}>
                Generate New AI API Key
              </Button>
            </Card>
          </motion.div>
        </TabPane>
        <TabPane tab={<span><BellOutlined />Recent AI Activity</span>} key="4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <Timeline mode="alternate">
                {user.recentActivity.map((activity, index) => (
                  <Timeline.Item
                    key={index}
                    color={index === 0 ? 'green' : 'blue'}
                    dot={index === 0 ? <RobotOutlined style={{ fontSize: '16px' }} /> : null}
                  >
                    <Card size="small" style={{ width: 300 }}>
                      <p>{activity.action}</p>
                      <Text type="secondary" style={{ fontSize: '12px' }}>{activity.date}</Text>
                    </Card>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </motion.div>
        </TabPane>
      </Tabs>

      <Modal
        title={<span><EditOutlined /> Edit AI Profile</span>}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          name="editProfile"
          onFinish={handleOk}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item
            name="company"
            label="Company"
            rules={[{ required: true, message: 'Please input your company!' }]}
          >
            <Input prefix={<BankOutlined />} />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please input your role!' }]}
          >
            <Input prefix={<IdcardOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <FloatingChatbot />
    </motion.div>
  );
}

// Floating Chatbot Component
const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.3 }}
            style={{
              background: 'white',
              padding: 20,
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              marginBottom: 16,
            }}
          >
            <Title level={4}>AI Assistant</Title>
            <Text>Hello! How can I help you today?</Text>
            <Input.TextArea
              rows={4}
              placeholder="Type your message here..."
              style={{ marginTop: 16, marginBottom: 16 }}
            />
            <Button type="primary" icon={<SendOutlined />}>Send</Button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          background: '#1890ff',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 24,
        }}
      >
        {isOpen ? <CloseOutlined /> : <RobotOutlined />}
      </motion.button>
    </motion.div>
  );
};

export default Profile;
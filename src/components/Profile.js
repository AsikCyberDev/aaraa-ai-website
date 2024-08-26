import {
  BankOutlined, BarChartOutlined, BellOutlined, CheckCircleOutlined,
  CopyOutlined, CrownOutlined, EditOutlined, HistoryOutlined, IdcardOutlined,
  KeyOutlined, LockOutlined, MailOutlined, MessageOutlined, PlusOutlined,
  RobotOutlined, SaveOutlined, ThunderboltOutlined, UserOutlined
} from '@ant-design/icons';
import {
  Avatar, Button, Card, Col, Descriptions, Divider, Form, Input, List,
  Modal, Progress, Row, Space, Spin, Statistic, Table, Tabs, Tag, Timeline,
  Tooltip, Typography, message
} from 'antd';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import styled from 'styled-components';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const StyledCard = styled(Card)`
  background-color: var(--layout-background-color);
  color: var(--text-color);
  border-color: var(--border-color);
`;

const StyledTitle = styled(Title)`
  color: var(--text-color);
`;

const StyledText = styled(Text)`
  color: var(--text-color);
`;

const StyledDivider = styled(Divider)`
  border-color: var(--border-color);
`;

const StyledButton = styled(Button)`
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--header-text-color);

  &:hover, &:focus {
    background-color: var(--button-hover-background-color);
    border-color: var(--button-hover-border-color);
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background-color: var(--background-color);
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProfileCard = styled(Card)`
  width: 100%;
  background-color: var(--component-background);
  border-color: var(--border-color);
  margin-bottom: 24px;
`;

const ProfileAvatar = styled(Avatar)`
  background-color: var(--primary-color);
  border: 4px solid var(--background-color);
`;

const StyledStatistic = styled(Statistic)`
  .ant-statistic-title {
    color: var(--text-color);
  }
  .ant-statistic-content {
    color: var(--heading-text-color);
  }
`;

const StyledTabs = styled(Tabs)`
  width: 100%;
  .ant-tabs-tab {
    color: var(--text-color);
  }
  .ant-tabs-tab-active {
    color: var(--primary-color);
  }
  .ant-tabs-ink-bar {
    background-color: var(--primary-color);
  }
`;

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
          <RobotOutlined style={{ color: 'var(--primary-color)' }} />
          <StyledText strong>{text}</StyledText>
        </Space>
      ),
    },
    {
      title: 'Interactions',
      dataIndex: 'interactions',
      key: 'interactions',
      render: (value) => (
        <StyledText>{value.toLocaleString()}</StyledText>
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
  ];

  const copyApiKey = (key) => {
    navigator.clipboard.writeText(key);
    message.success('API key copied to clipboard');
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
      <ProfileContainer>
        <Spin size="large" tip="Loading your AI dashboard..." />
      </ProfileContainer>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ProfileContainer>
        <ProfileCard>
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} sm={8} md={6} lg={4}>
              <ProfileAvatar size={120} icon={<UserOutlined />} />
            </Col>
            <Col xs={24} sm={16} md={18} lg={20}>
              <Space direction="vertical" size={0}>
                <StyledTitle level={2}>{user.name}</StyledTitle>
                <StyledText type="secondary">{user.role}</StyledText>
                <StyledText>{user.email}</StyledText>
                <StyledText>{user.company}</StyledText>
              </Space>
            </Col>
          </Row>
          <StyledDivider />
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <StyledStatistic title="Chatbots Created" value={user.chatbotsCreated} prefix={<RobotOutlined style={{ color: 'var(--primary-color)' }} />} />
            </Col>
            <Col span={6}>
              <StyledStatistic title="Total Interactions" value={user.totalInteractions} prefix={<MessageOutlined style={{ color: 'var(--secondary-color)' }} />} />
            </Col>
            <Col span={6}>
              <StyledStatistic title="Active Chatbots" value={user.activeChatbots} prefix={<ThunderboltOutlined style={{ color: 'var(--warning-color, #faad14)' }} />} />
            </Col>
            <Col span={6}>
              <StyledStatistic title="Last Login" value={user.lastLogin} prefix={<HistoryOutlined style={{ color: 'var(--info-color, #1890ff)' }} />} />
            </Col>
          </Row>
          <StyledDivider />
          <StyledButton type="primary" onClick={showModal} icon={<EditOutlined />}>
            Edit Profile
          </StyledButton>
        </ProfileCard>

        <StyledTabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab={<span><BarChartOutlined />Dashboard</span>} key="1">
          <Row gutter={16}>
            <Col span={16}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <StyledCard>
                  <StyledTitle level={4}>Chatbot Performance</StyledTitle>
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
                </StyledCard>
              </motion.div>
            </Col>
            <Col span={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <StyledCard>
                  <StyledTitle level={4}><CrownOutlined style={{ color: 'var(--warning-color, #faad14)' }} /> AI Subscription</StyledTitle>
                  <Descriptions column={1}>
                    <Descriptions.Item label="Plan">
                      <Tag color="blue">{user.subscription.plan}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Renewal">{user.subscription.renewalDate}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                      <Tag color={getStatusColor(user.subscription.status)}>{user.subscription.status}</Tag>
                    </Descriptions.Item>
                  </Descriptions>
                  <StyledDivider />
                  <StyledTitle level={5}>AI Features</StyledTitle>
                  <List
                    size="small"
                    dataSource={user.subscription.features}
                    renderItem={item => (
                      <List.Item>
                        <StyledText type="secondary"><CheckCircleOutlined style={{ color: 'var(--success-color, #52c41a)', marginRight: 8 }} />{item}</StyledText>
                      </List.Item>
                    )}
                  />
                </StyledCard>
              </motion.div>
            </Col>
          </Row>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <StyledCard style={{ marginTop: 16 }}>
              <StyledTitle level={4}>AI Token Usage</StyledTitle>
              <Progress
                percent={Math.round((user.tokenUsage.used / user.tokenUsage.limit) * 100)}
                status="active"
                strokeColor={{
                  '0%': 'var(--primary-color)',
                  '100%': 'var(--secondary-color)',
                }}
              />
              <Paragraph>
                {user.tokenUsage.used.toLocaleString()} / {user.tokenUsage.limit.toLocaleString()} AI tokens used
              </Paragraph>
            </StyledCard>
          </motion.div>
        </TabPane>
        <TabPane tab={<span><RobotOutlined />AI Chatbots</span>} key="2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StyledCard>
              <Table dataSource={user.chatbotPerformance} columns={chatbotColumns} rowKey="id" />
            </StyledCard>
          </motion.div>
        </TabPane>
        <TabPane tab={<span><KeyOutlined />API Keys</span>} key="3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StyledCard>
              <List
                itemLayout="horizontal"
                dataSource={user.apiKeys}
                renderItem={item => (
                  <List.Item actions={[
                    <Tooltip title="Copy API Key">
                      <StyledButton icon={<CopyOutlined />} onClick={() => copyApiKey(item.key)} />
                    </Tooltip>,
                    <Tooltip title="Revoke Key">
                      <StyledButton icon={<LockOutlined />} danger onClick={() => handleRevokeApiKey(item.id)} />
                    </Tooltip>
                  ]}>
                    <List.Item.Meta
                      title={<StyledText copyable={{ text: item.key }}>{item.key.substr(0, 8)}...{item.key.substr(-8)}</StyledText>}
                      description={`Created: ${item.created} | Last Used: ${item.lastUsed}`}
                    />
                  </List.Item>
                )}
              />
              <StyledButton type="primary" icon={<PlusOutlined />} style={{ marginTop: 16 }} onClick={handleGenerateNewApiKey}>
                Generate New AI API Key
              </StyledButton>
            </StyledCard>
          </motion.div>
        </TabPane>
        <TabPane tab={<span><BellOutlined />Recent AI Activity</span>} key="4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StyledCard>
              <Timeline mode="alternate">
                {user.recentActivity.map((activity, index) => (
                  <Timeline.Item
                    key={index}
                    color={index === 0 ? 'var(--success-color, #52c41a)' : 'var(--primary-color)'}
                    dot={index === 0 ? <RobotOutlined style={{ fontSize: '16px' }} /> : null}
                  >
                    <StyledCard size="small" style={{ width: 300 }}>
                      <StyledText>{activity.action}</StyledText>
                      <StyledText type="secondary" style={{ fontSize: '12px' }}>{activity.date}</StyledText>
                    </StyledCard>
                  </Timeline.Item>
                ))}
              </Timeline>
            </StyledCard>
          </motion.div>
        </TabPane>
      </StyledTabs>

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
            <StyledButton type="primary" htmlType="submit" icon={<SaveOutlined />}>
              Save Changes
            </StyledButton>
          </Form.Item>
        </Form>
      </Modal>
      </ProfileContainer>
    </motion.div>
  );
}

export default Profile;
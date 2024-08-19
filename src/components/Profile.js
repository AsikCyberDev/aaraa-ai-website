import { BarChartOutlined, BellOutlined, CopyOutlined, CrownOutlined, EditOutlined, HistoryOutlined, KeyOutlined, LockOutlined, PlusOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Descriptions, Divider, Form, Input, List, Modal, Progress, Row, Space, Statistic, Table, Tabs, Tag, Timeline, Tooltip, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

function Profile() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    company: 'Acme Corp',
    role: 'Administrator',
    chatbotsCreated: 5,
    totalInteractions: 1000,
    subscription: {
      plan: 'Professional',
      renewalDate: '2023-12-31',
      status: 'Active',
      features: ['Unlimited chatbots', 'Advanced analytics', 'Priority support'],
    },
    tokenUsage: {
      used: 750000,
      limit: 1000000,
    },
    activeChatbots: 3,
    lastLogin: '2023-05-15 14:30:00',
    apiKeys: [
      { id: 1, key: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', created: '2023-01-01', lastUsed: '2023-05-15' },
      { id: 2, key: 'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy', created: '2023-03-15', lastUsed: '2023-05-14' },
    ],
    recentActivity: [
      { action: 'Created new chatbot', date: '2023-05-14 10:30:00' },
      { action: 'Updated company info', date: '2023-05-13 16:45:00' },
      { action: 'Generated API key', date: '2023-05-12 09:15:00' },
    ],
    chatbotPerformance: [
      { id: 1, name: 'Support Bot', interactions: 500, satisfactionRate: 92 },
      { id: 2, name: 'Sales Assistant', interactions: 300, satisfactionRate: 88 },
      { id: 3, name: 'Product Guru', interactions: 200, satisfactionRate: 95 },
    ],
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();

  useEffect(() => {
    // Here you would typically fetch user data from your backend
    // For this example, we're using the hardcoded data in the state
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
    },
    {
      title: 'Interactions',
      dataIndex: 'interactions',
      key: 'interactions',
    },
    {
      title: 'Satisfaction Rate',
      dataIndex: 'satisfactionRate',
      key: 'satisfactionRate',
      render: (rate) => `${rate}%`,
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

  return (
    <div style={{ background: '#f0f2f5', padding: '24px' }}>
      <Card>
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} sm={8} md={6} lg={4}>
            <Avatar size={120} icon={<UserOutlined />} />
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
            <Statistic title="Chatbots Created" value={user.chatbotsCreated} prefix={<RobotOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title="Total Interactions" value={user.totalInteractions} prefix={<BarChartOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title="Active Chatbots" value={user.activeChatbots} prefix={<RobotOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title="Last Login" value={user.lastLogin} prefix={<HistoryOutlined />} />
          </Col>
        </Row>
        <Divider />
        <Button type="primary" onClick={showModal} icon={<EditOutlined />}>
          Edit Profile
        </Button>
      </Card>

      <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginTop: 24 }}>
        <TabPane tab={<span><BarChartOutlined />Overview</span>} key="1">
          <Row gutter={16}>
            <Col span={16}>
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
            </Col>
            <Col span={8}>
              <Card>
                <Title level={4}><CrownOutlined /> Subscription</Title>
                <Descriptions column={1}>
                  <Descriptions.Item label="Plan">{user.subscription.plan}</Descriptions.Item>
                  <Descriptions.Item label="Renewal">{user.subscription.renewalDate}</Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={getStatusColor(user.subscription.status)}>{user.subscription.status}</Tag>
                  </Descriptions.Item>
                </Descriptions>
                <Divider />
                <Title level={5}>Features</Title>
                <List
                  size="small"
                  dataSource={user.subscription.features}
                  renderItem={item => <List.Item><Text type="secondary">{item}</Text></List.Item>}
                />
              </Card>
            </Col>
          </Row>
          <Card style={{ marginTop: 16 }}>
            <Title level={4}>Token Usage</Title>
            <Progress
              percent={Math.round((user.tokenUsage.used / user.tokenUsage.limit) * 100)}
              status="active"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <Paragraph>
              {user.tokenUsage.used.toLocaleString()} / {user.tokenUsage.limit.toLocaleString()} tokens used
            </Paragraph>
          </Card>
        </TabPane>
        <TabPane tab={<span><RobotOutlined />Chatbots</span>} key="2">
          <Card>
            <Table dataSource={user.chatbotPerformance} columns={chatbotColumns} rowKey="id" />
          </Card>
        </TabPane>
        <TabPane tab={<span><KeyOutlined />API Keys</span>} key="3">
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
              Generate New API Key
            </Button>
          </Card>
        </TabPane>
        <TabPane tab={<span><BellOutlined />Recent Activity</span>} key="4">
          <Card>
            <Timeline>
              {user.recentActivity.map((activity, index) => (
                <Timeline.Item key={index} color={index === 0 ? 'green' : 'blue'}>
                  <p>{activity.action}</p>
                  <p style={{ fontSize: '12px', color: '#999' }}>{activity.date}</p>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </TabPane>
      </Tabs>

      <Modal title="Edit Profile" visible={isModalVisible} onCancel={handleCancel} footer={null}>
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
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="company"
            label="Company"
            rules={[{ required: true, message: 'Please input your company!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please input your role!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Profile;
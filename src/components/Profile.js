import React, { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Row, Col, Statistic, Button, Modal, Form, Input, Progress, Tag, Descriptions, Table, Tabs, List, Timeline } from 'antd';
import { UserOutlined, EditOutlined, CrownOutlined, RobotOutlined, BarChartOutlined, HistoryOutlined, KeyOutlined, BellOutlined } from '@ant-design/icons';

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
      { key: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', created: '2023-01-01', lastUsed: '2023-05-15' },
      { key: 'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy', created: '2023-03-15', lastUsed: '2023-05-14' },
    ],
    recentActivity: [
      { action: 'Created new chatbot', date: '2023-05-14 10:30:00' },
      { action: 'Updated company info', date: '2023-05-13 16:45:00' },
      { action: 'Generated API key', date: '2023-05-12 09:15:00' },
    ],
    chatbotPerformance: [
      { name: 'Support Bot', interactions: 500, satisfactionRate: 92 },
      { name: 'Sales Assistant', interactions: 300, satisfactionRate: 88 },
      { name: 'Product Guru', interactions: 200, satisfactionRate: 95 },
    ],
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Here you would typically fetch user data from your backend
    // For now, we're using the hardcoded data in the state
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = (values) => {
    setUser({ ...user, ...values });
    setIsModalVisible(false);
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
  ];

  return (
    <div>
      <Card>
        <Row gutter={16} align="middle">
          <Col span={4}>
            <Avatar size={100} icon={<UserOutlined />} />
          </Col>
          <Col span={16}>
            <Title level={2}>{user.name}</Title>
            <Text>{user.email}</Text>
            <br />
            <Text>{user.company} - {user.role}</Text>
          </Col>
          <Col span={4}>
            <Button icon={<EditOutlined />} onClick={showModal}>
              Edit Profile
            </Button>
          </Col>
        </Row>
      </Card>

      <Tabs defaultActiveKey="1" style={{ marginTop: 16 }}>
        <TabPane tab={<span><BarChartOutlined />Overview</span>} key="1">
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic title="Chatbots Created" value={user.chatbotsCreated} prefix={<RobotOutlined />} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Total Interactions" value={user.totalInteractions} prefix={<BarChartOutlined />} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Active Chatbots" value={user.activeChatbots} prefix={<RobotOutlined />} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Last Login" value={user.lastLogin} prefix={<HistoryOutlined />} />
              </Card>
            </Col>
          </Row>
          <Card style={{ marginTop: 16 }}>
            <Title level={4}><CrownOutlined /> Subscription Details</Title>
            <Descriptions bordered>
              <Descriptions.Item label="Plan">{user.subscription.plan}</Descriptions.Item>
              <Descriptions.Item label="Renewal Date">{user.subscription.renewalDate}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(user.subscription.status)}>{user.subscription.status}</Tag>
              </Descriptions.Item>
            </Descriptions>
            <Title level={4} style={{ marginTop: 16 }}>Token Usage</Title>
            <Progress
              percent={Math.round((user.tokenUsage.used / user.tokenUsage.limit) * 100)}
              status="active"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <Text>
              {user.tokenUsage.used.toLocaleString()} / {user.tokenUsage.limit.toLocaleString()} tokens used
            </Text>
          </Card>
        </TabPane>
        <TabPane tab={<span><RobotOutlined />Chatbots</span>} key="2">
          <Card>
            <Title level={4}>Chatbot Performance</Title>
            <Table dataSource={user.chatbotPerformance} columns={chatbotColumns} />
          </Card>
        </TabPane>
        <TabPane tab={<span><KeyOutlined />API Keys</span>} key="3">
          <Card>
            <Title level={4}>API Keys</Title>
            <List
              itemLayout="horizontal"
              dataSource={user.apiKeys}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<a href="https://ant.design">{item.key}</a>}
                    description={`Created: ${item.created} | Last Used: ${item.lastUsed}`}
                  />
                </List.Item>
              )}
            />
            <Button type="primary" style={{ marginTop: 16 }}>Generate New API Key</Button>
          </Card>
        </TabPane>
        <TabPane tab={<span><BellOutlined />Recent Activity</span>} key="4">
          <Card>
            <Title level={4}>Recent Activity</Title>
            <Timeline>
              {user.recentActivity.map((activity, index) => (
                <Timeline.Item key={index}>{activity.action} - {activity.date}</Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </TabPane>
      </Tabs>

      <Modal title="Edit Profile" visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form
          name="basic"
          initialValues={user}
          onFinish={handleOk}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="company"
            rules={[{ required: true, message: 'Please input your company!' }]}
          >
            <Input placeholder="Company" />
          </Form.Item>

          <Form.Item
            name="role"
            rules={[{ required: true, message: 'Please input your role!' }]}
          >
            <Input placeholder="Role" />
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
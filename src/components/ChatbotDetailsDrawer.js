import { ClockCircleOutlined, GlobalOutlined, MessageOutlined, TeamOutlined } from '@ant-design/icons';
import { Col, Drawer, List, Row, Statistic, Tabs, Typography } from 'antd';
import React from 'react';
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const { TabPane } = Tabs;
const { Title } = Typography;

const ChatbotDetailsDrawer = ({ visible, onClose, chatbot }) => {
  if (!chatbot) return null;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Drawer
      title="Chatbot Details"
      placement="right"
      onClose={onClose}
      visible={visible}
      width={800}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Overview" key="1">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Statistic title="Total Interactions" value={chatbot.interactions} prefix={<MessageOutlined />} />
            </Col>
            <Col span={12}>
              <Statistic title="Satisfaction Rate" value={chatbot.satisfactionRate} suffix="%" prefix={<TeamOutlined />} />
            </Col>
            <Col span={12}>
              <Statistic title="Avg. Response Time" value={chatbot.responseTime} suffix="s" prefix={<ClockCircleOutlined />} />
            </Col>
            <Col span={12}>
              <Statistic title="Languages" value={chatbot.languages.length} prefix={<GlobalOutlined />} />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="Performance" key="2">
          <Title level={4}>Interactions and Satisfaction Rate</Title>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chatbot.performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="interactions" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </TabPane>
        <TabPane tab="Language Usage" key="3">
          <Title level={4}>Language Distribution</Title>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chatbot.languageUsage}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="percentage"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chatbot.languageUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </TabPane>
        <TabPane tab="Top Queries" key="4">
          <List
            itemLayout="horizontal"
            dataSource={chatbot.topQueries}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={item.query}
                  description={`Count: ${item.count}`}
                />
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </Drawer>
  );
};

export default ChatbotDetailsDrawer;
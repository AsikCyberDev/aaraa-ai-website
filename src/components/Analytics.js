import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, DatePicker, Row, Select, Statistic, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;

const Analytics = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedChatbot, setSelectedChatbot] = useState('all');
  const [data, setData] = useState({
    kpis: {},
    interactionsData: [],
    satisfactionData: [],
    topQueries: [],
    chatbotPerformance: []
  });

  useEffect(() => {
    // Fetch data based on dateRange and selectedChatbot
    fetchAnalyticsData(dateRange, selectedChatbot);
  }, [dateRange, selectedChatbot]);

  const fetchAnalyticsData = (range, chatbot) => {
    // In a real application, you would make an API call here
    // For this example, we'll use mock data
    setData({
      kpis: {
        totalInteractions: 15000,
        avgSatisfaction: 4.2,
        resolutionRate: 85,
        avgResponseTime: 8
      },
      interactionsData: [
        { date: '2023-01', interactions: 1000 },
        { date: '2023-02', interactions: 1200 },
        { date: '2023-03', interactions: 1100 },
        { date: '2023-04', interactions: 1300 },
        { date: '2023-05', interactions: 1500 }
      ],
      satisfactionData: [
        { rating: 1, count: 50 },
        { rating: 2, count: 100 },
        { rating: 3, count: 200 },
        { rating: 4, count: 300 },
        { rating: 5, count: 350 }
      ],
      topQueries: [
        { query: "How to reset password", count: 250 },
        { query: "Pricing plans", count: 200 },
        { query: "Account activation", count: 180 },
        { query: "Billing issues", count: 150 },
        { query: "Feature requests", count: 120 }
      ],
      chatbotPerformance: [
        { name: "Support Bot", interactions: 5000, satisfaction: 4.5 },
        { name: "Sales Bot", interactions: 3000, satisfaction: 4.2 },
        { name: "FAQ Bot", interactions: 7000, satisfaction: 4.0 }
      ]
    });
  };

  const columns = [
    {
      title: 'Query',
      dataIndex: 'query',
      key: 'query',
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
    },
  ];

  return (
    <div className="analytics-container">
      <Title level={2}>Analytics Dashboard</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={12}>
          <Select
            value={selectedChatbot}
            onChange={(value) => setSelectedChatbot(value)}
            style={{ width: '100%' }}
          >
            <Option value="all">All Chatbots</Option>
            <Option value="support">Support Bot</Option>
            <Option value="sales">Sales Bot</Option>
            <Option value="faq">FAQ Bot</Option>
          </Select>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Interactions"
              value={data.kpis.totalInteractions}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Avg. Satisfaction"
              value={data.kpis.avgSatisfaction}
              precision={1}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="/5"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Resolution Rate"
              value={data.kpis.resolutionRate}
              precision={1}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Avg. Response Time"
              value={data.kpis.avgResponseTime}
              precision={1}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="s"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Interactions Over Time">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.interactionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="interactions" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Satisfaction Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie dataKey="count" data={data.satisfactionData} fill="#8884d8" label />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Top Queries">
            <Table dataSource={data.topQueries} columns={columns} pagination={false} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Chatbot Performance">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.chatbotPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="interactions" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="satisfaction" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
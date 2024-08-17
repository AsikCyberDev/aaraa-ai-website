import { MessageOutlined, RobotOutlined, TeamOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import React from 'react';

const ChatbotOverview = ({ chatbots }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Total Chatbots"
            value={chatbots.length}
            prefix={<RobotOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Active Chatbots"
            value={chatbots.filter(c => c.status === 'active').length}
            prefix={<RobotOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Total Interactions"
            value={chatbots.reduce((sum, c) => sum + c.interactions, 0)}
            prefix={<MessageOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Avg. Satisfaction Rate"
            value={
              chatbots.length > 0
                ? (chatbots.reduce((sum, c) => sum + c.satisfactionRate, 0) / chatbots.length).toFixed(2)
                : 0
            }
            suffix="%"
            prefix={<TeamOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default ChatbotOverview;
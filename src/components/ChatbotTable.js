import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Progress, Space, Table, Tag, Tooltip } from 'antd';
import React from 'react';

const ChatbotTable = ({ chatbots, loading, onEdit, onDelete, onShowDetails }) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Button type="link" onClick={() => onShowDetails(record)}>{text}</Button>
          <Tag color={record.status === 'active' ? 'green' : 'red'}>
            {record.status.toUpperCase()}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text) => <Tag>{text.toUpperCase()}</Tag>,
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
      responsive: ['md'],
    },
    {
      title: 'Interactions',
      dataIndex: 'interactions',
      key: 'interactions',
      sorter: (a, b) => a.interactions - b.interactions,
      responsive: ['lg'],
    },
    {
      title: 'Satisfaction',
      dataIndex: 'satisfactionRate',
      key: 'satisfactionRate',
      render: (rate) => (
        <Tooltip title={`${rate}% satisfaction rate`}>
          <Progress percent={rate} size="small" />
        </Tooltip>
      ),
      sorter: (a, b) => a.satisfactionRate - b.satisfactionRate,
      responsive: ['lg'],
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this chatbot?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={chatbots}
      rowKey="id"
      loading={loading}
      scroll={{ x: 'max-content' }}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default ChatbotTable;

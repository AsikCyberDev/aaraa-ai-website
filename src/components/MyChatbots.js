import {
  AppstoreOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ControlOutlined,
  DeleteOutlined, EditOutlined, GlobalOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  SettingOutlined,
  SkinOutlined,
  SlackOutlined,
  UploadOutlined,
  WhatsAppOutlined
} from '@ant-design/icons';
import {
  Button, Card, Checkbox,
  ColorPicker,
  Descriptions,
  Form, Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Slider,
  Steps,
  Switch,
  Table, Tag, Typography,
  Upload,
  message
} from 'antd';
import React, { useEffect, useState } from 'react';
import { FaDiscord } from 'react-icons/fa';
const { useForm } = Form;


const { Step } = Steps;
const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

const MyChatbots = () => {
  const [chatbots, setChatbots] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
const [form] = useForm();


  useEffect(() => {
    fetchChatbots();
  }, []);

  useEffect(() => {
  form.resetFields();
}, [isModalVisible, form]);

  const fetchChatbots = () => {
    setChatbots([
      { id: 1, name: 'Support Bot', type: 'Customer Support', integrations: ['Website', 'WhatsApp'], status: 'Active' },
      { id: 2, name: 'Sales Bot', type: 'Sales', integrations: ['Website', 'Slack'], status: 'Inactive' },
    ]);
  };

  const showModal = () => {
    setIsModalVisible(true);
    setCurrentStep(0);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setCurrentStep(0);
  };

  const handleStepChange = (current) => {
    form.validateFields().then(() => {
      setCurrentStep(current);
    }).catch(() => {
      // If validation fails, don't change the step
    });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

const handleCreateChatbot = async () => {
  try {
    const values = await form.validateFields();
    console.log("Form values:", values);

    const newChatbot = {
      id: chatbots.length + 1,
      ...values,
      status: 'Active',
      integrations: values.integrations || [],
    };

    console.log("New chatbot:", newChatbot);

    setChatbots([...chatbots, newChatbot]);
    setIsModalVisible(false);
    form.resetFields();
    setCurrentStep(0);
    message.success('Chatbot created successfully!');
  } catch (errorInfo) {
    console.log('Failed:', errorInfo);
    message.error('Please fill in all required fields.');
  }
};

  const handleDeleteChatbot = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this chatbot?',
      content: 'This action cannot be undone.',
      onOk() {
        setChatbots(chatbots.filter(chatbot => chatbot.id !== id));
        message.success('Chatbot deleted successfully!');
      },
    });
  };

  const calculateTotalCost = (integrations) => {
    const costs = {
      'WhatsApp': 20,
      'Slack': 15,
      'Discord': 15
    };
    return integrations.reduce((total, integration) => total + (costs[integration] || 0), 0);
  };

  const formatValue = (value) => {
    if (value === undefined || value === null) return 'Not set';
    if (typeof value === 'boolean') return value ? 'Enabled' : 'Disabled';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'None selected';
      if (value[0] instanceof File) return value.map(file => file.name).join(', ');
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      if (value.toHexString) return value.toHexString(); // For ColorPicker
      return JSON.stringify(value);
    }
    return String(value);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Integrations',
      dataIndex: 'integrations',
      key: 'integrations',
      render: integrations => (
        <>
          {(integrations || []).map(integration => {
            let color = integration === 'Website' ? 'green' : 'blue';
            return (
              <Tag color={color} key={integration}>
                {integration.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button icon={<EditOutlined />} style={{ marginRight: 8 }}>Edit</Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteChatbot(record.id)}>Delete</Button>
        </span>
      ),
    },
  ];

  const steps = [
    {
      title: 'Basic Info',
      icon: <InfoCircleOutlined />,
      content: (
        <>
          <Form.Item name="name" label="Chatbot Name" rules={[{ required: true, message: 'Please input the chatbot name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Chatbot Type" rules={[{ required: true, message: 'Please select the chatbot type!' }]}>
            <Select>
              <Option value="Customer Support">Customer Support</Option>
              <Option value="Sales">Sales</Option>
              <Option value="FAQ">FAQ</Option>
              <Option value="Lead Generation">Lead Generation</Option>
              <Option value="E-commerce Assistant">E-commerce Assistant</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="language" label="Primary Language" rules={[{ required: true, message: 'Please select the primary language!' }]}>
            <Select>
              <Option value="en">English</Option>
              <Option value="es">Spanish</Option>
              <Option value="fr">French</Option>
              <Option value="de">German</Option>
              <Option value="zh">Chinese</Option>
            </Select>
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Integrations',
      icon: <AppstoreOutlined />,
      content: (
        <>
          <Form.Item name="integrations" label="Select Integrations">
            <Checkbox.Group>
              <Card>
                <Checkbox value="Website" style={{ marginRight: 8 }}><GlobalOutlined /> Website (Free)</Checkbox>
              </Card>
              <Card style={{ marginTop: 16 }}>
                <Checkbox value="WhatsApp" style={{ marginRight: 8 }}><WhatsAppOutlined /> WhatsApp ($20/month)</Checkbox>
              </Card>
              <Card style={{ marginTop: 16 }}>
                <Checkbox value="Slack" style={{ marginRight: 8 }}><SlackOutlined /> Slack ($15/month)</Checkbox>
              </Card>
              <Card style={{ marginTop: 16 }}>
                <Checkbox value="Discord" style={{ marginRight: 8 }}><FaDiscord /> Discord ($15/month)</Checkbox>
              </Card>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item name="customIntegration" label="Custom Integration URL">
            <Input placeholder="https://your-api-endpoint.com" />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Appearance',
      icon: <SkinOutlined />,
      content: (
        <>
          <Title level={4}>Appearance</Title>
          <Form.Item name="theme" label="Chat Theme">
            <Radio.Group>
              <Radio value="light">Light</Radio>
              <Radio value="dark">Dark</Radio>
              <Radio value="custom">Custom</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="primaryColor" label="Primary Color">
            <ColorPicker />
          </Form.Item>
          <Form.Item name="fontSelection" label="Font Selection">
            <Select>
              <Option value="Arial">Arial</Option>
              <Option value="Helvetica">Helvetica</Option>
              <Option value="Times New Roman">Times New Roman</Option>
              <Option value="Courier">Courier</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="chatIcon"
            label="Chat Icon"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              name="logo"
              listType="picture"
              beforeUpload={() => false} // Prevent auto upload
            >
              <Button icon={<UploadOutlined />}>Upload Icon</Button>
            </Upload>
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Behavior',
      icon: <ControlOutlined />,
      content: (
        <>
          <Form.Item name="welcomeMessage" label="Welcome Message">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="fallbackMessage" label="Fallback Message">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="inputPlaceholder" label="Input Placeholder">
            <Input />
          </Form.Item>
          <Form.Item name="responseTime" label="Simulated Response Time (seconds)">
            <Slider min={0} max={5} step={0.5} />
          </Form.Item>
          <Form.Item name="enableTypingIndicator" label="Enable Typing Indicator" valuePropName="checked">
            <Switch />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Training',
      icon: <BookOutlined />,
      content: (
        <>
          <Title level={4}>Training</Title>
          <Form.Item
            name="trainingData"
            label="Upload Training Data"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              name="file"
              listType="text"
              beforeUpload={() => false} // Prevent auto upload
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="knowledgeBase" label="Knowledge Base URL">
            <Input placeholder="https://your-knowledge-base.com" />
          </Form.Item>
          <Form.Item name="enableLearning" label="Enable Continuous Learning" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="confidenceThreshold" label="Confidence Threshold">
            <Slider min={0} max={1} step={0.1} />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Advanced',
      icon: <SettingOutlined />,
      content: (
        <>
          <Form.Item name="maxConversationLength" label="Max Conversation Length">
            <InputNumber min={10} max={100} />
          </Form.Item>
          <Form.Item name="enableHumanHandoff" label="Enable Human Handoff" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="handoffThreshold" label="Human Handoff Threshold">
            <Slider min={0} max={1} step={0.1} />
          </Form.Item>
          <Form.Item name="enableAnalytics" label="Enable Analytics" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="sessionTimeout" label="Session Timeout (minutes)">
            <InputNumber min={5} max={60} />
          </Form.Item>
        </>
      ),
    },
  {
  title: 'Confirmation',
  icon: <CheckCircleOutlined />,
  content: (
    <Form.Item shouldUpdate>
      {() => {
        const values = form.getFieldsValue();
        const totalCost = calculateTotalCost(values.integrations || []);
        return (
          <Card>
            <Title level={4}>Chatbot Summary</Title>
            <Descriptions column={1}>
              {Object.entries(values).map(([key, value]) => (
                <Descriptions.Item key={key} label={key}>
                  {formatValue(value)}
                </Descriptions.Item>
              ))}
            </Descriptions>
            <Text strong>Total Additional Cost: ${totalCost}/month</Text>
          </Card>
        );
      }}
    </Form.Item>
  ),
},
  ];

  return (
    <div className="my-chatbots-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>My Chatbots</Title>
               <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Create New Chatbot
        </Button>
      </div>

      <Table columns={columns} dataSource={chatbots} rowKey="id" />

    <Modal
  title="Create New Chatbot"
  visible={isModalVisible}
  onCancel={handleCancel}
  footer={null}
  width={1000}
>
  <Form form={form} layout="vertical" onFinish={handleCreateChatbot}>
    <Steps current={currentStep} onChange={handleStepChange}>
      {steps.map(item => (
        <Step key={item.title} title={item.title} icon={item.icon} />
      ))}
    </Steps>

    <div style={{ marginTop: 24 }}>
      {steps[currentStep].content}
    </div>

    <div style={{ marginTop: 24 }}>
      {currentStep > 0 && (
        <Button style={{ marginRight: 8 }} onClick={() => setCurrentStep(currentStep - 1)}>
          Previous
        </Button>
      )}
      {currentStep < steps.length - 1 && (
        <Button type="primary" onClick={() => handleStepChange(currentStep + 1)}>
          Next
        </Button>
      )}
      {currentStep === steps.length - 1 && (
        <Button type="primary" htmlType="submit">
          Create Chatbot
        </Button>
      )}
    </div>
  </Form>
</Modal>
    </div>
  );
};

export default MyChatbots;
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
  message,
  Tooltip
} from 'antd';
import React, { useEffect, useState } from 'react';
import { FaDiscord } from 'react-icons/fa';


const { Step } = Steps;
const { Option } = Select;
const { Title } = Typography;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const sampleChatbot = {
  id: "9de8c05f-6e7f-4f65-a589-3c6df4053a91",
  name: "Sample Chatbotter",
  description: "This is a sample chatbot",
  status: "ACTIVE",
  type: "SUPPORT",
  language: "en",
  integrations: ["Website"],
  customIntegration: "Custom Integration",
  theme: "dark",
  primaryColor: "#912F31",
  fontSelection: "Arial",
  chatIcon: "test.png",
  welcomeMessage: "Welcome to our support chatbot!",
  fallbackMessage: "Sorry, I didn't understand that. Can you please rephrase?",
  inputPlaceholder: "Type your message here...",
  responseTime: 1,
  enableTypingIndicator: true,
  trainingData: "selected.csv",
  knowledgeBase: "Sample knowledge base content",
  enableLearning: true,
  confidenceThreshold: 0.2,
  maxConversationLength: 10,
  enableHumanHandoff: true,
  handoffThreshold: 0.1,
  enableAnalytics: true,
  sessionTimeout: 5,
  created: "2024-08-19T09:31:50.098Z",
  interactions: 0,
  satisfactionRate: 0
};

const MyChatbots = () => {
  const [form] = Form.useForm();
  const [chatbots, setChatbots] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});


  useEffect(() => {
    const savedChatbots = localStorage.getItem('chatbots');
    if (savedChatbots) {
      setChatbots([sampleChatbot, ...JSON.parse(savedChatbots)]);
    }
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
    setCurrentStep(0);
    setFormData({});
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentStep(0);
    setFormData({});
  };

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleCreateChatbot = () => {
    console.log("Form data:", formData);
    if (Object.keys(formData).length === 0) {
      message.error('Please fill in the form before submitting.');
      return;
    }

    const newChatbot = {
      id: Date.now(),
      ...formData,
      status: 'Active',
      created: new Date().toISOString(),
      interactions: 0,
      satisfactionRate: 0
    };

    const updatedChatbots = [...chatbots, newChatbot];
    setChatbots(updatedChatbots);
    localStorage.setItem('chatbots', JSON.stringify(updatedChatbots.filter(chatbot => chatbot.id !== sampleChatbot.id)));
    setIsModalVisible(false);
    setFormData({});
    message.success('Chatbot created successfully!');
  };




  const renderChatbotDetails = (item) => (
    <>
      <div><strong>Type:</strong> {item.type}</div>
      <div><strong>Language:</strong> {item.language}</div>
      <div><strong>Description:</strong> {item.description}</div>
      <div><strong>Integrations:</strong> {item.integrations.join(', ')}</div>
      <div><strong>Theme:</strong> {item.theme}</div>
      <div><strong>Primary Color:</strong> {item.primaryColor}</div>
      <div><strong>Font:</strong> {item.fontSelection}</div>
      <div><strong>Chat Icon:</strong> {item.chatIcon}</div>
      <div><strong>Training Data:</strong> {item.trainingData}</div>
      <div><strong>Created:</strong> {new Date(item.created).toLocaleString()}</div>
      <div><strong>Interactions:</strong> {item.interactions}</div>
      <div><strong>Satisfaction Rate:</strong> {item.satisfactionRate}%</div>
    </>
  );




  useEffect(() => {
    form.resetFields();
  }, [isModalVisible, form]);




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

  const renderFormStep = (step) => {
    switch (step.title) {
      case 'Basic Info':
        return (
          <Form {...formItemLayout}>
            <Form.Item label="Chatbot Name" required>
              <Input
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Chatbot Type" required>
              <Select
                value={formData.type}
                onChange={(value) => handleInputChange('type', value)}
              >
                <Option value="Customer Support">Customer Support</Option>
                <Option value="Sales">Sales</Option>
                <Option value="FAQ">FAQ</Option>
                <Option value="Lead Generation">Lead Generation</Option>
                <Option value="E-commerce Assistant">E-commerce Assistant</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Description">
              <TextArea
                rows={4}
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Primary Language" required>
              <Select
                value={formData.language}
                onChange={(value) => handleInputChange('language', value)}
              >
                <Option value="en">English</Option>
                <Option value="es">Spanish</Option>
                <Option value="fr">French</Option>
                <Option value="de">German</Option>
                <Option value="zh">Chinese</Option>
              </Select>
            </Form.Item>
          </Form>
        );

      case 'Integrations':
        return (
          <Form {...formItemLayout}>
            <Form.Item label="Select Integrations">
              <Checkbox.Group
                value={formData.integrations || []}
                onChange={(values) => handleInputChange('integrations', values)}
              >
                <Card style={{ marginBottom: 16 }}>
                  <Checkbox value="Website"><GlobalOutlined /> Website (Free)</Checkbox>
                </Card>
                <Card style={{ marginBottom: 16 }}>
                  <Checkbox value="WhatsApp"><WhatsAppOutlined /> WhatsApp ($20/month)</Checkbox>
                </Card>
                <Card style={{ marginBottom: 16 }}>
                  <Checkbox value="Slack"><SlackOutlined /> Slack ($15/month)</Checkbox>
                </Card>
                <Card style={{ marginBottom: 16 }}>
                  <Checkbox value="Discord"><FaDiscord /> Discord ($15/month)</Checkbox>
                </Card>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item label="Custom Integration URL">
              <Input
                placeholder="https://your-api-endpoint.com"
                value={formData.customIntegration || ''}
                onChange={(e) => handleInputChange('customIntegration', e.target.value)}
              />
            </Form.Item>
          </Form>
        );

      case 'Appearance':
        return (
          <Form {...formItemLayout}>
            <Form.Item label="Chat Theme">
              <Radio.Group
                value={formData.theme}
                onChange={(e) => handleInputChange('theme', e.target.value)}
              >
                <Radio value="light">Light</Radio>
                <Radio value="dark">Dark</Radio>
                <Radio value="custom">Custom</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Primary Color">
              <ColorPicker
                value={formData.primaryColor}
                onChange={(color) => handleInputChange('primaryColor', color.toHexString())}
              />
            </Form.Item>
            <Form.Item label="Font Selection">
              <Select
                value={formData.fontSelection}
                onChange={(value) => handleInputChange('fontSelection', value)}
              >
                <Option value="Arial">Arial</Option>
                <Option value="Helvetica">Helvetica</Option>
                <Option value="Times New Roman">Times New Roman</Option>
                <Option value="Courier">Courier</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Chat Icon">
              <Upload
                listType="picture-card"
                beforeUpload={() => false}
                onChange={(info) => handleInputChange('chatIcon', info.fileList)}
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </Form>
        );

      case 'Behavior':
        return (
          <Form {...formItemLayout}>
            <Form.Item label="Welcome Message">
              <TextArea
                rows={4}
                value={formData.welcomeMessage || ''}
                onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Fallback Message">
              <TextArea
                rows={4}
                value={formData.fallbackMessage || ''}
                onChange={(e) => handleInputChange('fallbackMessage', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Input Placeholder">
              <Input
                value={formData.inputPlaceholder || ''}
                onChange={(e) => handleInputChange('inputPlaceholder', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Response Time">
              <Slider
                min={0}
                max={5}
                step={0.5}
                value={formData.responseTime || 0}
                onChange={(value) => handleInputChange('responseTime', value)}
              />
            </Form.Item>
            <Form.Item label="Typing Indicator">
              <Switch
                checked={formData.enableTypingIndicator || false}
                onChange={(checked) => handleInputChange('enableTypingIndicator', checked)}
              />
            </Form.Item>
          </Form>
        );

      case 'Training':
        return (
          <Form {...formItemLayout}>
            <Form.Item label="Training Data">
              <Upload
                listType="text"
                beforeUpload={() => false}
                onChange={(info) => handleInputChange('trainingData', info.fileList)}
              >
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Form.Item>
            <Form.Item label="Knowledge Base URL">
              <Input
                placeholder="https://your-knowledge-base.com"
                value={formData.knowledgeBase || ''}
                onChange={(e) => handleInputChange('knowledgeBase', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Continuous Learning">
              <Switch
                checked={formData.enableLearning || false}
                onChange={(checked) => handleInputChange('enableLearning', checked)}
              />
            </Form.Item>
            <Form.Item label="Confidence Threshold">
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={formData.confidenceThreshold || 0}
                onChange={(value) => handleInputChange('confidenceThreshold', value)}
              />
            </Form.Item>
          </Form>
        );

      case 'Advanced':
        return (
          <Form {...formItemLayout}>
            <Form.Item label="Max Conversation Length">
              <InputNumber
                min={10}
                max={100}
                value={formData.maxConversationLength}
                onChange={(value) => handleInputChange('maxConversationLength', value)}
              />
            </Form.Item>
            <Form.Item label="Human Handoff">
              <Switch
                checked={formData.enableHumanHandoff || false}
                onChange={(checked) => handleInputChange('enableHumanHandoff', checked)}
              />
            </Form.Item>
            <Form.Item label="Handoff Threshold">
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={formData.handoffThreshold || 0}
                onChange={(value) => handleInputChange('handoffThreshold', value)}
              />
            </Form.Item>
            <Form.Item label="Analytics">
              <Switch
                checked={formData.enableAnalytics || false}
                onChange={(checked) => handleInputChange('enableAnalytics', checked)}
              />
            </Form.Item>
            <Form.Item label="Session Timeout">
              <InputNumber
                min={5}
                max={60}
                value={formData.sessionTimeout}
                onChange={(value) => handleInputChange('sessionTimeout', value)}
                addonAfter="minutes"
              />
            </Form.Item>
          </Form>
        );

      case 'Confirmation':
        return (
          <Card>
            <Descriptions title="Chatbot Summary" column={1} bordered>
              {Object.entries(formData).map(([key, value]) => (
                <Descriptions.Item key={key} label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}>
                  {formatValue(value)}
                </Descriptions.Item>
              ))}
            </Descriptions>
            <div style={{ marginTop: 16 }}>
              <strong>Total Additional Cost: </strong>${calculateTotalCost(formData.integrations || [])}/month
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <span>
          {text}
          {record.id === sampleChatbot.id && (
            <Tag color="blue" style={{ marginLeft: 8 }}>Template</Tag>
          )}
        </span>
      ),
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
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Details',
      key: 'details',
      render: (_, record) => (
        <Tooltip title={renderChatbotDetails(record)} placement="left" overlayStyle={{ maxWidth: 500 }}>
          <Button>View Details</Button>
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button icon={<EditOutlined />} style={{ marginRight: 8 }}>Edit</Button>
          {record.id !== sampleChatbot.id && (
            <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteChatbot(record.id)}>Delete</Button>
          )}
        </span>
      ),
    },
  ];



  const steps = [
    {
      title: 'Basic Info',
      icon: <InfoCircleOutlined />
    },
    {
      title: 'Integrations',
      icon: <AppstoreOutlined />
    },
    {
      title: 'Appearance',
      icon: <SkinOutlined />
    },
    {
      title: 'Behavior',
      icon: <ControlOutlined />
    },
    {
      title: 'Training',
      icon: <BookOutlined />
    },
    {
      title: 'Advanced',
      icon: <SettingOutlined />
    },
    {
      title: 'Confirmation',
      icon: <CheckCircleOutlined />
    },
  ];

  return (
    <div className="my-chatbots-container" style={{ padding: '24px' }}>
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
        width={800}
        styles={{ maxHeight: '70vh', overflow: 'auto' }}
      >
        <Steps current={currentStep}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} icon={item.icon} />
          ))}
        </Steps>

        <div style={{ marginTop: 24 }}>
          {renderFormStep(steps[currentStep])}
        </div>

        <div style={{ marginTop: 24 }}>
          {currentStep > 0 && (
            <Button style={{ marginRight: 8 }} onClick={() => setCurrentStep(prev => prev - 1)}>
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={() => setCurrentStep(prev => prev + 1)}>
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" onClick={handleCreateChatbot}>
              Create Chatbot
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default MyChatbots;
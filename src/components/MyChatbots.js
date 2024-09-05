import {
  BookOutlined, CheckCircleOutlined, ControlOutlined,
  DeleteOutlined, EditOutlined, InfoCircleOutlined,
  PlusOutlined, SettingOutlined, SkinOutlined
} from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import {
  Button, ColorPicker, Descriptions, Form, Input, InputNumber,
  Modal, Radio, Select, Slider, Steps, Switch, Table, Tag,
  Tooltip, Typography, message
} from 'antd';
import React, { useEffect, useState } from 'react';
import { CREATE_CHATBOT, DELETE_CHATBOT, GET_CHATBOTS, GET_PROJECTS, UPDATE_CHATBOT } from '../graphql/queries';

const { Step } = Steps;
const { Option } = Select;
const { Title } = Typography;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const MyChatbots = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [editingChatbot, setEditingChatbot] = useState(null);

  const userId = JSON.parse(localStorage.getItem('user')).id;

  const { loading, error, data, refetch } = useQuery(GET_CHATBOTS);
  const { data: projectsData, loading: projectsLoading, error: projectsError } = useQuery(GET_PROJECTS, {
    variables: { userId },
  });
  const [createChatbot] = useMutation(CREATE_CHATBOT);
  const [updateChatbot] = useMutation(UPDATE_CHATBOT);
  const [deleteChatbot] = useMutation(DELETE_CHATBOT);

  useEffect(() => {
    if (error) {
      message.error('Failed to load chatbots');
    }
    if (projectsError) {
      message.error('Failed to load projects');
    }
  }, [error, projectsError]);

  const showModal = (chatbot = null) => {
    setIsModalVisible(true);
    setCurrentStep(0);
    if (chatbot) {
      setEditingChatbot(chatbot);
      setFormData(chatbot);
      setSelectedProjectId(chatbot.projectId);
    } else {
      setEditingChatbot(null);
      setFormData({});
      setSelectedProjectId(null);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentStep(0);
    setFormData({});
    setEditingChatbot(null);
  };

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSaveChatbot = async () => {
    try {
      const input = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        type: formData.type,
        language: formData.language,
        theme: formData.theme,
        primaryColor: {
          cleared: false,  // or true depending on your application's logic
          metaColor: {
            isValid: true,  // Assuming the color picked is valid
            r: parseInt(formData.primaryColor.slice(1, 3), 16),  // Red component
            g: parseInt(formData.primaryColor.slice(3, 5), 16),  // Green component
            b: parseInt(formData.primaryColor.slice(5, 7), 16),  // Blue component
            a: 1,  // Alpha component, assuming fully opaque
            _h: 0,  // Hue, set to default or calculate based on color
            _s: 0,  // Saturation, set to default or calculate based on color
            _v: 0,  // Value (brightness), set to default or calculate based on color
          },
        },
        fontSelection: formData.fontSelection,
        welcomeMessage: formData.welcomeMessage,
        fallbackMessage: formData.fallbackMessage,
        inputPlaceholder: formData.inputPlaceholder,
        responseTime: formData.responseTime,
        enableTypingIndicator: formData.enableTypingIndicator,
        knowledgeBase: formData.knowledgeBase,
        enableLearning: formData.enableLearning,
        confidenceThreshold: formData.confidenceThreshold,
        maxConversationLength: formData.maxConversationLength,
        enableHumanHandoff: formData.enableHumanHandoff,
        handoffThreshold: formData.handoffThreshold,
        enableAnalytics: formData.enableAnalytics,
        sessionTimeout: formData.sessionTimeout,
      };

      if (editingChatbot) {
        await updateChatbot({
          variables: {
            id: editingChatbot.id,
            projectId: selectedProjectId,
            input
          },
        });
        message.success('Chatbot updated successfully!');
      } else {
        await createChatbot({
          variables: {
            input: {
              ...input,
              projectId: selectedProjectId
            }
          },
        });
        message.success('Chatbot created successfully!');
      }
      setIsModalVisible(false);
      refetch();
    } catch (err) {
      message.error(`Failed to ${editingChatbot ? 'update' : 'create'} chatbot: ` + err.message);
      console.error(err);
    }
  };

  const handleDeleteChatbot = async (id, projectId) => {
    try {
      await deleteChatbot({
        variables: { id, projectId },
      });
      message.success('Chatbot deleted successfully!');
      refetch();
    } catch (err) {
      message.error('Failed to delete chatbot');
      console.error(err);
    }
  };

  const renderChatbotDetails = (item) => (
    <>
      <div><strong>Type:</strong> {item.type}</div>
      <div><strong>Language:</strong> {item.language}</div>
      <div><strong>Description:</strong> {item.description}</div>
      <div><strong>Theme:</strong> {item.theme}</div>
      <div><strong>Primary Color:</strong> {item.primaryColor?.metaColor?.hex}</div>
      <div><strong>Font:</strong> {item.fontSelection}</div>
      <div><strong>Created:</strong> {new Date(item.created).toLocaleString()}</div>
      <div><strong>Interactions:</strong> {item.interactions}</div>
      <div><strong>Satisfaction Rate:</strong> {item.satisfactionRate}%</div>
    </>
  );

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
      title: 'Project',
      dataIndex: 'projectId',
      key: 'projectId',
      render: projectId => {
        const project = projectsData?.projects.find(p => p.id === projectId);
        return project ? project.name : 'Unknown Project';
      },
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
          <Button icon={<EditOutlined />} style={{ marginRight: 8 }} onClick={() => showModal(record)}>Edit</Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteChatbot(record.id, record.projectId)}>Delete</Button>
        </span>
      ),
    },
  ];

  const steps = [
    {
      title: 'Basic Info',
      icon: <InfoCircleOutlined />,
      content: (
        <Form {...formItemLayout} initialValues={formData}>
          <Form.Item label="Project" name="projectId" rules={[{ required: true }]}>
            <Select
              onChange={(value) => setSelectedProjectId(value)}
              loading={projectsLoading}
              placeholder={projectsLoading ? "Loading projects..." : "Select a project"}
            >
              {projectsData?.projects.length > 0 ? (
                projectsData.projects.map(project => (
                  <Option key={project.id} value={project.id}>{project.name}</Option>
                ))
              ) : (
                <Option disabled>No projects available</Option>
              )}
            </Select>
          </Form.Item>
          <Form.Item label="Chatbot Name" name="name" rules={[{ required: true }]}>
            <Input onChange={(e) => handleInputChange('name', e.target.value)} />
          </Form.Item>
          <Form.Item label="Chatbot Type" name="type" rules={[{ required: true }]}>
            <Select onChange={(value) => handleInputChange('type', value)}>
              <Option value="SUPPORT">Support</Option>
              <Option value="SALES">Sales</Option>
              <Option value="BEDROCK_AGENT">Agent</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Select onChange={(value) => handleInputChange('status', value)}>
              <Option value="ACTIVE">Active</Option>
              <Option value="INACTIVE">Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Description" name="description">
            <TextArea rows={4} onChange={(e) => handleInputChange('description', e.target.value)} />
          </Form.Item>
          <Form.Item label="Language" name="language" rules={[{ required: true }]}>
            <Select onChange={(value) => handleInputChange('language', value)}>
              <Option value="en">English</Option>
              <Option value="es">Spanish</Option>
              <Option value="fr">French</Option>
            </Select>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Appearance',
      icon: <SkinOutlined />,
      content: (
        <Form {...formItemLayout}>
          <Form.Item label="Theme" name="theme">
            <Radio.Group onChange={(e) => handleInputChange('theme', e.target.value)}>
              <Radio value="light">Light</Radio>
              <Radio value="dark">Dark</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Primary Color" name="primaryColor">
            <ColorPicker onChange={(color) => handleInputChange('primaryColor', color.toHexString())} />
          </Form.Item>
          <Form.Item label="Font" name="fontSelection">
            <Select onChange={(value) => handleInputChange('fontSelection', value)}>
              <Option value="Arial">Arial</Option>
              <Option value="Helvetica">Helvetica</Option>
              <Option value="Times New Roman">Times New Roman</Option>
            </Select>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Behavior',
      icon: <ControlOutlined />,
      content: (
        <Form {...formItemLayout}>
          <Form.Item label="Welcome Message" name="welcomeMessage">
            <TextArea rows={4} onChange={(e) => handleInputChange('welcomeMessage', e.target.value)} />
          </Form.Item>
          <Form.Item label="Fallback Message" name="fallbackMessage">
            <TextArea rows={4} onChange={(e) => handleInputChange('fallbackMessage', e.target.value)} />
          </Form.Item>
          <Form.Item label="Input Placeholder" name="inputPlaceholder">
            <Input onChange={(e) => handleInputChange('inputPlaceholder', e.target.value)} />
          </Form.Item>
          <Form.Item label="Response Time" name="responseTime">
            <InputNumber min={0} max={5} onChange={(value) => handleInputChange('responseTime', value)} />
          </Form.Item>
          <Form.Item label="Enable Typing Indicator" name="enableTypingIndicator" valuePropName="checked">
            <Switch onChange={(checked) => handleInputChange('enableTypingIndicator', checked)} />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Training',
      icon: <BookOutlined />,
      content: (
        <Form {...formItemLayout}>
          <Form.Item label="Knowledge Base" name="knowledgeBase">
            <Input onChange={(e) => handleInputChange('knowledgeBase', e.target.value)} />
          </Form.Item>
          <Form.Item label="Enable Learning" name="enableLearning" valuePropName="checked">
            <Switch onChange={(checked) => handleInputChange('enableLearning', checked)} />
          </Form.Item>
          <Form.Item label="Confidence Threshold" name="confidenceThreshold">
            <Slider min={0} max={1} step={0.1} onChange={(value) => handleInputChange('confidenceThreshold', value)} />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Advanced',
      icon: <SettingOutlined />,
      content: (
        <Form {...formItemLayout}>
          <Form.Item label="Max Conversation Length" name="maxConversationLength">
            <InputNumber min={1} onChange={(value) => handleInputChange('maxConversationLength', value)} />
          </Form.Item>
          <Form.Item label="Enable Human Handoff" name="enableHumanHandoff" valuePropName="checked">
            <Switch onChange={(checked) => handleInputChange('enableHumanHandoff', checked)} />
          </Form.Item>
          <Form.Item label="Handoff Threshold" name="handoffThreshold">
            <Slider min={0} max={1} step={0.1} onChange={(value) => handleInputChange('handoffThreshold', value)} />
          </Form.Item>
          <Form.Item label="Enable Analytics" name="enableAnalytics" valuePropName="checked">
            <Switch onChange={(checked) => handleInputChange('enableAnalytics', checked)} />
          </Form.Item>
          <Form.Item label="Session Timeout" name="sessionTimeout">
            <InputNumber min={1} addonAfter="minutes" onChange={(value) => handleInputChange('sessionTimeout', value)} />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Confirmation',
      icon: <CheckCircleOutlined />,
      content: (
        <Descriptions title="Chatbot Summary" bordered>
          {Object.entries(formData).map(([key, value]) => (
            <Descriptions.Item key={key} label={key}>{JSON.stringify(value)}</Descriptions.Item>
          ))}
        </Descriptions>
      ),
    },
  ];

  return (
    <div className="my-chatbots-container" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>My Chatbots</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Create New Chatbot
        </Button>
      </div>

      <Table columns={columns} dataSource={data?.chatbots} rowKey="id" loading={loading} />

      <Modal
        title={editingChatbot ? "Edit Chatbot" : "Create New Chatbot"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Steps current={currentStep}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} icon={item.icon} />
          ))}
        </Steps>

        <div style={{ marginTop: 24 }}>
          {steps[currentStep].content}
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
            <Button type="primary" onClick={handleSaveChatbot}>
              {editingChatbot ? 'Update Chatbot' : 'Create Chatbot'}
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default MyChatbots;

import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Select, Space, message } from 'antd';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { createChatbot, deleteChatbot, fetchChatbots, fetchDocuments, updateChatbot } from '../api';
import ChatbotDetailsDrawer from './ChatbotDetailsDrawer';
import ChatbotOverview from './ChatbotOverview';
import ChatbotTable from './ChatbotTable';

const { Option } = Select;

function MyChatbots() {
  const [chatbots, setChatbots] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  const [editingChatbot, setEditingChatbot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const chatbotsResponse = await fetchChatbots();
      const documentsResponse = await Promise.all(
        chatbotsResponse.data.getChatbots.flatMap(chatbot =>
          chatbot.documentIds.map(docId => fetchDocuments(docId))
        )
      );
      setChatbots(chatbotsResponse.data.getChatbots);
      setDocuments(documentsResponse.map(response => response.data.getDocument));
    } catch (error) {
      message.error('Failed to fetch data');
    }
    setLoading(false);
  };

  const showModal = (chatbot = null) => {
    setEditingChatbot(chatbot);
    if (chatbot) {
      form.setFieldsValue({
        ...chatbot,
        documentIds: chatbot.documentIds || [],
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingChatbot) {
        await updateChatbot(editingChatbot.id, { ...editingChatbot, ...values });
        message.success('Chatbot updated successfully');
      } else {
        await createChatbot(values);
        message.success('Chatbot created successfully');
      }
      setIsModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('Failed to save chatbot');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteChatbot(id);
      message.success('Chatbot deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete chatbot');
    }
  };

  const showDrawer = (chatbot) => {
    setSelectedChatbot(chatbot);
    setIsDrawerVisible(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>My Chatbots</h2>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                Create New Chatbot
              </Button>
            </motion.div>
          </div>
          <ChatbotOverview chatbots={chatbots} />
          <ChatbotTable
            chatbots={chatbots}
            loading={loading}
            onEdit={showModal}
            onDelete={handleDelete}
            onShowDetails={showDrawer}
          />
        </Space>
      </Card>

      <Modal
        title={editingChatbot ? "Edit Chatbot" : "Create New Chatbot"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Chatbot Name"
            rules={[{ required: true, message: 'Please input the chatbot name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the chatbot description!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please select the chatbot type!' }]}
          >
            <Select>
              <Option value="support">Support</Option>
              <Option value="sales">Sales</Option>
              <Option value="information">Information</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="languages"
            label="Languages"
            rules={[{ required: true, message: 'Please select at least one language!' }]}
          >
            <Select mode="multiple">
              <Option value="English">English</Option>
              <Option value="Spanish">Spanish</Option>
              <Option value="French">French</Option>
              <Option value="German">German</Option>
              <Option value="Chinese">Chinese</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="documentIds"
            label="Associated Documents"
          >
            <Select mode="multiple">
              {documents.map(doc => (
                <Option key={doc.id} value={doc.id}>{doc.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <ChatbotDetailsDrawer
        visible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        chatbot={selectedChatbot}
      />
    </motion.div>
  );
}

export default MyChatbots;

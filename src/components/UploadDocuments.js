import { DeleteOutlined, EditOutlined, FileTextOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, Input, List, Modal, Select, Space, Typography, Upload, message } from 'antd';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
    createDocument,
    deleteDocument,
    fetchChatbots,
    fetchDocuments,
    updateDocument
} from '../api'; // Assuming your API calls are in api.js

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const UploadDocuments = () => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [chatbots, setChatbots] = useState([]);
  const [selectedChatbot, setSelectedChatbot] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const chatbotsResponse = await fetchChatbots();
        setChatbots(chatbotsResponse.data);
      } catch (error) {
        message.error('Failed to load chatbots');
      }
    };
    loadData();
  }, []);

  const handleUpload = async () => {
    if (!selectedChatbot) {
      message.error('Please select a chatbot before uploading documents');
      return;
    }
    setUploading(true);

    try {
      const uploadedDocuments = await Promise.all(
        fileList.map(async (file) => {
          const newDocument = {
            name: file.name,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            uploadDate: new Date().toISOString().split('T')[0],
            chatbotId: selectedChatbot,
          };
          const response = await createDocument(newDocument);
          return response.data;
        })
      );

      const updatedChatbots = chatbots.map((chatbot) => {
        if (chatbot.id === selectedChatbot) {
          return {
            ...chatbot,
            documentIds: [...chatbot.documentIds, ...uploadedDocuments.map((doc) => doc.id)],
          };
        }
        return chatbot;
      });

      setChatbots(updatedChatbots);
      setFileList([]);
      message.success('Upload successful');
    } catch (error) {
      message.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const handleEdit = (document, chatbotId) => {
    setEditingDocument({ ...document, chatbotId });
    setEditModalVisible(true);
  };

  const handleDelete = async (documentId, chatbotId) => {
    try {
      await deleteDocument(documentId);
      const updatedChatbots = chatbots.map((chatbot) => {
        if (chatbot.id === chatbotId) {
          return {
            ...chatbot,
            documentIds: chatbot.documentIds.filter((id) => id !== documentId),
          };
        }
        return chatbot;
      });
      setChatbots(updatedChatbots);
      message.success('Document deleted successfully');
    } catch (error) {
      message.error('Failed to delete document');
    }
  };

  const handleEditModalOk = async () => {
    try {
      await updateDocument(editingDocument.id, { name: editingDocument.name });
      const updatedChatbots = chatbots.map((chatbot) => {
        if (chatbot.id === editingDocument.chatbotId) {
          return {
            ...chatbot,
            documentIds: chatbot.documentIds.map((doc) =>
              doc.id === editingDocument.id ? { ...doc, name: editingDocument.name } : doc
            ),
          };
        }
        return chatbot;
      });
      setChatbots(updatedChatbots);
      setEditModalVisible(false);
      setEditingDocument(null);
      message.success('Document updated successfully');
    } catch (error) {
      message.error('Failed to update document');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={2}>Upload Documents</Title>
          <Select
            style={{ width: 200 }}
            placeholder="Select a chatbot"
            onChange={setSelectedChatbot}
            value={selectedChatbot}
          >
            {chatbots.map((chatbot) => (
              <Option key={chatbot.id} value={chatbot.id}>{chatbot.name}</Option>
            ))}
          </Select>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0 || !selectedChatbot}
            loading={uploading}
            style={{ marginTop: 16 }}
          >
            {uploading ? 'Uploading' : 'Start Upload'}
          </Button>
          <Title level={3}>Uploaded Documents</Title>
          <Collapse>
            {chatbots.map((chatbot) => (
              <Panel header={chatbot.name} key={chatbot.id}>
                <List
                  itemLayout="horizontal"
                  dataSource={chatbot.documentIds.map((id) => fetchDocuments(id))}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button icon={<EditOutlined />} onClick={() => handleEdit(item, chatbot.id)}>Edit</Button>,
                        <Button icon={<DeleteOutlined />} onClick={() => handleDelete(item.id, chatbot.id)} danger>Delete</Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<FileTextOutlined style={{ fontSize: 24 }} />}
                        title={item.name}
                        description={
                          <Space direction="vertical">
                            <Text>Size: {item.size}</Text>
                            <Text>Uploaded: {item.uploadDate}</Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Panel>
            ))}
          </Collapse>
        </Space>
      </Card>
      <Modal
        title="Edit Document"
        visible={editModalVisible}
        onOk={handleEditModalOk}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingDocument(null);
        }}
      >
        {editingDocument && (
          <Input
            value={editingDocument.name}
            onChange={(e) => setEditingDocument({ ...editingDocument, name: e.target.value })}
            placeholder="Document Name"
          />
        )}
      </Modal>
    </motion.div>
  );
};

export default UploadDocuments;

import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Card, Input, List, Modal, Select, Upload, message } from 'antd';
import React, { useEffect, useState } from 'react';
import {
    CREATE_DOCUMENT,
    DELETE_DOCUMENT,
    GET_DOCUMENTS_BY_PROJECT,
    GET_PROJECTS,
    UPDATE_DOCUMENT
} from '../graphql/queries';

const { Option } = Select;

const UploadDocuments = () => {
    const [selectedProject, setSelectedProject] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingDocument, setEditingDocument] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null;

    const { data: projectsData, loading: projectsLoading, error: projectsError } = useQuery(GET_PROJECTS, {
        variables: { userId },
        skip: !userId,
    });

    const { data: documentsData, refetch: refetchDocuments } = useQuery(GET_DOCUMENTS_BY_PROJECT, {
        variables: { projectId: selectedProject },
        skip: !selectedProject,
    });

    const [createDocument] = useMutation(CREATE_DOCUMENT);
    const [updateDocument] = useMutation(UPDATE_DOCUMENT);
    const [deleteDocument] = useMutation(DELETE_DOCUMENT);

    useEffect(() => {
        if (projectsError) {
            message.error('Failed to load projects');
        }
        if (projectsData?.projects.length > 0 && !selectedProject) {
            setSelectedProject(projectsData.projects[0].id);
        }
    }, [projectsData, projectsError, selectedProject]);

    const handleUpload = async (file) => {
        try {
            const { data } = await createDocument({
                variables: {
                    input: {
                        name: file.name,
                        size: file.size.toString(),
                        projectId: selectedProject,
                        chatbotId: "default", // Adjust as needed
                    },
                },
            });

            const { uploadUrl, document } = data.createDocument;

            await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
            });

            message.success(`${file.name} file uploaded successfully`);
            refetchDocuments();
        } catch (error) {
            message.error(`${file.name} file upload failed.`);
            console.error('Upload error:', error);
        }
    };

    const handleEdit = (document) => {
        setEditingDocument(document);
        setEditModalVisible(true);
    };

    const handleDelete = async (document) => {
        try {
            await deleteDocument({
                variables: { id: document.id, projectId: selectedProject },
            });
            message.success('Document deleted successfully');
            refetchDocuments();
        } catch (error) {
            message.error('Failed to delete document');
            console.error('Delete error:', error);
        }
    };

    const handleEditModalOk = async () => {
        try {
            await updateDocument({
                variables: {
                    id: editingDocument.id,
                    projectId: selectedProject,
                    name: editingDocument.name,
                },
            });
            setEditModalVisible(false);
            message.success('Document updated successfully');
            refetchDocuments();
        } catch (error) {
            message.error('Failed to update document');
            console.error('Update error:', error);
        }
    };

    return (
        <Card title="Upload Documents">
            <Select
                style={{ width: 200, marginBottom: 16 }}
                placeholder="Select a project"
                onChange={setSelectedProject}
                value={selectedProject}
                loading={projectsLoading}
                disabled={!userId || projectsLoading}
            >
                {projectsData?.projects.map((project) => (
                    <Option key={project.id} value={project.id}>
                        {project.name}
                    </Option>
                ))}
            </Select>

            <Upload
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                customRequest={({ file, onSuccess }) => {
                    handleUpload(file);
                    onSuccess();
                }}
                disabled={!selectedProject}
            >
                <Button icon={<UploadOutlined />} disabled={!selectedProject}>
                    Select File
                </Button>
            </Upload>

            <List
                itemLayout="horizontal"
                dataSource={documentsData?.documentsByProject || []}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Button icon={<EditOutlined />} onClick={() => handleEdit(item)}>Edit</Button>,
                            <Button icon={<DeleteOutlined />} onClick={() => handleDelete(item)} danger>Delete</Button>
                        ]}
                    >
                        <List.Item.Meta
                            title={item.name}
                            description={`Size: ${item.size}, Uploaded: ${item.uploadDate}`}
                        />
                    </List.Item>
                )}
            />

            <Modal
                title="Edit Document"
                visible={editModalVisible}
                onOk={handleEditModalOk}
                onCancel={() => setEditModalVisible(false)}
            >
                {editingDocument && (
                    <Input
                        value={editingDocument.name}
                        onChange={(e) => setEditingDocument({ ...editingDocument, name: e.target.value })}
                        placeholder="Document Name"
                    />
                )}
            </Modal>
        </Card>
    );
};

export default UploadDocuments;
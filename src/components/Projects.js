import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Card, Form, Input, Modal, Space, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { CREATE_PROJECT, DELETE_PROJECT, GET_PROJECTS, UPDATE_PROJECT } from '../graphql/queries';

const Projects = ({ onSelectProject }) => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    const userId = JSON.parse(localStorage.getItem('user')).id;

    const { loading, error, data, refetch } = useQuery(GET_PROJECTS, {
        variables: { userId },
    });

    const [createProject] = useMutation(CREATE_PROJECT);
    const [updateProject] = useMutation(UPDATE_PROJECT);
    const [deleteProject] = useMutation(DELETE_PROJECT);

    useEffect(() => {
        if (error) {
            message.error('Failed to load projects');
        }
    }, [error]);

    const handleCreate = () => {
        setEditingProject(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        form.setFieldsValue(project);
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteProject({
                variables: { id, userId },
                update(cache) {
                    const existingProjects = cache.readQuery({
                        query: GET_PROJECTS,
                        variables: { userId }
                    });
                    const newProjects = existingProjects.projects.filter(project => project.id !== id);
                    cache.writeQuery({
                        query: GET_PROJECTS,
                        variables: { userId },
                        data: { projects: newProjects }
                    });
                }
            });
            message.success('Project deleted successfully');
            refetch();
        } catch (error) {
            message.error('Failed to delete project');
            console.error('Delete project error:', error);
        }
    };

    const handleModalOk = () => {
        form.validateFields().then(async (values) => {
            try {
                if (editingProject) {
                    await updateProject({
                        variables: {
                            id: editingProject.id,
                            userId,
                            input: values,
                        },
                    });
                    message.success('Project updated successfully');
                } else {
                    await createProject({
                        variables: {
                            input: {
                                ...values,
                                userId,
                            },
                        },
                    });
                    message.success('Project created successfully');
                }
                setIsModalVisible(false);
                refetch();
            } catch (error) {
                message.error('Failed to save project');
                console.error('Save project error:', error);
            }
        });
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Created',
            dataIndex: 'created',
            key: 'created',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        if (onSelectProject && data?.projects) {
            onSelectProject(data.projects);
        }
    }, [data, onSelectProject]);

    return (
        <Card
            title="Projects"
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>New Project</Button>}
        >
            <Table columns={columns} dataSource={data?.projects} rowKey="id" loading={loading} />
            <Modal
                title={editingProject ? "Edit Project" : "Create Project"}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default Projects;

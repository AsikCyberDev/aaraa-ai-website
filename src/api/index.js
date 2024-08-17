import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const fetchChatbots = () => axios.get(`${API_URL}/chatbots`);
export const fetchChatbot = (id) => axios.get(`${API_URL}/chatbots/${id}`);
export const createChatbot = (chatbot) => axios.post(`${API_URL}/chatbots`, chatbot);
export const updateChatbot = (id, chatbot) => axios.put(`${API_URL}/chatbots/${id}`, chatbot);
export const deleteChatbot = (id) => axios.delete(`${API_URL}/chatbots/${id}`);

export const fetchDocuments = () => axios.get(`${API_URL}/documents`);
export const createDocument = (document) => axios.post(`${API_URL}/documents`, document);
export const updateDocument = (id, document) => axios.put(`${API_URL}/documents/${id}`, document);
export const deleteDocument = (id) => axios.delete(`${API_URL}/documents/${id}`);
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const graphqlRequest = async (query, variables = {}) => {
    const response = await axios.post(API_URL, {
        query,
        variables,
    });
    return response.data;
};

// Fetch all chatbots
export const fetchChatbots = async () => {
    const query = `
        query {
            getChatbots {
                id
                name
                documentIds
                description
                type
                languages
            }
        }
    `;
    return graphqlRequest(query);
};

// Fetch a single document
export const fetchDocuments = async (id) => {
    const query = `
        query ($id: ID!) {
            getDocument(id: $id) {
                id
                name
                size
                uploadDate
                chatbotId
            }
        }
    `;
    return graphqlRequest(query, { id });
};

// Create a new chatbot
export const createChatbot = async (chatbot) => {
    const mutation = `
        mutation ($name: String!, $description: String!, $type: String!, $languages: [String!]!, $documentIds: [ID!]) {
            createChatbot(input: {name: $name, description: $description, type: $type, languages: $languages, documentIds: $documentIds}) {
                id
                name
                description
                type
                languages
                documentIds
            }
        }
    `;
    return graphqlRequest(mutation, chatbot);
};

// Update an existing chatbot
export const updateChatbot = async (id, chatbot) => {
    const mutation = `
        mutation ($id: ID!, $name: String!, $description: String!, $type: String!, $languages: [String!]!, $documentIds: [ID!]) {
            updateChatbot(id: $id, input: {name: $name, description: $description, type: $type, languages: $languages, documentIds: $documentIds}) {
                id
                name
                description
                type
                languages
                documentIds
            }
        }
    `;
    return graphqlRequest(mutation, { id, ...chatbot });
};

// Delete a chatbot
export const deleteChatbot = async (id) => {
    const mutation = `
        mutation ($id: ID!) {
            deleteChatbot(id: $id)
        }
    `;
    return graphqlRequest(mutation, { id });
};

// Create a new document
export const createDocument = async (document) => {
    const mutation = `
        mutation ($name: String!, $size: String!, $uploadDate: String!, $chatbotId: ID!) {
            createDocument(input: {name: $name, size: $size, uploadDate: $uploadDate, chatbotId: $chatbotId}) {
                id
                name
                size
                uploadDate
                chatbotId
            }
        }
    `;
    return graphqlRequest(mutation, document);
};

// Update an existing document
export const updateDocument = async (id, document) => {
    const mutation = `
        mutation ($id: ID!, $name: String!) {
            updateDocument(id: $id, input: {name: $name}) {
                id
                name
                size
                uploadDate
                chatbotId
            }
        }
    `;
    return graphqlRequest(mutation, { id, ...document });
};

// Delete a document
export const deleteDocument = async (id) => {
    const mutation = `
        mutation ($id: ID!) {
            deleteDocument(id: $id)
        }
    `;
    return graphqlRequest(mutation, { id });
};

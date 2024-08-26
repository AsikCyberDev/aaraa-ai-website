// src/graphql/queries.js

import { gql } from '@apollo/client';

// User Queries

export const SIGNIN_MUTATION = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      id
      name
      email
      token
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      id
      name
      email
      mobile
      address
      sex
      token
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      mobile
      address
      sex
      company
      role
      chatbotsCreated
      totalInteractions
      subscriptionPlan
      subscriptionRenewalDate
      subscriptionStatus
      tokenUsageLimit
      tokenUsageUsed
      activeChatbots
      lastLogin
    }
  }
`;

// // Project Queries
// export const GET_PROJECTS = gql`
//   query GetProjects($userId: ID!) {
//     projects(userId: $userId) {
//       id
//       name
//       description
//       userId
//       created
//     }
//   }
// `;

export const GET_PROJECT = gql`
  query GetProject($id: ID!, $userId: ID!) {
    project(id: $id, userId: $userId) {
      id
      name
      description
      userId
      created
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      description
      userId
      created
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $userId: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, userId: $userId, input: $input) {
      id
      name
      description
      userId
      created
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!, $userId: ID!) {
    deleteProject(id: $id, userId: $userId)
  }
`;

// // Document Queries
// export const GET_DOCUMENTS_BY_PROJECT = gql`
//   query GetDocumentsByProject($projectId: ID!) {
//     documentsByProject(projectId: $projectId) {
//       id
//       name
//       size
//       uploadDate
//       chatbotId
//       projectId
//       s3Url
//     }
//   }
// `;

export const GET_DOCUMENTS_BY_CHATBOT = gql`
  query GetDocumentsByChatbot($chatbotId: ID!) {
    documentsByChatbot(chatbotId: $chatbotId) {
      id
      name
      size
      uploadDate
      chatbotId
      projectId
      s3Url
    }
  }
`;

export const GET_DOCUMENT = gql`
  query GetDocument($id: ID!, $projectId: ID!) {
    document(id: $id, projectId: $projectId) {
      id
      name
      size
      uploadDate
      chatbotId
      projectId
      s3Url
    }
  }
`;

// export const CREATE_DOCUMENT = gql`
//   mutation CreateDocument($input: CreateDocumentInput!) {
//     createDocument(input: $input) {
//       id
//       name
//       size
//       uploadDate
//       chatbotId
//       projectId
//       s3Url
//     }
//   }
// `;

// export const UPDATE_DOCUMENT = gql`
//   mutation UpdateDocument($id: ID!, $name: String) {
//     updateDocument(id: $id, name: $name) {
//       id
//       name
//       size
//       uploadDate
//       chatbotId
//       projectId
//       s3Url
//     }
//   }
// `;

// export const DELETE_DOCUMENT = gql`
//   mutation DeleteDocument($id: ID!) {
//     deleteDocument(id: $id)
//   }
// `;

// Chatbot Queries
export const GET_CHATBOTS = gql`
  query GetChatbots {
    chatbots {
      id
      name
      description
      status
      type
      projectId
      created
      interactions
      satisfactionRate
    }
  }
`;

export const GET_CHATBOT = gql`
  query GetChatbot($id: ID!, $projectId: ID!) {
    chatbot(id: $id, projectId: $projectId) {
      id
      name
      description
      status
      type
      projectId
      language
      integrations
      customIntegration
      theme
      primaryColor {
        cleared
        metaColor {
          isValid
          r
          g
          b
          a
          _h
          _s
          _v
        }
      }
      fontSelection
      chatIcon {
        uid
        lastModified
        name
        size
        type
        thumbUrl
      }
      welcomeMessage
      fallbackMessage
      inputPlaceholder
      responseTime
      enableTypingIndicator
      trainingData {
        uid
        lastModified
        name
        size
        type
      }
      knowledgeBase
      enableLearning
      confidenceThreshold
      maxConversationLength
      enableHumanHandoff
      handoffThreshold
      enableAnalytics
      sessionTimeout
      apiKeys {
        apiKeyId
        key
        created
        lastUsed
        chatbotId
      }
      created
      interactions
      satisfactionRate
    }
  }
`;

export const CREATE_CHATBOT = gql`
  mutation CreateChatbot($input: CreateChatbotInput!) {
    createChatbot(input: $input) {
      id
      name
      description
      status
      type
      projectId
    }
  }
`;

export const UPDATE_CHATBOT = gql`
  mutation UpdateChatbot($id: ID!, $projectId: ID!, $input: UpdateChatbotInput!) {
    updateChatbot(id: $id, projectId: $projectId, input: $input) {
      id
      name
      description
      status
      type
      projectId
      language
      theme
      primaryColor {
        cleared
        metaColor {
          isValid
          r
          g
          b
          a
          _h
          _s
          _v
        }
      }
      fontSelection
      welcomeMessage
      fallbackMessage
      inputPlaceholder
      responseTime
      enableTypingIndicator
      knowledgeBase
      enableLearning
      confidenceThreshold
      maxConversationLength
      enableHumanHandoff
      handoffThreshold
      enableAnalytics
      sessionTimeout
    }
  }
`;

export const DELETE_CHATBOT = gql`
  mutation DeleteChatbot($id: ID!, $projectId: ID!) {
    deleteChatbot(id: $id, projectId: $projectId)
  }
`;

export const GENERATE_API_KEY = gql`
  mutation GenerateApiKey($input: CreateApiKeyInput!) {
    generateApiKey(input: $input) {
      apiKeyId
      key
      created
      lastUsed
      chatbotId
    }
  }
`;

export const REVOKE_API_KEY = gql`
  mutation RevokeApiKey($chatbotId: ID!, $apiKeyId: ID!) {
    revokeApiKey(chatbotId: $chatbotId, apiKeyId: $apiKeyId)
  }
`;


export const GET_PROJECTS = gql`
  query GetProjects($userId: ID!) {
    projects(userId: $userId) {
      id
      name
    }
  }
`;

export const GET_DOCUMENTS_BY_PROJECT = gql`
  query GetDocumentsByProject($projectId: ID!) {
    documentsByProject(projectId: $projectId) {
      id
      name
      size
      uploadDate
      s3Url
      projectId
    }
  }
`;

export const CREATE_DOCUMENT = gql`
  mutation CreateDocument($input: CreateDocumentInput!) {
    createDocument(input: $input) {
      document {
        id
        name
        size
        uploadDate
        s3Url
      }
      uploadUrl
    }
  }
`;

export const UPDATE_DOCUMENT = gql`
  mutation UpdateDocument($id: ID!, $projectId: ID!, $name: String!) {
    updateDocument(id: $id, projectId: $projectId, name: $name) {
      id
      name
      size
      uploadDate
      s3Url
    }
  }
`;

export const DELETE_DOCUMENT = gql`
  mutation DeleteDocument($id: ID!, $projectId: ID!) {
    deleteDocument(id: $id, projectId: $projectId)
  }
`;

export const GET_DOWNLOAD_URL = gql`
  mutation GetDownloadUrl($input: GetDownloadUrlInput!) {
    getDownloadUrl(input: $input) {
      downloadUrl
    }
  }
`;
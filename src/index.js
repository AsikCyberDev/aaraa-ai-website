import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import 'antd/dist/reset.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './ThemeProvider'; // Adjust the path as needed
import reportWebVitals from './reportWebVitals';
import './styles/global.css';

// Create an Apollo Client instance
const client = new ApolloClient({
  uri: 'https://api.chatbots.aaraa.ai/api', // Replace with your actual GraphQL API endpoint
  cache: new InMemoryCache()
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider>
      <App />
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
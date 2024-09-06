import 'professional-ai-chatbot'; // Ensure you are importing the correct path for your custom element
import React, { useEffect, useRef } from 'react';

const ChatBotWrapper = ({
    endpoint,
    heading,
    theme,
    initialModel,
    initialTemperature,
    initialMaxTokens,
    initialTopP
}) => {
    const chatbotRef = useRef(null);

    useEffect(() => {
        if (chatbotRef.current) {
            // You can add any event listeners or configurations here if needed
            chatbotRef.current.addEventListener('chatbotInitialized', () => {
                console.log('Chatbot is ready');
            });

            // Optionally, you could update properties dynamically:
            // chatbotRef.current.heading = "New Heading";
        }
    }, []);

    return (
        <chat-bot
        ref={chatbotRef}
            endpoint="https://github-aaraa-ai.vercel.app/api/chat"
            heading="AI Assistant"
            theme="colorful"
            initialModel="Mistral-large-2407"
            initialTemperature="0.7"
            initialMaxTokens="2048"
            initialTopP="0.9"
            enableSettings="true"
            showToolbar="true"
            fontSize="text-base"
            initialPlaceholder="Type your first message here..."
            subsequentPlaceholder="Continue chatting..."
            buttonLabels='{"send": "Send", "close": "Close", "settings": "Settings"}'
        ></chat-bot>
    );
};

export default ChatBotWrapper;

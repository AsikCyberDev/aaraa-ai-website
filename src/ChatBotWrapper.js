import 'professional-ai-chatbot';
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
            // You can add event listeners or interact with the web component here if needed
        }
    }, []);

    return (
        <chat-bot
            ref={chatbotRef}
            endpoint={endpoint}
            heading={heading}
            theme={theme}
            initial-model={initialModel}
            initial-temperature={initialTemperature}
            initial-max-tokens={initialMaxTokens}
            initial-top-p={initialTopP}
            enable-settings={false}
        />
    );
};

export default ChatBotWrapper;
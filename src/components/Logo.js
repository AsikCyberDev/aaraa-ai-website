import React from 'react';
const Logo = () => {
    return (
        <div className="logo logo-bubble">
            <img src="path-to-your-logo.png" alt="AaraaAI Chatbot" />
            <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className="ai-brain">
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
            </div>
        </div>
    );
};

export default Logo;

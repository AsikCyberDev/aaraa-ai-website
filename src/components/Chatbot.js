import { LoadingOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Input, Select, Typography } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

const { Option } = Select;
const { Title, Text } = Typography;

const Chatbot = ({ initialField, fields, onSubmit }) => {
    const [currentField, setCurrentField] = useState(initialField);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        // Reset the chatbot with the initial field and message
        setCurrentField(initialField);
        setMessages([{ text: fields[initialField].nextPrompt, sender: 'bot' }]);
        setInputValue('');
        inputRef.current?.focus();
    }, [initialField, fields]);

    const addMessage = (text, sender) => {
        setMessages((prev) => [...prev, { text, sender }]);
    };

    const onInputSubmit = async () => {
        const field = fields[currentField];

        if (inputValue.trim() !== '') {
            const isValid = field.validate ? field.validate(inputValue) : true;

            if (!isValid) {
                addMessage(`Invalid ${field.name}, please try again.`, 'bot');
                return;
            }

            addMessage(field.isSensitive ? '*'.repeat(inputValue.length) : inputValue, 'user');

            if (field.next) {
                setCurrentField(field.next);
                addMessage(fields[field.next].nextPrompt, 'bot');
                setInputValue('');
            } else {
                setIsLoading(true);
                const success = await onSubmit(field.name, inputValue);
                if (success) {
                    // Reset to the initial state after successful submission
                    setCurrentField(initialField);
                    setInputValue('');
                    setMessages([{ text: fields[initialField].nextPrompt, sender: 'bot' }]);
                }
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="chatbot-window">
            <div className="chatbot-header">
                <Title level={4}>Aaraa.Ai Chatbot Studio</Title>
                <Text className="tagline">AI for everyone, designed by You!</Text>
            </div>
            <div className="chat-messages">
                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className={`message ${msg.sender}`}
                        >
                            {msg.text}
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </AnimatePresence>
            </div>

            <div className="input-area">
                <Input
                    ref={inputRef}
                    placeholder={fields[currentField].placeholder}
                    type={fields[currentField].type}
                    prefix={fields[currentField].prefix}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onPressEnter={onInputSubmit}
                    className="input-field"
                    addonBefore={
                        currentField === 'mobile' ? (
                            <Select
                                value={fields['mobile'].countryCode}
                                style={{ width: 100 }}
                                onChange={(value) => fields['mobile'].setCountryCode(value)}
                                showSearch
                                optionFilterProp="children"
                            >
                                {fields['mobile'].countryCodes.map((country) => (
                                    <Option key={country.code} value={country.dial_code}>
                                        <span role="img" aria-label={country.name}>
                                            {country.emoji}
                                        </span>
                                        {country.dial_code}
                                    </Option>
                                ))}
                            </Select>
                        ) : null
                    }
                />
                <Button
                    type="primary"
                    icon={isLoading ? <LoadingOutlined /> : <SendOutlined />}
                    onClick={onInputSubmit}
                    disabled={isLoading}
                    className="send-button"
                />
            </div>
        </div>
    );
};

export default Chatbot;

import { LoadingOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Input, InputNumber, Radio, Select, Slider, Switch, Typography } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

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
        setMessages([{ text: fields[initialField]?.nextPrompt, sender: 'bot' }]);
        setInputValue('');
        inputRef.current?.focus();
    }, [initialField, fields]);

    const addMessage = (text, sender) => {
        setMessages((prev) => [...prev, { text, sender }]);
    };

    const renderInputField = () => {
        const field = fields[currentField];
        if (!field) return null;

        switch (field.type) {
            case 'text':
            case 'password':
                return (
                    <Input
                        ref={inputRef}
                        placeholder={field.placeholder}
                        type={field.type}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onPressEnter={onInputSubmit}
                        className="input-field"
                    />
                );
            case 'textarea':
                return (
                    <TextArea
                        ref={inputRef}
                        placeholder={field.placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onPressEnter={onInputSubmit}
                        className="input-field"
                    />
                );
            case 'select':
                return (
                    <Select
                        ref={inputRef}
                        placeholder={field.placeholder}
                        value={inputValue}
                        onChange={(value) => setInputValue(value)}
                        className="input-field"
                        showSearch
                        optionFilterProp="children"
                    >
                        {field.options && field.options.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                );
            case 'radio':
                return (
                    <Radio.Group
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    >
                        {field.options && field.options.map((option) => (
                            <Radio key={option.value} value={option.value}>
                                {option.label}
                            </Radio>
                        ))}
                    </Radio.Group>
                );
            case 'switch':
                return (
                    <Switch
                        ref={inputRef}
                        checked={inputValue}
                        onChange={(checked) => setInputValue(checked)}
                    />
                );
            case 'slider':
                return (
                    <Slider
                        ref={inputRef}
                        min={0}
                        max={1}
                        step={0.1}
                        value={inputValue}
                        onChange={(value) => setInputValue(value)}
                    />
                );
            case 'number':
                return (
                    <InputNumber
                        ref={inputRef}
                        placeholder={field.placeholder}
                        value={inputValue}
                        onChange={(value) => setInputValue(value)}
                        className="input-field"
                        min={field.min || 0}
                        max={field.max || Infinity}
                    />
                );
            default:
                return null;
        }
    };

    const onInputSubmit = async () => {
        const field = fields[currentField];

        if (inputValue !== '' || typeof inputValue === 'boolean') {
            const isValid = field.validate ? field.validate(inputValue) : true;

            if (!isValid) {
                addMessage(`Invalid ${field.name}, please try again.`, 'bot');
                return;
            }

            addMessage(field.isSensitive ? '*'.repeat(inputValue.length) : String(inputValue), 'user');

            if (field.next) {
                setCurrentField(field.next);
                addMessage(fields[field.next]?.nextPrompt, 'bot');
                setInputValue('');
            } else {
                setIsLoading(true);
                const success = await onSubmit(field.name, inputValue);
                if (success) {
                    // Reset to the initial state after successful submission
                    setCurrentField(initialField);
                    setInputValue('');
                    setMessages([{ text: fields[initialField]?.nextPrompt, sender: 'bot' }]);
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
                {renderInputField()}
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

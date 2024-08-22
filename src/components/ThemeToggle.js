import { Switch } from 'antd';
import React from 'react';
import { useTheme } from '../ThemeProvider'; // Adjust the path as needed

const ThemeToggle = () => {
    const { toggleTheme } = useTheme();

    return (
        <Switch
            checkedChildren="Dark"
            unCheckedChildren="Light"
            onChange={toggleTheme}
        />
    );
};

export default ThemeToggle;
// authUtils.js

export const setToken = (token) => {
    localStorage.setItem('authToken', token);
};

export const getToken = () => {
    return localStorage.getItem('authToken');
};

export const removeToken = () => {
    localStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
    const token = getToken();
    return !!token; // Returns true if token exists, false otherwise
};
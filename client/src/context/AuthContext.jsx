
import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            // Ideally verify token with backend or decode it
            // For now, we trust local storage or could add a /me endpoint
            // Let's decode if we have valid user data in localStorage too
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const { data } = await authApi.login({ email, password });
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true, role: data.user.role };
        } catch (error) {
            console.error(error);
            return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
    };

    const register = async (userData) => {
        try {
            await authApi.register(userData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Registration failed' };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

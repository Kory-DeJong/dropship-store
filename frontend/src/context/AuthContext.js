import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
      
      setLoading(false);
    };
    
    loadUser();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/users', userData);
      
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      setIsAuthenticated(true);
      setLoading(false);
      
      return res.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/users/login', userData);
      
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      setIsAuthenticated(true);
      setLoading(false);
      
      return res.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

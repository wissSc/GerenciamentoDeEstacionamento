import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('@SenaiEstacionamento:user');
    const storedToken = localStorage.getItem('@SenaiEstacionamento:token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      api.defaults.headers.Authorization = `Bearer ${storedToken}`;
    }
    
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    console.log({email, senha})
    try {
      const response = await api.post('/auth/login', { email, senha });
      
      const { user, token } = response.data;
      
      localStorage.setItem('@SenaiEstacionamento:user', JSON.stringify(user));
      localStorage.setItem('@SenaiEstacionamento:token', token);
      
      api.defaults.headers.Authorization = `Bearer ${token}`;
      
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao fazer login' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('@SenaiEstacionamento:user');
    localStorage.removeItem('@SenaiEstacionamento:token');
    api.defaults.headers.Authorization = '';
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gerenciamentodeestacionamento.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@SenaiEstacionamento:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se o erro for 401 (não autorizado), pode ser token expirado
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('@SenaiEstacionamento:user');
      localStorage.removeItem('@SenaiEstacionamento:token');
    }
    return Promise.reject(error);
  }
);

export default api;

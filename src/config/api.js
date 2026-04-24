// API Configuration
const getApiBaseUrl = () => {
  // Se há uma variável de ambiente definida, use ela como base URL da API
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Detecta automaticamente o IP do backend baseado no IP atual do frontend
  const currentHost = window.location.hostname;

  // Se estamos em localhost, usa localhost:5000
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    return 'http://localhost:5000';
  }

  // Se estamos em um IP da rede, assume que o backend está na mesma máquina na porta 5000
  return `http://${currentHost}:5000`;
};

const API_BASE_URL = getApiBaseUrl();
// Chave de armazenamento para dados de autenticação (token, usuário, etc.)
const AUTH_STORAGE_KEY = 'authData';

// Constantes de timeout para requisições e notificações
export const REQUEST_TIMEOUT = 5000;
export const NOTIFICATION_TIMEOUT = 5000;

// Endpoints da API
export const getAuthToken = () => {
  try {
    const authData = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || '{}');
    return authData.token || null;
  } catch (error) {
    return null;
  }
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  CHECK_EMAIL: `${API_BASE_URL}/auth/check-email`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  MINIATURAS: `${API_BASE_URL}/miniatures`,
  MINIATURA_DELETE: (id) => `${API_BASE_URL}/miniatures/${id}`,
  MINIATURA_UPDATE: (id) => `${API_BASE_URL}/miniatures/${id}`,
};

export default API_BASE_URL;

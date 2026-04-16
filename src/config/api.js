// API Configuration
const getApiBaseUrl = () => {
  // Se há uma variável de ambiente definida, use ela
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Detecta automaticamente o IP do backend baseado no IP atual do frontend
  const currentHost = window.location.hostname;
  const currentPort = window.location.port;

  // Se estamos em localhost, usa localhost:5000
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    return 'http://localhost:5000';
  }

  // Se estamos em um IP da rede, assume que o backend está na mesma máquina na porta 5000
  return `http://${currentHost}:5000`;
};

const API_BASE_URL = getApiBaseUrl();

// Constantes de timeout para requisições e notificações
export const REQUEST_TIMEOUT = 5000;
export const NOTIFICATION_TIMEOUT = 5000;

// Endpoints da API
export const API_ENDPOINTS = {
  MINIATURAS: `${API_BASE_URL}/miniaturas`,
  MINIATURA_DELETE: (id) => `${API_BASE_URL}/miniaturas/${id}`,
  MINIATURA_UPDATE: (id) => `${API_BASE_URL}/miniaturas/${id}`,
};

export default API_BASE_URL;

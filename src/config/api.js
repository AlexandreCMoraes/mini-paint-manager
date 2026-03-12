// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Constantes de timeout
export const REQUEST_TIMEOUT = 5000;
export const NOTIFICATION_TIMEOUT = 5000;

// Endpoints
export const API_ENDPOINTS = {
  MINIATURAS: `${API_BASE_URL}/miniaturas`,
  MINIATURA_DELETE: (id) => `${API_BASE_URL}/miniaturas/${id}`,
};

export default API_BASE_URL;

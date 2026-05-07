import { API_ENDPOINTS, getAuthHeaders } from '../../config/api';

const jsonHeaders = { 'Content-Type': 'application/json' };

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const listMiniatures = () => request(API_ENDPOINTS.MINIATURAS);

export const searchMiniatures = (searchTerm) =>
  request(`${API_ENDPOINTS.MINIATURAS}/search?search=${encodeURIComponent(searchTerm)}`);

export const createMiniature = (payload) =>
  request(API_ENDPOINTS.MINIATURAS, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });

export const updateMiniature = (id, payload) =>
  request(API_ENDPOINTS.MINIATURA_UPDATE(id), {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });

export const deleteMiniature = (id) =>
  request(API_ENDPOINTS.MINIATURA_DELETE(id), {
    method: 'DELETE',
  });

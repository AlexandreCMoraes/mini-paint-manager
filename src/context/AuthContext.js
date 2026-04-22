import React, { createContext, useState, useContext, useEffect } from 'react';

// Cria o contexto de autenticação
const AuthContext = createContext();

// Provider que envolve o app App.js
const AUTH_STORAGE_KEY = 'authData';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email: "exemplo@x.com", id: 1 }
  const [token, setToken] = useState(null); // token de autenticação

  // Função para login
  const login = ({ user: userData, token: jwtToken }) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: userData, token: jwtToken })); // para manter após refresh
  };

  // Função para logout que tem que ser chamada no AppBar
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  // Carregar usuário do localStorage se recarregar página (para manter login após 
  // refresh do navegador)
  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!savedAuth) return;

    try {
      const parsed = JSON.parse(savedAuth);
      if (parsed?.user && parsed?.token) {
        setUser(parsed.user);
        setToken(parsed.token);
      }
    } catch (error) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: Boolean(token), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto facilmente
export const useAuth = () => useContext(AuthContext);
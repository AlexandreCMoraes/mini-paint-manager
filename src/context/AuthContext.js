import React, { createContext, useState, useContext, useEffect } from 'react';

// Cria o contexto de autenticação
const AuthContext = createContext();

// Provider que envolve o app App.js
const AUTH_STORAGE_KEY = 'authData';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email: "exemplo@x.com", id: 1 }
  const [token, setToken] = useState(null); // token de autenticação
  const [isLoading, setIsLoading] = useState(true); // estado de carregamento

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
    // Limpar também qualquer outro dado relacionado ao usuário
    localStorage.clear();
  };

  // Carregar usuário do localStorage se recarregar página (para manter login após 
  // refresh do navegador) - DESABILITADO para sempre começar na página de login
  useEffect(() => {
    // Sempre começar deslogado ao iniciar o projeto
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setToken(null);
    setIsLoading(false); // Finalizar carregamento
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: Boolean(token), isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto facilmente
export const useAuth = () => useContext(AuthContext);
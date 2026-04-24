import React, { createContext, useState, useContext, useEffect } from 'react';

// Cria o contexto de autenticação
const AuthContext = createContext();

// Provider que envolve o app App.js
const AUTH_STORAGE_KEY = 'authData';

// O AuthProvider é responsável por gerenciar o estado de autenticação do usuário, 
// incluindo login, logout e persistência do token. Ele fornece um contexto para que 
// outros componentes possam acessar facilmente as informações de autenticação e as 
// funções relacionadas.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email: "exemplo@x.com", id: 1 }
  const [token, setToken] = useState(null); // token de autenticação
  const [isLoading, setIsLoading] = useState(true); // estado de carregamento

  // Função para login que recebe os dados do usuário e o token, e armazena ambos 
  // no estado e localStorage para persistência. O token é usado para autenticação
  //  em requisições futuras, enquanto os dados do usuário podem ser usados para
  //  exibir informações na UI.
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
    // localStorage.clear();
  };

  // Carregar usuário do localStorage se recarregar página
  useEffect(() => {
    // Sempre começar deslogado ao iniciar o projeto
    // localStorage.removeItem(AUTH_STORAGE_KEY);
    // setUser(null);
    // setToken(null);
    // Finalizar carregamento
    // setIsLoading(false); 

    try {
      const authData = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || '{}');
      if (authData?.token && authData?.user) {
        setUser(authData.user);
        setToken(authData.token);
      }
    } catch (error) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false); // Finalizar carregamento
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: Boolean(token), isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto facilmente
export const useAuth = () => useContext(AuthContext);
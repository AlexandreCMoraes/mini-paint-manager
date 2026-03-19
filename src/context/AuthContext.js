import React, { createContext, useState, useContext } from 'react';

// Cria o contexto
const AuthContext = createContext();

// Provider que envolve o app App.js
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email: "exemplo@x.com", id: 1 }

  // Função para login
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('loggedUser', JSON.stringify(userData)); // para manter após refresh
  };

  // Função para logout que tem que ser chamada no AppBar
  const logout = () => {
    setUser(null);
    localStorage.removeItem('loggedUser');
  };

  // Carregar usuário do sessionStorage se recarregar página (para manter login após refresh do navegador)
  React.useEffect(() => {
    const savedUser = sessionStorage.getItem('loggedUser');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);
  // Valor do contexto que será acessível em toda a aplicação 
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto facilmente
export const useAuth = () => useContext(AuthContext);
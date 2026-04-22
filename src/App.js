import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext"; //  contexto de autenticação
import Home from "./pages/Home"; //  página do sistema
import Dashboard from "./pages/Dashboard"; //  página do dashboard
import Login from "./pages/LoginPage/Login"; //  página de login 
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";  //  página para rotas não encontradas
import Profile from "./pages/Profile"; //  página de perfil do usuário
import PrivateRoute from "./routes/PrivateRoute"; //  componente para rotas protegidas
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./styles/theme"; //  tema atual

// Componente AppRoutes que define as rotas da aplicação usando React Router. Ele 
// verifica o estado de autenticação do usuário para redirecionar para a página de 
// login ou para a página principal, e protege as rotas que requerem autenticação 
// usando o componente PrivateRoute. Ele também inclui uma rota para lidar com páginas 
// não encontradas.
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? '/home' : '/login'} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<PrivateRoute isLoggedIn={isAuthenticated}><Home /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute isLoggedIn={isAuthenticated}><Profile /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute isLoggedIn={isAuthenticated}><Dashboard /></PrivateRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
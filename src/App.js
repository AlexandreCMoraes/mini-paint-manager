import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext"; //  contexto de autenticação
import Home from "./pages/Home"; //  página do sistema
import Dashboard from "./pages/Dashboard"; //  página do dashboard
import Login from "./pages/LoginPage/Login"; //  página de login 
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";  //  página para rotas não encontradas
import Profile from "./pages/Profile"; //  página de perfil do usuário
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./styles/theme"; //  tema atual

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* Redireciona / para /login */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Página de login */}
            <Route path="/login" element={<Login />} />

            {/* Página principal do sistema */}
            <Route path="/home" element={<Home />} />

            {/* Se quiser, qualquer rota desconhecida redireciona para Miniaturas */}
            {/* <Route path="*" element={<Miniaturas />} /> */}

            {/* Página de perfil */}
            <Route path="/profile" element={<Profile />} />

            {/* Página para rotas não encontradas */}
            <Route path="*" element={<NotFoundPage />} />

            {/* Página do dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
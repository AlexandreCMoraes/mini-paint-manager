import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Miniaturas from "./pages/Miniaturas"; //  página do sistema
import Login from "./components/LoginPage/Login"; //  página de login 
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./styles/theme"; //  tema atual

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Página de login */}
          <Route path="/login" element={<Login />} />

          {/* Página principal do sistema */}
          <Route path="/miniaturas" element={<Miniaturas />} />

          {/* Redireciona / para /login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Se quiser, qualquer rota desconhecida redireciona para Miniaturas */}
          <Route path="*" element={<Miniaturas />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
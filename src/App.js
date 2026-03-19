import { BrowserRouter, Routes, Route } from "react-router-dom";
import Miniaturas from "./pages/Miniaturas"; // sua página do sistema
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./styles/theme"; // seu tema atual

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Página principal do sistema */}
          <Route path="/" element={<Miniaturas />} />
          {/* Se quiser, qualquer rota desconhecida redireciona para Miniaturas */}
          <Route path="*" element={<Miniaturas />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
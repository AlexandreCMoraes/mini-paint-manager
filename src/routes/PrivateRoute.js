import { Navigate } from "react-router-dom";

// impede acesso a páginas do sistema sem login.
export default function PrivateRoute({ children }) {
  const logado = localStorage.getItem("logado");

  if (!logado) {
    return <Navigate to="/login" />; // se não estiver logado, manda pro login
  }

  return children; // se estiver logado, mostra a página
}
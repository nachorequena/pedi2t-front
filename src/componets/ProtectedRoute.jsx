import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));

  // Si no hay usuario, redirigir al login
  if (!usuarioActual) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, renderizar la página
  return children;
}

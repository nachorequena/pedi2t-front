import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole = null }) {
  const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));

  // Si no hay usuario, redirigir al login
  if (!usuarioActual) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene
  if (requiredRole && usuarioActual.rol !== requiredRole) {
    // Redirigir según el rol del usuario
    if (usuarioActual.rol === "ADMIN") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Si no se requiere rol específico pero es una ruta de usuario y el usuario es ADMIN
  // redirigirlo a su área
  if (!requiredRole && usuarioActual.rol === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  // Si hay usuario y tiene el rol correcto, renderizar la página
  return children;
}

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Home from "./pages/Home";
import HomeAdmin from "./pages/HomeAdmin";
import PedidosAdmin from "./pages/PedidosAdmin";
import NotificarAdmin from "./pages/NotificarAdmin";
import PerfilAdmin from "./pages/PerfilAdmin";
import Navbar from "./componets/Navbar";
import NavbarAdmin from "./componets/NavbarAdmin";
import Pedidos from "./pages/Pedidos";
import Historial from "./pages/Historial";
import Notificaciones from "./pages/Notificaciones";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./componets/ProtectedRoute";

function AppContent() {
  const location = useLocation();

  // Rutas conocidas en la aplicación
  const rutasConocidas = ["/", "/pedidos", "/historial", "/notificaciones", "/perfil", "/admin", "/admin/pedidos", "/admin/notificar", "/admin/perfil", "/login", "/registro"];

  // Verificar si es una ruta de admin
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Ocultar Navbar en /login, /registro o en rutas desconocidas (404)
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/registro" ||
    !rutasConocidas.includes(location.pathname);

  return (
    <div className="min-h-screen">
      {!hideNavbar && (isAdminRoute ? <NavbarAdmin /> : <Navbar />)}

      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas protegidas para usuarios */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos"
          element={
            <ProtectedRoute>
              <Pedidos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historial"
          element={
            <ProtectedRoute>
              <Historial />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notificaciones"
          element={
            <ProtectedRoute>
              <Notificaciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        {/* Rutas protegidas para administradores */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <HomeAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pedidos"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <PedidosAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notificar"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <NotificarAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/perfil"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <PerfilAdmin />
            </ProtectedRoute>
          }
        />
        {/* Ruta para direcciones que no existen */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

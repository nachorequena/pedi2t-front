import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, ClipboardList, Bell, User, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

export default function NavbarAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openProfileMenu, setOpenProfileMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión actual se cerrará.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("usuarioActual");
        Swal.fire({
          icon: "success",
          title: "Sesión cerrada",
          text: "Tu sesión se cerró correctamente.",
          confirmButtonColor: "#16a34a",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/login");
      }
    });
  };

  const toggleProfileMenu = () => setOpenProfileMenu(!openProfileMenu);

  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/admin" className="text-2xl font-bold">
            PEDI2T
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              to="/admin"
              className={`flex items-center gap-2 hover:text-gray-300 transition-colors ${
                isActive("/admin") ? "font-semibold" : ""
              }`}
            >
              
              <span>Inicio</span>
            </Link>

            <Link
              to="/admin/pedidos"
              className={`flex items-center gap-2 hover:text-gray-300 transition-colors ${
                isActive("/admin/pedidos") ? "font-semibold" : ""
              }`}
            >
              
              <span>Pedidos</span>
            </Link>

            <Link
              to="/admin/notificar"
              className={`flex items-center gap-2 hover:text-gray-300 transition-colors ${
                isActive("/admin/notificar") ? "font-semibold" : ""
              }`}
            >
             
              <span>Notificar</span>
            </Link>

            {/* Menú de perfil */}
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center gap-1 hover:bg-gray-800 p-2 rounded-full transition-colors"
              >
                <User size={20} />
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    openProfileMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {openProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                  <Link
                    to="/admin/perfil"
                    onClick={() => setOpenProfileMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    <User size={18} />
                    <span>Ver perfil</span>
                  </Link>
                  <button
                    onClick={() => {
                      setOpenProfileMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

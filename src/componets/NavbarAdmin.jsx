import { Link, useLocation } from "react-router-dom";
import { Home, ClipboardList, Bell, User } from "lucide-react";

export default function NavbarAdmin() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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

            {/* User Icon */}
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

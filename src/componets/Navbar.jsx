import { Link, useLocation, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { useState, useEffect } from "react";
import { ChevronDown, Bell } from "lucide-react";
import Swal from "sweetalert2";
import axios from "../api/axios";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [notificacionesSinLeer, setNotificacionesSinLeer] = useState(0);

  useEffect(() => {
    fetchNotificacionesSinLeer();
  }, []);

  const fetchNotificacionesSinLeer = async () => {
    try {
      const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
      if (!usuarioActual || !usuarioActual.id) return;
      
      // TODO: Descomentar cuando el backend tenga el endpoint de notificaciones
      // const response = await axios.get(`/api/usuarios/${usuarioActual.id}/notificaciones`);
      // const sinLeer = response.data.filter(n => !n.leida).length;
      // setNotificacionesSinLeer(sinLeer);
      
      setNotificacionesSinLeer(0); // Por ahora siempre 0
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    }
  };

  const linkStyle = (path) =>
    `relative px-4 py-2 font-semibold rounded-md transition-all duration-300 ${
      location.pathname === path
        ? "text-[#C8997E] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#C8997E]"
        : " hover:text-[#C8997E]"
    }`;

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
    <nav className="bg-black/95 text-white shadow-md px-8 py-4 flex justify-between items-center relative">
      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-extrabold  select-none cursor-pointer"
      >
        PEDI<span className="text-[#C8997E]">2</span>T
      </h1>

      {/* Links principales */}
      <div className="flex items-center gap-6">
        <Link to="/" className={linkStyle("/")}>
          Inicio
        </Link>
        <Link to="/pedidos" className={linkStyle("/pedidos")}>
          Pedidos
        </Link>
        <Link to="/historial" className={linkStyle("/historial")}>
          Historial
        </Link>
        

        {/* Notificaciones */}
        <Link to="/notificaciones" className="relative">
          <Bell 
            size={22} 
            className={`transition-all duration-300 ${
              location.pathname === "/notificaciones" 
                ? "text-[#C8997E]" 
                : "hover:text-[#C8997E]"
            }`}
          />
          {notificacionesSinLeer > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {notificacionesSinLeer > 9 ? "9+" : notificacionesSinLeer}
            </span>
          )}
        </Link>

        {/* Menú de perfil */}
        <div className="relative">
          <button
            onClick={toggleProfileMenu}
            className="flex items-center gap-1 hover:text-[#C8997E] transition-all duration-300"
          >
            <CgProfile size={22} />
            <ChevronDown
              size={16}
              className={`transition-transform ${
                openProfileMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {openProfileMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-gray-100 text-gray-800 rounded-lg shadow-lg overflow-hidden animate-fadeIn z-50">
              <button
                onClick={() => {
                  navigate("/perfil");
                  setOpenProfileMenu(false);
                }}
                className="block w-full text-left px-4 py-2  hover:bg-gray-200 transition"
              >
                Ver perfil
              </button>
              <button
                onClick={() => {
                  setOpenProfileMenu(false);
                  handleLogout();
                }}
                className="block w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white transition"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

import { Link, useLocation, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import Swal from "sweetalert2";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const linkStyle = (path) =>
    `px-4 py-2 font-semibold rounded-md transition ${
      location.pathname === path
        ? " text-white"
        : "text-gray-900 hover:text-white"
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

  return (
    <nav className=" bg-[#dbc9ac] px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-white select-none">
        PEDI<span className="text-[#C8997E]">2</span>T
      </h1>

      <div className="flex items-center gap-4">
        <Link to="/" className={linkStyle("/")}>
          Inicio
        </Link>

        <Link to="/pedidos" className={linkStyle("/pedidos")}>
          Pedidos
        </Link>

        <Link to="/perfil" className={linkStyle("/perfil")}>
          <CgProfile size={22} />
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

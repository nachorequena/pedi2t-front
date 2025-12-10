import { useState, useEffect } from "react";
import { Search, Bell } from "lucide-react";
import api from "../api/axios";
import Swal from "sweetalert2";
import { LoadingSpinner } from "../componets/LoadingSpinner";

export default function NotificarAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar usuarios sin selección desde el backend
  useEffect(() => {
    fetchUsuariosSinSeleccion();
  }, []);

  const fetchUsuariosSinSeleccion = async () => {
    setLoading(true);
    try {
      // Endpoint esperado: GET /admin/usuarios/sin-seleccion
      // Respuesta esperada: [{ id, username, email, nombre, apellido }]
      const response = await api.get("/admin/usuarios/sin-seleccion");
      
      setUsuarios(response.data || []);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      Swal.fire({
        icon: "error",
        title: "Error al cargar usuarios",
        text: "No se pudieron cargar los usuarios sin selección.",
        confirmButtonColor: "#dc2626",
      });
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.apellido?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const notificarUsuario = async (usuarioId) => {
    try {
      // Endpoint esperado: POST /admin/notificar { usuarioId }
      await api.post("/admin/notificar", {
        usuarioId: usuarioId
      });

      Swal.fire({
        icon: "success",
        title: "¡Notificación enviada!",
        text: "El usuario ha sido notificado correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });

      // Recargar lista de usuarios
      fetchUsuariosSinSeleccion();
    } catch (error) {
      console.error("Error al notificar usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error al notificar",
        text: "No se pudo enviar la notificación.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const handleNotificarTodos = async () => {
    try {
      // Endpoint esperado: POST /admin/notificar/todos
      await api.post("/admin/notificar/todos");

      Swal.fire({
        icon: "success",
        title: "¡Notificaciones enviadas!",
        text: `Se notificó a ${usuarios.length} usuarios correctamente.`,
        confirmButtonColor: "#22c55e",
      });

      // Recargar lista de usuarios
      fetchUsuariosSinSeleccion();
    } catch (error) {
      console.error("Error al notificar usuarios:", error);
      Swal.fire({
        icon: "error",
        title: "Error al notificar",
        text: "No se pudieron enviar las notificaciones.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  if (loading) {
    return <LoadingSpinner text="Cargando usuarios..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 mb-4">
            Lista de usuarios sin selección
          </h1>

          {/* Barra de búsqueda */}
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </div>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className="px-4 pt-4 space-y-3">
        {usuariosFiltrados.map((usuario) => (
          <div
            key={usuario.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex items-center gap-4"
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* Info del usuario */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm">
                {usuario.username}
              </h3>
              <p className="text-xs text-gray-500">
                {usuario.nombre && usuario.apellido 
                  ? `${usuario.nombre} ${usuario.apellido}`
                  : "Ver perfil"
                }
              </p>
            </div>

            {/* Botón de notificación */}
            <button
              onClick={() => notificarUsuario(usuario.id)}
              className={`p-3 rounded-full transition-all ${
                selectedUsers.includes(usuario.id)
                  ? "bg-red-100"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <Bell
                size={20}
                className={
                  selectedUsers.includes(usuario.id)
                    ? "text-red-500 fill-red-500"
                    : "text-red-500"
                }
              />
            </button>
          </div>
        ))}
      </div>

      {/* Botón notificar a todos */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 bg-linear-to-t from-gray-50 via-gray-50 to-transparent pt-6">
        <button
          onClick={handleNotificarTodos}
          className="w-full bg-red-400 hover:bg-red-500 text-white font-semibold py-4 rounded-full shadow-lg transition-colors"
        >
          Notificar a todos
        </button>
      </div>
    </div>
  );
}

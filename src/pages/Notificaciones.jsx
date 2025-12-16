import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import api from "../api/axios";
import { LoadingSpinner } from "../componets/LoadingSpinner";

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotificacion, setSelectedNotificacion] = useState(null);

  // Cargar notificaciones desde el backend
  useEffect(() => {
    fetchNotificaciones();
  }, []);

  const fetchNotificaciones = async () => {
    setLoading(true);
    try {
      const usuario = JSON.parse(localStorage.getItem("usuarioActual"));

      // Endpoint: GET /api/usuarios/{usuarioId}/notificaciones
      // Respuesta esperada: [{ id, titulo, mensaje, fecha, leida, tipo }]
      const response = await api.get(`/api/usuarios/${usuario.id}/notificaciones`);

      setNotificaciones(response.data || []);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
      setNotificaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNotificacion = async (notificacion) => {
    setSelectedNotificacion(notificacion);

    // Si no está leída, marcarla como leída
    if (!notificacion.leida) {
      try {
        // Endpoint esperado: PUT /notificaciones/{id}/marcar-leida
        await api.put(`/notificaciones/${notificacion.id}/marcar-leida`);

        // Actualizar estado local
        setNotificaciones((prev) =>
          prev.map((n) => (n.id === notificacion.id ? { ...n, leida: true } : n))
        );
      } catch (error) {
        console.error("Error al marcar notificación como leída:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedNotificacion(null);
  };

  const handleEliminarNotificacion = async (notificacionId) => {
    try {
      // Endpoint esperado: DELETE /notificaciones/{id}
      await api.delete(`/notificaciones/${notificacionId}`);

      // Actualizar estado local
      setNotificaciones((prev) => prev.filter((n) => n.id !== notificacionId));

      if (selectedNotificacion?.id === notificacionId) {
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
    }
  };

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);

    // Si es hoy
    if (date.toDateString() === hoy.toDateString()) {
      return `Hoy ${date.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // Si es ayer
    if (date.toDateString() === ayer.toDateString()) {
      return `Ayer ${date.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // Si es otra fecha
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const notificacionesNoLeidas = notificaciones.filter((n) => !n.leida).length;

  if (loading) {
    return <LoadingSpinner text="Cargando notificaciones..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      
        <div className="flex items-center justify-between">
          {notificacionesNoLeidas > 0 && (
            <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {notificacionesNoLeidas} nueva{notificacionesNoLeidas !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      
      {/* Lista de notificaciones */}
      <div className="px-4 pt-4">
        {notificaciones.length === 0 ? (
          <div className="text-center py-12">
            <Bell size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No tenés notificaciones</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notificaciones.map((notificacion) => (
              <div
                key={notificacion.id}
                onClick={() => handleOpenNotificacion(notificacion)}
                className={`bg-white rounded-2xl p-4 shadow-sm border cursor-pointer hover:shadow-md transition-all ${
                  !notificacion.leida
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icono de notificación */}
                  <div
                    className={`p-2 rounded-full shrink-0 ${
                      !notificacion.leida ? "bg-red-500" : "bg-gray-300"
                    }`}
                  >
                    <Bell
                      size={20}
                      className={!notificacion.leida ? "text-white" : "text-gray-600"}
                    />
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`font-semibold text-base ${
                          !notificacion.leida ? "text-gray-900" : "text-gray-600"
                        }`}
                      >
                        {notificacion.titulo}
                      </h3>
                      {!notificacion.leida && (
                        <div className="w-2 h-2 bg-red-500 rounded-full shrink-0 mt-2"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {notificacion.mensaje}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatFecha(notificacion.fecha)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {selectedNotificacion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative">
            {/* Botón cerrar */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X size={24} className="text-gray-600" />
            </button>

            {/* Contenido del modal */}
            <div className="p-6">
              {/* Icono grande */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <Bell size={32} className="text-red-600" />
                </div>
              </div>

              {/* Título */}
              <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
                {selectedNotificacion.titulo}
              </h2>

              {/* Fecha */}
              <p className="text-sm text-gray-500 text-center mb-4">
                {formatFecha(selectedNotificacion.fecha)}
              </p>

              {/* Mensaje completo */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {selectedNotificacion.mensaje}
                </p>
              </div>

              {/* Tipo de notificación */}
              {selectedNotificacion.tipo && (
                <div className="text-center mb-4">
                  <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full">
                    {selectedNotificacion.tipo}
                  </span>
                </div>
              )}

              {/* Botón eliminar */}
              <button
                onClick={() => handleEliminarNotificacion(selectedNotificacion.id)}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-full transition-colors"
              >
                Eliminar notificación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

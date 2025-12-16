import { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../api/axios";
import Swal from "sweetalert2";
import { LoadingSpinner } from "../componets/LoadingSpinner";

export default function Historial() {
  const [historialPedidos, setHistorialPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar historial de pedidos desde el backend
  useEffect(() => {
    fetchHistorial();
  }, []);

  const fetchHistorial = async () => {
    setLoading(true);
    try {
      const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
      
      // GET /Pedidos/HistorialPedidos?usuarioId={id}
      const response = await api.get(`/Pedidos/HistorialPedidos`, {
        params: { usuarioId: usuario.id },
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      console.log("=== DEBUG Historial: Response ===", response.data);
      
      // Mapear estructura de HistorialPedidosResponseDTO al formato del frontend
      const pedidosMapeados = (response.data.pedidos || []).map(pedido => ({
        id: pedido.idPedido,
        menuNombre: pedido.nombrePlato,
        categoria: pedido.categoria,
        imagenUrl: pedido.fotoUrl,
        fecha: pedido.fechaEntrega,
        estado: pedido.estado,
        dia: new Date(pedido.fechaEntrega + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long' }),
        // Copiar campos adicionales para mantener compatibilidad
        platoId: pedido.idPedido,
        diaId: null
      }));
      
      setHistorialPedidos(pedidosMapeados);
    } catch (error) {
      console.error("Error al cargar historial:", error);
      Swal.fire({
        icon: "error",
        title: "Error al cargar historial",
        text: "No se pudo cargar tu historial de pedidos.",
        confirmButtonColor: "#dc2626",
      });
      setHistorialPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (pedido) => {
    setSelectedPedido(pedido);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPedido(null);
    setIsModalOpen(false);
  };

  const handleRepetirPedido = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
      
      // POST /Pedidos/SeleccionarPedido
      await api.post("/Pedidos/SeleccionarPedido", {
        usuarioId: usuario.id,
        observaciones: "",
        pedidos: [{
          diaId: selectedPedido.diaId,
          platoId: selectedPedido.platoId
        }]
      });

      Swal.fire({
        icon: "success",
        title: "¡Pedido repetido!",
        text: `Se repitió el pedido de ${selectedPedido.menuNombre}`,
        timer: 2000,
        showConfirmButton: false,
      });

      handleCloseModal();
      fetchHistorial();
    } catch (error) {
      console.error("Error al repetir pedido:", error);
      Swal.fire({
        icon: "error",
        title: "Error al repetir pedido",
        text: error.response?.data?.mensaje || "No se pudo repetir el pedido.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const handleCancelarPedido = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
      
      const result = await Swal.fire({
        icon: "warning",
        title: "¿Cancelar pedido?",
        text: `¿Estás seguro de cancelar el pedido de ${selectedPedido.menuNombre}?`,
        showCancelButton: true,
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No",
        confirmButtonColor: "#dc2626",
      });

      if (result.isConfirmed) {
        // PUT /Pedidos/CancelarPedido
        await api.put("/Pedidos/CancelarPedido", {
          usuarioId: usuario.id,
          pedidoId: selectedPedido.id
        });

        Swal.fire({
          icon: "success",
          title: "Pedido cancelado",
          text: `Se canceló el pedido de ${selectedPedido.menuNombre}`,
          timer: 2000,
          showConfirmButton: false,
        });

        handleCloseModal();
        fetchHistorial();
      }
    } catch (error) {
      console.error("Error al cancelar pedido:", error);
      Swal.fire({
        icon: "error",
        title: "Error al cancelar",
        text: error.response?.data?.mensaje || "No se pudo cancelar el pedido.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const formatFecha = (fecha) => {
    const date = new Date(fecha + 'T12:00:00');
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  if (loading) {
    return <LoadingSpinner text="Cargando historial..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      

      {/* Lista de pedidos */}
      <div className="px-4 pt-4">
        {historialPedidos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No tenés pedidos en tu historial
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {historialPedidos.map((pedido) => (
              <div
                key={pedido.id}
                onClick={() => handleOpenModal(pedido)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all"
              >
                {/* Imagen del plato */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={pedido.imagenUrl || "/placeholder.jpg"}
                    alt={pedido.menuNombre}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info del pedido */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base mb-1">
                    {pedido.menuNombre}
                  </h3>
                  <p className="text-sm text-gray-500">{pedido.categoria}</p>
                </div>

                {/* Día y fecha */}
                <div className="text-right">
                  <p className="font-medium text-gray-900 text-sm">
                    {pedido.dia}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFecha(pedido.fecha)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para repetir pedido */}
      {isModalOpen && selectedPedido && (
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
            <div className="px-6 pb-6 pt-8">
              {/* Imagen grande del plato */}
              <div className="w-full h-48 rounded-2xl overflow-hidden bg-gray-100 mb-4">
                <img
                  src={selectedPedido.imagenUrl || "/placeholder.jpg"}
                  alt={selectedPedido.menuNombre}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Título */}
              <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
                {selectedPedido.menuNombre}
              </h2>

              {/* Categoría */}
              <p className="text-sm text-gray-600 text-center mb-1">
                {selectedPedido.categoria}
              </p>

              {/* Descripción si existe */}
              {selectedPedido.descripcion && (
                <p className="text-sm text-gray-500 text-center mb-4">
                  {selectedPedido.descripcion}
                </p>
              )}

              {/* Info adicional */}
              <div className="text-center text-sm text-gray-500">
                <p>
                  {selectedPedido.dia} - {formatFecha(selectedPedido.fecha)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

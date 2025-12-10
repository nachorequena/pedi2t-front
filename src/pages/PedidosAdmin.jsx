import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, User } from "lucide-react";
import api from "../api/axios";
import Swal from "sweetalert2";
import { LoadingSpinner } from "../componets/LoadingSpinner";

export default function PedidosAdmin() {
  const [selectedDay, setSelectedDay] = useState("Lunes");
  const [searchTerm, setSearchTerm] = useState("");
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  // Cargar pedidos del backend
  useEffect(() => {
    fetchPedidos(selectedDay);
  }, [selectedDay]);

  const fetchPedidos = async (dia) => {
    setLoading(true);
    try {
      // Endpoint esperado: GET /admin/pedidos?dia=Lunes
      // Respuesta esperada: [{ id, menuId, menuNombre, categoria, imagenUrl, cantidadPersonas }]
      const response = await api.get(`/admin/pedidos`, {
        params: { dia }
      });
      
      setPedidos(response.data || []);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      Swal.fire({
        icon: "error",
        title: "Error al cargar pedidos",
        text: "No se pudieron cargar los pedidos del día seleccionado.",
        confirmButtonColor: "#dc2626",
      });
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevDay = () => {
    const currentIndex = dias.indexOf(selectedDay);
    if (currentIndex > 0) {
      setSelectedDay(dias[currentIndex - 1]);
    }
  };

  const handleNextDay = () => {
    const currentIndex = dias.indexOf(selectedDay);
    if (currentIndex < dias.length - 1) {
      setSelectedDay(dias[currentIndex + 1]);
    }
  };

  const handleEnviarPedidos = async () => {
    try {
      // Endpoint esperado: POST /admin/pedidos/enviar { dia: "Lunes" }
      const response = await api.post("/admin/pedidos/enviar", {
        dia: selectedDay
      });

      Swal.fire({
        icon: "success",
        title: "¡Pedidos enviados!",
        text: `Los pedidos del ${selectedDay} fueron enviados correctamente.`,
        confirmButtonColor: "#22c55e",
      });

      // Recargar pedidos después de enviar
      fetchPedidos(selectedDay);
    } catch (error) {
      console.error("Error al enviar pedidos:", error);
      Swal.fire({
        icon: "error",
        title: "Error al enviar pedidos",
        text: "No se pudieron enviar los pedidos. Intenta nuevamente.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const pedidosFiltrados = pedidos.filter((pedido) =>
    pedido.menuNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner text="Cargando pedidos..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header con navegación de días */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={handlePrevDay}
            disabled={selectedDay === "Lunes"}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>

          <h1 className="text-xl font-bold text-gray-900">{selectedDay}</h1>

          <button
            onClick={handleNextDay}
            disabled={selectedDay === "Viernes"}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="px-4 pb-4">
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

      {/* Lista de pedidos */}
      <div className="px-4 pt-4">
        <h2 className="text-sm font-medium text-gray-500 mb-3">
          Listado pedidos
        </h2>

        <div className="space-y-3">
          {pedidosFiltrados.map((pedido) => (
            <div
              key={pedido.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex items-center gap-4"
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
                <h3 className="font-semibold text-gray-900 text-sm mb-0.5">
                  {pedido.menuNombre}
                </h3>
                <p className="text-xs text-gray-500">{pedido.categoria}</p>
              </div>

              {/* Cantidad de pedidos */}
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-gray-500">Pedidos</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg text-gray-900">
                    {pedido.cantidadPersonas}
                  </span>
                  <User size={16} className="text-gray-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botón enviar pedidos */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 bg-linear-to-t from-gray-50 via-gray-50 to-transparent pt-6">
        <button 
          onClick={handleEnviarPedidos}
          className="w-full bg-red-400 hover:bg-red-500 text-white font-semibold py-4 rounded-full shadow-lg transition-colors"
        >
          Enviar pedidos
        </button>
      </div>
    </div>
  );
}

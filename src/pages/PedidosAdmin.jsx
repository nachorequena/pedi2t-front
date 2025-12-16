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
  const [isEntregadosModalOpen, setIsEntregadosModalOpen] = useState(false);
  const [fechaEntrega, setFechaEntrega] = useState("");

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  // Cargar pedidos del backend
  useEffect(() => {
    fetchPedidos(selectedDay);
  }, [selectedDay]);

  const fetchPedidos = async (dia) => {
    setLoading(true);
    try {
      // GET /admin/platosPedidos
      // Respuesta: { pedidosPorDia: [{ diaSemana, platos: [...], totalPlatosDia }], totalPedidos, mensaje }
      const response = await api.get(`/admin/platosPedidos`);
      
      console.log("=== DEBUG PedidosAdmin: Response ===", response.data);
      
      const pedidosPorDiaArray = Array.isArray(response.data.pedidosPorDia) 
        ? response.data.pedidosPorDia 
        : [];
      
      // Buscar el día seleccionado (normalizar mayúsculas)
      const diaSeleccionadoUpper = dia.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remover acentos
      const diaData = pedidosPorDiaArray.find(d => {
        const diaNormalizado = d.diaSemana.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return diaNormalizado === diaSeleccionadoUpper;
      });
      
      if (!diaData || !diaData.platos) {
        setPedidos([]);
        setLoading(false);
        return;
      }
      
      // Mapear los platos del día seleccionado
      const pedidosMapeados = diaData.platos.map(plato => ({
        id: plato.idPlato,
        menuId: plato.idPlato,
        menuNombre: plato.nombrePlato,
        categoria: plato.categoria,
        imagenUrl: plato.imagenUrl,
        cantidadPersonas: plato.cantidadTotal || 0,
        cantidadPendiente: plato.cantidadPendiente || 0,
        cantidadConfirmado: plato.cantidadConfirmado || 0
      }));
      
      setPedidos(pedidosMapeados);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      Swal.fire({
        icon: "error",
        title: "Error al cargar pedidos",
        text: "No se pudieron cargar los pedidos.",
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
      // Primero confirmar los pedidos pendientes
      const confirmResult = await Swal.fire({
        icon: "warning",
        title: "¿Confirmar pedidos pendientes?",
        text: "Esto cambiará el estado de todos los pedidos pendientes a confirmados y generará el reporte.",
        showCancelButton: true,
        confirmButtonText: "Sí, confirmar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#10b981",
      });

      if (!confirmResult.isConfirmed) {
        return;
      }

      // Llamar al endpoint para confirmar pedidos
      // Calcular el lunes y viernes de la próxima semana
      const hoy = new Date();
      const diaActual = hoy.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
      
      // Días hasta el próximo lunes
      let diasHastaLunes = (8 - diaActual) % 7;
      if (diasHastaLunes === 0) diasHastaLunes = 7; // Si es lunes, ir al próximo
      
      const proximoLunes = new Date(hoy);
      proximoLunes.setDate(hoy.getDate() + diasHastaLunes);
      
      const proximoViernes = new Date(proximoLunes);
      proximoViernes.setDate(proximoLunes.getDate() + 4); // Lunes + 4 días = Viernes
      
      await api.put(`/admin/confirmarPedido`, {
        fechaInicio: proximoLunes.toISOString().split('T')[0],
        fechaFin: proximoViernes.toISOString().split('T')[0]
      });

      // Obtener todos los pedidos de todos los días (ahora actualizados)
      const response = await api.get(`/admin/platosPedidos`);
      const pedidosPorDiaArray = Array.isArray(response.data.pedidosPorDia) 
        ? response.data.pedidosPorDia 
        : [];
      
      if (pedidosPorDiaArray.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Sin pedidos",
          text: "No hay pedidos para generar el reporte.",
          confirmButtonColor: "#f59e0b",
        });
        return;
      }
      
      // Generar contenido del archivo TXT
      let contenido = `REPORTE SEMANAL DE PEDIDOS\n`;
      contenido += `${'='.repeat(70)}\n`;
      contenido += `Fecha de generación: ${new Date().toLocaleDateString('es-AR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}\n`;
      contenido += `Total de pedidos semanales: ${response.data.totalPedidos}\n`;
      contenido += `${'='.repeat(70)}\n\n`;
      
      // Mapeo de días con fechas (calcular próximos días)
      const obtenerProximaFecha = (diaSemana) => {
        const hoy = new Date();
        const diasMap = { 'LUNES': 1, 'MARTES': 2, 'MIERCOLES': 3, 'JUEVES': 4, 'VIERNES': 5 };
        const diaObjetivo = diasMap[diaSemana];
        const diaActual = hoy.getDay() === 0 ? 7 : hoy.getDay(); // Domingo = 7
        
        let diasHasta = diaObjetivo - diaActual;
        if (diasHasta <= 0) diasHasta += 7; // Próxima semana
        
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() + diasHasta);
        return fecha;
      };
      
      // Procesar cada día
      pedidosPorDiaArray.forEach((diaData, index) => {
        const fecha = obtenerProximaFecha(diaData.diaSemana);
        const fechaFormateada = fecha.toLocaleDateString('es-AR', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long' 
        });
        
        contenido += `\n${'-'.repeat(70)}\n`;
        contenido += `${diaData.diaSemana} - ${fechaFormateada}\n`;
        contenido += `${'-'.repeat(70)}\n`;
        contenido += `Total del día: ${diaData.totalPlatosDia} pedidos\n\n`;
        
        diaData.platos.forEach((plato, idx) => {
          contenido += `${idx + 1}. ${plato.nombrePlato}\n`;
          contenido += `   Categoría: ${plato.categoria}\n`;
          contenido += `   Pendientes: ${plato.cantidadPendiente} | Confirmados: ${plato.cantidadConfirmado} | Total: ${plato.cantidadTotal}\n`;
          contenido += `\n`;
        });
      });
      
      contenido += `\n${'='.repeat(70)}\n`;
      contenido += `FIN DEL REPORTE\n`;
      contenido += `${'='.repeat(70)}\n`;
      
      // Crear Blob y descargar
      const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_semanal_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      Swal.fire({
        icon: "success",
        title: "¡Pedidos confirmados!",
        text: "Los pedidos pendientes fueron confirmados y el reporte se descargó correctamente.",
        timer: 2500,
        showConfirmButton: false,
      });

      // Recargar los pedidos para ver el cambio de estado
      fetchPedidos(selectedDay);
    } catch (error) {
      console.error("Error al confirmar pedidos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.mensaje || "No se pudieron confirmar los pedidos.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  // Calcular el día de esta semana según selectedDay
  const calcularDiaSemanaActual = (diaSeleccionado) => {
    const mapaDias = {
      "Lunes": 1,
      "Martes": 2,
      "Miércoles": 3,
      "Jueves": 4,
      "Viernes": 5
    };

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const diaActual = hoy.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
    const diaObjetivo = mapaDias[diaSeleccionado];
    
    // Calcular cuántos días faltan para el día objetivo de esta semana
    let diasHastaDia;
    if (diaActual === 0) { // Domingo
      diasHastaDia = diaObjetivo;
    } else if (diaActual <= diaObjetivo) {
      // El día objetivo es hoy o está más adelante esta semana
      diasHastaDia = diaObjetivo - diaActual;
    } else {
      // El día objetivo ya pasó esta semana
      return null; // Devolver null para indicar que ya pasó
    }
    
    const diaObjetivoFecha = new Date(hoy);
    diaObjetivoFecha.setDate(hoy.getDate() + diasHastaDia);
    
    return {
      fecha: diaObjetivoFecha.toISOString().split('T')[0],
      yaPaso: false
    };
  };

  const diaInfo = calcularDiaSemanaActual(selectedDay);
  const diaSemanaActual = diaInfo?.fecha;
  const diaYaPaso = diaInfo === null;

  const handleMarcarEntregado = async () => {
    if (!fechaEntrega) {
      Swal.fire({
        icon: "warning",
        title: "Fecha requerida",
        text: "Por favor selecciona la fecha de entrega.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    try {
      // PUT /admin/marcarEntregado
      await api.put("/admin/marcarEntregado", {
        fechaEntrega: fechaEntrega
      });

      Swal.fire({
        icon: "success",
        title: "¡Pedidos marcados!",
        text: `Los pedidos del ${new Date(fechaEntrega + 'T00:00:00').toLocaleDateString('es-AR')} fueron marcados como entregados.`,
        timer: 2000,
        showConfirmButton: false,
      });

      setIsEntregadosModalOpen(false);
      setFechaEntrega("");
      fetchPedidos(selectedDay);
    } catch (error) {
      console.error("Error al marcar como entregado:", error);
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || "No se pudo marcar como entregado. Intenta nuevamente.",
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
              <div className="flex flex-col items-end gap-2">
                {/* Pendientes */}
                <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-lg">
                  <span className="text-xs text-yellow-700 font-medium">Pendientes:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-yellow-800">
                      {pedido.cantidadPendiente}
                    </span>
                    <User size={14} className="text-yellow-700" />
                  </div>
                </div>
                {/* Confirmados */}
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-lg">
                  <span className="text-xs text-green-700 font-medium">Confirmados:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-green-800">
                      {pedido.cantidadConfirmado}
                    </span>
                    <User size={14} className="text-green-700" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 bg-linear-gradient-to-t from-gray-50 via-gray-50 to-transparent pt-6">
        <div className="flex gap-3">
          <button 
            onClick={handleEnviarPedidos}
            className="flex-1 bg-red-400 hover:bg-red-500 text-white font-semibold py-4 rounded-full shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Enviar pedidos
          </button>
          <button 
            onClick={() => setIsEntregadosModalOpen(true)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-full shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Entregados
          </button>
        </div>
      </div>

      {/* Modal Entregados */}
      {isEntregadosModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Marcar Entregados</h2>
              <button
                onClick={() => {
                  setIsEntregadosModalOpen(false);
                  setFechaEntrega("");
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de entrega
              </label>
              {diaYaPaso ? (
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 text-center">
                  El {selectedDay.toLowerCase()} de esta semana ya pasó
                </div>
              ) : (
                <>
                  <input
                    type="date"
                    value={fechaEntrega}
                    onChange={(e) => setFechaEntrega(e.target.value)}
                    min={diaSemanaActual}
                    max={diaSemanaActual}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Solo puedes marcar como entregados los pedidos del {selectedDay.toLowerCase()} de esta semana ({new Date(diaSemanaActual).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })})
                  </p>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsEntregadosModalOpen(false);
                  setFechaEntrega("");
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleMarcarEntregado}
                disabled={diaYaPaso}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Marcar Entregados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

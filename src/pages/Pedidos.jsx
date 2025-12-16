import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "../api/axios";

export default function Pedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [nota, setNota] = useState("");
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [usuario, setUsuario] = useState(null);

  //  Cargar pedidos desde el backend
  useEffect(() => {
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
    setUsuario(usuarioActual);
    
    if (!usuarioActual || !usuarioActual.id) {
      return;
    }

    fetchPedidosPendientes(usuarioActual.id);
  }, []);

  const fetchPedidosPendientes = async (usuarioId) => {
    try {
      // GET /Pedidos/PedidosRealizados?usuarioId={id}
      const response = await axios.get(`/Pedidos/PedidosRealizados`, {
        params: { usuarioId: usuarioId }
      });
      
      console.log("=== DEBUG: Response completo ===", response.data);
      console.log("=== DEBUG: Pedidos array ===", response.data.pedidos);
      
      // Verificar si response.data.pedidos es un array
      const pedidosArray = Array.isArray(response.data.pedidos) 
        ? response.data.pedidos 
        : (response.data.pedidos ? [response.data.pedidos] : []);
      
      console.log("=== DEBUG: Cantidad de pedidos ===", pedidosArray.length);
      
      // Mapear los pedidos del backend al formato esperado
      const pedidosMapeados = pedidosArray.map((pedido, index) => {
        console.log(`=== DEBUG: Pedido ${index} ===`, pedido);
        
        return {
          id: pedido.idPedido || pedido.id,
          dia: pedido.diaSemana || pedido.dia || "Día desconocido",
          menu: pedido.nombrePlato || pedido.menuNombre || "Plato desconocido",
          categoria: pedido.categoria || "Minuta",
          descripcion: pedido.descripcionPlato || pedido.descripcion || "",
          imagenUrl: pedido.fotoUrl || pedido.imagenUrl || "/placeholder.jpg",
          fecha: pedido.fechaEntrega || pedido.fecha,
          diaId: pedido.idMenuDia || pedido.diaId,
          platoId: pedido.idPlato || pedido.platoId,
          pedidoId: pedido.idPedido || pedido.id,
          estado: pedido.estado || "PENDIENTE"
        };
      });
      
      console.log("=== DEBUG: Pedidos mapeados ===", pedidosMapeados);
      setPedidos(pedidosMapeados);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      // Si falla, intentar cargar desde localStorage como fallback
      const pedidoGuardado = JSON.parse(localStorage.getItem("pedidoSeleccionado")) || [];
      setPedidos(pedidoGuardado.filter((p) => p.menu !== null));
    }
  };

  //  Cancelar pedido (solo si no fue enviado)
  const handleCancelarPedido = async (pedido) => {
    Swal.fire({
      icon: "warning",
      title: "¿Cancelar pedido?",
      text: `Se cancelará el pedido de ${pedido.menu} para el ${pedido.dia}`,
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
      confirmButtonColor: "#dc2626",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const dataCancelar = {
            idUsuario: usuario.id,
            idPedido: pedido.pedidoId || pedido.id
          };
          
          console.log("=== DEBUG: Cancelando pedido ===", dataCancelar);
          console.log("=== DEBUG: Pedido completo ===", pedido);
          
          // PUT /Pedidos/CancelarPedido
          await axios.put("/Pedidos/CancelarPedido", dataCancelar);

          Swal.fire({
            icon: "success",
            title: "Pedido cancelado",
            text: "Tu pedido fue cancelado exitosamente.",
            confirmButtonColor: "#16a34a",
          });

          // Recargar pedidos
          fetchPedidosPendientes(usuario.id);
        } catch (error) {
          console.error("Error al cancelar pedido:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo cancelar el pedido. Intenta nuevamente.",
            confirmButtonColor: "#dc2626",
          });
        }
      }
    });
  };

  //  Enviar pedido (marca el pedido como finalizado)
  const handleEnviar = async () => {
    if (pedidos.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin pedido",
        text: "No hay ningún pedido para enviar.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    try {
      // Preparar datos para enviar al backend
      const pedidoData = {
        usuarioId: usuario.id,
        observaciones: nota || "",
        pedidos: pedidos.map(p => ({
          diaId: p.diaId, // Necesitarás el ID del día/menú
          platoId: p.platoId // Necesitarás el ID del plato
        }))
      };

      const response = await axios.post("/Pedidos/SeleccionarPedido", pedidoData);

      localStorage.setItem("notaPedido", nota);
      localStorage.setItem("pedidoEnviado", "true");
      setPedidoEnviado(true);

      Swal.fire({
        icon: "success",
        title: "Pedido enviado",
        html: `
          <p>${response.data.mensaje || "Tu pedido fue registrado con éxito."}</p>
          <p><b>Nota:</b> ${nota || "Sin nota"}</p>
        `,
        confirmButtonColor: "#16a34a",
      });
      
    } catch (error) {
      console.error("Error al enviar pedido:", error);
      Swal.fire({
        icon: "error",
        title: "Error al enviar",
        text: error.response?.data?.mensaje || "No se pudo enviar el pedido. Intenta nuevamente.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  //  Guardar nota si el pedido ya fue enviado (actualiza localStorage automáticamente)
  const handleActualizarNota = () => {
    localStorage.setItem("notaPedido", nota);
    Swal.fire({
      icon: "success",
      title: "Nota actualizada",
      text: "Tu nota fue guardada correctamente.",
      confirmButtonColor: "#16a34a",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  if (pedidos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen  text-center px-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          No hay pedidos registrados
        </h2>
        <p className="text-gray-700 mb-6 max-w-md">
          No realizaste ningún pedido esta semana. Volvé al menú para
          seleccionar tus comidas presenciales.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
        >
          Ir al menú
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
        Pedidos
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {pedidos.map((pedido, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Encabezado del día */}
            <div className="bg-gray-50 px-6 py-3 border-b">
              <h2 className="text-xl font-bold text-gray-800 text-center">
                {pedido.dia || "Día desconocido"}
              </h2>
            </div>

            {/* Tarjeta del plato */}
            <div className="p-6">
              <div className="flex gap-4 items-start">
                {/* Imagen del plato */}
                <div className="w-48 h-32 rounded-lg overflow-hidden shrink-0 shadow-md">
                  <img
                    src={pedido.imagenUrl || "/placeholder.jpg"}
                    alt={pedido.menu}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Información del plato */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {pedido.menu || "Plato desconocido"}
                  </h3>
                  <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                    {pedido.categoria || "Minuta"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {pedido.descripcion || ""}
                  </p>
                  {pedido.fecha && (
                    <p className="text-xs text-gray-400 mt-2">
                      Fecha de entrega: {new Date(pedido.fecha + 'T00:00:00').toLocaleDateString('es-AR', { 
                        year: 'numeric', 
                        month: '2-digit', 
                        day: '2-digit',
                        timeZone: 'America/Argentina/Buenos_Aires'
                      })}
                    </p>
                  )}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 mt-4 justify-center">
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Seleccionado
                </button>
                <button
                  onClick={() => handleCancelarPedido(pedido)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancelar pedido
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

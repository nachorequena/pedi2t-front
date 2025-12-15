import { useEffect, useState } from "react";
import MenuCarousel from "../componets/MenuCarousel";
import Swal from "sweetalert2";
import api from "../api/axios";
import { LoadingSpinner } from "../componets/LoadingSpinner";
export default function Home() {
  const [menuData, setMenuData] = useState([]);
  const [mostrarRecordatorio, setMostrarRecordatorio] = useState(false);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));

    if (!usuario || !usuario.id) {
      Swal.fire({
        icon: "error",
        title: "Usuario no encontrado",
        text: "No se encontró información del usuario. Iniciá sesión nuevamente.",
        confirmButtonColor: "#dc2626",
      });
      setLoading(false);
      return;
    }

    const fetchMenus = async () => {
      try {
        const response = await api.get(`/home/${usuario.id}`);

        // El backend ahora devuelve { usuarioId, menus: [...] }
        setMenuData(response.data.menus || []);

        const pedidoYaEnviado =
          localStorage.getItem("pedidoEnviado") === "true";
        setPedidoEnviado(pedidoYaEnviado);

        const hoy = new Date().getDay(); // 5 = Viernes
        if (hoy === 5 && !pedidoYaEnviado) {
          setMostrarRecordatorio(true);
        }
      } catch (error) {
        console.error("Error al obtener los menús:", error);
        Swal.fire({
          icon: "error",
          title: "Error al cargar menús",
          text: "No se pudo conectar con el servidor.",
          confirmButtonColor: "#dc2626",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  const handleSeleccion = async (dia, platoId) => {
    console.log(`Seleccionado: ${dia} - Plato ID: ${platoId}`);

    Swal.fire({
      title: "Confirmas la seleccion del plato?",
      text: "No podrás cambiarlo después del viernes.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "si, confirmar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // 🔥 POST al backend
          const response = await api.post("/reservas", {
            usuarioId: usuario.id,
            menuPlatoId: platoId,
            dia: dia, // "lunes", "martes", etc.
          });

          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });

          Toast.fire({
            icon: "success",
            title: "Plato seleccionado con éxito",
          });
        } catch (error) {
          console.error("Error al enviar selección:", error);

          Swal.fire({
            icon: "error",
            title: "Error al seleccionar plato",
            text: "Intentalo nuevamente.",
          });
        }
      }
    });
  };

  if (loading) {
    return <LoadingSpinner text="Cargando menús..." />;
  }

  if (menuData.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen px-6 text-center">
        <p className="text-lg text-gray-800 max-w-md">
          No se encontraron menús disponibles para tus días presenciales.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notificaciones */}
      <div className="px-4 pt-4">
        {mostrarRecordatorio && (
          <div className="bg-yellow-400 text-black text-center p-3 rounded-md mb-6 font-medium shadow-md animate-pulse">
            Recordatorio: tenés tiempo hasta <b>hoy viernes</b> para enviar tu
            pedido semanal.
          </div>
        )}

        {pedidoEnviado && (
          <div className="bg-green-400 text-white text-center p-3 rounded-md mb-6 font-medium shadow-md">
            Ya enviaste tu pedido semanal. No es posible modificarlo.
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 px-4">
        Menú de la semana
      </h1>

      {/* Carrusel de menús por día */}
      <div className="px-4 pb-6">
        <MenuCarousel menuData={menuData} onSeleccion={handleSeleccion} />
      </div>
    </div>
  );
}

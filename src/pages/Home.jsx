import { useEffect, useState } from "react";
import DayMenuCard from "../componets/DayMenuCard";
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
    <div className="min-h-screen px-6 py-10 bg-gray-100">
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

      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
        Menú de la semana
      </h1>

      {/* Recorremos los menús y dentro de cada uno sus platos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto">
        {menuData.map((menu) =>
          menu.platos.map((plato) => (
            <DayMenuCard
              key={`${menu.id}-${plato.idPlato}`}
              dia={menu.descripcion} // Muestra “Menú del lunes”, etc.
              opciones={[
                {
                  id: plato.idPlato,
                  nombre: plato.nombre,
                  descripcion: plato.descripcion,
                  imagenUrl: plato.imagenUrl,
                },
              ]}
              onSeleccion={() => {}}
            />
          ))
        )}
      </div>
    </div>
  );
}

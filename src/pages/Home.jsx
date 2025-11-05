import { useEffect, useState } from "react";
import DayMenuCard from "../componets/DayMenuCard";
import Swal from "sweetalert2";
import api from "../api/axios"; //  Importá tu instancia de Axios

export default function Home() {
  const [menuData, setMenuData] = useState([]);
  const [mostrarRecordatorio, setMostrarRecordatorio] = useState(false);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));

    const fetchMenus = async () => {
      try {
        //  Obtener menús desde el backend, según el empleado
        const response = await api.get(`/menus`, {
          params: { empleadoId: usuario.id },
        });

        setMenuData(response.data);

        // Verificar si ya envió pedido
        const pedidoYaEnviado =
          localStorage.getItem("pedidoEnviado") === "true";
        setPedidoEnviado(pedidoYaEnviado);

        // Mostrar recordatorio si es viernes y no se envió el pedido
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

  const handleSeleccion = (diaSeleccionado, idMenu) => {
    if (pedidoEnviado) {
      Swal.fire({
        icon: "info",
        title: "Pedido ya enviado",
        text: "No podés modificar el menú porque ya enviaste tu pedido.",
        confirmButtonColor: "#6b7280",
      });
      return;
    }

    const updated = menuData.map((dia) =>
      dia.dia === diaSeleccionado
        ? {
            ...dia,
            opciones: dia.opciones.map((op) => ({
              ...op,
              seleccionado: op.id === idMenu,
            })),
          }
        : dia
    );

    setMenuData(updated);

    const pedidoActualizado = updated.map((dia) => {
      const seleccion = dia.opciones.find((op) => op.seleccionado);
      return { dia: dia.dia, menu: seleccion ? seleccion.nombre : null };
    });

    localStorage.setItem(
      "pedidoSeleccionado",
      JSON.stringify(pedidoActualizado)
    );

    const dia = updated.find((d) => d.dia === diaSeleccionado);
    const menuSeleccionado = dia.opciones.find((op) => op.id === idMenu);

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `Pedido actualizado: ${diaSeleccionado} → ${menuSeleccionado.nombre}`,
      showConfirmButton: false,
      timer: 1200,
      toast: true,
      color: "#064e3b",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg animate-pulse text-gray-700">Cargando menús...</p>
      </div>
    );
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

      <div className="grid grid-cols-1 gap-8 mx-auto">
        {menuData.map((dia) => (
          <DayMenuCard
            key={dia.dia}
            dia={dia.dia}
            opciones={dia.opciones}
            onSeleccion={handleSeleccion}
          />
        ))}
      </div>
    </div>
  );
}

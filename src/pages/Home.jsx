import { useEffect, useState } from "react";
import MenuCarousel from "../componets/MenuCarousel";
import Swal from "sweetalert2";
import api from "../api/axios";
import { LoadingSpinner } from "../componets/LoadingSpinner";
export default function Home() {
  const [menuData, setMenuData] = useState([]);

  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
    setUsuario(usuarioActual);

    if (!usuarioActual || !usuarioActual.id) {
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
        const response = await api.get(`/home/${usuarioActual.id}`);

        console.log("=== DEBUG HOME: Response completo ===", response.data);
        console.log("=== DEBUG HOME: Menus array ===", response.data.menus);
        console.log(
          "=== DEBUG HOME: Cantidad de días ===",
          response.data.menus?.length
        );

        // Ordenar menús por día de la semana (Lunes a Viernes)
        const ordenDias = {
          "LUNES": 1,
          "MARTES": 2,
          "MIERCOLES": 3,
          "MIÉRCOLES": 3,
          "JUEVES": 4,
          "VIERNES": 5
        };

        const menusOrdenados = (response.data.menus || []).sort((a, b) => {
          const diaA = a.descripcion.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const diaB = b.descripcion.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          
          // Encontrar el orden del día A
          let ordenA = 6;
          for (const [dia, orden] of Object.entries(ordenDias)) {
            if (diaA.includes(dia)) {
              ordenA = orden;
              break;
            }
          }
          
          // Encontrar el orden del día B
          let ordenB = 6;
          for (const [dia, orden] of Object.entries(ordenDias)) {
            if (diaB.includes(dia)) {
              ordenB = orden;
              break;
            }
          }
          
          return ordenA - ordenB;
        });

        // El backend ahora devuelve { usuarioId, menus: [...] }
        setMenuData(menusOrdenados);

        const pedidoYaEnviado =
          localStorage.getItem("pedidoEnviado") === "true";
        setPedidoEnviado(pedidoYaEnviado);
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

  const handleSeleccion = async (dia, platoId, menuDiaId) => {
    console.log(
      `Seleccionado: ${dia} - Plato ID: ${platoId} - MenuDia ID: ${menuDiaId}`
    );

    if (!usuario || !usuario.id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró información del usuario. Por favor, inicia sesión nuevamente.",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

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
          // Validar que todos los datos necesarios están presentes
          if (!platoId || !menuDiaId) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Datos incompletos. Por favor, intenta nuevamente.",
              confirmButtonColor: "#dc2626",
            });
            return;
          }

          const pedidoData = {
            idUsuario: usuario.id,
            idPlato: platoId,
            idMenuDia: menuDiaId,
            diaEntrega: dia, // Enviar el día tal como viene (Lunes, Martes, Miércoles, Jueves, Viernes)
          };

          console.log("Enviando pedido:", pedidoData);

          // POST al backend con el formato correcto del DTO
          const response = await api.post(
            "/Pedidos/SeleccionarPedido",
            pedidoData
          );

          // Encontrar el plato seleccionado para obtener su nombre
          const menuSeleccionado = menuData.find(
            (menu) => menu.id === menuDiaId
          );
          const platoSeleccionado = menuSeleccionado?.platos.find(
            (plato) => plato.idPlato === platoId
          );

          // Guardar en localStorage para que aparezca en Pedidos
          const pedidosActuales =
            JSON.parse(localStorage.getItem("pedidoSeleccionado")) || [];
          const nuevoPedido = {
            dia: dia,
            menu: platoSeleccionado?.nombre || "Plato seleccionado",
            diaId: menuDiaId,
            platoId: platoId,
          };

          // Verificar si ya existe un pedido para ese día y reemplazarlo
          const pedidosActualizados = pedidosActuales.filter(
            (p) => p.dia !== dia
          );
          pedidosActualizados.push(nuevoPedido);

          localStorage.setItem(
            "pedidoSeleccionado",
            JSON.stringify(pedidosActualizados)
          );

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
          console.error("Detalles del error:", error.response?.data);
          console.error("Status:", error.response?.status);

          Swal.fire({
            icon: "error",
            title: "Error al seleccionar plato",
            text:
              error.response?.data?.message ||
              error.response?.data ||
              "Intentalo nuevamente.",
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
      <div className="px-4 pt-4">
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

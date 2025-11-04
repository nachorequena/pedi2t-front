import { useEffect, useState } from "react";
import DayMenuCard from "../componets/DayMenuCard";
import Swal from "sweetalert2";

export default function Home() {
  const [menuData, setMenuData] = useState([]);
  const [diasPresenciales, setDiasPresenciales] = useState([]);
  const [mostrarRecordatorio, setMostrarRecordatorio] = useState(false);
  const [pedidoEnviado, setPedidoEnviado] = useState(false); // 🔹 nuevo estado

  useEffect(() => {
    // Obtener los días presenciales configurados por el usuario
    const diasGuardados =
      JSON.parse(localStorage.getItem("diasPresenciales")) || [];
    setDiasPresenciales(diasGuardados);

    // Datos simulados
    const simulatedData = [
      {
        dia: "Lunes",
        opciones: [
          { id: 1, nombre: "Milanesas con puré", seleccionado: false },
          { id: 2, nombre: "Ensalada César", seleccionado: false },
          { id: 7, nombre: "Hamburguesa vegetariana", seleccionado: false },
          { id: 8, nombre: "Sopa de verduras", seleccionado: false },
        ],
      },
      {
        dia: "Martes",
        opciones: [
          { id: 3, nombre: "Tarta de jamón y queso", seleccionado: false },
          { id: 4, nombre: "Pollo al horno", seleccionado: false },
          { id: 9, nombre: "Ensalada griega", seleccionado: false },
          { id: 10, nombre: "Curry de garbanzos", seleccionado: false },
        ],
      },
      {
        dia: "Miércoles",
        opciones: [
          { id: 5, nombre: "Pastas con salsa bolognesa", seleccionado: false },
          { id: 6, nombre: "Wok de vegetales", seleccionado: false },
          { id: 11, nombre: "Pizza margarita", seleccionado: false },
          { id: 12, nombre: "Ensalada de quinoa", seleccionado: false },
        ],
      },
      {
        dia: "Jueves",
        opciones: [
          { id: 13, nombre: "Lomo con papas", seleccionado: false },
          { id: 14, nombre: "Empanadas árabes", seleccionado: false },
          { id: 15, nombre: "Ravioles con pesto", seleccionado: false },
          { id: 16, nombre: "Wrap vegetariano", seleccionado: false },
        ],
      },
      {
        dia: "Viernes",
        opciones: [
          { id: 17, nombre: "Pizza calabresa", seleccionado: false },
          { id: 18, nombre: "Merluza al horno", seleccionado: false },
          { id: 19, nombre: "Tacos de pollo", seleccionado: false },
          { id: 20, nombre: "Fideos alfredo", seleccionado: false },
        ],
      },
    ];

    // Filtrar según los días presenciales del usuario
    const filtrados =
      diasGuardados.length > 0
        ? simulatedData.filter((dia) => diasGuardados.includes(dia.dia))
        : [];

    // Cargar pedido guardado (si existe)
    const pedidoGuardado =
      JSON.parse(localStorage.getItem("pedidoSeleccionado")) || [];

    // Si ya hay selecciones previas, marcarlas
    const menuConSelecciones = filtrados.map((dia) => {
      const seleccionDia = pedidoGuardado.find((p) => p.dia === dia.dia);
      if (seleccionDia) {
        return {
          ...dia,
          opciones: dia.opciones.map((op) => ({
            ...op,
            seleccionado: op.nombre === seleccionDia.menu,
          })),
        };
      }
      return dia;
    });

    setTimeout(() => setMenuData(menuConSelecciones), 600);

    // Verificar si ya fue enviado el pedido
    const pedidoYaEnviado = localStorage.getItem("pedidoEnviado") === "true";
    setPedidoEnviado(pedidoYaEnviado);

    // Mostrar recordatorio si es viernes y no se envió el pedido
    const hoy = new Date().getDay(); // 5 = Viernes
    if (hoy === 5 && !pedidoYaEnviado) {
      setMostrarRecordatorio(true);
    }
  }, []);

  const handleSeleccion = (diaSeleccionado, idMenu) => {
    //  Evitar modificar si el pedido ya fue enviado
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

  if (diasPresenciales.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8E4C3] px-6 text-center">
        <p className="text-lg text-gray-800 max-w-md">
          No configuraste tus días presenciales aún. <br />
          <span className="font-semibold">Dirigite a tu perfil</span> para
          hacerlo.
        </p>
      </div>
    );
  }

  if (menuData.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8E4C3] ">
        <p className="text-lg animate-pulse">Cargando menús...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-[#F8E4C3]">
      {/*  Banner de recordatorio */}
      {mostrarRecordatorio && (
        <div className="bg-yellow-400 text-black text-center p-3 rounded-md mb-6 font-medium shadow-md animate-pulse">
          Recordatorio: tenés tiempo hasta <b>hoy viernes</b> para enviar tu
          pedido semanal.
        </div>
      )}

      {/*  Aviso si el pedido ya fue enviado */}
      {pedidoEnviado && (
        <div className="bg-green-600 text-white text-center p-3 rounded-md mb-6 font-medium shadow-md">
          Ya enviaste tu pedido semanal. No es posible modificarlo.
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
        Menú de la semana
      </h1>

      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
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

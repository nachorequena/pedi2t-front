import { useEffect, useState } from "react";

export default function Home() {
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    // Simulación de carga (podría venir del backend)
    const simulatedData = [
      {
        dia: "Lunes",
        opciones: [
          { id: 1, nombre: "Milanesas con puré", seleccionado: false },
          { id: 2, nombre: "Ensalada César", seleccionado: false },
        ],
      },
      {
        dia: "Martes",
        opciones: [
          { id: 3, nombre: "Tarta de jamón y queso", seleccionado: false },
          { id: 4, nombre: "Pollo al horno", seleccionado: false },
        ],
      },
      {
        dia: "Miércoles",
        opciones: [
          { id: 5, nombre: "Pastas con salsa bolognesa", seleccionado: false },
          { id: 6, nombre: "Wok de vegetales", seleccionado: false },
        ],
      },
    ];
    setTimeout(() => setMenuData(simulatedData), 800); // simula carga
  }, []);

  const handleSeleccion = (diaSeleccionado, idMenu) => {
    setMenuData((prev) =>
      prev.map((dia) =>
        dia.dia === diaSeleccionado
          ? {
              ...dia,
              opciones: dia.opciones.map((op) => ({
                ...op,
                seleccionado: op.id === idMenu,
              })),
            }
          : dia
      )
    );
  };

  if (menuData.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a] text-white">
        <p className="text-lg animate-pulse">Cargando menús...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-6 py-10 text-white"
      style={{
        background:
          "radial-gradient(circle at center, #161616 0%, #0a0a0a 100%)",
      }}
    >
      <h1 className="text-3xl font-bold mb-8 text-center">Menú de la semana</h1>

      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        {menuData.map((dia) => (
          <div
            key={dia.dia}
            className="bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-800"
          >
            <h2 className="text-xl font-semibold mb-4">{dia.dia}</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {dia.opciones.map((menu) => (
                <button
                  key={menu.id}
                  onClick={() => handleSeleccion(dia.dia, menu.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    menu.seleccionado
                      ? "bg-green-600 border-green-500 text-white shadow-lg"
                      : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                  }`}
                >
                  {menu.nombre}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

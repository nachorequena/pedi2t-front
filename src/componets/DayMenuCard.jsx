export default function DayMenuCard({ dia, opciones, onSeleccion }) {
  return (
    <div className="bg-gray-100 rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">{dia}</h2>

      <div className="grid gap-4 sm:grid-cols-4">
        {opciones.map((menu) => (
          <button
            key={menu.id}
            onClick={() => onSeleccion(dia, menu.id)}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              menu.seleccionado
                ? "bg-green-600 border-green-500 text-white shadow-lg scale-[1.02]"
                : "bg-gray-100  hover:bg-gray-200 hover:scale-[1.01] hover:cursor-pointer"
            }`}
          >
            {menu.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}

import { CheckCircle2 } from "lucide-react"; // 👈 ícono moderno (de lucide-react)

export default function DayMenuCard({ dia, opciones, onSeleccion }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-5 text-gray-900 text-center">
        {dia}
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {opciones.map((menu) => (
          <div
            key={menu.id}
            onClick={() => onSeleccion(dia, menu.id)}
            className={`relative group cursor-pointer rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-xl ${
              menu.seleccionado
                ? "border-green-600 ring-2 ring-green-500"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            {/* Imagen del plato */}
            <div className="h-36 w-full overflow-hidden relative">
              <img
                src={menu.imagen || "/placeholder.jpg"}
                alt={menu.nombre}
                className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                  menu.seleccionado ? "opacity-90" : ""
                }`}
              />

              {/* Overlay animado cuando se selecciona */}
              {menu.seleccionado && (
                <div className="absolute inset-0 bg-green-600/60 backdrop-blur-[1px] flex items-center justify-center animate-fadeIn">
                  <CheckCircle2
                    size={50}
                    className="text-white drop-shadow-md animate-scaleIn"
                  />
                </div>
              )}
            </div>

            {/* Contenido */}
            <div className="p-4">
              <h3
                className={`font-semibold text-lg mb-1 ${
                  menu.seleccionado ? "text-green-700" : "text-gray-900"
                }`}
              >
                {menu.nombre}
              </h3>

              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {menu.descripcion || "No hay descripción disponible."}
              </p>

              {/* Categoría */}
              {menu.categoria && (
                <span
                  className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${
                    menu.categoria.toLowerCase() === "vegetariano"
                      ? "bg-green-100 text-green-800"
                      : menu.categoria.toLowerCase() === "light"
                      ? "bg-blue-100 text-blue-800"
                      : menu.categoria.toLowerCase() === "vegano"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {menu.categoria}
                </span>
              )}
            </div>

            {/* Etiqueta “Seleccionado” en la esquina */}
            {menu.seleccionado && (
              <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow-md animate-fadeIn">
                Seleccionado
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

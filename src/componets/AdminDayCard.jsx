import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminDayCard({ dia, menus = [], onAddMenu, onEditMenu, onDeleteMenu }) {
  return (
    <div className="mb-6">
      {/* Header del día */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">{dia}</h2>

      {/* Grid de menús */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menus.map((menu, index) => (
          <div
            key={index}
            className="relative group rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all"
          >
            {/* Botones de acción */}
            <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEditMenu(dia, index, menu)}
                className="p-2 bg-white hover:bg-gray-100 rounded-full shadow-md transition-colors"
                title="Editar"
              >
                <Edit size={16} className="text-gray-700" />
              </button>
              <button
                onClick={() => onDeleteMenu(dia, index)}
                className="p-2 bg-white hover:bg-red-50 rounded-full shadow-md transition-colors"
                title="Eliminar"
              >
                <Trash2 size={16} className="text-red-600" />
              </button>
            </div>

            {/* Imagen del menú */}
            <div className="h-36 w-full bg-gray-100 overflow-hidden relative">
              {menu.imagenUrl ? (
                <img
                  src={menu.imagenUrl}
                  alt={menu.nombre}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  <span className="text-4xl">🍽️</span>
                </div>
              )}
            </div>

            {/* Info del menú */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1 text-gray-900">
                {menu.nombre || menu.categoria}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {menu.descripcion || "Sin descripción"}
              </p>
              {menu.categoria && (
                <span className="inline-block text-xs px-3 py-1 rounded-full font-medium bg-gray-200 text-gray-700">
                  {menu.categoria}
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Botón para agregar nuevo menú */}
        <button
          onClick={() => onAddMenu(dia)}
          className="h-full min-h-60 rounded-xl border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 hover:border-black transition-all flex flex-col items-center justify-center gap-3 group"
        >
          <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
            <Plus size={32} className="text-black" />
          </div>
          <span className="text-sm font-medium text-gray-600 group-hover:text-black transition-colors">
            Agregar menú
          </span>
        </button>
      </div>
    </div>
  );
}


export default function MenuCarousel({ menuData, onSeleccion }) {
  if (!menuData || menuData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No hay menús disponibles</p>
      </div>
    );
  }

  const obtenerNombreDia = (descripcion) => {
    if (descripcion.toLowerCase().includes("lunes")) return "Lunes";
    if (descripcion.toLowerCase().includes("miércoles") || descripcion.toLowerCase().includes("miercoles")) return "Miércoles";
    if (descripcion.toLowerCase().includes("viernes")) return "Viernes";
    return descripcion;
  };

  return (
    <div className="space-y-6">
      {menuData.map((menu) => {
        const nombreDia = obtenerNombreDia(menu.descripcion);
        
        return (
          <div key={menu.id} className="bg-white rounded-xl shadow-md">
            {/* Título del día */}
            <div className="px-6 py-4 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800 text-center">{nombreDia}</h2>
            </div>

            {/* Carrusel horizontal de platos */}
            <div className="p-6">
              <div className="responsive-grid">
                {menu.platos.map((plato) => (
                  <div
                    key={plato.idPlato}
                    onClick={() => onSeleccion && onSeleccion(nombreDia, plato.idPlato)}
                    className="cursor-pointer group bg-gray-50 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Imagen del plato */}
                    <div className="w-full h-48 rounded-xl overflow-hidden mb-4 relative shadow-md">
                      <img
                        src={plato.imagenUrl || "/placeholder.jpg"}
                        alt={plato.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Información del plato */}
                    <div className="text-center space-y-2">
                      <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                        {plato.categoria || "Minuta"}
                      </p>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                        {plato.nombre}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../componets/LoadingSpinner";

export default function PerfilAdmin() {
  const [usuario, setUsuario] = useState(null);

  // Cargar datos del usuario
  useEffect(() => {
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
    setUsuario(usuarioActual);
  }, []);

  //  Obtener iniciales del usuario
  const getIniciales = (nombre, apellido) => {
    if (!nombre || !apellido) return "";

    const partesNombre = nombre.trim().split(" ");
    const partesApellido = apellido.trim().split(" ");

    const inicialNombre = partesNombre[0]?.[0] || "";
    const inicialApellido = partesApellido[0]?.[0] || "";

    return (inicialNombre + inicialApellido).toUpperCase();
  };

  if (!usuario) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
        Perfil del Administrador
      </h1>

      {/* Card de información personal */}
      <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
          {getIniciales(usuario?.nombre, usuario?.apellido)}
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {usuario?.nombre} {usuario?.apellido}
        </h2>
        <span className="inline-block px-3 py-1 bg-black text-white text-xs font-semibold rounded-full mb-4">
          ADMINISTRADOR
        </span>
        
        <div className="w-full space-y-3 mt-4">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-500">Correo electrónico</span>
            <span className="text-base text-gray-900">{usuario?.email}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-500">Usuario</span>
            <span className="text-base text-gray-900">{usuario?.username || "N/A"}</span>
          </div>

          {usuario?.direccion && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-500">Dirección</span>
              <span className="text-base text-gray-900">{usuario?.direccion}</span>
            </div>
          )}

          {usuario?.telefono && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-500">Número de teléfono</span>
              <span className="text-base text-gray-900">{usuario?.telefono}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

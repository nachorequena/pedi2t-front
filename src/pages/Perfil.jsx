import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Perfil() {
  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  const [diasPresenciales, setDiasPresenciales] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuario, setUsuario] = useState(null);

  // Cargar datos del usuario y configuración
  useEffect(() => {
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
    setUsuario(usuarioActual);

    const guardados = localStorage.getItem("diasPresenciales");
    if (guardados) {
      setDiasPresenciales(JSON.parse(guardados));
    } else {
      setModoEdicion(true);
    }
  }, []);

  const handleCheckboxChange = (dia) => {
    setDiasPresenciales((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const handleGuardar = () => {
    if (diasPresenciales.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona al menos un día",
        text: "Debes configurar al menos un día presencial.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    localStorage.setItem("diasPresenciales", JSON.stringify(diasPresenciales));
    setModoEdicion(false);

    Swal.fire({
      icon: "success",
      title: "Días guardados",
      html: `Tus días presenciales son:<br><b>${diasPresenciales.join(
        ", "
      )}</b>`,
      confirmButtonColor: "#16a34a",
    });
  };

  const handleEditar = () => {
    setModoEdicion(true);
  };

  //  Obtener iniciales del usuario
  const getIniciales = (nombre, apellido) => {
    if (!nombre || !apellido) return "";

    const partesNombre = nombre.trim().split(" ");
    const partesApellido = apellido.trim().split(" ");

    const inicialNombre = partesNombre[0]?.[0] || "";
    const inicialApellido = partesApellido[0]?.[0] || "";

    return (inicialNombre + inicialApellido).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
        Perfil del Empleado
      </h1>

      {/* Card de información personal */}
      <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-md mb-8 border border-gray-200 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-linear-to-br from-[#C8997E] to-[#8A5A4A] flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
          {getIniciales(usuario?.nombre, usuario?.apellido)}
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          {usuario?.nombre} {usuario?.apellido}
        </h2>
        <p className="text-gray-600">
          <span className="font-bold">Correo electronico:</span>{" "}
          {usuario?.email}
        </p>
        <p className="text-gray-600">
          <span className="font-bold">Direccion:</span> {usuario?.direccion}
        </p>
        <p className="text-gray-600">
          <span className="font-bold">Numero de telefono:</span>{" "}
          {usuario?.telefono}
        </p>
      </div>

      {/* Card de configuración de días presenciales */}
      <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-md border border-gray-200">
        {!modoEdicion ? (
          <>
            <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">
              Días presenciales configurados
            </h2>

            {diasPresenciales.length > 0 ? (
              <ul className="flex flex-col gap-3 mb-6">
                {diasPresenciales.map((dia) => (
                  <li
                    key={dia}
                    className="bg-green-100 text-green-700 font-medium text-center py-2 rounded-lg border border-green-300"
                  >
                    {dia}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-center mb-6">
                Aún no configuraste tus días presenciales.
              </p>
            )}

            <div className="flex justify-center">
              <button
                onClick={handleEditar}
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition"
              >
                Editar días
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">
              Seleccioná tus días presenciales
            </h2>

            <div className="flex flex-col gap-4 mb-8">
              {diasSemana.map((dia) => (
                <label
                  key={dia}
                  className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  <span className="text-gray-800">{dia}</span>
                  <input
                    type="checkbox"
                    checked={diasPresenciales.includes(dia)}
                    onChange={() => handleCheckboxChange(dia)}
                    className="w-5 h-5 accent-green-600"
                  />
                </label>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleGuardar}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
              >
                Guardar cambios
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

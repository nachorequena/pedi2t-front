import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";

export default function Registro() {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [diasPresenciales, setDiasPresenciales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const diasSemana = [
    { label: "Lunes", value: "Lunes" },
    { label: "Martes", value: "Martes" },
    { label: "Miércoles", value: "Miercoles" },
    { label: "Jueves", value: "Jueves" },
    { label: "Viernes", value: "Viernes" },
  ];

  const handleCheckboxChange = (dia) => {
    setDiasPresenciales((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validaciones frontend
    if (!nombre || !apellido || !email || !password) {
      Swal.fire(
        "Error",
        "Todos los campos obligatorios deben completarse.",
        "warning"
      );
      return;
    }

    if (!validateEmail(email)) {
      Swal.fire("Error", "El email no es válido.", "warning");
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire("Error", "Las contraseñas no coinciden.", "warning");
      return;
    }

    if (password.length < 6) {
      Swal.fire(
        "Error",
        "La contraseña debe tener al menos 6 caracteres.",
        "warning"
      );
      return;
    }

    if (diasPresenciales.length === 0) {
      Swal.fire(
        "Error",
        "Debes seleccionar al menos un día presencial.",
        "warning"
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/usuarios/registrarUsuario", {
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        contrasena: password,
        diasPresenciales,
      });

      if (response.status === 200 || response.status === 201) {
        Swal.fire(
          "Registro exitoso",
          "Tu cuenta fue creada correctamente. Ahora podés iniciar sesión.",
          "success"
        ).then(() => navigate("/login"));
      }
    } catch (error) {
      console.error("Error al registrar:", error);

      // Mostrar errores de validación del backend si existen
      if (
        error.response?.status === 400 &&
        Array.isArray(error.response.data)
      ) {
        Swal.fire(
          "Errores de validación",
          error.response.data.join("<br/>"),
          "error"
        );
      } else if (error.response?.status === 409) {
        Swal.fire("Error", "Este correo ya está registrado.", "error");
      } else {
        Swal.fire("Error", "No se pudo completar el registro.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4"
      style={{
        background:
          "radial-gradient(circle at center, #161616 0%, #0a0a0a 100%)",
      }}
    >
      <form
        onSubmit={handleRegister}
        className="bg-[#161616] p-10 rounded-xl shadow-[0_0_50px_rgba(200,153,126,0.15)] w-full max-w-md text-white border border-white/5 backdrop-blur-sm"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold mb-1">
            PEDI<span className="text-[#C8997E]">2</span>T
          </h2>
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            Crear Cuenta
          </p>
        </div>

        {/* Campos del formulario */}
        {[
          { label: "Nombre", value: nombre, setValue: setNombre },
          { label: "Apellido", value: apellido, setValue: setApellido },
          { label: "Email", type: "email", value: email, setValue: setEmail },
          { label: "Teléfono", value: telefono, setValue: setTelefono },
          { label: "Dirección", value: direccion, setValue: setDireccion },
        ].map((field, i) => (
          <div key={i} className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              value={field.value}
              onChange={(e) => field.setValue(e.target.value)}
              required
              className="w-full p-3 bg-[#1f1f1f] border-b border-gray-700 rounded-md focus:ring-0 focus:border-[#C8997E] transition duration-300 placeholder-gray-500"
            />
          </div>
        ))}

        {/* Contraseñas */}
        {[
          { label: "Contraseña", value: password, setValue: setPassword },
          {
            label: "Confirmar Contraseña",
            value: confirmPassword,
            setValue: setConfirmPassword,
          },
        ].map((field, i) => (
          <div key={i} className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              {field.label}
            </label>
            <input
              type="password"
              value={field.value}
              onChange={(e) => field.setValue(e.target.value)}
              required
              className="w-full p-3 bg-[#1f1f1f] border-b border-gray-700 rounded-md focus:ring-0 focus:border-[#C8997E] transition duration-300 placeholder-gray-500"
            />
          </div>
        ))}

        {/* Días presenciales */}
        <div className="mb-6">
          <label className="block mb-3 text-sm font-medium text-gray-300">
            Días Presenciales
          </label>
          <div className="grid grid-cols-2 gap-3">
            {diasSemana.map((dia) => (
              <label
                key={dia.value}
                className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition ${
                  diasPresenciales.includes(dia.value)
                    ? "bg-green-600 text-white border border-green-500"
                    : "bg-[#1f1f1f] text-gray-300 border border-gray-700 hover:bg-[#2a2a2a]"
                }`}
              >
                <span>{dia.label}</span>
                <input
                  type="checkbox"
                  checked={diasPresenciales.includes(dia.value)}
                  onChange={() => handleCheckboxChange(dia.value)}
                  className="accent-green-500 cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-3 rounded-lg font-bold text-black shadow-lg transition duration-300 ease-in-out ${
            isLoading
              ? "bg-gray-600 cursor-not-allowed opacity-70"
              : "bg-linear-to-r from-[#C8997E] to-[#8A5A4A] hover:from-[#E3B091] hover:to-[#A37363]"
          }`}
        >
          {isLoading ? "Registrando..." : "Registrarse"}
        </button>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm text-gray-500 hover:text-gray-300 transition duration-200"
          >
            ¿Ya tienes cuenta? Inicia Sesión
          </button>
        </div>
      </form>
    </div>
  );
}

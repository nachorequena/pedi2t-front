import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios"; // ← tu archivo axios.js

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Si ya hay una sesión activa, redirigir automáticamente al Home
  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActual"));
    if (usuarioActivo) navigate("/");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire("Error", "Por favor completá todos los campos.", "warning");
      return;
    }

    setIsLoading(true);

    try {
      //  Enviar datos al backend
      const response = await api.post("/usuarios/login", {
        email,
        contrasena: password,
      });

      if (response.status === 200 && response.data) {
        const usuario = response.data;

        // Guardar usuario en localStorage (sesión activa)
        localStorage.setItem("usuarioActual", JSON.stringify(usuario));

        Swal.fire({
          icon: "success",
          title: "Bienvenido",
          text: `Hola ${usuario.nombre} ${usuario.apellido}, ingresaste correctamente.`,
          confirmButtonColor: "#16a34a",
        }).then(() => navigate("/"));
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Credenciales inválidas.",
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (error) {
      console.error("Error en login:", error);

      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text:
          error.response?.status === 401
            ? "Email o contraseña incorrectos."
            : "No se pudo conectar con el servidor.",
        confirmButtonColor: "#dc2626",
      });
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
        onSubmit={handleLogin}
        className="bg-[#161616] p-10 rounded-xl shadow-[0_0_50px_rgba(200,153,126,0.15)] w-full max-w-sm text-white border border-white/5 backdrop-blur-sm"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold mb-1">
            PEDI<span className="text-[#C8997E]">2</span>T
          </h2>
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            Iniciar Sesión
          </p>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="usuario@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 bg-[#1f1f1f] border-b border-gray-700 rounded-md focus:ring-0 focus:border-[#C8997E] transition duration-300 placeholder-gray-500"
          />
        </div>

        {/* Contraseña */}
        <div className="mb-8">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 bg-[#1f1f1f] border-b border-gray-700 rounded-md focus:ring-0 focus:border-[#C8997E] transition duration-300 placeholder-gray-500"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-3 rounded-lg font-bold shadow-lg text-black transition duration-300 ease-in-out transform ${
            isLoading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-linear-to-r from-[#C8997E] to-[#8A5A4A] hover:from-[#E3B091] hover:to-[#A37363] hover:scale-[1.02] active:scale-100"
          }`}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-black mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Ingresar"
          )}
        </button>

        {/* Link al registro */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/registro")}
            className="text-sm text-gray-500 hover:text-gray-300 transition duration-200"
          >
            ¿No tienes cuenta? Registrate
          </button>
        </div>
      </form>
    </div>
  );
}

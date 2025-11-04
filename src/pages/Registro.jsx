import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Registro() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

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

    setIsLoading(true);

    try {
      // Cargar usuarios existentes
      const existingUsers = JSON.parse(localStorage.getItem("usuarios")) || [];

      // Verificar si el email ya existe
      const emailExists = existingUsers.some(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );
      if (emailExists) {
        Swal.fire("Error", "Este correo ya está registrado.", "error");
        setIsLoading(false);
        return;
      }

      // Crear el nuevo usuario
      const newUser = {
        id: Date.now(),
        username,
        email,
        password, //  (en producción nunca se guarda plano)
      };

      // Guardar usuario
      existingUsers.push(newUser);
      localStorage.setItem("usuarios", JSON.stringify(existingUsers));

      Swal.fire(
        "Registro exitoso",
        "Tu cuenta fue creada correctamente. Ahora podés iniciar sesión.",
        "success"
      );

      navigate("/login");
    } catch (error) {
      Swal.fire(
        "Error de Registro",
        "Ocurrió un error al intentar registrar tu cuenta.",
        "error"
      );
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
        className="bg-[#161616] p-10 rounded-xl shadow-[0_0_50px_rgba(200,153,126,0.15)] w-full max-w-sm text-white border border-white/5 backdrop-blur-sm"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold mb-1">
            PEDI<span className="text-[#C8997E]">2</span>T
          </h2>
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            Crear Cuenta
          </p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            type="email"
            placeholder="usuario@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 bg-[#1f1f1f] border-b border-gray-700 rounded-md focus:ring-0 focus:border-[#C8997E] focus:outline-none transition duration-300 placeholder-gray-500"
          />
        </div>

        {/* nombre de usuario */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Nombre de Usuario
          </label>
          <input
            type="text"
            placeholder="Nombre"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 bg-[#1f1f1f] border-b border-gray-700 rounded-md focus:ring-0 focus:border-[#C8997E] focus:outline-none transition duration-300 placeholder-gray-500"
          />
        </div>

        {/* contraseña */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Contraseña
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 bg-[#1f1f1f] border-b border-gray-700 rounded-md focus:ring-0 focus:border-[#C8997E] focus:outline-none transition duration-300 placeholder-gray-500"
          />
        </div>

        {/* repetir contraseña */}
        <div className="mb-8">
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 bg-[#1f1f1f] border-b border-gray-700 rounded-md focus:ring-0 focus:border-[#C8997E] focus:outline-none transition duration-300 placeholder-gray-500"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={isLoading || password !== confirmPassword}
          className={`w-full p-3 rounded-lg font-bold text-black shadow-lg transition duration-300 ease-in-out ${
            isLoading || password !== confirmPassword
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

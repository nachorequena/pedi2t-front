import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mockUseNavigate = () => (path) => console.log(`Navigating to: ${path}`);
const mockSwal = {
  fire: (title, text, icon) =>
    console.log(`SWAL: ${icon.toUpperCase()} - ${title}: ${text}`),
};

const mockSignUp = async (auth, email, password, username) => {
  return new Promise((resolve, reject) => {
    console.log(`Attempting registration for: ${email} (User: ${username})`);

    if (password.length >= 6) {
      setTimeout(
        () =>
          resolve({
            user: { uid: "mock-user-456", email, displayName: username },
          }),
        1000
      );
    } else {
      // Simular un error en el registro (ej: contraseña débil)
      setTimeout(() => reject(new Error("auth/weak-password")), 1000);
    }
  });
};

// Componente principal de registro
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
      mockSwal.fire("Error", "Las contraseñas no coinciden.", "warning");
      return;
    }

    // Validación básica de longitud
    if (password.length < 6) {
      mockSwal.fire(
        "Error",
        "La contraseña debe tener al menos 6 caracteres.",
        "warning"
      );
      return;
    }

    setIsLoading(true);

    try {
      // Usamos la simulación de la función de Firebase
      await mockSignUp(null, email, password, username);

      mockSwal.fire(
        "¡Bienvenido!",
        "Tu cuenta ha sido creada exitosamente.",
        "success"
      );
      navigate("/login"); // Navegar al login después del registro exitoso
    } catch (error) {
      console.error("Error al registrarse:", error.message);
      let errorMessage = "Ocurrió un error al intentar registrar la cuenta.";
      if (error.message.includes("auth/email-already-in-use")) {
        errorMessage = "Este email ya está en uso.";
      } else if (error.message.includes("auth/weak-password")) {
        errorMessage = "La contraseña es muy débil. Debe ser más segura.";
      }

      mockSwal.fire("Error de Registro", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4"
      // Gradiente radial para un look más premium y profundo
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
          {/* Título y subtítulo con enfoque minimalista */}
          <h2 className="text-4xl font-extrabold mb-1">
            PEDI<span className="text-[#C8997E]">2</span>T
          </h2>
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            Crear Cuenta
          </p>
        </div>

        {/* Input Email */}
        <div className="mb-4">
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
            className="w-full p-3 bg-[#1f1f1f] border-b border-gray-700 rounded-md focus:ring-0 focus:border-[#C8997E] focus:outline-none transition duration-300 placeholder-gray-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            Nombre de Usuario
          </label>
          <input
            type="text"
            id="username"
            placeholder="Nombre"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 bg-[#1f1f1f] border-b border-gray-700 rounded-md focus:ring-0 focus:border-[#C8997E] focus:outline-none transition duration-300 placeholder-gray-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            Contraseña (mín. 6 caracteres)
          </label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 bg-[#1f1f1f] border-b border-gray-700 rounded-md focus:ring-0 focus:border-[#C8997E] focus:outline-none transition duration-300 placeholder-gray-500"
          />
        </div>

        <div className="mb-8">
          <label
            htmlFor="confirmPassword"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            Confirmar Contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 bg-[#1f1f1f] border-b border-gray-700 rounded-md focus:ring-0 focus:border-[#C8997E] focus:outline-none transition duration-300 placeholder-gray-500"
          />
          {password && confirmPassword && password !== confirmPassword && (
            <p className="mt-2 text-sm text-red-400">
              Las contraseñas no coinciden.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={
            isLoading ||
            (password !== confirmPassword && confirmPassword !== "")
          }
          className={`
            w-full p-3 rounded-lg font-bold shadow-lg text-black
            transition duration-300 ease-in-out transform
            ${
              isLoading ||
              (password !== confirmPassword && confirmPassword !== "")
                ? "bg-gray-600 cursor-not-allowed opacity-70"
                : "bg-linear-to-r from-[#C8997E] to-[#8A5A4A] hover:from-[#E3B091] hover:to-[#A37363] hover:scale-[1.02] active:scale-100"
            }
          `}
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
            "Registrarse"
          )}
        </button>

        {/* Enlace para volver al Login */}
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

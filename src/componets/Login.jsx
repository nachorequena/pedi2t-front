import { useState } from "react";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Swal.fire("Error", "Credenciales inválidas", "error");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4 bg-[radial-gradient(circle_at_center,#161616_0%,#0a0a0a_100%)]"
      // Gradiente radial para un look más premium y profundo
    >
      <form
        onSubmit={handleLogin}
        className="bg-[#161616] p-10 rounded-xl shadow-[0_0_50px_rgba(200,153,126,0.15)] w-full max-w-sm text-white border border-white/5 backdrop-blur-sm"
      >
        <div className="text-center mb-8">
          {/* Título y subtítulo con enfoque minimalista */}
          <h2 className="text-4xl font-extrabold mb-1">
            PEDI<span className="text-[#C8997E]">2</span>T
          </h2>
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            Iniciar Sesión
          </p>
        </div>

        {/* Input Usuario */}
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
            className="w-full p-3 bg-[#1f1f1f] border-b border-gray-700 rounded-md focus:ring-0 focus:border-[#C8997E] focus:outline-none transition duration-300 placeholder-gray-500"
          />
        </div>

        {/* Input Contraseña */}
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 bg-[#1f1f1f] border-b border-gray-700 rounded-md focus:ring-0 focus:border-[#C8997E] focus:outline-none transition duration-300 placeholder-gray-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full p-3 rounded-lg font-bold shadow-lg text-black
            transition duration-300 ease-in-out transform
            ${
              isLoading
                ? "bg-gray-600 cursor-not-allowed"
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
            "Ingresar"
          )}
        </button>
      </form>
    </div>
  );
}

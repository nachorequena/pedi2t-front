import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">404</h1>
        <p className="text-gray-600 mb-6">La página que buscas no existe.</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Volver
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-[#C8997E] text-white rounded-md hover:bg-[#a77c67]"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
}

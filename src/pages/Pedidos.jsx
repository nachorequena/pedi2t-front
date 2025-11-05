import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Pedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [nota, setNota] = useState("");
  const [pedidoEnviado, setPedidoEnviado] = useState(false);

  //  Cargar pedidos y nota guardados en localStorage
  useEffect(() => {
    const pedidoGuardado =
      JSON.parse(localStorage.getItem("pedidoSeleccionado")) || [];
    const notaGuardada = localStorage.getItem("notaPedido") || "";
    const enviado = localStorage.getItem("pedidoEnviado") === "true";

    setPedidos(pedidoGuardado.filter((p) => p.menu !== null));
    setNota(notaGuardada);
    setPedidoEnviado(enviado);
  }, []);

  //  Cancelar pedido (solo si no fue enviado)
  const handleCancelar = () => {
    Swal.fire({
      icon: "warning",
      title: "¿Cancelar pedido?",
      text: "Tu pedido actual se eliminará.",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
      confirmButtonColor: "#dc2626",
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.removeItem("pedidoSeleccionado");
        localStorage.removeItem("notaPedido");
        localStorage.removeItem("pedidoEnviado");

        Swal.fire({
          icon: "info",
          title: "Pedido cancelado",
          text: "Podés generar un nuevo pedido desde el menú.",
          confirmButtonColor: "#3b82f6",
        }).then(() => navigate("/"));
      }
    });
  };

  //  Enviar pedido (marca el pedido como finalizado)
  const handleEnviar = () => {
    if (pedidos.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin pedido",
        text: "No hay ningún pedido para enviar.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    localStorage.setItem("notaPedido", nota);
    localStorage.setItem("pedidoEnviado", "true"); //  marcar como enviado
    setPedidoEnviado(true);

    Swal.fire({
      icon: "success",
      title: "Pedido enviado",
      html: `
        <p>Tu pedido fue registrado con éxito.</p>
        <p><b>Nota:</b> ${nota || "Sin nota"}</p>
      `,
      confirmButtonColor: "#16a34a",
    });
  };

  //  Guardar nota si el pedido ya fue enviado (actualiza localStorage automáticamente)
  const handleActualizarNota = () => {
    localStorage.setItem("notaPedido", nota);
    Swal.fire({
      icon: "success",
      title: "Nota actualizada",
      text: "Tu nota fue guardada correctamente.",
      confirmButtonColor: "#16a34a",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  if (pedidos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen  text-center px-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          No hay pedidos registrados
        </h2>
        <p className="text-gray-700 mb-6 max-w-md">
          No realizaste ningún pedido esta semana. Volvé al menú para
          seleccionar tus comidas presenciales.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
        >
          Ir al menú
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
        {pedidoEnviado ? "Pedido Enviado" : "Detalle del Pedido"}
      </h1>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <ul className="space-y-3 mb-6">
          {pedidos.map((p) => (
            <li
              key={p.dia}
              className="border border-gray-300 rounded-lg p-3 flex justify-between"
            >
              <span className="font-semibold text-gray-800">{p.dia}</span>
              <span className="text-gray-600">{p.menu}</span>
            </li>
          ))}
        </ul>

        {/* Área de nota */}
        <textarea
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          placeholder={
            pedidoEnviado
              ? "Podés agregar o editar tu nota..."
              : "Deja una nota (opcional)"
          }
          disabled={!pedidoEnviado ? false : false} // editable incluso luego de enviado
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          rows="3"
        />

        <div className="flex justify-between">
          {!pedidoEnviado ? (
            <>
              <button
                onClick={() => navigate("/")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Editar pedido
              </button>

              <button
                onClick={handleCancelar}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Cancelar pedido
              </button>

              <button
                onClick={handleEnviar}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Enviar pedido
              </button>
            </>
          ) : (
            <div className="flex justify-end w-full">
              <button
                onClick={handleActualizarNota}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
              >
                Guardar nota
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Filter } from "lucide-react";
import AdminDayCard from "../componets/AdminDayCard";
import MenuModal from "../componets/MenuModal";
import Swal from "sweetalert2";

export default function HomeAdmin() {
  const [selectedDay, setSelectedDay] = useState("Lunes");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayForModal, setSelectedDayForModal] = useState("");
  const [editingMenu, setEditingMenu] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  
  // Estado para almacenar los menús por día
  const [menusPorDia, setMenusPorDia] = useState({
    Lunes: [],
    Martes: [],
    Miércoles: [],
    Jueves: [],
    Viernes: [],
  });

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  const handleAddMenu = (dia) => {
    setSelectedDayForModal(dia);
    setEditingMenu(null);
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleEditMenu = (dia, index, menu) => {
    setSelectedDayForModal(dia);
    setEditingMenu(menu);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDeleteMenu = (dia, index) => {
    Swal.fire({
      icon: "warning",
      title: "¿Eliminar menú?",
      text: "Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        setMenusPorDia((prev) => ({
          ...prev,
          [dia]: prev[dia].filter((_, i) => i !== index),
        }));

        Swal.fire({
          icon: "success",
          title: "¡Menú eliminado!",
          text: "El menú ha sido eliminado correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleSaveMenu = (dia, formData) => {
    // Crear URL temporal para preview de la imagen
    const imagenUrl = formData.imagen 
      ? (typeof formData.imagen === 'string' ? formData.imagen : URL.createObjectURL(formData.imagen))
      : null;

    const menuData = {
      categoria: formData.categoria,
      nombre: formData.menu,
      descripcion: formData.descripcion,
      imagenUrl: imagenUrl,
      imagen: formData.imagen,
    };

    if (editingIndex !== null) {
      // Editar menú existente
      setMenusPorDia((prev) => ({
        ...prev,
        [dia]: prev[dia].map((menu, index) => 
          index === editingIndex ? menuData : menu
        ),
      }));

      Swal.fire({
        icon: "success",
        title: "¡Menú actualizado!",
        text: `Se actualizó el menú para ${dia}`,
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      // Agregar nuevo menú
      setMenusPorDia((prev) => ({
        ...prev,
        [dia]: [...prev[dia], menuData],
      }));

      Swal.fire({
        icon: "success",
        title: "¡Menú agregado!",
        text: `Se agregó el menú para ${dia}`,
        timer: 2000,
        showConfirmButton: false,
      });
    }

    console.log("Menú guardado:", { dia, ...menuData });
    // Aquí puedes hacer la llamada a la API para guardar en el backend
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Menú Semanal</h1>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Filter size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Tabs de días */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {dias.map((dia) => (
              <button
                key={dia}
                onClick={() => setSelectedDay(dia)}
                className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                  selectedDay === dia
                    ? "bg-black text-white shadow-lg"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {dia}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-4 py-6">
        {dias.map((dia) => (
          <div
            key={dia}
            className={dia === selectedDay ? "block" : "hidden"}
          >
            <AdminDayCard
              dia={dia}
              menus={menusPorDia[dia]}
              onAddMenu={handleAddMenu}
              onEditMenu={handleEditMenu}
              onDeleteMenu={handleDeleteMenu}
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      <MenuModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMenu(null);
          setEditingIndex(null);
        }}
        selectedDay={selectedDayForModal}
        onSave={handleSaveMenu}
        editData={editingMenu}
      />
    </div>
  );
}

import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import AdminDayCard from "../componets/AdminDayCard";
import MenuModal from "../componets/MenuModal";
import Swal from "sweetalert2";
import axios from "../api/axios";
import { LoadingSpinner } from "../componets/LoadingSpinner";

export default function HomeAdmin() {
  const [selectedDay, setSelectedDay] = useState("Lunes");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayForModal, setSelectedDayForModal] = useState("");
  const [editingMenu, setEditingMenu] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estado para almacenar los menús por día
  const [menusPorDia, setMenusPorDia] = useState({
    Lunes: [],
    Martes: [],
    Miércoles: [],
    Jueves: [],
    Viernes: [],
  });

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  // Cargar menús al montar el componente
  useEffect(() => {
    fetchPlatos();
  }, []);

  const fetchPlatos = async () => {
    setLoading(true);
    try {
      const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
      
      if (!usuario || !usuario.id) {
        Swal.fire({
          icon: "error",
          title: "Usuario no encontrado",
          text: "No se encontró información del usuario.",
          confirmButtonColor: "#dc2626",
        });
        setLoading(false);
        return;
      }

      // GET /admin/home/{usuarioId}
      const response = await axios.get(`/admin/home/${usuario.id}`);
      
      console.log("=== DEBUG: Response completo ===", response.data);
      console.log("=== DEBUG: Menus array ===", response.data.menus);

      // Organizar los platos por día
      const platosOrganizados = {
        Lunes: [],
        Martes: [],
        Miércoles: [],
        Jueves: [],
        Viernes: [],
      };

      // El backend devuelve { usuarioId, menus: [...] }
      const menus = response.data.menus || [];
      
      console.log("=== DEBUG: Total menus recibidos ===", menus.length);
      
      menus.forEach((menu, index) => {
        console.log(`=== DEBUG: Menu ${index} ===`, menu);
        
        // Extraer el día de "Menú del lunes" -> "Lunes"
        let diaOriginal = menu.descripcion;
        
        // Si viene como "Menú del lunes", "Menú del martes", etc.
        if (menu.descripcion.includes("del ")) {
          diaOriginal = menu.descripcion.split("del ")[1].trim(); // "lunes", "miércoles"
        }
        
        // Normalizar y capitalizar
        diaOriginal = diaOriginal.toLowerCase();
        
        // Mapear a las claves correctas con acentos
        const mapasDias = {
          'lunes': 'Lunes',
          'martes': 'Martes',
          'miercoles': 'Miércoles',
          'miércoles': 'Miércoles',
          'jueves': 'Jueves',
          'viernes': 'Viernes'
        };
        
        const diaCapitalizado = mapasDias[diaOriginal] || diaOriginal.charAt(0).toUpperCase() + diaOriginal.slice(1);
        
        console.log(`=== DEBUG: Día procesado: ${menu.descripcion} -> ${diaOriginal} -> ${diaCapitalizado}`);
        
        if (platosOrganizados[diaCapitalizado]) {
          menu.platos.forEach((plato, pIndex) => {
            console.log(`=== DEBUG: Plato ${pIndex} del ${diaCapitalizado} ===`, plato);
            console.log(`=== DEBUG: URL de imagen ===`, plato.imagenUrl);
            
            platosOrganizados[diaCapitalizado].push({
              id: plato.idPlato,
              menuPlatoId: plato.menuPlatoId || plato.idMenuPlato, // ID de la relación menu_platos
              imagenUrl: plato.imagenUrl || "/placeholder.jpg",
              nombre: plato.nombre,
              categoria: plato.categoria,
              descripcion: plato.descripcion,
              publicado: plato.publicado !== false // Por defecto true si no viene
            });
          });
        } else {
          console.warn(`=== WARN: Día no reconocido: ${diaCapitalizado}`);
        }
      });

      console.log("=== DEBUG: Platos organizados ===", platosOrganizados);
      setMenusPorDia(platosOrganizados);
    } catch (error) {
      console.error("Error al cargar platos:", error);
      Swal.fire({
        icon: "error",
        title: "Error al cargar menús",
        text: "No se pudieron cargar los menús. Intenta nuevamente.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleTogglePublicado = async (dia, menu) => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    
    if (!usuario || !usuario.id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró información del usuario.",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    if (!menu.menuPlatoId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró el ID del menú-plato.",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    const accion = menu.publicado ? "despublicar" : "republicar";
    const endpoint = menu.publicado 
      ? `/admin/despublicarPlato/${usuario.id}/${menu.menuPlatoId}`
      : `/admin/republicarPlato/${usuario.id}/${menu.menuPlatoId}`;

    try {
      await axios.put(endpoint);

      Swal.fire({
        icon: "success",
        title: `¡Plato ${menu.publicado ? 'despublicado' : 'publicado'}!`,
        text: `El plato ha sido ${menu.publicado ? 'despublicado' : 'publicado'} correctamente.`,
        timer: 1500,
        showConfirmButton: false,
      });

      // Recargar platos para reflejar el cambio
      fetchPlatos();
    } catch (error) {
      console.error(`Error al ${accion} plato:`, error);
      
      Swal.fire({
        icon: "error",
        title: `Error al ${accion}`,
        text: error.response?.data || `No se pudo ${accion} el plato.`,
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const handleDeleteMenu = async (dia, index) => {
    const menuId = menusPorDia[dia][index].id;
    
    Swal.fire({
      icon: "warning",
      title: "¿Eliminar menú?",
      text: "Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // DELETE /admin/eliminarPlato/{id}
          await axios.delete(`/admin/eliminarPlato/${menuId}`);
          
          Swal.fire({
            icon: "success",
            title: "¡Menú eliminado!",
            text: "El menú ha sido eliminado correctamente.",
            timer: 2000,
            showConfirmButton: false,
          });

          // Recargar platos
          fetchPlatos();
        } catch (error) {
          console.error("Error al eliminar el menú:", error);
          
          let errorMessage = "No se pudo eliminar el menú.";
          
          // Verificar si es un error de constraint de BD
          if (error.response?.status === 409 || 
              error.response?.data?.includes("constraint") ||
              error.response?.data?.includes("foreign key")) {
            errorMessage = "No se puede eliminar este plato porque está asociado a pedidos o menús existentes.";
          } else if (error.response?.status === 404) {
            errorMessage = "El endpoint de eliminación no fue encontrado. Verifica la ruta en el backend.";
          } else if (error.response?.data) {
            errorMessage = typeof error.response.data === 'string' 
              ? error.response.data 
              : error.response.data.message || errorMessage;
          }
          
          Swal.fire({
            icon: "error",
            title: "Error al eliminar",
            text: errorMessage,
            confirmButtonColor: "#dc2626",
          });
        }
      }
    });
  };

  const handleSaveMenu = async (diasSeleccionados, formData) => {
    try {
      // Preparar FormData para enviar al backend
      const formDataToSend = new FormData();
      
      // Crear el objeto DTO del plato como JSON
      const platoDTO = {
        nombre: formData.menu,
        descripcion: formData.descripcion,
        categoria: formData.categoria,
        diasSemana: diasSeleccionados.map(dia => dia.toUpperCase()) // Convertir a mayúsculas
      };
      
      console.log("Datos a enviar:", platoDTO);
      console.log("FormData completo:", formData);
      
      // Agregar el DTO como Blob JSON
      formDataToSend.append("plato", new Blob([JSON.stringify(platoDTO)], {
        type: "application/json"
      }));
      
      // Agregar la imagen
      if (formData.imagen && typeof formData.imagen !== 'string') {
        formDataToSend.append("imagen", formData.imagen);
        console.log("Imagen agregada:", formData.imagen.name);
      } else {
        console.log("No se agregó imagen");
      }

      let response;
      
      if (editingIndex !== null) {
        // Editar menú existente
        const menuId = menusPorDia[selectedDayForModal][editingIndex].id;
        response = await axios.put(`/admin/actualizarPlato/${menuId}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Actualizar el estado local - remover de día actual y agregar a los días seleccionados
        setMenusPorDia((prev) => {
          const newState = { ...prev };
          
          // Remover del día actual
          newState[selectedDayForModal] = prev[selectedDayForModal].filter((_, i) => i !== editingIndex);
          
          // Agregar a los días seleccionados
          diasSeleccionados.forEach(dia => {
            const existe = newState[dia].find(m => m.id === response.data.id);
            if (!existe) {
              newState[dia] = [...newState[dia], response.data];
            }
          });
          
          return newState;
        });

        // Recargar platos después de actualizar
        fetchPlatos();

        Swal.fire({
          icon: "success",
          title: "¡Menú actualizado!",
          text: `Se actualizó el menú para ${diasSeleccionados.join(", ")}`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        // Agregar nuevo menú
        response = await axios.post("/admin/cargarPlatos", formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Agregar el nuevo menú a todos los días seleccionados
        setMenusPorDia((prev) => {
          const newState = { ...prev };
          diasSeleccionados.forEach(dia => {
            newState[dia] = [...prev[dia], response.data];
          });
          return newState;
        });

        // Recargar platos después de agregar
        fetchPlatos();

        Swal.fire({
          icon: "success",
          title: "¡Menú agregado!",
          text: `Se agregó el menú para ${diasSeleccionados.join(", ")}`,
          timer: 2000,
          showConfirmButton: false,
        });
      }

      console.log("Menú guardado exitosamente:", response.data);
      
    } catch (error) {
      console.error("Error completo:", error);
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
      
      let errorMessage = "No se pudo guardar el menú. Intenta nuevamente.";
      
      if (error.response?.data) {
        // Si el backend devuelve un string directo
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } 
        // Si el backend devuelve un objeto con mensaje
        else if (error.response.data.mensaje) {
          errorMessage = error.response.data.mensaje;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: errorMessage,
        confirmButtonColor: "#dc2626",
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

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
              onTogglePublicado={handleTogglePublicado}
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

import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

export default function MenuModal({ isOpen, onClose, selectedDay, onSave, editData = null }) {
  const [formData, setFormData] = useState({
    categoria: "",
    menu: "",
    descripcion: "",
    imagen: null,
    diasSemana: selectedDay ? [selectedDay] : [], // Días seleccionados
  });

  const [previewImage, setPreviewImage] = useState(null);
  
  const diasDisponibles = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  // Cargar datos cuando se está editando
  useEffect(() => {
    if (editData) {
      setFormData({
        categoria: editData.categoria || "",
        menu: editData.nombre || "",
        descripcion: editData.descripcion || "",
        imagen: editData.imagen || null,
        diasSemana: selectedDay ? [selectedDay] : [],
      });
      setPreviewImage(editData.imagenUrl || null);
    } else if (selectedDay) {
      setFormData(prev => ({
        ...prev,
        diasSemana: [selectedDay]
      }));
    }
  }, [editData, selectedDay]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleDayToggle = (dia) => {
    setFormData((prev) => {
      const diasActuales = prev.diasSemana;
      if (diasActuales.includes(dia)) {
        // Remover día
        return {
          ...prev,
          diasSemana: diasActuales.filter(d => d !== dia)
        };
      } else {
        // Agregar día
        return {
          ...prev,
          diasSemana: [...diasActuales, dia]
        };
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imagen: file,
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que se haya seleccionado al menos un día
    if (formData.diasSemana.length === 0) {
      alert("Debes seleccionar al menos un día de la semana");
      return;
    }
    
    onSave(formData.diasSemana, formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      categoria: "",
      menu: "",
      descripcion: "",
      imagen: null,
      diasSemana: [],
    });
    setPreviewImage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {editData ? "Editar" : "Cargar"} Menú
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Preview de imagen */}
          <div className="relative">
            <div className="h-40 w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-2">📷</div>
                  <p className="text-sm">Cargar imagen del menú</p>
                </div>
              )}
            </div>
            
            <label className="absolute bottom-4 right-4 bg-black hover:bg-gray-800 text-white p-3 rounded-full cursor-pointer shadow-lg transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </label>
          </div>

          {/* Campo Categoría */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-sm font-medium text-gray-700">
              <span>Categoría</span>
              <Check size={18} className="text-green-600" />
            </label>
            <input
              type="text"
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              required
              placeholder="Ej: Vegetariano, Minuta, Pasta..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Campo Menú */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-sm font-medium text-gray-700">
              <span>Menú</span>
              <Check size={18} className="text-green-600" />
            </label>
            <input
              type="text"
              name="menu"
              value={formData.menu}
              onChange={handleInputChange}
              required
              placeholder="Ej: Pasta con verduras"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Campo Descripción */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-sm font-medium text-gray-700">
              <span>Descripción</span>
              <Check size={18} className="text-green-600" />
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="Describe el menú..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none transition-all"
            />
          </div>

          {/* Selección de días */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Días de la semana *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {diasDisponibles.map((dia) => (
                <button
                  key={dia}
                  type="button"
                  onClick={() => handleDayToggle(dia)}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                    formData.diasSemana.includes(dia)
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300 hover:border-black"
                  }`}
                >
                  {dia}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Seleccionados: {formData.diasSemana.length > 0 ? formData.diasSemana.join(", ") : "Ninguno"}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-xl font-medium transition-colors shadow-lg"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

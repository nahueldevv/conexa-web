import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  X,
  UploadCloud,
  ChevronDown,
  Hash,
  FileText,
  Image as ImageIcon,
} from "lucide-react"
import { useCommunityHome } from "../../hooks/useCommunityHome"
import { useCommunityActions } from "../../hooks/useCommunityActions" // Asumiendo que creaste este hook o lo tienes inline
// Si no tienes el hook de acciones separado, importamos el servicio directo:
import { createPost } from "../../services/community.service"

const CreatePostPage = () => {
  const navigate = useNavigate()

  // 1. Obtener lista de foros para el selector
  const { forums } = useCommunityHome()

  // 2. Estado del Formulario
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    topicId: "", // ID del foro seleccionado
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Seleccionar el primer foro por defecto cuando carguen
  useEffect(() => {
    if (forums && forums.length > 0 && !formData.topicId) {
      setFormData((prev) => ({ ...prev, topicId: forums[0].id }))
    }
  }, [forums])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.topicId
    ) {
      setError("Por favor completa todos los campos.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Llamada al servicio
      const newPost = await createPost(formData)
      // Redirigir al detalle del nuevo post o al feed
      navigate(`/community/post/${newPost.id || newPost.post?.id}`)
    } catch (err) {
      console.error("Error creating post:", err)
      setError("Hubo un error al crear la publicación.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] font-display transition-colors flex flex-col">
      {/* HEADER SIMPLE */}
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#111] border-b border-gray-200 dark:border-white/10 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-black font-black text-lg">
            C
          </div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Nueva Publicación
          </h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </header>

      <main className="flex-1 flex justify-center py-12 px-4">
        <div className="w-full max-w-3xl flex flex-col gap-8">
          {/* TÍTULO DE SECCIÓN */}
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Crear Nueva Publicación
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Comparte tus ideas, dudas o noticias con la comunidad logística.
            </p>
          </div>

          {/* FORMULARIO CARD */}
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
            {/* 1. SELECTOR DE FORO */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Selecciona un Foro
              </label>
              <div className="relative">
                <select
                  name="topicId"
                  value={formData.topicId}
                  onChange={handleChange}
                  className="w-full appearance-none bg-gray-50 dark:bg-[#191919] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled>
                    Selecciona un tema...
                  </option>
                  {forums.map((forum) => (
                    <option key={forum.id} value={forum.id}>
                      {forum.title}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            {/* 2. TÍTULO */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Título del Post
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Escribe un título claro y conciso..."
                className="w-full bg-gray-50 dark:bg-[#191919] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* 3. CONTENIDO */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Contenido
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={8}
                placeholder="Desarrolla tu idea aquí..."
                className="w-full bg-gray-50 dark:bg-[#191919] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 resize-y min-h-[150px]"
              />
              <div className="flex justify-end px-1">
                <span
                  className={`text-xs ${
                    formData.content.length > 2000
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {formData.content.length}/2000
                </span>
              </div>
            </div>

            {/* 4. ADJUNTOS (Visual Only por ahora) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Adjuntar Imagen (Opcional)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-[#191919] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group">
                <div className="w-12 h-12 bg-white dark:bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud
                    className="text-gray-400 group-hover:text-amber-500"
                    size={24}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  <span className="text-amber-600 dark:text-amber-500 hover:underline">
                    Haz clic para subir
                  </span>{" "}
                  o arrastra y suelta
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG hasta 5MB</p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-2">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white dark:text-black bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                  Publicando...
                </>
              ) : (
                "Publicar Post"
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CreatePostPage

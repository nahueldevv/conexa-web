import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useCommunityActions } from "../../hooks/useCommunityActions"
import { useAuth } from "../../context/AuthContext"

const CreatePostForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const forums = location.state?.forums || []
  const activeForum = location.state?.activeForum || "general"

  const { submitPost, isSubmitting, error } = useCommunityActions()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [topicId, setTopicId] = useState(
    activeForum === "general" ? "" : activeForum
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    const payload = {
      title,
      content,
      userId: user?.id
    }

    if (topicId && topicId !== "") {
      payload.topicId = topicId
    }

    try {
      await submitPost(payload)
      navigate("/community")
    } catch (e) {
      console.error("Error creando el post:", e)
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-10 flex justify-center">
      <div className="w-full max-w-xl bg-[#111] border border-white/5 rounded-2xl p-8 shadow-xl">

        <h1 className="text-3xl font-extrabold text-white mb-8">
          Crear Nuevo Post
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-7">

          {/* --- TÍTULO --- */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Título
            </label>
            <input
              className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-3 text-white placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Escribe un título... (mínimo 10 caracteres)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* --- CONTENIDO --- */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Contenido
            </label>
            <textarea
              className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-3 h-40 resize-none text-white placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Describe tu post... (mínimo 10 caracteres)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* --- SELECTOR DE FORO --- */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Publicar en
            </label>

            <select
              className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-3 text-white 
                         focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
            >
              <option value="">General</option>
              <option value="">Impacto Económico</option>
              <option value="">Sostenibilidad y Medio Ambiente</option>
              <option value="">Innovación Tecnológica en Logística</option>
              <option value="">Oportunidades Laborales</option>

              {forums.map((forum) => (
                <option key={forum.id} value={forum.id}>
                  {forum.title}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-red-400 text-sm font-semibold">
              Error: {error.message || "No se pudo publicar"}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 rounded-lg bg-[#FFA200] hover:bg-[#ff8c00] text-black font-bold
                       shadow-md transition disabled:opacity-50"
          >
            {isSubmitting ? "Publicando..." : "Publicar Post"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/community")}
            className="h-12 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold shadow-md transition"
          >
            Cancelar
          </button>
        </form>
      </div>
    </main>
  )
}

export default CreatePostForm

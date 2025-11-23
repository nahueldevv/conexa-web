import { useState } from "react"
import { createPost, deleteComment as deleteCommentService } from "../services/community.service"
import { useAuth } from "../context/AuthContext"

export const useCommunityActions = () => {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Acción: Crear un Post
  const submitPost = async (postData) => {
    if (!user) throw new Error("Must be logged in to post.")
    
    setIsSubmitting(true)
    setError(null)
    try {
      // postData espera: { title, content, topicId (opcional) }
      const response = await createPost(postData)
      return response.data // Retornamos el post creado por si hay redirección
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Error creating post")
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  // Acción: Eliminar Comentario (Genérica)
  // Nota: Si estás DENTRO de un hilo, es mejor usar la función de usePostThread
  // Pero esta sirve para listas de administración o perfil.
  const removeComment = async (commentId) => {
    setIsSubmitting(true)
    try {
      await deleteCommentService(commentId)
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    submitPost,
    removeComment,
    isSubmitting,
    error
  }
}
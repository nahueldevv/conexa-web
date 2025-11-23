import { useState, useEffect, useCallback } from "react"
import { getPostComments, createComment, deleteComment } from "../services/community.service"
import { useAuth } from "../context/AuthContext"

export const usePostThread = (postId) => {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1. Cargar Comentarios
  const fetchComments = useCallback(async () => {
    if (!postId) return
    setLoading(true)
    try {
      const data = await getPostComments(postId)
      setComments(data || [])
    } catch (err) {
      console.error(err)
      setError("Error loading comments.")
    } finally {
      setLoading(false)
    }
  }, [postId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  // 2. Crear Comentario
  const submitComment = async (content) => {
    if (!user) throw new Error("Login required.")
    setIsSubmitting(true)
    try {
      await createComment(postId, content)
      await fetchComments() // Recarga fresca del servidor
      return true
    } catch (err) {
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  // 3. Eliminar Comentario (NUEVO: Optimistic Update)
  const removeLocalComment = async (commentId) => {
    if (!confirm("Are you sure?")) return

    // Opción A: Optimistic Update (Borrar visualmente primero)
    const previousComments = [...comments]
    setComments(comments.filter(c => c.id !== commentId))

    try {
      await deleteComment(commentId)
    } catch {
      // Si falla, revertimos
      setComments(previousComments)
      alert("Failed to delete comment")
    }
  }

  return { 
    comments, 
    loading, 
    error, 
    isSubmitting,
    submitComment,
    removeLocalComment // <--- Tu equipo usará esto en el botón "Borrar" de cada comentario
  }
}
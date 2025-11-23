import { useState, useEffect, useCallback } from "react"
import { createComment, deleteComment, getPostById, updateComment as updateCommentService, updatePost as updatePostService } from "../services/community.service" 
import { useAuth } from "../context/AuthContext"

export const usePostThread = (postId) => {
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Función para cargar contenido y comentarios (ÚNICA LLAMADA)
  const fetchData = useCallback(async () => {
    if (!postId) return
    setLoading(true)
    try {
      const data = await getPostById(postId)
      
      setPost(data.post)
      setComments(data.comments || []) 
      
    } catch (err) {
      console.error("Error loading post content:", err)
      setPost(null) 
      setError("El post no fue encontrado o ha sido eliminado.")
    } finally {
      setLoading(false)
    }
  }, [postId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 1. Crear Comentario
  const submitComment = async (content) => {
    if (!user) throw new Error("Login required")
    
    setIsSubmitting(true)
    try {
      await createComment(postId, content)
      await fetchData() // Recarga después del éxito
      return true
    } catch (err) {
      console.error("Error submitting comment:", err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  // 2. Eliminar Comentario (Optimistic Update)
  const removeLocalComment = async (commentId) => {
    if (!confirm("Confirm to delete comment")) return

    const previousComments = comments
    setComments(comments.filter(c => c.id !== commentId)) // Optimistic UI

    try {
      await deleteComment(commentId)
    } catch {
      setComments(previousComments)
      alert("Fallo al eliminar, revisa que seas el dueño")
    }
  }

  // 3. Editar Comentario (Actualización de Estado Local)
  const updateLocalComment = async (commentId, newContent) => {
    try {
      await updateCommentService(commentId, newContent)
      
      // Actualización Optimista: Reemplazar el comentario editado en el estado local
      setComments(comments.map(c => 
        c.id === commentId ? { ...c, content: newContent, updated_at: new Date().toISOString() } : c
      ))
      return true
    } catch (err) {
      alert("Failed to edit comment")
      throw err
    }
  }

  // 4. Actualizar Post Content (Edición del post principal en el hilo)
  const updatePostContent = async (postData) => {
    const updatedPost = await updatePostService(post.id, postData)
    
    // Actualizar el estado mezclando con lo anterior
    setPost(prev => ({
      ...prev,       // Mantenemos datos viejos (id, author, comentarios, etc.)
      ...updatedPost // Sobrescribimos título y contenido nuevos
    }))
    return true
  }

  return { 
    post, 
    comments, 
    loading, 
    error, 
    isSubmitting,
    user, 
    submitComment,
    removeLocalComment,
    updateLocalComment, 
    updatePostContent
  }
}
import { useState } from "react"
import { 
  createPost, 
  deleteComment as deleteCommentService, 
  deletePost as deletePostService,
  updatePost as updatePostService,
  createSuggestion
} from "../services/community.service"
import { useAuth } from "../context/AuthContext"

export const useCommunityActions = () => {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Acción: Crear un Post
  const submitPost = async (postData) => {
    if (!user) throw new Error("Must be logged in to post")
    
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await createPost(postData)
      return response.data // Retornamos el post creado
    } catch (err) {
      console.error("Error creating post:", err)
      setError(err.response?.data?.message || "Error creating post")
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  // Acción: Editar un Post
  const editPost = async (postId, postData) => {
    if (!user) throw new Error("Must be logged in to edit")
    setIsSubmitting(true)
    try {
      await updatePostService(postId, postData)
      return true
    } catch (err) {
      console.error("Error editing post:", err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  // Acción: Eliminar un Post
  const removePost = async (postId) => {
    if (!user) throw new Error("Must be logged in to delete")
    try {
      await deletePostService(postId)
      return true
    } catch (err) {
      console.error("Error deleting post:", err)
      throw err
    }
  }

  // Acción: Eliminar Comentario (Genérica, útil para listas de administración)
  const removeComment = async (commentId) => {
    if (!user) throw new Error("Login required")
    try {
      await deleteCommentService(commentId)
    } catch (err) {
      console.error("Error deleting comment:", err)
      throw err
    }
  }

  // Acción: Crear Sugerencia (Buzón)
  const sendSuggestion = async (suggestionData) => {
    if (!user) throw new Error("Login required")
    try {
      await createSuggestion(suggestionData)
      return true
    } catch (err) {
      console.error("Error submitting suggestion:", err)
      throw err
    }
  }

  return {
    submitPost,
    editPost,
    removePost,
    removeComment,
    sendSuggestion,
    isSubmitting,
    error
  }
}
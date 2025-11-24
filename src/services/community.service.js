import apiClient from "./apiClient"

/**
 * Obtiene las tarjetas temáticas (Foros) con sus contadores.
 * Endpoint: GET /community/forums
 */
export const getForums = async () => {
  const response = await apiClient.get("/community/forums")
  return response.data.topics
}

/**
 * Obtiene un listado de posts filtrado (ej. feed general o por tema).
 * Endpoint: GET /community/posts?topicId=...
 * @param {Object} filters - { topicId: 'uuid' | 'general' }
 */
export const getPosts = async (filters = {}) => {
  const response = await apiClient.get("/community/posts", { params: filters })
  return response.data.posts
}

/**
 * Obtiene el detalle de un post específico (con sus comentarios)
 */
export const getPostById = async (postId) => {
  const response = await apiClient.get(`/community/posts/${postId}`)
  // Devuelve el objeto completo { post, comments }
  return response.data 
}

/**
 * Obtiene los comentarios de un post específico.
 * Endpoint: GET /community/posts/:postId/comments
 */
export const getPostComments = async (postId) => {
  const response = await apiClient.get(`/community/posts/${postId}/comments`)
  return response.data.comments
}


/**
 * Crea un nuevo post en un tema o en el general.
 * @param {Object} postData - { title, content, topicId }
 */
export const createPost = async (postData) => {
  const response = await apiClient.post("/community/posts", postData)
  return response.data
}

/**
 * Añade un comentario a un post existente.
 * @param {string} postId 
 * @param {string} content 
 */
export const createComment = async (postId, content) => {
  const response = await apiClient.post(`/community/posts/${postId}/comments`, { content })
  return response.data
}

export const updatePost = async (postId, data) => {
  const response = await apiClient.patch(`/community/posts/${postId}`, data)
  // Devolvemos el post actualizado (asumiendo que el BE lo anida en .post)
  return response.data.post 
}

export const updateComment = async (commentId, content) => {
  const response = await apiClient.patch(`/community/comments/${commentId}`, { content })
  return response.data
}

export const deletePost = async (postId) => {
  const response = await apiClient.delete(`/community/posts/${postId}`)
  return response.data
}

export const deleteComment = async (commentId) => {
  const response = await apiClient.delete(`/community/comments/${commentId}`)
  return response.data
}

export const createSuggestion = async (suggestionData) => {
  const response = await apiClient.post("/community/suggestions", suggestionData)
  return response.data
}
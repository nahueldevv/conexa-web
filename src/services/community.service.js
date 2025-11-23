import apiClient from "./apiClient"

// --- LECTURA (GET) ---

/**
 * Obtiene las tarjetas temáticas (Foros) con sus contadores.
 * Endpoint: GET /community/forums
 */
export const getForums = async () => {
  const response = await apiClient.get("/community/forums")
  return response.data
}

/**
 * Obtiene un listado de posts filtrado (ej. feed general o por tema).
 * Endpoint: GET /community/posts?topicId=...
 * @param {Object} filters - { topicId: 'uuid' | 'general' }
 */
export const getPosts = async (filters = {}) => {
  const response = await apiClient.get("/community/posts", { params: filters })
  return response.data
}

/**
 * Obtiene el detalle de un post específico (opcional, si no se pasa por estado)
 */
export const getPostById = async (postId) => {
  const response = await apiClient.get(`/community/posts/${postId}`)
  return response.data
}

/**
 * Obtiene los comentarios de un post específico.
 * Endpoint: GET /community/posts/:postId/comments
 */
export const getPostComments = async (postId) => {
  const response = await apiClient.get(`/community/posts/${postId}/comments`)
  return response.data
}

// --- ESCRITURA (POST/PATCH/DELETE) ---

/**
 * Crea un nuevo post en un tema o en el general.
 * @param {Object} postData - { title, content, topicId }
 */
export const createPost = async (postData) => {
  return apiClient.post("/community/posts", postData)
}

/**
 * Añade un comentario a un post existente.
 * @param {string} postId 
 * @param {string} content 
 */
export const createComment = async (postId, content) => {
  return apiClient.post(`/community/posts/${postId}/comments`, { content })
}

export const deleteComment = async (commentId) => {
  return apiClient.delete(`/community/comments/${commentId}`)
}

export const createSuggestion = async (suggestionData) => {
  return apiClient.post("/community/suggestions", suggestionData)
}
import apiClient from "./apiClient"

const BASE_URL = "/tracking"

/**
 * Obtiene el historial completo de eventos de un envío.
 * @param {string} shipmentId 
 */
export const getTrackingHistory = async (shipmentId) => {
  try {
    const response = await apiClient.get(`${BASE_URL}/${shipmentId}/history`)
    return response.data.history
  } catch (error) {
    console.error("Error fetching tracking history:", error)
    throw error
  }
}

/**
 * Registra un nuevo evento en el tracking (Solo Transportista).
 * @param {string} shipmentId 
 * @param {Object} eventData - { location, description }
 */
export const addTrackingEvent = async (shipmentId, eventData) => {
  try {
    const response = await apiClient.post(`${BASE_URL}/${shipmentId}/event`, eventData)
    return response.data
  } catch (error) {
    console.error("Error adding tracking event:", error)
    throw error
  }
}
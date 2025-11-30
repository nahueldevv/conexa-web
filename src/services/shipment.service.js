import apiClient from "./apiClient"

const BASE_URL = "/shipments"

/**
 * Crea un nuevo acuerdo formal (Shipment).
 * @param {Object} payload 
 * @param {string} [payload.offerId] - ID de la oferta (si aplica)
 * @param {string} [payload.requestId] - ID del pedido (si aplica)
 * @param {string} payload.conversationId - ID del chat actual
 * @param {Array<string>} payload.requiredDocuments - IDs de docs seleccionados
 */
export const createShipment = async (payload) => {
  try {
    const response = await apiClient.post(BASE_URL, payload)
    return response.data
  } catch (error) {
    console.error("Error creating shipment:", error)
    throw error
  }
}

/**
 * Obtiene los envíos del usuario actual (Como empresa o transportista).
 */
export const getMyShipments = async () => {
  try {
    const response = await apiClient.get(`${BASE_URL}/mine`)
    return response.data.shipments
  } catch (error) {
    console.error("Error fetching my shipments:", error)
    throw error
  }
}

/**
 * Obtiene el detalle de un envío específico por ID.
 */
export const getShipmentById = async (id) => {
  try {
    const response = await apiClient.get(`${BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching shipment details:", error)
    throw error
  }
}
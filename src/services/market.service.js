import apiClient from "./apiClient"

/**
 * Gets all published transport offers
 * @returns {Promise<Array>} An array of offer objects
 */
export const getOffers = async () => {
  return apiClient.get("/mercado/offers")
}

/**
 * Creates a new transport offer
 * @param {Object} offerData - The offer form data
 * @returns {Promise<Object>} The newly created offer
 */
export const createOffer = async (offerData) => {
  return apiClient.post("/mercado/offers", offerData)
}

/**
 * Gets all published load requests
 * @returns {Promise<Array>} An array of request objects
 */
export const getRequests = async () => {
  return apiClient.get("/mercado/requests")
}

/**
 * Creates a new load request
 * @param {Object} requestData - The request form data
 * @returns {Promise<Object>} The newly created request
 */
export const createRequest = async (requestData) => {
  return apiClient.post("/mercado/requests", requestData)
}
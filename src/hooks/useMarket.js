import { useState, useEffect } from "react"
import { getOffers, getRequests } from "../services/market.service"
import { useAuth } from "../context/AuthContext"

/**
 * Hook to manage state and data loading for the Logistics Market
 * Loads Offers (for Companies) or Requests (for Carriers) based on role
 * @returns {Object} { data, loading, error, refetchData }
 */
export const useMarket = () => {
  const { user } = useAuth()

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      let result
      if (user.role === "transportista") {
        result = await getRequests()
      } else if (user.role === "empresa") {
        result = await getOffers()
      }

      setData(result?.data || [])
    } catch (err) {
      console.error("Error fetching market data:", err)
      setError("Could not load market data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  return {
    data,
    loading,
    error,
    refetchData: fetchData
  }
}
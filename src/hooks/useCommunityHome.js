import { useState, useEffect } from "react"
import { getForums, getPosts } from "../services/community.service"

export const useCommunityHome = () => {
  const [forums, setForums] = useState([])
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Carga paralela: Metadata de Foros + Feed General
      const [forumsData, feedData] = await Promise.all([
        getForums(),
        getPosts({ topicId: 'general' })
      ])

      setForums(forumsData || [])
      setFeed(feedData || [])
    } catch (err) {
      console.error("Error loading community home:", err)
      setError("No se pudo cargar el contenido de la comunidad.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { forums, feed, loading, error, refetch: fetchData }
}
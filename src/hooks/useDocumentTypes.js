import { useState, useEffect } from "react"
import { getDocumentTypes } from "../services/market.service"

// Diccionario para etiquetas legibles en la UI
export const CATEGORY_LABELS = {
  LEGAL: "Documentación de Empresa",
  DRIVER: "Documentación del Conductor",
  VEHICLE: "Documentación del Vehículo",
  CARGO: "Documentación de Carga"
}

export const useDocumentTypes = () => {
  const [documents, setDocuments] = useState([]) // Lista plana
  const [groupedDocuments, setGroupedDocuments] = useState({}) // Objeto agrupado
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true)
      try {
        const data = await getDocumentTypes()
        
        // 1. Guardar lista plana (útil para validaciones o búsquedas)
        setDocuments(data || [])

        // 2. Lógica de Agrupación (Grouping)
        // Transforma [ {id, category: 'LEGAL'} ] en { LEGAL: [...], DRIVER: [...] }
        const groups = (data || []).reduce((acc, doc) => {
          const cat = doc.category || 'OTROS'
          if (!acc[cat]) acc[cat] = []
          acc[cat].push(doc)
          return acc
        }, {})

        setGroupedDocuments(groups)

      } catch (err) {
        console.error("Error loading document types:", err)
        setError("No se pudo cargar el catálogo de documentos")
      } finally {
        setLoading(false)
      }
    }

    fetchDocs()
  }, [])

  return { 
    documents,       
    groupedDocuments,
    categoryLabels: CATEGORY_LABELS,
    loading, 
    error 
  }
}
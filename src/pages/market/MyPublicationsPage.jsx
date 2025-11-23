import React, { useState, useMemo } from "react"
import { useMyPublications } from "../../hooks/useMyPublications"
import PublicationCard from "../../components/market/PublicationCard"
import { PlusCircle, Search, Filter, ArrowUpDown } from "lucide-react"

function MyPublicationsPage() {
  const { data, loading, error } = useMyPublications()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date_desc")

  // 🟦 FIX: hooks deben ejecutarse SIEMPRE, aunque data sea null
  const publications = data?.publications ?? []

  const filteredPublications = useMemo(() => {
    let list = [...publications]

    // search
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase()
      list = list.filter(item => {
        const origin = (item.origin || "").toLowerCase()
        const dest = (item.destination || "").toLowerCase()
        return origin.includes(term) || dest.includes(term)
      })
    }

    if (statusFilter !== "all") {
      list = list.filter(item =>
        (item.status || "").toLowerCase().includes(statusFilter)
      )
    }

    list.sort((a, b) => {
      const aDate = new Date(a.available_date || a.ready_date || a.created_at || 0)
      const bDate = new Date(b.available_date || b.ready_date || b.created_at || 0)
      return sortBy === "date_asc" ? aDate - bDate : bDate - aDate
    })

    return list
  }, [publications, searchTerm, statusFilter, sortBy])

  // 🟩 Recién AHORA los returns condicionales
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center">
        <p className="animate-pulse text-lg">Cargando tus publicaciones...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  if (publications.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center">
        <p>No tienes publicaciones todavía.</p>
      </div>
    )
  }

  // 🔵 Render normal
  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-white dark:bg-neutral-900">
      <div className="mx-auto max-w-[960px] flex flex-col px-4 py-8">

        {/* ... resto de la UI ... */}

        <section className="mt-6 space-y-4">
          {filteredPublications.map(item => (
            <PublicationCard key={item.id} item={item} />
          ))}
        </section>

      </div>
    </div>
  )
}

export default MyPublicationsPage

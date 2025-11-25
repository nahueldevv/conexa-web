import React, { useState } from "react"
import { useMyPublications } from "../../hooks/useMyPublications"
import PublicationCard from "../../components/market/PublicationCard"
import { Link } from "react-router-dom"

const MyPublicationsPage = () => {
  const { data, loading, error } = useMyPublications()

  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [fadeKey, setFadeKey] = useState("initial") // ← controla el fade-in

  // 🔥 Cada vez que cambia un filtro, se activa un fade nuevo
  const triggerFade = (value) => {
    setFilter(value)
    setFadeKey(value + "-" + Date.now())
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center">
        <p className="animate-pulse text-lg font-medium text-neutral-700 dark:text-neutral-200">
          Cargando tus publicaciones...
        </p>
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

  if (!data || data.total === 0) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center">
        <p className="text-neutral-600 dark:text-neutral-300">
          No tienes publicaciones todavía.
        </p>
      </div>
    )
  }

  // Normalize role
  let normalizedRole = "dual"
  if (data.role === "transportista") normalizedRole = "offer"
  if (data.role === "empresa") normalizedRole = "request"

  const offers = data.publications.filter(p => p.vehicle_type)
  const requests = data.publications.filter(p => p.required_vehicle_type)

  // SEARCH FILTER
  const applySearch = (list) => {
    const t = searchTerm.trim().toLowerCase()
    if (!t) return list

    return list.filter(item => {
      const o = item.origin?.toLowerCase() || ""
      const d = item.destination?.toLowerCase() || ""
      return o.startsWith(t) || d.startsWith(t)
    })
  }

  const filteredOffers = applySearch(offers)
  const filteredRequests = applySearch(requests)

  // FINAL FILTER
  let finalPublications = []
  if (normalizedRole === "offer") {
    finalPublications = filteredOffers
  } else if (normalizedRole === "request") {
    finalPublications = filteredRequests
  } else {
    if (filter === "offers") finalPublications = filteredOffers
    else if (filter === "requests") finalPublications = filteredRequests
    else finalPublications = [...filteredOffers, ...filteredRequests]
  }

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto p-6 gap-8">

      {/* TITLE */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-4xl font-black text-neutral-900 dark:text-neutral-100">
          Mis Publicaciones
        </h1>

      <Link
        to="/mercado/create"
        className="
          flex items-center justify-center gap-2 h-10 px-4
          text-sm font-bold tracking-wide
          rounded-lg shadow-sm transition-all duration-300

          /* MODO CLARO */
          bg-white text-neutral-900 border border-gray-300

          /* MODO OSCURO */
          dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700

          /* HOVER */
          hover:bg-gray-100 dark:hover:bg-gray-700
        "
      >
        <span className="material-symbols-outlined text-xl">
          add_circle
        </span>
        Nueva Publicación
      </Link>



      </div>

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3 py-3">
        
        {/* Search */}
        <label className="flex flex-col min-w-40 h-11 w-full sm:flex-1">
          <div className="flex w-full items-stretch rounded-lg h-full">
            <div className="text-gray-500 dark:text-gray-400 flex items-center justify-center bg-gray-100 dark:bg-gray-800 pl-3.5 rounded-l-lg">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>

            <input
              type="text"
              placeholder="Buscar por Origen o Destino"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                form-input w-full rounded-r-lg px-3 text-sm
                bg-gray-100 dark:bg-gray-800
                text-neutral-900 dark:text-gray-200
                border-none focus:ring-0
                placeholder:text-gray-500 dark:placeholder:text-gray-400
              "
            />
          </div>
        </label>

        {/* FILTER BUTTONS */}
        {normalizedRole === "dual" && (
          <div className="flex gap-3">
            
            <button
              onClick={() => triggerFade("all")}
              className={`
                h-11 px-4 rounded-lg text-sm font-medium transition
                ${filter === "all"
                  ? "bg-primary"
                  : "bg-gray-100 dark:bg-gray-800"}
                text-gray-900 dark:text-gray-200
              `}
            >
              Todo
            </button>

            <button
              onClick={() => triggerFade("offers")}
              className={`
                h-11 px-4 rounded-lg text-sm font-medium transition
                ${filter === "offers"
                  ? "bg-amber-600"
                  : "bg-gray-100 dark:bg-gray-800"}
                text-gray-900 dark:text-gray-200
              `}
            >
              Ofertas
            </button>

            <button
              onClick={() => triggerFade("requests")}
              className={`
                h-11 px-4 rounded-lg text-sm font-medium transition
                ${filter === "requests"
                  ? "bg-cyan-600"
                  : "bg-gray-100 dark:bg-gray-800"}
                text-gray-900 dark:text-gray-200
              `}
            >
              Solicitudes
            </button>

          </div>
        )}
      </div>

      {/* PUBLICATIONS LIST — con FADING REAL */}
      <div
        key={fadeKey}
        className="space-y-4 animate-fadeIn"
      >
        {finalPublications.length === 0 ? (
          <p className="text-neutral-500 dark:text-neutral-400">No hay publicaciones</p>
        ) : (
          finalPublications.map(item => (
            <PublicationCard
              key={`${filter}-${searchTerm}-${item.id}`}
              item={item}
            />
          ))
        )}
      </div>

    </div>
  )
}

export default MyPublicationsPage

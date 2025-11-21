import React, { useState } from "react"
import { useMyPublications } from "../../hooks/useMyPublications"
import PublicationCard from "../../components/market/PublicationCard"

function MyPublicationsPage() {
  const { data, loading, error } = useMyPublications()
  const [filter, setFilter] = useState("all")

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
          No tienes publicaciones todavia. 
        </p>
      </div>
    )
  }

  // Normalize backend roles to UI roles
  let normalizedRole = "dual"

  if (data.role === "transportista") normalizedRole = "offer"
  if (data.role === "empresa") normalizedRole = "request"
  if (data.role === "dual") normalizedRole = "dual"

  // Separate offers and requests
  const offers = data.publications.filter(p => p.vehicle_type)
  const requests = data.publications.filter(p => p.required_vehicle_type)

  return (
    <div className="flex w-full flex-col gap-10 p-6 transition-all duration-300">

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
        Mis Publicaciones ({data.total})
      </h1>

      {/* FILTER BUTTONS — ONLY FOR DUAL USERS */}
      {normalizedRole === "dual" && (
        <div className="flex gap-3">

          <button
            onClick={() => setFilter("all")}
            className={`rounded-md px-4 py-2 text-sm font-medium 
              transition-all duration-300 ease-in-out transform
              ${filter === "all"
                ? "bg-blue-600 text-white scale-105"
                : "bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"}`}
          >
            Todo
          </button>

          <button
            onClick={() => setFilter("offers")}
            className={`rounded-md px-4 py-2 text-sm font-medium 
              transition-all duration-300 ease-in-out transform
              ${filter === "offers"
                ? "bg-amber-600 text-white scale-105"
                : "bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"}`}
          >
            Ofertas
          </button>

          <button
            onClick={() => setFilter("requests")}
            className={`rounded-md px-4 py-2 text-sm font-medium
              transition-all duration-300 ease-in-out transform
              ${filter === "requests"
                ? "bg-cyan-600 text-white scale-105"
                : "bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"}`}
          >
            Solicitudes
          </button>

        </div>
      )}

      {/* MAIN GRID OR SINGLE COLUMN BASED ON ROLE */}
      <div
        className={`
          transition-all duration-300
          ${normalizedRole === "dual"
            ? "grid grid-cols-1 lg:grid-cols-2 gap-10"
            : "flex flex-col gap-10"}
          ${filter === "all" ? "opacity-100 translate-y-0"
            : filter === "offers" ? "opacity-100 translate-y-0"
            : "opacity-100 translate-y-0"}
        `}
        key={filter} // ← CLAVE: fuerza fade entre filtros
>


        {/* LEFT COLUMN — OFFERS */}
        {(normalizedRole === "offer" ||
          (normalizedRole === "dual" && (filter === "all" || filter === "offers")))

          && (
          <div className="flex flex-col gap-4 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-amber-600 dark:text-amber-400">
              Ofertas Activas ({offers.length})
            </h2>

            {offers.length === 0 ? (
              <p className="text-neutral-600 dark:text-neutral-400">
                No hay ofertas activas
              </p>
            ) : (
              <div className="flex flex-col gap-4 transition-all duration-300 opacity-0 animate-fadeIn">
                {offers.map(item => (
                  <PublicationCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* RIGHT COLUMN — REQUESTS */}
        {(normalizedRole === "request" ||
          (normalizedRole === "dual" && (filter === "all" || filter === "requests")))

          && (
          <div className="flex flex-col gap-4 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-cyan-600 dark:text-cyan-400">
              Solicitudes de Carga ({requests.length})
            </h2>

            {requests.length === 0 ? (
              <p className="text-neutral-600 dark:text-neutral-400">
                No hay solicitudes de carga
              </p>
            ) : (
              <div className="flex flex-col gap-4 transition-all duration-300 opacity-0 animate-fadeIn">
                {requests.map(item => (
                  <PublicationCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default MyPublicationsPage

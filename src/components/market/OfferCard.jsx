import React, { useState } from "react"

function OfferCard({ item }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="rounded-xl border border-amber-400 bg-white p-5 shadow-sm 
                 transition-all duration-300 hover:shadow-md dark:border-amber-500 
                 dark:bg-neutral-900"
    >
      {/* Header */}
      <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400">
        Oferta de Transporte
      </h3>

      {/* PRINCIPALES */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-neutral-700 dark:text-neutral-300">
        <p><span className="font-medium">Origen:</span> {item?.origin || "N/A"}</p>
        <p><span className="font-medium">Destino:</span> {item?.destination || "N/A"}</p>

        <p><span className="font-medium">Tipo:</span> {item?.type || "N/A"}</p>
        <p><span className="font-medium">Fecha:</span> {item?.date || "N/A"}</p>
      </div>

      {/* SECUNDARIOS */}
      {expanded && (
        <div className="mt-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3 text-sm space-y-1 transition-all duration-300">
          <p><span className="font-medium">Temperatura:</span> {item?.temperature || "N/A"}</p>
          <p><span className="font-medium">Vehículos disponibles:</span> {item?.vehicles || "N/A"}</p>
          <p><span className="font-medium">Observaciones:</span> {item?.notes || "N/A"}</p>
        </div>
      )}

      {/* BOTÓN */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 rounded-md px-3 py-1 text-sm bg-neutral-200 
                   hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600
                   transition-all duration-300 opacity-0 animate-fade-in"
      >
        {expanded ? "Mostrar menos" : "Mostrar más"}
      </button>
    </div>
  )
}

export default OfferCard

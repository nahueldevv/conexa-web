import React from "react"
import { Truck, Package, Edit3, Trash2 } from "lucide-react"

const PublicationCard = ({ item }) => {
  const isOffer = !!item.vehicle_type

  const origin = item.origin || "Origen no especificado"
  const destination = item.destination || "Destino no especificado"

  const dateRaw = item.available_date || item.ready_date || item.created_at
  const dateFormatted = dateRaw
    ? new Date(dateRaw).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    : "Fecha a confirmar"

  const cargoType = item.cargo_type || "Carga general"

  const rawStatus = (item.status || "").toLowerCase()
  let statusLabel = item.status || "Sin estado"
  let statusClasses =
    "inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-800 dark:bg-gray-700 dark:text-gray-200"

  if (rawStatus.includes("act")) {
    statusClasses =
      "inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-200"
  } else if (rawStatus.includes("tran")) {
    statusClasses =
      "inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  } else if (rawStatus.includes("fin") || rawStatus.includes("complet")) {
    statusClasses =
      "inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-800 dark:bg-gray-700 dark:text-gray-200"
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-[#F9FAFB] p-4 dark:border-gray-700 dark:bg-gray-800/50 sm:flex-row sm:justify-between">
      {/* LEFT SIDE: ICON + INFO */}
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#005A9C]/10 text-[#005A9C] dark:bg-[#005A9C]/20">
          {isOffer ? (
            <Truck className="h-6 w-6" />
          ) : (
            <Package className="h-6 w-6" />
          )}
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <p className="text-base font-bold leading-normal text-[#111827] dark:text-gray-100">
            {origin} → {destination}
          </p>
          <p className="mt-1 text-sm font-normal leading-normal text-gray-600 dark:text-gray-400">
            Fecha: {dateFormatted}
          </p>
          <p className="text-sm font-normal leading-normal text-gray-600 dark:text-gray-400">
            Tipo de Carga: {cargoType}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: STATUS + ACTIONS */}
      <div className="ml-16 flex flex-col justify-between gap-2 sm:ml-0 sm:items-end">
        <div className="shrink-0">
          <span className={statusClasses}>{statusLabel}</span>
        </div>

        <div className="mt-1 flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-medium text-[#005A9C] transition hover:underline"
          >
            <Edit3 className="h-4 w-4" />
            <span>Editar</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-medium text-red-600 transition hover:underline dark:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PublicationCard

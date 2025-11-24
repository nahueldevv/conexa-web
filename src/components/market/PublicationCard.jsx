import React, { useState } from "react"
import { Pencil, Trash2, Truck, Package } from "lucide-react"

const PublicationCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false)

  const isOffer = !!item.vehicle_type
  const Icon = isOffer ? Truck : Package

  /* 🎨 BADGE DE ROL (OFERTA / DEMANDA) */
  const badgeText = isOffer ? "OFERTA DE TRANSPORTE" : "SOLICITUD DE CARGA"
  const badgeColor = isOffer
    ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
    : "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"

  /* 🎨 BADGE DE ESTADO */
  const status = item.status?.toLowerCase() || ""

  const stateStyles = {
    open: "bg-green-200 dark:bg-green-700 text-black dark:text-white",
    closed: "bg-red-200 dark:bg-red-700 text-black dark:text-white",
    in_transit: "bg-blue-200 dark:bg-blue-700 text-black dark:text-white",
  }

  const stateClass =
    stateStyles[status] ||
    "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"

  return (
    <div
      className={`
        relative w-full rounded-xl border p-5 shadow-sm transition-all 
        hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900 ${badgeColor}
      `}
    >
      {/* BADGE DE ESTADO (arriba derecha) */}
      <span
        className={`
          absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full
          ${stateClass}
        `}
      >
        {item.status}
      </span>

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-white dark:bg-neutral-800 shadow-sm`}>
          <Icon size={22} className={isOffer ? "text-amber-600" : "text-cyan-600"} />
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-semibold opacity-80">{badgeText}</span>

          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            {item.origin} → {item.destination}
          </h3>

          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {item.cargo_type}
          </p>
        </div>
      </div>

      {/* INFO PRINCIPAL */}
      <div className="grid grid-cols-2 gap-2 text-sm text-neutral-700 dark:text-neutral-200">
        <p>
          <span className="font-medium">Peso:</span> {item.weight_kg} kg
        </p>
        <p>
          <span className="font-medium">Volumen:</span> {item.volume_m3} m³
        </p>
        <p>
          <span className="font-medium">Vehículo:</span>{" "}
          {isOffer ? item.vehicle_type : item.required_vehicle_type}
        </p>
      </div>

      {/* SECCIÓN EXPANDIBLE */}
      {expanded && (
        <div
          className="mt-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 
                     p-3 text-sm text-neutral-700 dark:text-neutral-200 
                     flex flex-col gap-3 transition-all duration-300 
                     opacity-0 animate-fadeIn"
        >
          {/* INFO GENERAL */}
          <div className="flex flex-col gap-1">
            <p>
              <span className="font-medium">Creada el:</span> {item.created_at}
            </p>

            <p>
              <span className="font-medium">Tipo de carga:</span>{" "}
              {item.cargo_type}
            </p>

            {isOffer ? (
              <>
                <p>
                  <span className="font-medium">Control de Temperatura:</span>{" "}
                  {item.temperature_control}
                </p>
                <p>
                  <span className="font-medium">Vehículos Disponibles:</span>{" "}
                  {item.number_of_vehicles}
                </p>
                <p>
                  <span className="font-medium">Fecha de disponibilidad:</span>{" "}
                  {item.available_date}
                </p>
              </>
            ) : (
              <>
                <p>
                  <span className="font-medium">Temperatura Requerida:</span>{" "}
                  {item.required_temperature}
                </p>
                <p>
                  <span className="font-medium">Vehículos Necesarios:</span>{" "}
                  {item.number_of_vehicles}
                </p>
                <p>
                  <span className="font-medium">Fecha de carga:</span>{" "}
                  {item.ready_date}
                </p>
                <p>
                  <span className="font-medium">Fecha límite de entrega:</span>{" "}
                  {item.delivery_deadline}
                </p>
                <p>
                  <span className="font-medium">Presupuesto:</span>{" "}
                  {item.budget}
                </p>
              </>
            )}
          </div>

          {/* DOCUMENTACIÓN (sección nueva) */}
          <div className="pt-3 border-t border-neutral-300 dark:border-neutral-700">
            <h4 className="font-semibold mb-1">Documentación requerida</h4>
            <ul className="list-disc ml-5 text-neutral-700 dark:text-neutral-300">
              <li>Factura comercial</li>
              <li>Remito / guía de carga</li>
              <li>Documentación del transportista</li>
            </ul>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="rounded-md bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300 
                     dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          {expanded ? "Mostrar menos" : "Mostrar más"}
        </button>

        <div className="flex gap-2">
          <button
            className="flex items-center gap-1 rounded-md bg-gray-300 px-3 py-1 text-sm 
                       hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
          >
            <Pencil size={16} />
            Editar
          </button>

          <button
            className="flex items-center gap-1 rounded-md bg-red-300 px-3 py-1 text-sm 
                       text-red-900 hover:bg-red-400 dark:bg-red-900 dark:text-red-300 
                       dark:hover:bg-red-800"
          >
            <Trash2 size={16} />
            Borrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default PublicationCard

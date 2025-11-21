    import React, { useState } from "react"

    const PublicationCard = ({ item }) => {
    const [expanded, setExpanded] = useState(false)

    // Determine if this record is an offer or a request
    const isOffer = !!item.vehicle_type

    // Primary badge
    const badgeText = isOffer ? "🚛 OFERTA ACTIVA" : "📦 SOLICITUD DE CARGA"
    const borderColor = isOffer ? "border-amber-500" : "border-cyan-400"

    return (
        <div className={`flex flex-col gap-3 rounded-xl border p-4 shadow-sm ${borderColor} hover:shadow-md transition`}>
        
        {/* Header */}
        <div className="flex flex-col">
            <span className="font-semibold text-sm">{badgeText}</span>

            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            {item.origin} → {item.destination}
            </h3>

            <p className="text-sm text-neutral-600 dark:text-neutral-300">
            {isOffer ? item.cargo_type : item.cargo_type}
            </p>
        </div>

        {/* Main quick info */}
        <div className="grid grid-cols-2 gap-2 text-sm text-neutral-700 dark:text-neutral-200">
            <p><span className="font-medium">Peso:</span> {item.weight_kg} kg</p>
            <p><span className="font-medium">Volumen:</span> {item.volume_m3} m³</p>

            <p>
            <span className="font-medium">Vehiculo:</span> 
            {isOffer ? item.vehicle_type : item.required_vehicle_type}
            </p>

            <p>
            <span className="font-medium">Estado:</span> {item.status}
            </p>
        </div>

        {/* Expandable section */}
        {expanded && (
            <div className="mt-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3 text-sm text-neutral-700 dark:text-neutral-200 flex flex-col gap-1 transition-all duration-300 opacity-0 animate-fadeIn">

            {/* Shared fields */}
            <p><span className="font-medium">Creada el:</span> {item.created_at}</p>
            <p><span className="font-medium">Tipo de carga:</span> {item.cargo_type}</p>

            {/* Conditional fields */}
            {isOffer ? (
                <>
                <p><span className="font-medium">Control de Temperatura:</span> {item.temperature_control}</p>
                <p><span className="font-medium">Vehiculos Disponibles:</span> {item.number_of_vehicles}</p>
                <p><span className="font-medium">Fecha de disponibilidad:</span> {item.available_date}</p>
                </>
            ) : (
                <>
                <p><span className="font-medium">Temperatura Requerida:</span> {item.required_temperature}</p>
                <p><span className="font-medium">Vehiculos Necesarios:</span> {item.number_of_vehicles}</p>
                <p><span className="font-medium">Fecha de entrega:</span> {item.ready_date}</p>
                <p><span className="font-medium">Fecha límite de entrega:</span> {item.delivery_deadline}</p>
                <p><span className="font-medium">Presupuesto:</span> {item.budget}</p>
                </>
            )}
            </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-2">
            
            <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-md bg-neutral-200 px-3 py-1 text-sm hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 "
            >
            {expanded ? "Mostrar menos" : "Mostrar más"}
            </button>

            <div className="flex gap-2">
            <button className="rounded-md bg-neutral-300 px-3 py-1 text-sm hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500">
                Editar
            </button>

            <button className="rounded-md bg-red-300 px-3 py-1 text-sm text-red-900 hover:bg-red-400 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800">
                Borrar
            </button>
            </div>
        </div>
        </div>
    )
    }

    export default PublicationCard

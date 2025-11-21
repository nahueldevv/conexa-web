import React, { useState } from "react";
import { Truck, Package } from "lucide-react";

const PublicationCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  const isOffer = !!item.vehicle_type;
  const isRequest = !isOffer;

  const headerClasses = isRequest
    ? "bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-800"
    : "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800";

  const baseClasses = `
    flex flex-col gap-3 p-4 
    bg-[#F9FAFB] dark:bg-neutral-900 
    rounded-xl border dark:border-neutral-800 
    hover:border-amber-500/50 dark:hover:border-amber-500/50 
    transition-all group shadow-sm
  `;

  const dateRaw = item.available_date || item.ready_date;
  const dateFormatted = dateRaw
    ? new Date(dateRaw).toLocaleDateString()
    : "A confirmar";

  const cargoInfo = item.cargo_type
    ? `${item.cargo_type.toUpperCase()} • ${item.weight_kg}kg`
    : "Carga general";

  const vehicleInfo = isOffer ? item.vehicle_type : item.required_vehicle_type;

  return (
    <div className={baseClasses}>
      {/* 🔹 HEADER VISUAL TIPO MARKETCARD */}
      <div
        className={`w-full aspect-2/1 relative ${headerClasses} border flex flex-col items-center justify-center rounded-lg p-4 mb-2`}
      >
        {isOffer ? (
          <Truck size={32} className="mb-2 opacity-80" />
        ) : (
          <Package size={32} className="mb-2 opacity-80" />
        )}

        <span className="text-xl font-black uppercase tracking-widest opacity-90">
          {isOffer ? "OFERTA" : "SOLICITUD"}
        </span>

        <span className="text-xs font-medium opacity-70 mt-1 uppercase tracking-wider">
          {isOffer ? "Transporte Disponible" : "Carga Disponible"}
        </span>
      </div>

      {/* 🔹 INFORMACIÓN PRINCIPAL */}
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">
          Ruta
        </span>

        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
          {item.origin} → {item.destination}
        </h3>

        <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
          {cargoInfo}
        </p>
      </div>

      {/* 🔹 CUADRÍCULA DE INFO RÁPIDA */}
      <div className="grid grid-cols-2 gap-2 text-sm text-neutral-700 dark:text-neutral-200">
        <p>
          <span className="font-medium">Fecha:</span> {dateFormatted}
        </p>
        <p>
          <span className="font-medium">Vehículo:</span>{" "}
          {vehicleInfo || "N/A"}
        </p>
        <p>
          <span className="font-medium">Peso:</span> {item.weight_kg} kg
        </p>
        <p>
          <span className="font-medium">Volumen:</span> {item.volume_m3} m³
        </p>
      </div>

      {/* 🔹 SECCIÓN EXPANDIBLE */}
      {expanded && (
        <div className="mt-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3 text-sm text-neutral-700 dark:text-neutral-200 flex flex-col gap-1 transition-all duration-300 opacity-0 animate-fadeIn">
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
                <span className="font-medium">Vehículos disponibles:</span>{" "}
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
                <span className="font-medium">Temperatura requerida:</span>{" "}
                {item.required_temperature}
              </p>
              <p>
                <span className="font-medium">Vehículos necesarios:</span>{" "}
                {item.number_of_vehicles}
              </p>
              <p>
                <span className="font-medium">Fecha de carga:</span>{" "}
                {item.ready_date}
              </p>
              <p>
                <span className="font-medium">Fecha límite:</span>{" "}
                {item.delivery_deadline}
              </p>
              <p>
                <span className="font-medium">Presupuesto:</span>{" "}
                {item.budget}
              </p>
            </>
          )}
        </div>
      )}

      {/* 🔹 FOOTER */}
      <div className="flex items-center justify-between mt-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="rounded-md bg-neutral-200 px-3 py-1 text-sm hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 transition"
        >
          {expanded ? "Mostrar menos" : "Mostrar más"}
        </button>

        <div className="flex gap-2">
          <button className="rounded-md bg-neutral-300 px-3 py-1 text-sm hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500 transition">
            Editar
          </button>

          <button className="rounded-md bg-red-300 px-3 py-1 text-sm text-red-900 hover:bg-red-400 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition">
            Borrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicationCard;

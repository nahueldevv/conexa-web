import { Truck, Package } from 'lucide-react'

const MarketCard = ({ item }) => {
  const isOffer = !!item.vehicle_type
  const isRequest = !isOffer

  const origin = item.origin
  const destination = item.destination

  const dateRaw = item.available_date || item.ready_date
  const dateFormatted = dateRaw ? new Date(dateRaw).toLocaleDateString() : 'A confirmar'

  const cargoInfo = item.cargo_type
    ? `${item.cargo_type.toUpperCase()} • ${item.weight_kg}kg`
    : 'Carga General'

  const vehicleInfo = isOffer ? item.vehicle_type : item.required_vehicle_type

  const baseClasses =
    `flex flex-col gap-3 p-4 
    bg-[#F9FAFB] dark:bg-neutral-900 
    rounded-lg dark:border-neutral-800 
    hover:border-amber-500/50 dark:hover:border-amber-500/50 
    transition-all h-full group`

  const headerClasses = isRequest
    ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-800'
    : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800'

  // 🔵 CLARO: azul  
  // 🟠 OSCURO: ámbar
  const contactButtonClass = `
    flex w-full mt-3 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5
    text-white text-lg font-bold leading-normal transition-colors shadow-md

    bg-[#005A9C] hover:bg-blue-500        /* Modo claro */
    dark:bg-[#d97706]/20 dark:text-[#d97706] dark:hover:bg-amber-600 dark:hover:text-white   /* Modo oscuro */
  `

  return (
    <div className={baseClasses}>
      {/* 1. Header Visual */}
      <div
        className={`w-full aspect-2/1 relative ${headerClasses} border flex flex-col items-center justify-center rounded-lg p-4 mb-2`}
      >
        {isOffer ? <Truck size={32} className="mb-2 opacity-80" /> : <Package size={32} className="mb-2 opacity-80" />}
        <span className="text-xl font-black uppercase tracking-widest opacity-90">
          {isOffer ? 'OFERTA' : 'PEDIDO'}
        </span>
        <span className="text-xs font-medium opacity-70 mt-1 uppercase tracking-wider">
          {isOffer ? 'Transporte Disponible' : 'Carga Disponible'}
        </span>
      </div>

      {/* 2. Contenido */}
      <div className="flex flex-col gap-3 grow">
        {/* Ruta */}
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Ruta</span>
          <p className="text-gray-900 dark:text-white text-lg font-bold leading-tight">
            {origin} → {destination}
          </p>
        </div>

        {/* Detalles en Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold block">Fecha</span>
            <span className="text-gray-700 dark:text-gray-300">{dateFormatted}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold block">Vehículo</span>
            <span className="text-gray-700 dark:text-gray-300 capitalize">{vehicleInfo || 'N/A'}</span>
          </div>
        </div>

        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold block">Detalle Carga</span>
          <span className="text-gray-700 dark:text-gray-300">{cargoInfo}</span>
        </div>
      </div>

      {/* 3. Botón Contactar */}
      <button className={contactButtonClass}>Contactar</button>
    </div>
  )
}

export default MarketCard

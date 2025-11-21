import React from 'react'
import { Loader2, AlertTriangle } from 'lucide-react'
import MarketCard from '../../components/market/MarketCard'
import ListFooterMessage from '../../components/common/ListFooterMessage'

const MercadoList = ({ data, loading, error, refetchData }) => {
  // 1. Estado de Carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 
        bg-gray-100 dark:bg-neutral-900 
        text-gray-900 dark:text-white 
        rounded-xl border border-gray-300 dark:border-neutral-800">
        <Loader2 className="animate-spin text-amber-500 mr-3" size={32} />
        <span className="text-lg font-medium">Sincronizando Mercado...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl flex flex-col items-center justify-center h-64 
        bg-red-50 dark:bg-red-900/20 
        border-l-4 border-red-500 dark:border-red-700 
        text-red-900 dark:text-red-200">
        <div className="flex items-center mb-2">
          <AlertTriangle className="mr-3 text-red-500 dark:text-red-400" size={32} />
          <p className="font-bold text-xl">Error de Conexión</p>
        </div>
        <p className="text-base mb-4">{error.message || 'Ocurrió un error al obtener los datos de la API.'}</p>
        <button
          onClick={refetchData}
          className="px-6 py-2 
            bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 
            text-white rounded-lg font-bold transition"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
          <ListFooterMessage refetchData={refetchData} />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
      {data.map((item) => (
        // La MarketCard (ahora un componente separado) recibe el ítem
        <MarketCard key={item.id} item={item} /> 
      ))}
    </div>
  )
}

export default MercadoList
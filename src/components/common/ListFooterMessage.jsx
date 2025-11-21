import { Search } from 'lucide-react'

const ListFooterMessage = ({ refetchData }) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 p-10 rounded-lg min-h-[250px]
        bg-gray-50 dark:bg-neutral-900 
        border border-dashed border-gray-300 dark:border-neutral-700"
    >
      <Search size={48} className="text-gray-400 dark:text-neutral-600" />
      <p className="text-gray-900 dark:text-white text-lg font-medium">No se encontraron publicaciones.</p>
      <p className="text-gray-600 dark:text-neutral-400 text-center max-w-md">
        No hay resultados que coincidan con tu rol en este momento. Intenta recargar o vuelve más tarde.
      </p>
      {refetchData && (
        <button
          onClick={refetchData}
          className="mt-4 px-6 py-2 
            bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 
            text-white rounded-lg text-base font-bold transition shadow-md"
        >
          Actualizar Búsqueda
        </button>
      )}
    </div>
  )
}

export default ListFooterMessage
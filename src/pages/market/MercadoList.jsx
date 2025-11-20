import React from 'react'
import { Loader2, AlertTriangle, Search } from 'lucide-react'


const MarketCard = ({ item, isRequest }) => {
    const { origin, destination, departure, load, extraDetail } = item || {} 

    const baseClasses = 'flex flex-col gap-3 p-4 bg-neutral-900 rounded-lg border border-transparent hover:border-primary/50 transition-all h-full'
    
    const headerClasses = isRequest 
        ? 'bg-teal-700' // Pedido
        : 'bg-indigo-700' // Oferta

    // 1. Botón Contactar
    const contactButtonClass = 'flex w-full mt-3 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 ' +
                               'bg-amber-900 ' + 
                               'text-amber-400 ' +
                               'text-lg font-bold leading-normal hover:brightness-110 transition-colors' 

    return (
        <div className={baseClasses}>
            {/* 1. Área de Color Sólido */}
            <div 
                className={`w-full aspect-video relative ${headerClasses} flex items-center justify-center rounded-lg p-6`} 
            >
                {/* Texto de estado centrado y en blanco/gris */}
                <span className="text-2xl font-black uppercase tracking-widest text-white/80">
                    {isRequest ? 'PEDIDO' : 'OFERTA'}
                </span>
            </div>


            {/* 2. Área de Contenido */}
            <div className="flex flex-col gap-2 flex-grow mt-1"> 
                {/* Título de la ruta */}
                <p className="text-white text-xl font-bold leading-tight">
                    {origin || 'Origen'} → {destination || 'Destino'}
                </p>
                

                {/* Nuevo detalle destacado (ej. tiempo) */}
                <p className="text-white text-xl font-black leading-tight mb-2">
                    {extraDetail || ''}
                </p>


                {/* Salida */}
                <p className="text-base font-normal leading-tight">
                    <span className="font-medium text-gray-400">Salida:</span> <span className="text-white">{departure || 'Fecha no definida'}</span>
                </p>


                {/* Carga */}
                <p className="text-base font-normal leading-tight">
                    <span className="font-medium text-gray-400">Carga:</span> <span className="text-white">{load || 'No especificado'}</span>
                </p>
            </div>
            

            {/* 3. Botón Contactar (Estilo marrón/naranja) */}
            <button className={contactButtonClass}>
                Contactar
            </button>
        </div>
    )
}
// === Subcomponente: ListFooterMessage (Ajustado al Template) ===
const ListFooterMessage = ({ refetchData }) => {
    // Usamos card-dark y border-white/10 como en el ejemplo del template
    const footerClasses = 'bg-card-dark border border-dashed border-white/10 transition-colors animate-fadeIn'
    const buttonClass = 'bg-primary hover:brightness-110 text-background-dark' // Botón de acción principal

    return (
        // La clase sm:col-span-2 lg:col-span-3 xl:col-span-4 se agregará en el renderizado final
        <div className={`flex flex-col items-center justify-center gap-4 p-10 rounded-lg min-h-[250px] ${footerClasses}`}>
            {/* Usaremos Search de Lucide, ya que Material Symbols no está importado aquí */}
            <Search size={48} className={`text-5xl text-text-subtle`} /> 
            <p className="text-text-light text-lg font-medium">No se encontraron más publicaciones.</p>
            <p className="text-text-subtle text-center">
                Intenta ajustar los filtros o crea una nueva publicación para que otros te encuentren.
            </p>
            {refetchData && (
                <button
                    onClick={refetchData}
                    className={`mt-4 px-6 py-2 ${buttonClass} rounded-lg text-base font-bold transition shadow-md`}
                >
                    Actualizar Búsqueda
                </button>
            )}
        </div>
    )
}

// ====================================================================
// Componente MercadoList (Principal exportado)
// ====================================================================
const MercadoList = ({ data, loading, error, role, refetchData }) => {
    const isTransportista = role === 'TRANSPORTISTA'
    
    // Clases de fondo y texto basadas en el template
    const bgStatusClass = 'bg-card-dark text-text-light'
    const errorClasses = 'bg-red-900/40 border-l-4 border-red-700 text-red-300'

    // 1. Manejo del estado de Carga
    if (loading) {
        return (
            <div className={`flex justify-center items-center h-48 ${bgStatusClass} rounded-xl shadow-lg animate-fadeIn`}>
                <Loader2 className="animate-spin text-primary mr-2" size={24} />
                <span className="text-lg font-medium">Cargando publicaciones del Mercado...</span>
            </div>
        )
    }

    // 2. Manejo del estado de Error
    if (error) {
        return (
             <div className={`p-6 border-l-4 rounded-xl shadow-md flex items-center justify-center h-48 ${errorClasses} animate-fadeIn`}>
                <AlertTriangle className="mr-3 text-red-500" size={24} />
                <div className='flex flex-col'>
                    <p className="font-bold text-lg">Error al cargar publicaciones:</p>
                    <p className="text-sm">{error.message || 'Ocurrió un error al obtener los datos de la API.'}</p>
                    <button
                        onClick={refetchData}
                        className={`mt-3 px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-md text-sm transition w-fit`}
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    const isDataEmpty = !data || data.length === 0

    // 3. Manejo de Lista Vacía
    if (isDataEmpty) {
        // Envolvemos el mensaje de lista vacía en el contenedor de 4 columnas, y le aplicamos el span de 4
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
                     <ListFooterMessage refetchData={refetchData} />
                 </div>
            </div>
        )
    }

    // 4. Mapeo: Layout de 4 columnas
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.map((item) => (
                <MarketCard 
                    key={item.id} 
                    item={item} 
                    isRequest={isTransportista} 
                />
            ))}
        </div>
    )
}

export default MercadoList
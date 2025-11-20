import React, { useState } from 'react'
import { PlusCircle, ChevronDown, Filter, CalendarDays, Box, Search } from 'lucide-react'
import { useMarket } from "../../hooks/useMarket" // Asumimos que este hook existe
import MercadoList from "./MercadoList" 


const FilterDropdown = ({ text }) => {
    const filterClasses = 'flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-neutral-800 px-4 py-2 text-white text-base font-normal hover:bg-neutral-700 transition-colors' 
    return (
        <button className={filterClasses}>
            <span className="leading-normal">{text}</span> 
            <ChevronDown size={16} className="text-white" /> 
        </button>
    )
}


const DashboardPage = () => { 
    const [user, setUser] = useState({ rol: 'TRANSPORTISTA' }) 
    const { data, loading, error, refetchData } = useMarket()
    const roleActiveBg = 'bg-amber-700 text-white shadow-md' 
    const roleInactiveChip = 'bg-neutral-800 text-white hover:bg-neutral-700' 
    const handleRoleChange = (newRol) => {
        setUser({ rol: newRol })
    }

    const currentRol = user.rol
    const isTransportista = currentRol === 'TRANSPORTISTA'


    // Botón 'Nueva publicación'
    const newPublicationButtonClass = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-700 text-white text-base font-bold hover:bg-amber-600 transition-colors shadow-md"
    return (
        <div className="p-4 md:p-10 bg-black min-h-screen"> 
            {/* PageHeading */}
            <div className="flex flex-wrap justify-between gap-4 items-center mb-6">
                <div className="flex min-w-72 flex-col gap-2">
                    <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Mercado Logístico</h1>
                    <p className="text-text-subtle text-base font-normal leading-normal">Explore ofertas y demandas de carga a lo largo del corredor.</p>
                </div>
            </div>


            {/* Action & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                {/* Chips de Filtro */}
                <div className="flex gap-3 overflow-x-auto w-full">
                    <FilterDropdown text="Filtrar por Ruta" />
                    <FilterDropdown text="Filtrar por Fecha" />
                    <FilterDropdown text="Tipo de Carga" />
                </div>
                {/* SingleButton: Nueva publicación */}
                <div className="flex w-full md:w-auto justify-end">
                   <button className={newPublicationButtonClass}>
                    <PlusCircle size={18} />
                    <span>Nueva publicación</span>
                   </button>
                </div>
            </div>


            <div className="flex items-center space-x-3 mb-6 p-2 rounded-xl bg-gray-900 w-fit">
                <span className="text-base text-gray-400 font-normal">Ver como:</span>
                <button
                    onClick={() => handleRoleChange('TRANSPORTISTA')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        isTransportista 
                            ? roleActiveBg 
                            : 'text-white' 
                    }`}
                >
                    Transportista
                </button>
                <button
                    onClick={() => handleRoleChange('EMPRESA')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        currentRol === 'EMPRESA' 
                            ? roleActiveBg // Naranja (Activo)
                            : 'text-white' // Texto blanco (Inactivo)
                    }`}
                >
                    Empresa
                </button>
            </div>


            {/* Renderizado del listado */}
            <MercadoList 
                data={data}
                loading={loading}
                error={error}
                role={currentRol} 
                refetchData={refetchData}
            />
        </div>
    )
}

export default DashboardPage
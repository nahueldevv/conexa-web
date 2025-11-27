import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { PlusCircle } from "lucide-react"
import { useMarket } from "../../hooks/useMarket"
import { useAuth } from "../../context/AuthContext"
import MercadoList from "./MercadoList"
import { FilterDropdown, SearchInput } from "../../components/common/MarketFilters"
import MarketDetailSidebar from "../../components/market/MarketDetailSidebar"

import { CARGO_TYPES, AVAILABLE_LOCATIONS } from "../../constants/marketOptions"

const DashboardPage = () => {
  const { user } = useAuth()
  const { data, loading, error, refetchData } = useMarket()
  const navigate = useNavigate()

  // Local State
  const [viewMode, setViewMode] = useState("all")
  const [selectedItem, setSelectedItem] = useState(null)
  
  // Filter State
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    cargoType: "",
    origin: "",
    destination: "" // added for scalability
  })

  const userRol = user?.rol

    // Lógica de filtrado
  const filteredData = data.filter((item) => {
    if (!item) return false
    if (viewMode === "all") return true
    if (viewMode === "offers") return !!item.vehicle_type
    if (viewMode === "requests") return !!item.required_vehicle_type
    return true
  })

  // Debounce Logic for Search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleRefetch()
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filters, viewMode])

  // Centralized Refetch Function
  const handleRefetch = () => {
    // Clean empty filters before sending
    const activeFilters = {
      ...filters,
      search: searchTerm,
      type: viewMode === "all" ? undefined : viewMode // Mapping 'offers'/'requests' to backend expected param if needed
    }
    
    // Call the hook's refetch function
    refetchData(activeFilters)
  }

  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // Styles
  const newPublicationButtonClass = `
    flex w-full md:w-auto min-w-[84px] max-w-[480px]
    cursor-pointer items-center justify-center gap-2
    overflow-hidden rounded-lg h-12 px-5
    bg-amber-500 dark:bg-amber-500 
    text-white dark:text-black 
    font-bold text-base tracking-[0.015em]
    hover:bg-amber-700 dark:hover:bg-amber-600 
    transition-all
  `
  const roleActiveBg = "bg-amber-500 text-white shadow-md"

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] font-display flex flex-col">
      {selectedItem && (
        <MarketDetailSidebar 
            item={selectedItem} 
            isOpen={!!selectedItem} 
            onClose={() => setSelectedItem(null)} 
        />
      )}
      
      <div className="flex-1 px-4 sm:px-8 md:px-12 lg:px-16 py-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          
          {/* HEADER */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-72 flex-col gap-1">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                Marketplace Dashboard
              </h1>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                Explore available transport offers and cargo requests.
              </p>
            </div>

            <button
              onClick={() => navigate("/marketplace/create")}
              className={newPublicationButtonClass}
            >
              <PlusCircle size={18} />
              <span>New Publication</span>
            </button>
          </div>

          {/* FILTERS BAR */}
          <div className="flex flex-col bg-[#F9FAFB] dark:bg-neutral-900 rounded-xl p-3 gap-4 border border-gray-100 dark:border-neutral-800">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between w-full">
              
              {/* Left: Search & Dropdowns */}
              <div className="flex flex-1 flex-wrap items-center gap-2 w-full">
                <SearchInput 
                  value={searchTerm} 
                  onChange={setSearchTerm} 
                  placeholder="Search routes, cargo..." 
                />
                
                <div className="h-8 w-px bg-gray-300 dark:bg-neutral-700 mx-1 hidden md:block"></div>

                <FilterDropdown 
                  label="Origen" 
                  value={filters.origin} 
                  options={AVAILABLE_LOCATIONS}
                  onChange={(val) => handleFilterChange('origin', val)} 
                />
                
                <FilterDropdown
                  label="Destino"
                  value={filters.destination}
                  options={AVAILABLE_LOCATIONS}
                  onChange={(val) => handleFilterChange('destination', val)}
                />
                
                <FilterDropdown 
                  label="Tipo de Carga" 
                  value={filters.cargoType} 
                  options={CARGO_TYPES}
                  onChange={(val) => handleFilterChange('cargoType', val)} 
                />
              </div>

              {/* Right: View Toggle (Dual Role) */}
              {userRol === "operador_dual" && (
                <div className="flex bg-white dark:bg-neutral-800 p-1 rounded-lg border border-gray-200 dark:border-neutral-700 shrink-0">
                  {["all", "offers", "requests"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                        viewMode === mode
                          ? roleActiveBg
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-700"
                      }`}
                    >
                      {mode === "all" ? "All" : mode === "offers" ? "Offers" : "Requests"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* LIST */}
          <MercadoList
            data={filteredData} // Pass raw data, backend handles filtering now
            loading={loading}
            error={error}
            refetchData={handleRefetch}
            onViewDetail={(item) => setSelectedItem(item)}
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
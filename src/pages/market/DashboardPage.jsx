import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { useMarket } from "../../hooks/useMarket";
import { useAuth } from "../../context/AuthContext";
import MercadoList from "./MercadoList";
import { FilterDropdown } from "../../components/common/MarketFilters";
import MarketDetailSidebar from "../../components/market/MarketDetailSidebar";

import {
  CARGO_TYPES,
  AVAILABLE_LOCATIONS,
} from "../../constants/marketOptions";

const DashboardPage = () => {
  const { user } = useAuth();
  const { data, loading, error, refetchData } = useMarket();
  const navigate = useNavigate();

  // Local State
  const [viewMode, setViewMode] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);

  // Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    cargoType: "",
    origin: "",
    destination: "",
  });

  const userRol = user?.rol;

  // --- 1. EFECTO DE CARGA (Solo Dropdowns/Toggles) ---
  useEffect(() => {
    const activeFilters = {
      ...filters,
      // El backend filtra por tipo si se lo mandamos
      type: viewMode === "all" ? undefined : viewMode,
    };
    refetchData(activeFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, viewMode]);

  // --- 2. LÓGICA DE FILTRADO DE TEXTO (Local) ---
  const filteredData = data.filter((item) => {
    if (!item) return false;

    // Filtro de Texto Local
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      (item.origin || "").toLowerCase().includes(term) ||
      (item.destination || "").toLowerCase().includes(term) ||
      (item.cargo_type || "").toLowerCase().includes(term);

    // Filtro de Vista (Refuerzo local para inmediatez visual)
    let matchesView = true;
    if (viewMode === "offers") matchesView = !!item.vehicle_type;
    if (viewMode === "requests") matchesView = !!item.required_vehicle_type;

    return matchesSearch && matchesView;
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] font-display flex flex-col transition-colors">
      {selectedItem && (
        <MarketDetailSidebar
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          {/* --- 1. HEADER --- */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Marketplace
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Conecta oferta y demanda en tiempo real a través del corredor.
              </p>
            </div>

            <button
              onClick={() => navigate("/marketplace/create")}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Plus size={18} />
              <span>Nueva Publicación</span>
            </button>
          </div>

          {/* --- 2. BARRA DE HERRAMIENTAS (Estilo MyPublications) --- */}
          <div className="flex flex-col gap-4">
            {/* Fila 1: Buscador + Separador + Toggles */}
            <div className="bg-white dark:bg-[#111] p-2 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 flex flex-col md:flex-row gap-2 items-center">
              {/* Buscador */}
              <div className="relative grow w-full md:w-auto group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar rutas, carga, empresas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:ring-0 sm:text-sm"
                />
              </div>

              {/* Lógica Dual: Separador y Botones */}
              {userRol === "operador_dual" && (
                <>
                  {/* Separador Vertical */}
                  <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-white/10 mx-2"></div>

                  {/* Toggle Container */}
                  <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-lg w-full md:w-auto">
                    <button
                      onClick={() => setViewMode("all")}
                      className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                        viewMode === "all"
                          ? "bg-white dark:bg-[#222] text-black dark:text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                      }`}
                    >
                      Todo
                    </button>
                    <button
                      onClick={() => setViewMode("offers")}
                      className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                        viewMode === "offers"
                          ? "bg-white dark:bg-blue-600 text-black dark:text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                      }`}
                    >
                      Ofertas
                    </button>
                    <button
                      onClick={() => setViewMode("requests")}
                      className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                        viewMode === "requests"
                          ? "bg-white dark:bg-amber-500 text-black dark:text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                      }`}
                    >
                      Demandas
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Fila 2: Filtros Dropdown */}
            <div className="flex flex-wrap gap-3">
              <FilterDropdown
                label="Origen"
                value={filters.origin}
                options={AVAILABLE_LOCATIONS}
                onChange={(val) => handleFilterChange("origin", val)}
              />

              <FilterDropdown
                label="Destino"
                value={filters.destination}
                options={AVAILABLE_LOCATIONS}
                onChange={(val) => handleFilterChange("destination", val)}
              />

              <FilterDropdown
                label="Tipo de Carga"
                value={filters.cargoType}
                options={CARGO_TYPES}
                onChange={(val) => handleFilterChange("cargoType", val)}
              />
            </div>
          </div>

          {/* --- 3. LISTADO --- */}
          <div className="min-h-[300px]">
            <MercadoList
              data={filteredData}
              loading={loading}
              error={error}
              refetchData={refetchData} // Pasamos refetchData aunque no se use para el filtro de texto, por si MercadoList tiene paginación
              onViewDetail={(item) => setSelectedItem(item)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

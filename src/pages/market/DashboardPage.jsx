import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useMarket } from "../../hooks/useMarket";
import { useAuth } from "../../context/AuthContext";
import MercadoList from "./MercadoList";
import FilterDropdown from "../../components/common/FilterDropdown";

import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuth();
  const { data, loading, error, refetchData } = useMarket();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState("all");
  const userRol = user?.rol;

  const filteredData = data.filter((item) => {
    if (!item) return false;
    if (viewMode === "all") return true;
    if (viewMode === "offers") return !!item.vehicle_type;
    if (viewMode === "requests") return !!item.required_vehicle_type;
    return true;
  });

  // BOTÓN NUEVA PUBLICACIÓN con modo oscuro
  const newPublicationButtonClass = `
    flex w-full md:w-auto min-w-[84px] max-w-[480px]
    cursor-pointer items-center justify-center gap-2
    overflow-hidden rounded-lg h-12 px-5
    bg-amber-500 dark:bg-amber-500 
    text-white dark:text-black 
    font-bold text-base tracking-[0.015em]
    hover:bg-amber-700 dark:hover:bg-amber-500 
    transition-all
  `;

  const roleActiveBg = `
    bg-amber-500 text-white shadow-md 
    dark:bg-amber-500 dark:text-black
  `;

  return (
    <div className="animate-fadeIn px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
        {/* HEADINGS */}
        <div className="flex flex-wrap justify-between gap-4 items-center mb-6 px-4 md:px-0">
          <div className="flex min-w-72 flex-col gap-2">
            <h1
              className="text-4xl font-black leading-tight tracking-[-0.033em]
              text-gray-900 dark:text-gray-100"
            >
              Mercado Logístico
            </h1>

            <p
              className="text-base font-normal leading-normal
              text-gray-600 dark:text-gray-400"
            >
              Explore ofertas y demandas de carga a lo largo del corredor.
            </p>
          </div>
        </div>

        {/* FILTERS + NEW PUBLICATION */}
        <div className="flex flex-col bg-[#F9FAFB] dark:bg-neutral-900 rounded py-3 justify-between md:flex-row gap-4 items-center mb-6 px-4 md:px-4">
          <div className="flex gap-3 overflow-x-auto">
            <FilterDropdown text="Filtrar por Ruta" />
            <FilterDropdown text="Filtrar por Fecha" />
            <FilterDropdown text="Tipo de Carga" />
          </div>

          <div className="flex w-full md:w-auto">
            <button
              onClick={() => navigate("/mercado/create")}
              className={newPublicationButtonClass}
            >
              <PlusCircle size={20} />
              <span>Nueva Publicación</span>
            </button>
          </div>
        </div>

        {/* VIEW MODE - OPERADOR DUAL */}
        {userRol === "operador_dual" && (
          <div
            className="flex items-center space-x-4 mb-6 p-2 rounded-xl px-4 py-4
            bg-[#F9FAFB] text-black w-fit
            dark:bg-neutral-900 dark:text-white"
          >
            <button
              onClick={() => setViewMode("all")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                ${
                  viewMode === "all"
                    ? roleActiveBg
                    : "text-gray-900 dark:text-white bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 border border-gray-300 dark:border-transparent"
                }
              `}
            >
              Todo
            </button>

            <button
              onClick={() => setViewMode("offers")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                ${
                  viewMode === "offers"
                    ? roleActiveBg
                    : "text-gray-900 dark:text-white bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 border border-gray-300 dark:border-transparent"
                }
              `}
            >
              Ofertas
            </button>

            <button
              onClick={() => setViewMode("requests")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                ${
                  viewMode === "requests"
                    ? roleActiveBg
                    : "text-gray-900 dark:text-white bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 border border-gray-300 dark:border-transparent"
                }
              `}
            >
              Pedidos
            </button>
          </div>
        )}

        <div className="px-4 md:px-0">
          <MercadoList
            data={filteredData}
            loading={loading}
            error={error}
            refetchData={refetchData}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

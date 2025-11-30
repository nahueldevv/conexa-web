import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Filter,
  Calendar,
  User,
  ArrowUpDown,
  Plus,
  Box,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { getMyShipments } from "../../services/shipment.service"
import { useAuth } from "../../context/AuthContext"

// Badge de Estado con diseño mejorado
const StatusBadge = ({ status }) => {
  let styles = "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400"
  let dotColor = "bg-gray-400"

  // Normalizar status para comparación
  const s = status?.toLowerCase() || ""

  if (s.includes("tránsito") || s.includes("transit")) {
    styles =
      "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
    dotColor = "bg-blue-500"
  } else if (s.includes("entregado") || s.includes("delivered")) {
    styles =
      "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border border-green-200 dark:border-green-500/20"
    dotColor = "bg-green-500"
  } else if (s.includes("pendiente") || s.includes("pending")) {
    styles =
      "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500 border border-amber-200 dark:border-amber-500/20"
    dotColor = "bg-amber-500"
  } else if (s.includes("retrasado") || s.includes("delayed")) {
    styles =
      "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20"
    dotColor = "bg-red-500"
  } else if (s.includes("aduana") || s.includes("customs")) {
    styles =
      "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20"
    dotColor = "bg-purple-500"
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${styles}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      {status || "Desconocido"}
    </span>
  )
}

const MyShipmentsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Paginación visual (simulada)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const data = await getMyShipments()
        setShipments(data)
      } catch (error) {
        console.error("Error cargando envíos:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchShipments()
  }, [])

  // Filtrado
  const filteredShipments = shipments.filter(
    (ship) =>
      ship.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ship.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ship.destination?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Paginación Lógica
  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage)
  const paginatedData = filteredShipments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Función para determinar el nombre del cliente/contraparte
  const getCounterpartName = (ship) => {
    if (user?.id === ship.transporterId) {
      return ship.companyName || "Empresa Cliente"
    } else {
      return ship.transporterName || "Transportista"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] font-display transition-colors">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* --- HEADER --- */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Envíos
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gestiona y rastrea todos tus contratos logísticos activos.
            </p>
          </div>

          <button
            onClick={() => navigate("/marketplace/create")}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Plus size={18} />
            <span>Nuevo Envío</span>
          </button>
        </div>

        {/* --- FILTROS --- */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search
                className="text-gray-400 group-focus-within:text-amber-500 transition-colors"
                size={20}
              />
            </div>
            <input
              type="text"
              placeholder="Buscar por ID, origen o destino..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 shadow-sm"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Estado: Todos", icon: Filter },
              { label: "Rango de Fecha", icon: Calendar },
              { label: "Cliente", icon: User },
              { label: "Más Recientes", icon: ArrowUpDown },
            ].map((filter, idx) => (
              <button
                key={idx}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <filter.icon size={16} className="text-gray-400" />
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* --- TABLA DE ENVÍOS --- */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Cargando tus envíos...
              </p>
            </div>
          ) : filteredShipments.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Box size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                No se encontraron envíos
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                No tienes contratos activos que coincidan con tu búsqueda.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Shipment ID
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Ruta
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Contraparte
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Fecha Inicio
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {paginatedData.map((ship) => (
                      <tr
                        key={ship.id}
                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm font-bold text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors">
                            #{ship.id.slice(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {ship.origin?.split(",")[0] || ship.origin}{" "}
                              <span className="text-gray-400">→</span>{" "}
                              {ship.destination?.split(",")[0] || ship.destination}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-0.5">
                              {ship.cargoType || "Carga General"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {getCounterpartName(ship)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                          {new Date(
                            ship.created_at || ship.startDate
                          ).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={ship.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() =>
                              navigate(
                                `/marketplace/shipments/${ship.id}/tracking`
                              )
                            }
                            className="text-sm font-bold text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 flex items-center justify-end gap-1 transition-colors"
                          >
                            <Eye size={16} />
                            Ver Detalles
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              {filteredShipments.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Mostrando{" "}
                    <span className="font-bold text-gray-900 dark:text-white">
                      {Math.min(
                        filteredShipments.length,
                        (currentPage - 1) * itemsPerPage + 1
                      )}
                    </span>{" "}
                    a{" "}
                    <span className="font-bold text-gray-900 dark:text-white">
                      {Math.min(
                        filteredShipments.length,
                        currentPage * itemsPerPage
                      )}
                    </span>{" "}
                    de{" "}
                    <span className="font-bold text-gray-900 dark:text-white">
                      {filteredShipments.length}
                    </span>{" "}
                    resultados
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={16} /> Anterior
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Siguiente <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default MyShipmentsPage

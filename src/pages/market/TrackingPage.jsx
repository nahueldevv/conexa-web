import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  MapPin,
  Truck,
  Package,
  Calendar,
  Circle,
  Plus,
  MoreVertical,
  Navigation,
  Share2,
  Download,
} from "lucide-react"
import { getShipmentById } from "../../services/shipment.service"
import {
  getTrackingHistory,
  addTrackingEvent,
} from "../../services/tracking.service"
import { useAuth } from "../../context/AuthContext"

// --- HELPER: Formateo seguro de fechas ---
const formatDate = (dateString) => {
  if (!dateString) return "Pendiente"
  try {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch{
    return "Fecha inválida"
  }
}

// --- SUB-COMPONENTE: Grid Item para Detalles ---
const DetailItem = ({
  label,
  value,
  subValue,
  icon: Icon,
  iconColor = "text-gray-400",
}) => (
  <div className="flex flex-col gap-1">
    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
      {label}
    </p>
    <div className="flex items-center gap-2">
      {Icon && <Icon size={16} className={iconColor} />}
      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
        {value || "N/A"}
      </p>
    </div>
    {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
  </div>
)

// --- SUB-COMPONENTE: Timeline Event (Mejorado) ---
const TimelineEvent = ({ event, isFirst, isLast }) => {
  const formattedDateTime = new Date(event.timestamp).toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  })

  const locationText = event.location ? `, ${event.location}` : ""

  return (
    <div className="relative pb-8 last:pb-0">
      {/* Línea conectora */}
      {!isLast && (
        <span
          className="absolute left-3.5 top-3.5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-white/10"
          aria-hidden="true"
        ></span>
      )}

      <div className="relative flex items-start gap-4">
        {/* Icono */}
        <div className="relative z-10 shrink-0">
          <div
            className={`
              flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-white dark:ring-[#111]
              ${
                isFirst
                  ? "bg-amber-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                  : "bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400"
              }
            `}
          >
            {isFirst ? (
              <MapPin size={14} />
            ) : (
              <Circle size={10} fill="currentColor" />
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="min-w-0 flex-1 pt-0.5">
          <p
            className={`text-sm font-semibold mb-1 ${
              isFirst
                ? "text-gray-900 dark:text-white"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {event.description || event.status}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {formattedDateTime}
            {locationText && (
              <span className="text-amber-600 dark:text-amber-500 font-medium">
                {locationText}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

const TrackingPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [shipment, setShipment] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const [showEventModal, setShowEventModal] = useState(false)
  const [newEventData, setNewEventData] = useState({
    status: "",
    description: "",
    location: "",
  })
  const [updating, setUpdating] = useState(false)

  const fetchAllData = async () => {
    try {
      const [shipData, historyData] = await Promise.all([
        getShipmentById(id),
        getTrackingHistory(id),
      ])
      setShipment(shipData)
      setHistory(
        historyData.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        )
      )
    } catch (error) {
      console.error("Error cargando tracking:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [id])

  const handleAddEvent = async (e) => {
    e.preventDefault()
    if (!newEventData.description) return
    setUpdating(true)
    try {
      await addTrackingEvent(id, newEventData)
      await fetchAllData()
      setShowEventModal(false)
      setNewEventData({ status: "", description: "", location: "" })
    } catch {
      alert("No se pudo registrar el evento.")
    } finally {
      setUpdating(false)
    }
  }

  const isTransporter = shipment && user?.id === shipment.transporterId

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || ""
    if (s.includes("pendiente"))
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500"
    if (s.includes("tránsito"))
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
    if (s.includes("entregado"))
      return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
    return "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!shipment)
    return (
      <div className="p-10 text-center dark:text-white">
        Envío no encontrado.
      </div>
    )

  const mapImage =
    shipment.mapUrl ||
    "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] font-display text-gray-900 dark:text-white pb-20 transition-colors">
      {/* --- HEADER --- */}
      <div className="bg-white dark:bg-[#0A0A0A] pt-6 pb-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto sticky top-0 z-20 shadow-sm border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-2 mb-2 text-sm font-medium">
          <span
            onClick={() => navigate("/marketplace/shipments")}
            className="text-amber-600 dark:text-amber-500 cursor-pointer hover:underline"
          >
            Envíos
          </span>
          <span className="text-gray-400 dark:text-gray-600">/</span>
          <span className="text-gray-500 dark:text-gray-300">
            #{id.slice(0, 8)}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            Detalles de Envío y Tracking
          </h1>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
              <Share2 size={18} />
              <span>Compartir</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">
              <Download size={18} />
              <span>Documentos</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* --- 1. TARJETA DE DETALLES --- */}
        <section className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-white/10 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-8">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Shipment ID
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                #{shipment.id.slice(0, 8)}
              </p>
            </div>
            <DetailItem label="Origen" value={shipment.origin} />
            <DetailItem label="Destino" value={shipment.destination} />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Estado Actual
              </p>
              <div
                className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full w-fit ${getStatusColor(
                  shipment.status
                )}`}
              >
                <span className="h-2 w-2 rounded-full bg-current animate-pulse"></span>
                <span className="text-sm font-bold capitalize">
                  {shipment.status || "En Curso"}
                </span>
              </div>
            </div>
            <DetailItem
              label="Fecha de Recogida"
              value={formatDate(shipment.startDate || shipment.readyDate)}
              icon={Calendar}
            />
            <DetailItem
              label="Entrega Estimada"
              value="Calculando..."
              icon={Calendar}
            />
            <DetailItem
              label="Transportista"
              value={shipment.transporterName || "Logística Externa"}
              subValue={shipment.transporterEmail}
              icon={Truck}
              iconColor="text-blue-500"
            />
            <DetailItem
              label="Tipo de Carga"
              value={shipment.cargoType || "General"}
              subValue={`${shipment.weightKg} kg`}
              icon={Package}
              iconColor="text-amber-500"
            />
          </div>
        </section>

        {/* --- 2. LAYOUT INFERIOR (MAPA + TIMELINE) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mapa (2/3) - Altura fija de 500px */}
          <div className="lg:col-span-2 h-[500px]">
            <div className="h-full w-full rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden relative group bg-gray-100 dark:bg-[#111]">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105 duration-700"
                style={{ backgroundImage: `url('${mapImage}')` }}
              ></div>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-black/70 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-2">
                  <Navigation size={12} className="text-amber-500" /> Vista
                  Satelital
                </span>
              </div>
            </div>
          </div>

          {/* Timeline (1/3) - Altura forzada a 500px para igualar mapa */}
          <div className="h-[500px] flex flex-col bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
            {/* Header Fijo */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5 shrink-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Historial
              </h3>
              {isTransporter && (
                <button
                  onClick={() => setShowEventModal(true)}
                  className="p-1.5 bg-amber-500 hover:bg-amber-600 rounded text-black transition-colors"
                  title="Actualizar Estado"
                >
                  <Plus size={18} />
                </button>
              )}
            </div>

            {/* Lista Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <ul className="space-y-4">
                {history.length > 0 ? (
                  history.map((event, index) => (
                    <li key={event.id || index}>
                      <TimelineEvent
                        event={event}
                        isFirst={index === 0}
                        isLast={index === history.length - 1}
                      />
                    </li>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 mb-2 flex items-center justify-center">
                      <Calendar className="text-gray-400" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-500">
                      Sin eventos
                    </h4>
                    <span className="text-xs text-gray-600">
                      El seguimiento comenzará pronto.
                    </span>
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODAL: AGREGAR EVENTO --- */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#191919] border border-gray-200 dark:border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Actualizar Estado
            </h3>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-gray-500 font-bold mb-1">
                  Estado / Título
                </label>
                <input
                  type="text"
                  placeholder="Ej: En Aduana"
                  className="w-full bg-gray-50 dark:bg-[#111] border border-gray-300 dark:border-white/10 rounded-lg p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  value={newEventData.status}
                  onChange={(e) =>
                    setNewEventData({ ...newEventData, status: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-gray-500 font-bold mb-1">
                  Ubicación Actual
                </label>
                <input
                  type="text"
                  placeholder="Ej: Paso de Jama"
                  className="w-full bg-gray-50 dark:bg-[#111] border border-gray-300 dark:border-white/10 rounded-lg p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  value={newEventData.location}
                  onChange={(e) =>
                    setNewEventData({
                      ...newEventData,
                      location: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-gray-500 font-bold mb-1">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalles adicionales..."
                  className="w-full bg-gray-50 dark:bg-[#111] border border-gray-300 dark:border-white/10 rounded-lg p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none resize-none transition-all"
                  value={newEventData.description}
                  onChange={(e) =>
                    setNewEventData({
                      ...newEventData,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold shadow-lg disabled:opacity-50"
                >
                  {updating ? "Guardando..." : "Registrar Evento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrackingPage

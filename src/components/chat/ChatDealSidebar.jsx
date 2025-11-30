import React from "react"
import { useNavigate } from "react-router-dom"
import {
  X,
  MapPin,
  Flag,
  Package,
  User,
  Briefcase,
  ArrowRight,
  ExternalLink,
} from "lucide-react"

const ChatDealSidebar = ({ isOpen, onClose, contextData, partnerName, conversationId }) => {
  const navigate = useNavigate()

  // Si está cerrado, no renderizamos (o podríamos usar translate para animar)
  // Usamos clases condicionales para la animación de entrada
  const sidebarClasses = `
    absolute top-0 right-0 h-full w-[360px] 
    bg-white dark:bg-[#191919] 
    border-l border-gray-200 dark:border-white/10 
    shadow-2xl z-40 flex flex-col 
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "translate-x-full"}
  `

  const handleStartAgreement = () => {
    if (!contextData) return
    navigate(`/marketplace/agreement/${contextData.marketItemId}`, {
      state: {
        dealType: contextData.type,
        marketItemData: contextData,
        selectedChatId: conversationId
      },
    })
  }

  // Renderizado condicional del contenido si no hay datos
  const renderContent = () => {
    if (!contextData) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-60">
          <Package size={48} className="mb-4 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400">
            No hay una publicación activa asociada a esta conversación.
          </p>
        </div>
      )
    }

    return (
      <>
        {/* SECCIÓN 1: DETALLES DE LA PUBLICACIÓN */}
        <div className="p-6 border-b border-gray-200 dark:border-white/10">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Detalles de la Publicación
          </h3>

          {/* Título Principal (Ámbar) */}
          <h4 className="text-lg font-bold text-amber-600 dark:text-amber-500 mb-4 leading-tight">
            {contextData.title}
          </h4>

          {/* Lista de Detalles (Con espacio vertical space-y-4) */}
          <div className="space-y-4">
            {/* Origen */}
            <div className="flex items-start gap-3">
              <MapPin className="text-gray-400 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">
                  Origen
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {contextData.title.split("➝")[0]?.trim() || "N/A"}
                </p>
              </div>
            </div>

            {/* Destino */}
            <div className="flex items-start gap-3">
              <Flag className="text-gray-400 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">
                  Destino
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {contextData.title.split("➝")[1]?.trim() || "N/A"}
                </p>
              </div>
            </div>

            {/* Carga */}
            <div className="flex items-start gap-3">
              <Package className="text-gray-400 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">
                  Carga / Vehículo
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {contextData.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: INFORMACIÓN DEL CONTACTO */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Información del Contacto
          </h3>
          <div className="flex items-center gap-4">
            {/* Avatar Grande */}
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-gray-500 border border-gray-300 dark:border-white/10">
              <User size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">
                {partnerName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Briefcase size={12} />
                <span>Usuario Verificado</span>
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className={sidebarClasses}>
      {/* HEADER DE LA SIDEBAR (Botón Cerrar) */}
      {/* Lo hacemos flotante o integrado, en este diseño no tiene header explícito salvo el contenido */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors z-50"
      >
        <X size={20} />
      </button>

      {/* CONTENIDO SCROLLABLE */}
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>

      {/* FOOTER (BOTONES DE ACCIÓN) */}
      {/* mt-auto para empujarlo al fondo */}
      {contextData && (
        <div className="mt-auto p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#191919]">
          <button
            onClick={handleStartAgreement}
            className="w-full h-12 rounded-lg bg-amber-500 hover:bg-amber-600 text-white dark:text-black font-bold text-base shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Finalizar Trato</span>
            <ArrowRight size={18} />
          </button>

          <button
            // Aquí podrías navegar al detalle del post original si tienes el ID
            className="mt-3 w-full h-12 rounded-lg bg-white dark:bg-[#2D2D2D] border border-gray-200 dark:border-transparent text-gray-700 dark:text-white font-bold text-base hover:bg-gray-100 dark:hover:bg-[#3D3D3D] transition-colors flex items-center justify-center gap-2"
          >
            <span>Ver Publicación Completa</span>
            <ExternalLink size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default ChatDealSidebar

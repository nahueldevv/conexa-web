import React, { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import {
  Check,
  ChevronRight,
  ArrowLeft,
  FileText,
  CreditCard,
  ShieldCheck,
  MapPin,
  Package,
  Truck,
  User,
  Building2,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  Clock,
  AlertCircle,
  Info,
} from "lucide-react"
import {
  getListingById,
  getDocumentTypes,
} from "../../services/market.service"
import { createShipment } from "../../services/shipment.service"
import { useAuth } from "../../context/AuthContext"

const CATEGORY_CONFIG = {
  LEGAL: { label: "Legal / Empresa", icon: Building2, color: "text-blue-400" },
  DRIVER: { label: "Conductor", icon: User, color: "text-green-400" },
  VEHICLE: { label: "Vehículo", icon: Truck, color: "text-amber-400" },
  CARGO: {
    label: "Carga / Mercancía",
    icon: Package,
    color: "text-purple-400",
  },
  DEFAULT: { label: "Otros", icon: FileText, color: "text-gray-400" },
}

const Stepper = ({ currentStep }) => {
  const steps = [
    { id: 1, label: "Revisión", icon: FileText },
    { id: 2, label: "Facturación", icon: CreditCard },
    { id: 3, label: "Confirmar", icon: ShieldCheck },
  ]

  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep
        const isCompleted = step.id < currentStep
        const Icon = step.icon

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2
                  ${
                    isActive || isCompleted
                      ? "bg-amber-500 border-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                      : "bg-[#111] border-gray-700 text-gray-500"
                  }
                `}
              >
                {isCompleted ? (
                  <Check size={20} strokeWidth={3} />
                ) : (
                  <Icon size={20} />
                )}
              </div>
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isActive ? "text-amber-500" : "text-gray-600"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  h-1 w-16 md:w-32 mx-2 rounded mb-6 transition-all duration-500
                  ${isCompleted ? "bg-amber-500" : "bg-gray-800"}
                `}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

const AgreementPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [dealData, setDealData] = useState(null)
  const [groupedDocs, setGroupedDocs] = useState({})
  const [categoriesOrder, setCategoriesOrder] = useState([])
  const [selectedDocs, setSelectedDocs] = useState([])
  const [resultModal, setResultModal] = useState(null)

  const [billingData, setBillingData] = useState({
    enterpriseName: user?.enterpriseName || "",
    taxId: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    country: "",
    paymentMethod: "transfer",
    notes: "",
  })

  const conversationId =
    location.state?.selectedChatId ||
    sessionStorage.getItem(`deal_chat_id_${id}`)

  const dealType = location.state?.dealType || "request"

  const handleToggleDoc = (docId) => {
    setSelectedDocs((prev) => {
      if (prev.includes(docId)) {
        return prev.filter((id) => id !== docId)
      } else {
        return [...prev, docId]
      }
    })
  }

  const handleBillingChange = (field, value) => {
    setBillingData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    if (conversationId) {
      navigate("/messages", {
        state: { selectedChatId: conversationId },
      })
    } else {
      navigate(-1)
    }
  }

  useEffect(() => {
    if (location.state?.selectedChatId) {
      sessionStorage.setItem(
        `deal_chat_id_${id}`,
        location.state.selectedChatId
      )
    }

    const fetchData = async () => {
      try {
        const [listingData, allDocs] = await Promise.all([
          getListingById(dealType, id),
          getDocumentTypes(),
        ])

        setDealData(listingData)

        let categoriesToShow = []
        if (dealType === "offer") {
          categoriesToShow = ["LEGAL", "DRIVER", "VEHICLE", "CARGO"]
        } else {
          categoriesToShow = ["LEGAL", "CARGO"]
        }

        setCategoriesOrder(categoriesToShow)

        const normalizedDocs = allDocs.map((d) => ({
          ...d,
          category: d.category ? d.category.toUpperCase() : "DEFAULT",
        }))

        const relevantDocs = normalizedDocs.filter((doc) =>
          categoriesToShow.includes(doc.category)
        )

        const grouped = relevantDocs.reduce((acc, doc) => {
          const cat = doc.category
          if (!acc[cat]) acc[cat] = []
          acc[cat].push(doc)
          return acc
        }, {})

        setGroupedDocs(grouped)
        setSelectedDocs(relevantDocs.map((d) => d.id))
      } catch (error) {
        console.error("Error cargando detalles:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, location.state, dealType])

  const handleNext = () => setCurrentStep((prev) => prev + 1)
  const handleBack = () => setCurrentStep((prev) => prev - 1)

  const handleFinalize = async () => {
    if (!conversationId) {
      setResultModal({
        type: "error",
        message: "Error de sesión: Falta ID de chat.",
      })
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        conversationId: conversationId,
        requiredDocuments: selectedDocs,
        [dealType === "offer" ? "offerId" : "requestId"]: id,
        billingData: billingData,
      }

      const res = await createShipment(payload)
      const trackingId = res.id || res.shipmentId || res.shipment?.id

      setResultModal({ type: "success", trackingId })
    } catch (error) {
      console.error("Error creando acuerdo:", error)
      setResultModal({
        type: "error",
        message: "No se pudo formalizar el acuerdo. Intenta nuevamente.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoToTracking = () => {
    if (resultModal?.trackingId) {
      navigate(`/marketplace/shipments/${resultModal.trackingId}/tracking`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">Preparando contrato...</p>
        </div>
      </div>
    )
  }

  if (!dealData) return null

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-display text-white flex flex-col items-center py-12 px-4 relative">
      <div className="w-full max-w-3xl mb-8 text-center">
        <button
          onClick={handleCancel}
          className="text-gray-500 hover:text-white flex items-center gap-2 mb-4 mx-auto transition-colors"
        >
          <ArrowLeft size={16} /> Cancelar y Volver
        </button>
        <h1 className="text-3xl font-black text-white mb-2">
          Formalización de Servicio
        </h1>
        <p className="text-gray-400">
          Completa los pasos para generar el contrato digital y comenzar el
          seguimiento.
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <Stepper currentStep={currentStep} />

        <div className="bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl animate-fadeInUp">
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-amber-500 border-b border-white/10 pb-4 mb-6">
                  Detalles de la Operación
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#191919] p-5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-4 text-gray-400 uppercase text-xs font-bold tracking-wider">
                      <MapPin size={16} /> Ruta
                    </div>
                    <div className="flex flex-col gap-4 relative">
                      <div className="absolute left-[3px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-amber-500/50 to-amber-500/10"></div>
                      <div className="pl-4 relative">
                        <span className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-amber-500"></span>
                        <span className="text-xs text-gray-500 block">
                          Origen
                        </span>
                        <p className="text-lg font-medium text-white">
                          {dealData.origin}
                        </p>
                      </div>
                      <div className="pl-4 relative">
                        <span className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-gray-700 border border-gray-500"></span>
                        <span className="text-xs text-gray-500 block">
                          Destino
                        </span>
                        <p className="text-lg font-medium text-white">
                          {dealData.destination}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#191919] p-5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-4 text-gray-400 uppercase text-xs font-bold tracking-wider">
                      <Package size={16} /> Especificaciones
                    </div>
                    <ul className="space-y-4">
                      <li className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-gray-500 text-sm">
                          Tipo de Carga
                        </span>
                        <span className="font-medium capitalize text-white">
                          {dealData.cargo_type}
                        </span>
                      </li>
                      <li className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-gray-500 text-sm">
                          Peso Total
                        </span>
                        <span className="font-medium text-white">
                          {dealData.weight_kg} kg
                        </span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Vehículo</span>
                        <span className="font-medium capitalize text-white">
                          {dealData.vehicle_type ||
                            dealData.required_vehicle_type}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText size={20} className="text-amber-500" />
                    Documentación a Solicitar
                  </h3>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {dealType === "offer"
                      ? "Validar Transportista"
                      : "Validar Carga"}
                  </span>
                </div>

                <div className="space-y-6">
                  {categoriesOrder.map((category) => {
                    const docs = groupedDocs[category]
                    if (!docs || docs.length === 0) return null
                    const Config =
                      CATEGORY_CONFIG[category] || CATEGORY_CONFIG.DEFAULT
                    const CatIcon = Config.icon

                    return (
                      <div
                        key={category}
                        className="bg-[#191919] border border-white/5 rounded-xl p-4"
                      >
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                          <CatIcon size={18} className={Config.color} />
                          <h4
                            className={`text-sm font-bold uppercase tracking-wide ${Config.color}`}
                          >
                            {Config.label}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {docs.map((doc) => (
                            <label
                              key={doc.id}
                              className={`
                                flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 select-none
                                ${
                                  selectedDocs.includes(doc.id)
                                    ? "bg-amber-500/10 border-amber-500"
                                    : "bg-[#111] border-white/5 hover:border-white/20"
                                }
                              `}
                            >
                              <div
                                className={`
                                  w-5 h-5 rounded flex items-center justify-center border transition-colors shrink-0
                                  ${
                                    selectedDocs.includes(doc.id)
                                      ? "bg-amber-500 border-amber-500"
                                      : "border-gray-600 bg-transparent"
                                  }
                                `}
                              >
                                {selectedDocs.includes(doc.id) && (
                                  <Check size={14} className="text-black" />
                                )}
                              </div>
                              <input
                                type="checkbox"
                                className="hidden"
                                checked={selectedDocs.includes(doc.id)}
                                onChange={() => handleToggleDoc(doc.id)}
                              />
                              <span
                                className={`text-sm font-medium ${
                                  selectedDocs.includes(doc.id)
                                    ? "text-white"
                                    : "text-gray-300"
                                }`}
                              >
                                {doc.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  Datos de Facturación
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Completa la información para la generación de la factura y
                  orden de pago.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#191919] p-6 rounded-xl border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Building2 size={16} />
                    Información Empresarial
                  </h3>

                  <div>
                    <label className="block text-xs uppercase text-gray-500 font-bold mb-2">
                      Razón Social
                    </label>
                    <input
                      type="text"
                      value={billingData.enterpriseName}
                      disabled
                      className="w-full bg-[#111] border border-gray-700 rounded-lg p-3 text-gray-300 cursor-not-allowed text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-gray-500 font-bold mb-2">
                      NIT / RUT / CUIT <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={billingData.taxId}
                      onChange={(e) =>
                        handleBillingChange("taxId", e.target.value)
                      }
                      placeholder="20-12345678-9"
                      className="w-full bg-[#111] border border-gray-700 rounded-lg p-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-gray-500 font-bold mb-2">
                      País <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={billingData.country}
                      onChange={(e) =>
                        handleBillingChange("country", e.target.value)
                      }
                      placeholder="Argentina, Chile, Paraguay..."
                      className="w-full bg-[#111] border border-gray-700 rounded-lg p-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-gray-500 font-bold mb-2">
                      Ciudad <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={billingData.city}
                      onChange={(e) =>
                        handleBillingChange("city", e.target.value)
                      }
                      placeholder="Buenos Aires, Santiago..."
                      className="w-full bg-[#111] border border-gray-700 rounded-lg p-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="bg-[#191919] p-6 rounded-xl border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User size={16} />
                    Contacto y Dirección
                  </h3>

                  <div>
                    <label className="block text-xs uppercase text-gray-500 font-bold mb-2">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                      <input
                        type="email"
                        value={billingData.email}
                        onChange={(e) =>
                          handleBillingChange("email", e.target.value)
                        }
                        placeholder="contacto@empresa.com"
                        className="w-full bg-[#111] border border-gray-700 rounded-lg p-3 pl-10 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-gray-500 font-bold mb-2">
                      Teléfono <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                      <input
                        type="tel"
                        value={billingData.phone}
                        onChange={(e) =>
                          handleBillingChange("phone", e.target.value)
                        }
                        placeholder="+54 11 1234-5678"
                        className="w-full bg-[#111] border border-gray-700 rounded-lg p-3 pl-10 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-gray-500 font-bold mb-2">
                      Dirección Completa <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={billingData.address}
                      onChange={(e) =>
                        handleBillingChange("address", e.target.value)
                      }
                      placeholder="Calle, número, piso, departamento..."
                      className="w-full bg-[#111] border border-gray-700 rounded-lg p-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-gray-500 font-bold mb-2">
                      Método de Pago <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <CreditCard
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                      <select
                        value={billingData.paymentMethod}
                        onChange={(e) =>
                          handleBillingChange("paymentMethod", e.target.value)
                        }
                        className="w-full bg-[#111] border border-gray-700 rounded-lg p-3 pl-10 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-sm transition-colors appearance-none cursor-pointer"
                      >
                        <option value="transfer">Transferencia Bancaria</option>
                        <option value="check">Cheque</option>
                        <option value="cash">Efectivo</option>
                        <option value="credit">Tarjeta de Crédito</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#191919] p-6 rounded-xl border border-white/5">
                <label className="block text-xs uppercase text-gray-500 font-bold mb-2">
                  Notas Adicionales (Opcional)
                </label>
                <textarea
                  value={billingData.notes}
                  onChange={(e) =>
                    handleBillingChange("notes", e.target.value)
                  }
                  placeholder="Información adicional sobre facturación, condiciones especiales, etc."
                  rows={4}
                  className="w-full bg-[#111] border border-gray-700 rounded-lg p-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-sm transition-colors resize-none"
                />
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
                <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-300">
                  Los campos marcados con <span className="text-red-400">*</span>{" "}
                  son obligatorios. Esta información será utilizada para generar
                  la factura y la orden de pago del servicio.
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)] mb-6">
                  <ShieldCheck size={48} className="text-green-500" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2">
                  ¡Todo Listo para Firmar!
                </h2>
                <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                  Revisa todos los detalles antes de confirmar. Se notificará a
                  la contraparte para que cargue los documentos solicitados.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#191919] p-6 rounded-xl border border-white/5">
                  <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MapPin size={16} />
                    Resumen de la Operación
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-gray-400 text-sm">Ruta</span>
                      <span className="text-white font-medium text-sm">
                        {dealData.origin} → {dealData.destination}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-gray-400 text-sm">Carga</span>
                      <span className="text-white font-medium text-sm capitalize">
                        {dealData.cargo_type}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-gray-400 text-sm">Peso</span>
                      <span className="text-white font-medium text-sm">
                        {dealData.weight_kg} kg
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Vehículo</span>
                      <span className="text-white font-medium text-sm capitalize">
                        {dealData.vehicle_type ||
                          dealData.required_vehicle_type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#191919] p-6 rounded-xl border border-white/5">
                  <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileText size={16} />
                    Documentación
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-gray-400 text-sm">
                        Documentos Solicitados
                      </span>
                      <span className="text-white font-bold text-sm">
                        {selectedDocs.length}
                      </span>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-gray-500 mb-2">
                        Categorías incluidas:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {categoriesOrder.map((cat) => {
                          const Config =
                            CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.DEFAULT
                          return (
                            <span
                              key={cat}
                              className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded text-xs font-medium border border-amber-500/20"
                            >
                              {Config.label}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#191919] p-6 rounded-xl border border-white/5">
                <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CreditCard size={16} />
                  Datos de Facturación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">
                      Razón Social
                    </span>
                    <p className="text-white font-medium text-sm">
                      {billingData.enterpriseName || "No especificado"}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">
                      NIT / RUT / CUIT
                    </span>
                    <p className="text-white font-medium text-sm">
                      {billingData.taxId || "No especificado"}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">
                      Email
                    </span>
                    <p className="text-white font-medium text-sm">
                      {billingData.email || "No especificado"}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">
                      Teléfono
                    </span>
                    <p className="text-white font-medium text-sm">
                      {billingData.phone || "No especificado"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-xs text-gray-500 block mb-1">
                      Dirección
                    </span>
                    <p className="text-white font-medium text-sm">
                      {billingData.address
                        ? `${billingData.address}, ${billingData.city}, ${billingData.country}`
                        : "No especificado"}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">
                      Método de Pago
                    </span>
                    <p className="text-white font-medium text-sm capitalize">
                      {billingData.paymentMethod === "transfer"
                        ? "Transferencia Bancaria"
                        : billingData.paymentMethod === "check"
                        ? "Cheque"
                        : billingData.paymentMethod === "cash"
                        ? "Efectivo"
                        : "Tarjeta de Crédito"}
                    </p>
                  </div>
                </div>
                {billingData.notes && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <span className="text-xs text-gray-500 block mb-1">
                      Notas Adicionales
                    </span>
                    <p className="text-white text-sm">{billingData.notes}</p>
                  </div>
                )}
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-300 mb-1">
                    Importante
                  </p>
                  <p className="text-sm text-amber-200/80">
                    Al confirmar, se generará un acuerdo vinculante. La
                    contraparte recibirá una notificación para cargar los{" "}
                    <span className="font-bold">{selectedDocs.length} documentos</span>{" "}
                    solicitados. Una vez completada la documentación, el envío
                    será activado y podrás hacer seguimiento en tiempo real.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-12 pt-6 border-t border-white/10">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                disabled={submitting}
                className="px-6 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-bold text-sm"
              >
                Atrás
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold shadow-lg transition-transform active:scale-95 text-sm"
              >
                Siguiente Paso <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleFinalize}
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-black font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {submitting ? "Procesando..." : "Confirmar y Firmar"}
              </button>
            )}
          </div>
        </div>
      </div>

      {resultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#191919] p-8 rounded-2xl w-full max-w-md shadow-2xl border border-white/10 transform scale-100 transition-all text-center">
            {resultModal.type === "success" ? (
              <>
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">
                  ¡Acuerdo Formalizado!
                </h2>
                <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                  El envío ha sido creado exitosamente y ya puedes ver su estado
                  en tiempo real.
                </p>
                <button
                  onClick={handleGoToTracking}
                  className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-black font-bold shadow-lg shadow-green-500/20 transition-all active:scale-95"
                >
                  Continuar al Tracking
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle size={32} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">
                  Hubo un problema
                </h2>
                <p className="text-gray-400 mb-8 text-sm">
                  {resultModal.message ||
                    "No se pudo crear el acuerdo. Inténtalo de nuevo."}
                </p>
                <button
                  onClick={() => setResultModal(null)}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
                >
                  Cerrar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AgreementPage

import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  ArrowLeft,
  MapPin,
  Flag,
  Package,
  Truck,
  Calendar,
  FileText,
  ChevronDown,
  Scale,
  Box,
  Layers,
} from "lucide-react"
import { Link } from "react-router-dom"

// IMPORTAMOS LAS UBICACIONES DEFINIDAS
import { AVAILABLE_LOCATIONS } from "../../../constants/marketOptions"

const PublicationFormStep1 = ({ initialData, onSubmit, allowedType }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  })

  const selectedType = watch("type")
  const selectedOrigin = watch("origin") // Observamos el origen para validar

  // --- CONFIGURACIÓN DE ETIQUETAS DINÁMICAS ---
  const LABELS = {
    offer: {
      title: "Publicar Oferta de Transporte",
      subtitle: "Complete los datos de su vehículo disponible.",
      cargoLabel: "Tipo de Carga que Acepta",
      vehicleLabel: "Su Vehículo",
      weight: "Capacidad (kg)",
      volume: "Volumen (m³)",
      dateLabel: "Disponible Desde",
    },
    request: {
      title: "Publicar Solicitud de Carga",
      subtitle: "Describa la mercancía que necesita transportar.",
      cargoLabel: "Tipo de Mercancía",
      vehicleLabel: "Vehículo Requerido",
      weight: "Peso Total (kg)",
      volume: "Volumen Total (m³)",
      dateLabel: "Fecha de Salida",
    },
  }

  const currentLabels = LABELS[selectedType] || LABELS.request

  useEffect(() => {
    if (allowedType) setValue("type", allowedType)
  }, [allowedType, setValue])

  const onStepSubmit = (data) => {
    const dateFieldName = data.type === "offer" ? "availableDate" : "readyDate"
    const dateValue = data[dateFieldName]
    if (dateValue) data[dateFieldName] = new Date(dateValue).toISOString()
    onSubmit(data)
  }

  // --- ESTILOS DE UI ---
  const inputWrapperClass = "relative flex items-center group"
  const inputIconClass =
    "absolute left-4 text-gray-400 dark:text-gray-500 pointer-events-none group-focus-within:text-amber-500 transition-colors"

  const inputClass = `
    w-full h-12 rounded-lg border text-sm font-medium transition-all outline-none
    pl-11 pr-4 
    bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400
    focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500
    dark:bg-[#111] dark:border-neutral-800 dark:text-white dark:placeholder:text-neutral-600
    dark:focus:bg-black dark:focus:border-amber-500
  `

  const selectClass = `${inputClass} appearance-none cursor-pointer`
  const labelClass =
    "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1"
  const sectionTitleClass =
    "text-lg font-bold text-gray-900 dark:text-white pb-4 border-b border-gray-200 dark:border-neutral-800 mb-6"
  const arrowIconClass =
    "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"

  return (
    <div className="flex justify-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-4xl">
        {/* HEADER */}
        <div className="mb-8">
          <Link
            to="/marketplace"
            className="inline-flex items-center text-sm text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-500 mb-4 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" /> Volver al Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                {currentLabels.title}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {currentLabels.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white dark:bg-[#111] p-3 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#005A9C] dark:bg-amber-500 text-white dark:text-black flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <span className="text-sm font-bold text-black dark:text-amber-500">
                  Requisitos
                </span>
              </div>
              <div className="w-8 h-px bg-gray-300 dark:bg-neutral-700"></div>
              <div className="flex items-center gap-2 opacity-50">
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-neutral-800 text-gray-500 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Docs
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FORM CONTAINER */}
        <div className="bg-white dark:bg-[#191919] border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 md:p-10 shadow-xl">
          <form
            onSubmit={handleSubmit(onStepSubmit)}
            className="flex flex-col gap-10"
          >
            {/* 0. TIPO DE OPERACIÓN */}
            <div>
              <h2 className={sectionTitleClass}>Tipo de Operación</h2>
              <div className="flex p-1 rounded-xl bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-neutral-800">
                {["offer", "request"].map((type) => {
                  const isActive = selectedType === type
                  if (allowedType && allowedType !== type) return null

                  return (
                    <label
                      key={type}
                      className={`
                            flex-1 cursor-pointer flex items-center justify-center py-3 rounded-lg text-sm font-bold transition-all duration-200
                            ${
                              isActive
                                ? "bg-[#005A9C] dark:bg-amber-500 text-white dark:text-black shadow-sm ring-1 ring-black/5"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            }
                            `}
                    >
                      <input
                        type="radio"
                        value={type}
                        {...register("type")}
                        className="hidden"
                      />
                      {type === "offer"
                        ? "Ofertar Transporte"
                        : "Solicitar Carga"}
                    </label>
                  )
                })}
              </div>
            </div>

            {/* 1. RUTA */}
            <section>
              <h2 className={sectionTitleClass}>Ruta del Viaje</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ORIGEN */}
                <div>
                  <label className={labelClass}>Origen</label>
                  <div className={inputWrapperClass}>
                    <MapPin size={18} className={inputIconClass} />
                    <select
                      {...register("origin", {
                        required: "Seleccione un origen",
                      })}
                      className={selectClass}
                    >
                      <option value="" disabled>
                        Seleccione Origen...
                      </option>
                      {AVAILABLE_LOCATIONS.map((loc) => (
                        <option key={loc.value} value={loc.value}>
                          {loc.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className={arrowIconClass} />
                  </div>
                  {errors.origin && (
                    <span className="text-red-500 text-xs mt-1 ml-1">
                      {errors.origin.message}
                    </span>
                  )}
                </div>

                {/* DESTINO (Con validación lógica) */}
                <div>
                  <label className={labelClass}>Destino</label>
                  <div className={inputWrapperClass}>
                    <Flag size={18} className={inputIconClass} />
                    <select
                      {...register("destination", {
                        required: "Seleccione un destino",
                        validate: (value) =>
                          value !== selectedOrigin ||
                          "El destino no puede ser igual al origen",
                      })}
                      className={selectClass}
                    >
                      <option value="" disabled>
                        Seleccione Destino...
                      </option>
                      {AVAILABLE_LOCATIONS.map((loc) => (
                        <option key={loc.value} value={loc.value}>
                          {loc.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className={arrowIconClass} />
                  </div>
                  {/* Mensaje de error */}
                  {errors.destination && (
                    <span className="text-red-500 text-xs mt-1 ml-1">
                      {errors.destination.message}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* 2. DETALLES TÉCNICOS */}
            <section>
              <h2 className={sectionTitleClass}>Detalles Técnicos</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={labelClass}>
                    {currentLabels.cargoLabel}
                  </label>
                  <div className={inputWrapperClass}>
                    <Package size={18} className={inputIconClass} />
                    <select
                      {...register("cargoType", { required: true })}
                      className={selectClass}
                    >
                      <option value="" disabled>
                        Seleccionar...
                      </option>
                      <option value="carga general">Carga General</option>
                      <option value="perecederos">
                        Perecederos (Refrigerada)
                      </option>
                      <option value="granel">Granel</option>
                      <option value="embalada">Embalada / Pallets</option>
                      <option value="peligrosa">Carga Peligrosa (IMO)</option>
                      <option value="maquinaria">Maquinaria</option>
                    </select>
                    <ChevronDown size={16} className={arrowIconClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    {currentLabels.vehicleLabel}
                  </label>
                  <div className={inputWrapperClass}>
                    <Truck size={18} className={inputIconClass} />
                    <select
                      {...register(
                        selectedType === "offer"
                          ? "vehicleType"
                          : "requiredVehicleType",
                        { required: true }
                      )}
                      className={selectClass}
                    >
                      <option value="" disabled>
                        Seleccionar...
                      </option>
                      <option value="semiremolque">
                        Semiremolque / Trailer
                      </option>
                      <option value="camion_rigido">Camión Rígido</option>
                      <option value="frigorifico">Frigorífico</option>
                      <option value="cisterna">Cisterna</option>
                      <option value="plataforma">Plataforma / Cama Baja</option>
                    </select>
                    <ChevronDown size={16} className={arrowIconClass} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* PESO */}
                <div>
                  <label className={labelClass}>{currentLabels.weight}</label>
                  <div className={inputWrapperClass}>
                    <Scale size={18} className={inputIconClass} />
                    <input
                      type="number"
                      {...register("weightKg", {
                        required: true,
                        valueAsNumber: true,
                      })}
                      className={inputClass}
                      placeholder="Ej: 25000"
                    />
                  </div>
                </div>

                {/* VOLUMEN */}
                <div>
                  <label className={labelClass}>{currentLabels.volume}</label>
                  <div className={inputWrapperClass}>
                    <Box size={18} className={inputIconClass} />
                    <input
                      type="number"
                      {...register("volumeM3", { valueAsNumber: true })}
                      className={inputClass}
                      placeholder="Ej: 80"
                    />
                  </div>
                </div>

                {/* CANTIDAD */}
                <div>
                  <label className={labelClass}>Cantidad</label>
                  <div className={inputWrapperClass}>
                    <Layers size={18} className={inputIconClass} />
                    <input
                      type="number"
                      defaultValue={1}
                      {...register("numberOfVehicles", {
                        required: true,
                        valueAsNumber: true,
                        min: 1,
                      })}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 3. PROGRAMACIÓN */}
            <section>
              <h2 className={sectionTitleClass}>Programación</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>
                    {currentLabels.dateLabel}
                  </label>
                  <div className={inputWrapperClass}>
                    <Calendar size={18} className={inputIconClass} />
                    <input
                      type="datetime-local"
                      {...register(
                        selectedType === "offer"
                          ? "availableDate"
                          : "readyDate",
                        { required: true }
                      )}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 4. INFORMACIÓN ADICIONAL */}
            <section>
              <h2 className={sectionTitleClass}>Información Adicional</h2>
              <div>
                <label className={labelClass}>Instrucciones Especiales</label>
                <div className="relative">
                  <FileText
                    size={18}
                    className="absolute left-4 top-4 text-gray-400 dark:text-gray-500 pointer-events-none"
                  />
                  <textarea
                    {...register("notes")}
                    className={`
                            w-full min-h-[120px] rounded-lg border text-sm font-medium transition-all outline-none
                            pl-11 pr-4 py-3 resize-y
                            bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400
                            focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500
                            dark:bg-[#111] dark:border-neutral-800 dark:text-white dark:placeholder:text-neutral-600
                            dark:focus:bg-black dark:focus:border-amber-500
                        `}
                    placeholder="Añada cualquier nota relevante, requisitos de manipulación o preguntas..."
                  ></textarea>
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-neutral-800">
              <Link to="/marketplace">
                <button
                  type="button"
                  className="px-6 h-12 rounded-lg font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  Cancelar
                </button>
              </Link>
              <button
                type="submit"
                className="px-8 h-12 rounded-lg font-bold bg-[#005A9C] dark:bg-amber-500 text-white dark:text-black hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                Siguiente Paso
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PublicationFormStep1

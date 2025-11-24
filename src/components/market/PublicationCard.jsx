import React, { useState, useEffect, useRef } from "react"
import { Pencil, Trash2, Truck, Package, X } from "lucide-react"
import { useDocumentTypes } from "../../hooks/useDocumentTypes"

import {
  getListingById,
  updateListingContent,
  updateOfferDocuments,
  updateRequestDocuments,
  deleteOffer,
  deleteRequest,
} from "../../services/market.service"

const PublicationCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // 🔥 NUEVO: refs para autoscroll
  const editModalRef = useRef(null)
  const deleteModalRef = useRef(null)

  // 🔥 NUEVO: Auto-scroll cuando se abre EDIT modal
  useEffect(() => {
    if (isEditOpen && editModalRef.current) {
      setTimeout(() => {
        editModalRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center"
        })
      }, 50)
    }
  }, [isEditOpen])

  // 🔥 NUEVO: Auto-scroll cuando se abre DELETE modal
  useEffect(() => {
    if (isDeleteOpen && deleteModalRef.current) {
      setTimeout(() => {
        deleteModalRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center"
        })
      }, 50)
    }
  }, [isDeleteOpen])

  // Tipo
  const isOffer = !!item.vehicle_type
  const Icon = isOffer ? Truck : Package
  const iconColor = isOffer ? "text-amber-600" : "text-cyan-600"

  const badgeText = isOffer ? "OFERTA DE TRANSPORTE" : "SOLICITUD DE CARGA"
  const badgeColor = isOffer
    ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
    : "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"

  // ---------------------------------------------
  // 📌 HOOK GLOBAL DE DOCUMENTOS
  // ---------------------------------------------
  const {
    documents,
    loading: docsLoading,
    error: docsError
  } = useDocumentTypes(isOffer ? "offer" : "request")

  const requiredDocIds = Array.isArray(item.required_document_type_ids)
    ? item.required_document_type_ids
    : []


  // ---------------------------------------------
  // 📌 DOCUMENTOS REALES DEL BACKEND (EXPANDIBLE)
  // ---------------------------------------------
  const [extraDocsLoading, setExtraDocsLoading] = useState(false)
  const [extraDocs, setExtraDocs] = useState([])

  useEffect(() => {
    if (!expanded) return
    if (extraDocs.length > 0) return

    const type = isOffer ? "offer" : "request"
    setExtraDocsLoading(true)

    getListingById(type, item.id)
      .then(full => setExtraDocs(full.requiredDocuments || []))
      .catch(err => console.error("Error cargando documentación:", err))
      .finally(() => setExtraDocsLoading(false))
  }, [expanded])

  // --------------------------
  // 🗑 ELIMINAR (confirmado desde modal)
  // --------------------------
  const handleDelete = async () => {
    try {
      if (isOffer) await deleteOffer(item.id)
      else await deleteRequest(item.id)

      setIsDeleteOpen(false)
      window.location.reload()
    } catch (e) {
      console.error(e)
      alert("No se pudo eliminar")
    }
  }

  // --------------------------
  // ✏ MODAL DE EDICIÓN
  // --------------------------
  const [editLoading, setEditLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editData, setEditData] = useState({
    origin: "",
    destination: "",
    weight_kg: "",
    volume_m3: "",
    notes: "",
  })

  const [editSelectedDocs, setEditSelectedDocs] = useState([])

  useEffect(() => {
    if (!isEditOpen) return

    let active = true
    const type = isOffer ? "offer" : "request"

    const fetch = async () => {
      setEditLoading(true)
      try {
        const full = await getListingById(type, item.id)
        if (!active) return

        setEditData({
          origin: full.origin || "",
          destination: full.destination || "",
          weight_kg: full.weight_kg ?? "",
          volume_m3: full.volume_m3 ?? "",
          notes: full.notes || "",
        })

        const ids = Array.isArray(full.requiredDocuments)
          ? full.requiredDocuments.map(d => d.id)
          : []

        setEditSelectedDocs(ids)
      } finally {
        if (active) setEditLoading(false)
      }
    }

    fetch()
    return () => (active = false)
  }, [isEditOpen])

  const toggleDoc = (id) => {
    setEditSelectedDocs(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    )
  }

  const handleEditChange = (field, value) =>
    setEditData(prev => ({ ...prev, [field]: value }))

  const handleSaveEdit = async (e) => {
    e.preventDefault()

    const type = isOffer ? "offer" : "request"
    try {
      setSaving(true)

      await updateListingContent(type, item.id, { ...editData })

      if (isOffer) await updateOfferDocuments(item.id, editSelectedDocs)
      else await updateRequestDocuments(item.id, editSelectedDocs)

      setIsEditOpen(false)
      window.location.reload()
    } catch (e) {
      console.error(e)
      alert("Error guardando cambios")
    } finally {
      setSaving(false)
    }
  }

  // 🟩 ESTADO VISUAL
  const status = (item.status || "").toLowerCase()
  let statusBg = "bg-gray-300"

  if (status === "open") statusBg = "bg-green-500" 
  else if (status === "closed") statusBg = "bg-red-500"
  else if (status === "in_transit") statusBg = "bg-blue-500"
  const statusLabels = {
    open: "Abierto",
    closed: "Cerrado",
    in_transit: "En tránsito"
  };

const statusLabel = statusLabels[status] || item.status;

// Normaliza textos tipo "carga general" → "Carga General"
const normalizeText = (str) => {
  if (!str) return "";
  return str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

  return (
    <>
      {/* CARD */}
      <div className={`relative w-full rounded-xl border p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 ${badgeColor}`}>

        {/* HEADER */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-white dark:bg-neutral-800 ${iconColor}`}>
              <Icon size={22} />
            </div>

            <div>
              <span className="text-xs font-semibold opacity-80">{badgeText}</span>

              <h3 className="text-xl font-bold">
                {normalizeText(item.origin)} → {normalizeText(item.destination)}
              </h3>

              <p className="text-sm opacity-80">{normalizeText(item.cargo_type)}</p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBg} text-black dark:text-white`}>
            {statusLabel}
          </span>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
          <p><span className="font-medium">Peso:</span> {item.weight_kg} kg</p>
          <p><span className="font-medium">Volumen:</span> {item.volume_m3} m³</p>
          <p><span className="font-medium">Vehículo:</span> {isOffer ? normalizeText(item.vehicle_type) : normalizeText(item.required_vehicle_type)}</p>
          <p><span className="font-medium">Creada:</span> {item.created_at}</p>
          <p><span className="font-medium">Notas:</span> {item.notes}</p>
        </div>

        {/* EXPANDIBLE */}
        {expanded && (
          <div className="rounded-lg p-3 bg-neutral-100 dark:bg-neutral-800 mt-2 animate-fadeIn">

            {/* EXTRA ATRIBUTES */}
            <div className="mb-3">
              {isOffer ? (
                <>
                  <p><span className="font-medium">Temp. Control:</span> {item.temperature_control}</p>
                  <p><span className="font-medium">Vehículos disp.:</span> {item.number_of_vehicles}</p>
                  <p><span className="font-medium">Disponible:</span> {item.available_date}</p>
                </>
              ) : (
                <>
                  <p><span className="font-medium">Temp. requerida:</span> {item.required_temperature}</p>
                  <p><span className="font-medium">Vehículos nec.:</span> {item.number_of_vehicles}</p>
                  <p><span className="font-medium">Fecha carga:</span> {item.ready_date}</p>
                  <p><span className="font-medium">Entrega límite:</span> {item.delivery_deadline}</p>
                  <p><span className="font-medium">Presupuesto:</span> {item.budget}</p>
                </>
              )}
            </div>

            {/* DOCUMENTOS REALES */}
            <div className="border-t border-neutral-400 dark:border-neutral-700 pt-2">
              <h4 className="text-sm font-semibold mb-1">Documentación requerida</h4>

              {extraDocsLoading && (
                <p className="text-xs opacity-70">Cargando documentación...</p>
              )}

              {!extraDocsLoading && extraDocs.length === 0 && (
                <p className="text-xs opacity-70">Sin documentos requeridos.</p>
              )}

              {extraDocs.length > 0 && (
                <ul className="list-disc pl-5 text-sm">
                  {extraDocs.map(doc => (
                    <li key={doc.id}>{doc.name}</li>
                  ))}
                </ul>
              )}
            </div>

          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setExpanded(v => !v)}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            {expanded ? "Mostrar menos" : "Mostrar más"}
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditOpen(true)}
              className="px-3 py-1 rounded-md bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 flex items-center gap-1"
            >
              <Pencil size={16} /> Editar
            </button>

            <button
              onClick={() => setIsDeleteOpen(true)}
              className="px-3 py-1 rounded-md bg-red-300 hover:bg-red-400 dark:bg-red-900 dark:text-red-300 flex items-center gap-1"
            >
              <Trash2 size={16} /> Borrar
            </button>
          </div>
        </div>
      

      {/* EDIT MODAL */}
      {isEditOpen && (
        <div
          ref={editModalRef}
          className="absolute inset-0 bg-black/40 flex items-center justify-center z-40 animate-fadeIn"
        >
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-3xl animate-fadeInUp">
            <div className="flex justify-between mb-3">
              <h2 className="text-xl font-bold">Editar publicación</h2>

              <button onClick={() => setIsEditOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {editLoading ? (
              <p>Cargando...</p>
            ) : (
              <form onSubmit={handleSaveEdit} className="space-y-4">

                {/* Campos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Origen</label>
                    <input
                      className="w-full rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-1"
                      value={editData.origin}
                      onChange={e => handleEditChange("origin", e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Destino</label>
                    <input
                      className="w-full rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-1"
                      value={editData.destination}
                      onChange={e => handleEditChange("destination", e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Peso</label>
                    <input
                      className="w-full rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-1"
                      value={editData.weight_kg}
                      onChange={e => handleEditChange("weight_kg", e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Volumen</label>
                    <input
                      className="w-full rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-1"
                      value={editData.volume_m3}
                      onChange={e => handleEditChange("volume_m3", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label>Notas</label>
                  <textarea
                    className="w-full rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-1"
                    rows={3}
                    value={editData.notes}
                    onChange={e => handleEditChange("notes", e.target.value)}
                  />
                </div>

                {/* Documentos */}
                <div className="border-t pt-3">
                  <h3 className="font-semibold text-sm mb-2">Documentación requerida</h3>

                  {docsLoading && <p className="text-xs">Cargando documentos...</p>}
                  {docsError && <p className="text-xs text-red-400">Error cargando documentos</p>}

                  {!docsLoading && !docsError && Array.isArray(documents) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {documents.map(doc => (
                        <label key={doc.id} className="flex gap-2">
                          <input
                            type="checkbox"
                            checked={editSelectedDocs.includes(doc.id)}
                            onChange={() => toggleDoc(doc.id)}
                          />
                          {doc.name}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-4 py-2 rounded-md bg-neutral-200 dark:bg-neutral-700"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-neutral-200 dark:bg-neutral-700"
                    disabled={saving}
                  >
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteOpen && (
        <div
          ref={deleteModalRef}
          className="absolute inset-0 bg-black/40 flex items-center justify-center z-40 animate-fadeIn"
        >
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-md animate-fadeInUp">

            <div className="flex justify-between mb-3">
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Eliminar publicación</h2>

              <button onClick={() => setIsDeleteOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <p className="text-sm mb-4">
              ¿Estás seguro de que deseas eliminar esta publicación?
              <br />
              <span className="font-semibold">{item.origin} → {item.destination}</span>
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 rounded-md bg-neutral-200 dark:bg-neutral-700"
              >
                Cancelar
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>

          </div>
        </div>
      )}
</div>
    </>
  )
}

export default PublicationCard

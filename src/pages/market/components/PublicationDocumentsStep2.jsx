import React, { useState } from "react";
import { ArrowLeft, Check, FileText, ShieldCheck } from "lucide-react";
import { useDocumentTypes } from "../../../hooks/useDocumentTypes";

const PublicationDocumentsStep2 = ({
  transactionType,
  onBack,
  onSubmit,
  isSubmitting,
}) => {
  const { groupedDocuments, loading, categoryLabels } = useDocumentTypes();
  const [selectedIds, setSelectedIds] = useState([]);

  // Lógica de Filtrado
  const getFilteredCategories = () => {
    if (transactionType === "offer") return ["LEGAL", "CARGO"];
    if (transactionType === "request")
      return ["LEGAL", "DRIVER", "VEHICLE", "CARGO"];
    return [];
  };
  const allowedCategories = getFilteredCategories();

  const toggleDoc = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  if (loading)
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-[#ecb613] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Cargando catálogo...
          </p>
        </div>
      </div>
    );

  // --- ESTILOS VISUALES ---
  const descriptionClass =
    "text-sm text-gray-500 dark:text-[#888888] font-normal mt-0.5";
  const checkboxContainerClass =
    "flex items-start gap-4 py-4 cursor-pointer group";

  // Checkbox personalizado
  const CheckboxVisual = ({ checked }) => (
    <div
      className={`
        mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 shrink-0
        ${
          checked
            ? "bg-[#ecb613] border-[#ecb613]"
            : "bg-transparent border-gray-300 dark:border-gray-600 group-hover:border-[#ecb613]"
        }
    `}
    >
      {checked && <Check size={14} className="text-black" strokeWidth={3} />}
    </div>
  );

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-4xl">
        {/* --- HEADER (Igual que Step 1) --- */}
        <div className="mb-8">
          {/* Botón Volver Arriba */}
          <button
            onClick={onBack}
            className="inline-flex items-center text-sm text-gray-500 hover:text-[#ecb613] dark:text-gray-400 dark:hover:text-[#ecb613] mb-4 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" /> Volver a Requisitos
          </button>

          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            {/* Títulos */}
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                Documentación Requerida
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Seleccione los documentos obligatorios para la contraparte.
              </p>
            </div>

            {/* STEPPER VISUAL (Alineado a la derecha) */}
            <div className="flex items-center gap-4 bg-white dark:bg-[#111] p-3 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm">
              {/* Paso 1 (Completado) */}
              <div className="flex items-center gap-2 opacity-50">
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-neutral-800 text-gray-500 flex items-center justify-center font-bold text-xs">
                  <Check size={14} />
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Requisitos
                </span>
              </div>

              <div className="w-8 h-px bg-gray-300 dark:bg-neutral-700"></div>

              {/* Paso 2 (Activo) */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#ecb613] text-black flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <span className="text-sm font-bold text-[#ecb613]">Docs</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN CARD --- */}
        <div className="rounded-xl bg-white dark:bg-[#191919] p-6 md:p-8 border border-gray-200 dark:border-neutral-800 shadow-sm">
          {/* Intro Text dentro de la card */}
          <div className="mb-8 pb-4 border-b border-gray-100 dark:border-[#333333]">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              Catálogo de Documentos
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-[#888888]">
              Estos requisitos aparecerán en el contrato inteligente al momento
              de cerrar el trato.
            </p>
          </div>

          <div className="flex flex-col gap-10">
            {Object.entries(groupedDocuments).map(([category, docs]) => {
              if (!allowedCategories.includes(category)) return null;

              return (
                <div key={category}>
                  <h3 className="text-base font-bold leading-tight tracking-tight text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-[#333333] mb-2 uppercase">
                    {categoryLabels[category] || category}
                  </h3>

                  <div className="flex flex-col divide-y divide-gray-100 dark:divide-[#252525]">
                    {docs.map((doc) => {
                      const isChecked = selectedIds.includes(doc.id);
                      return (
                        <label key={doc.id} className={checkboxContainerClass}>
                          {/* Input Real Oculto */}
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={isChecked}
                            onChange={() => toggleDoc(doc.id)}
                          />

                          <CheckboxVisual checked={isChecked} />

                          <div className="flex flex-col">
                            <p
                              className={`font-medium text-sm transition-colors ${
                                isChecked
                                  ? "text-[#ecb613]"
                                  : "text-gray-900 dark:text-gray-200"
                              }`}
                            >
                              {doc.name}
                            </p>
                            <p className={descriptionClass}>
                              {doc.description ||
                                "Documento estándar requerido para validación."}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- FOOTER ACTIONS --- */}
          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-[#333333]">
            <button
              onClick={onBack}
              type="button"
              className="px-6 h-12 rounded-lg font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
            >
              Volver
            </button>

            <button
              onClick={() => onSubmit(selectedIds)}
              disabled={isSubmitting}
              className="px-8 h-12 flex items-center justify-center gap-2 rounded-lg font-bold bg-[#005A9C] dark:bg-amber-500 text-white dark:text-black hover:brightness-110 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                  Publicando...
                </>
              ) : (
                "Publicar Oferta/Demanda"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationDocumentsStep2;

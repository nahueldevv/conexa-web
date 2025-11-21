import { useState } from 'react'
import { ArrowLeft, Check } from 'lucide-react'
import { useDocumentTypes } from '../../../hooks/useDocumentTypes'

const PublicationDocumentsStep2 = ({ transactionType, onBack, onSubmit, isSubmitting }) => {
  const { groupedDocuments, loading, categoryLabels } = useDocumentTypes()
  const [selectedIds, setSelectedIds] = useState([])

  // Lógica de filtrado (copiada de tu test, adaptada)
  const getFilteredCategories = () => {
    if (transactionType === 'offer') return ['LEGAL', 'CARGO']
    if (transactionType === 'request') return ['LEGAL', 'DRIVER', 'VEHICLE', 'CARGO']
    return []
  }
  
  const allowedCategories = getFilteredCategories()

  const toggleDoc = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    )
  }

  if (loading) return <div className="p-20 text-center font-bold text-xl">Cargando catálogo de documentos...</div>

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Header Fixed */}
      <header className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full transition-colors">
                <ArrowLeft />
            </button>
            <div>
                <h2 className="text-lg font-bold leading-tight">Requisitos Documentales</h2>
                <p className="text-xs text-text-subtle">Paso 2 de 2</p>
            </div>
        </div>
        <div className="text-sm font-medium text-primary">
            {selectedIds.length} Seleccionados
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 pb-32">
        <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Seleccionar Documentación</h1>
            <p className="text-text-subtle">Marque los documentos que exigirá a la contraparte para validar la operación.</p>
        </div>

        <div className="space-y-8">
            {Object.entries(groupedDocuments).map(([category, docs]) => {
                if (!allowedCategories.includes(category)) return null

                return (
                    <section key={category} className="animate-fadeIn">
                        <h3 className="text-sm font-bold text-text-subtle uppercase tracking-wider mb-3 ml-1">
                            {categoryLabels[category] || category}
                        </h3>
                        <div className="flex flex-col gap-2">
                            {docs.map(doc => {
                                const isChecked = selectedIds.includes(doc.id)
                                return (
                                    <label 
                                        key={doc.id}
                                        className={`
                                            flex cursor-pointer gap-4 p-4 rounded-xl border transition-all duration-200
                                            ${isChecked 
                                                ? 'bg-primary/10 border-primary/50 shadow-sm' 
                                                : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-primary/30'}
                                        `}
                                    >
                                        <div className={`
                                            h-6 w-6 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors
                                            ${isChecked ? 'bg-primary border-primary text-black' : 'border-neutral-400 bg-transparent'}
                                        `}>
                                            {isChecked && <Check size={14} strokeWidth={4} />}
                                            <input 
                                                type="checkbox" 
                                                className="hidden"
                                                checked={isChecked}
                                                onChange={() => toggleDoc(doc.id)}
                                            />
                                        </div>
                                        <div>
                                            <p className={`text-base font-bold leading-tight mb-1 ${isChecked ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                                                {doc.name}
                                            </p>
                                            <p className="text-sm text-text-subtle leading-snug">
                                                {doc.description || 'Documento estándar requerido para validación.'}
                                            </p>
                                        </div>
                                    </label>
                                )
                            })}
                        </div>
                    </section>
                )
            })}
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-background-light/90 dark:bg-background-dark/90 border-t border-neutral-200 dark:border-neutral-800 backdrop-blur p-4">
        <div className="max-w-4xl mx-auto flex gap-4">
            <button 
                onClick={() => onSubmit(selectedIds)}
                disabled={isSubmitting}
                className="flex-1 h-14 rounded-xl bg-primary text-background-dark text-lg font-bold hover:brightness-110 transition-all shadow-lg disabled:opacity-70 disabled:cursor-wait"
            >
                {isSubmitting ? 'Publicando...' : 'Confirmar y Publicar'}
            </button>
        </div>
      </footer>

    </div>
  )
}

export default PublicationDocumentsStep2
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createOffer, createRequest } from '../../services/market.service'
import PublicationFormStep1 from './components/PublicationFormStep1'
import PublicationDocumentsStep2 from './components/PublicationDocumentsStep2'

const CreatePublicationPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // Estado del Wizard
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // 1. LÓGICA DE TIPO PERMITIDO (CRUCIAL)
  // - Si es Dual: null (Puede elegir en el paso 1)
  // - Si es Transportista: 'offer' (Fijo)
  // - Si es Empresa: 'request' (Fijo)
  const allowedType = user?.rol === 'operador_dual' 
    ? null 
    : (user?.rol === 'transportista' ? 'offer' : 'request')

  // Estado inicial del formulario
  // Nota: Si hay allowedType, el componente hijo (Step1) forzará ese valor al montarse gracias al useEffect.
  const [formData, setFormData] = useState({
    type: allowedType || 'offer', // Pre-asignamos si es posible
    // ... campos vacíos ...
    requiredDocuments: [] 
  })

  // Handler paso 1
  const handleStep1Submit = (data) => {
    setFormData(prev => ({ ...prev, ...data }))
    setStep(2)
  }

  // Handler Final
  const handleFinalSubmit = async (docIds) => {
    setIsSubmitting(true)
    try {
      const finalPayload = {
        ...formData,
        requiredDocuments: docIds
      }

      if (formData.type === 'offer') {
        await createOffer(finalPayload)
      } else {
        await createRequest(finalPayload)
      }

      alert("✅ ¡Publicación creada exitosamente!")
      navigate('/mercado')
      
    } catch (error) {
      console.error("Error creando publicación", error)
      const msg = error.response?.data?.message || "Revisa los datos."
      alert(`❌ Error: ${msg}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white">
      {step === 1 ? (
        <PublicationFormStep1 
          initialData={formData} 
          onSubmit={handleStep1Submit}
          allowedType={allowedType} // <--- AQUÍ SE PASA LA RESTRICCIÓN AL HIJO
        />
      ) : (
        <PublicationDocumentsStep2 
          transactionType={formData.type} // El paso 2 ya sabe qué tipo se eligió en el paso 1
          onBack={() => setStep(1)}
          onSubmit={handleFinalSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}

export default CreatePublicationPage
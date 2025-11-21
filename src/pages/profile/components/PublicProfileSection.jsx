import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Pencil, Check, X, Image as ImageIcon } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'

const PublicProfileSection = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const { register, handleSubmit, reset, watch } = useForm()
  
  const watchedImageUrl = watch('profileImageUrl')

  useEffect(() => {
    if (user) {
      reset({
        profileImageUrl: user.profileImageUrl || '',
        description: user.description || ''
      })
    }
  }, [user, reset])

  // --- CORRECCIÓN AQUÍ ---
  const onSubmit = async (data) => {
    setIsSaving(true)
    try {
      // 1. Copiar datos para no mutar el original
      const cleanData = { ...data }

      // 2. SANITIZACIÓN: Si el string está vacío, enviar null para que Zod no falle la validación de URL
      if (!cleanData.profileImageUrl || cleanData.profileImageUrl.trim() === '') {
        cleanData.profileImageUrl = undefined
      }

      // 3. Enviar datos limpios
      await updateProfile(cleanData)
      
      setIsEditing(false)
    } catch (error) {
      console.error("Error actualizando perfil público:", error)
      alert("Error al guardar. Revisa si la URL de la imagen es válida.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  // Estilos 
  const containerClass = "flex flex-col gap-6 bg-white dark:bg-[#191919] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm"
  const labelClass = "text-sm font-medium text-gray-500 dark:text-gray-400 mb-4"
  const inputClass = "flex w-full rounded-lg text-gray-900 dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-[#2d2d2d] h-10 px-3 text-base transition-colors"
  const textareaClass = "flex w-full rounded-lg text-gray-900 dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-[#2d2d2d] min-h-[120px] p-3 text-base transition-colors resize-y"
  const valueTextClass = "text-base font-normal text-gray-900 dark:text-[#F5F5F5] leading-relaxed whitespace-pre-wrap"

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-white/10">
        <h3 className="text-xl font-bold text-gray-900 dark:text-[#F5F5F5] leading-tight tracking-[-0.015em]">
            Perfil Público
        </h3>
        
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            <Pencil size={16} /> Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
                type="button"
                onClick={handleCancel} 
                disabled={isSaving} 
                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            >
                <X size={20}/>
            </button>
            <button 
                type="button"
                onClick={handleSubmit(onSubmit)} 
                disabled={isSaving} 
                className="p-2 text-primary hover:text-amber-400 transition-colors"
            >
                <Check size={20}/>
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        
        {/* 1. IMAGEN DE PERFIL */}
        <div>
            <p className={labelClass}>Imagen de Perfil (URL)</p>
            
            <div className="flex gap-4 items-center">
                <div className="shrink-0 h-16 w-16 rounded-full bg-gray-200 dark:bg-white/10 bg-cover bg-center border border-gray-300 dark:border-white/10"
                     style={{ backgroundImage: `url("${(isEditing ? watchedImageUrl : user?.profileImageUrl) || ''}")` }}>
                     {!user?.profileImageUrl && !watchedImageUrl && (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                            <ImageIcon size={24} />
                        </div>
                     )}
                </div>

                <div className="grow">
                    {isEditing ? (
                        <div className="flex flex-col gap-1">
                            <input 
                                {...register("profileImageUrl")} 
                                className={inputClass} 
                                placeholder="https://ejemplo.com/mi-logo.png"
                            />
                            <p className="text-xs text-gray-400">Ingresa la URL de tu logo o foto corporativa.</p>
                        </div>
                    ) : (
                        <div className="h-10 flex items-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                {user?.profileImageUrl ? 'Imagen configurada' : 'Sin imagen configurada'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* 2. DESCRIPCIÓN */}
        <div>
            <p className={labelClass}>Descripción de la Empresa</p>
            {isEditing ? (
                <textarea 
                    {...register("description")} 
                    className={textareaClass}
                    placeholder="Describe tu empresa, flota, o servicios principales..."
                    maxLength={1000}
                />
            ) : (
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#2d2d2d]/30 border border-transparent dark:border-white/5">
                    <p className={valueTextClass}>
                        {user?.description || <span className="italic text-gray-400">Sin descripción detallada.</span>}
                    </p>
                </div>
            )}
        </div>

      </form>
    </div>
  )
}

export default PublicProfileSection
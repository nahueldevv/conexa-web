import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Pencil, Check, X } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'

const ContactSection = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    if (user) {
      reset({
        contactPerson: user.contactPerson || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || ''
      })
    }
  }, [user, reset])

  const onSubmit = async (data) => {
    setIsSaving(true)
    try {
      await updateProfile(data)
      setIsEditing(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  // ESTILOS STITCH (Dual Mode)
  const containerClass = "flex flex-col gap-6 bg-white dark:bg-[#191919] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm"
  const labelClass = "text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal pb-2"
  const valueClass = "text-gray-900 dark:text-[#F5F5F5] text-base font-normal min-h-[24px]"
  // Input estilo Stitch (borde white/20, bg #2d2d2d)
  const inputClass = "flex w-full rounded-lg text-gray-900 dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-[#2d2d2d] h-10 px-3 text-base transition-colors"

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-white/10">
        <h3 className="text-gray-900 dark:text-[#F5F5F5] text-lg font-bold leading-tight tracking-[-0.015em]">
            Detalles de Contacto
        </h3>
        
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 font-bold text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white text-sm transition-colors"
          >
            <Pencil size={16} /> Editar
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => setIsEditing(false)} disabled={isSaving} className="text-gray-500 hover:text-red-500"><X size={18}/></button>
            <button onClick={handleSubmit(onSubmit)} disabled={isSaving} className="text-primary hover:text-amber-400"><Check size={18}/></button>
          </div>
        )}
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="flex flex-col">
          <p className={labelClass}>Persona de Contacto</p>
          {isEditing ? <input {...register("contactPerson")} className={inputClass} /> : <p className={valueClass}>{user?.contactPerson || '-'}</p>}
        </div>

        <div className="flex flex-col">
          <p className={labelClass}>Teléfono</p>
          {isEditing ? <input {...register("phone")} className={inputClass} /> : <p className={valueClass}>{user?.phone || '-'}</p>}
        </div>

        <div className="flex flex-col">
          <p className={labelClass}>Dirección</p>
          {isEditing ? <input {...register("address")} className={inputClass} /> : <p className={valueClass}>{user?.address || '-'}</p>}
        </div>

        <div className="flex flex-col">
          <p className={labelClass}>Ciudad</p>
          {isEditing ? <input {...register("city")} className={inputClass} /> : <p className={valueClass}>{user?.city || '-'}</p>}
        </div>

        <div className="flex flex-col">
          <p className={labelClass}>País</p>
          {isEditing ? <input {...register("country")} className={inputClass} /> : <p className={valueClass}>{user?.country || '-'}</p>}
        </div>

      </div>
    </div>
  )
}

export default ContactSection
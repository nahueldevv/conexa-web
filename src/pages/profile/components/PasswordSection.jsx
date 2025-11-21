import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../../context/AuthContext'

const PasswordSection = () => {
  const { changePassword } = useAuth()
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()
  const [status, setStatus] = useState(null)

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
        setStatus({ type: 'error', msg: "Las contraseñas no coinciden." })
        return
    }
    try {
        await changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword })
        setStatus({ type: 'success', msg: "Contraseña cambiada." }) // Nota: AuthContext redirigirá al login
    } catch (err) {
        setStatus({ type: 'error', msg: "Error al cambiar contraseña." })
    }
  }

  // Estilos Stitch
  const containerClass = "flex flex-col gap-6 bg-white dark:bg-[#191919] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm"
  const labelClass = "text-gray-900 dark:text-[#F5F5F5] text-sm font-medium leading-normal pb-2"
  const inputClass = "flex w-full rounded-lg text-gray-900 dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-[#2d2d2d] h-12 p-3 text-base transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"

  return (
    <div className={containerClass}>
        <div className="pb-2 border-b border-gray-200 dark:border-white/10">
            <h3 className="text-gray-900 dark:text-[#F5F5F5] text-lg font-bold leading-tight tracking-[-0.015em]">Cambiar Contraseña</h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="flex flex-col gap-6 col-span-1 md:col-span-2">
                <label className="flex flex-col">
                    <p className={labelClass}>Contraseña Actual</p>
                    <input type="password" {...register("currentPassword", { required: true })} className={inputClass} placeholder="Ingresa tu contraseña actual" />
                </label>
                <label className="flex flex-col">
                    <p className={labelClass}>Nueva Contraseña</p>
                    <input type="password" {...register("newPassword", { required: true, minLength: 6 })} className={inputClass} placeholder="Ingresa la nueva contraseña" />
                </label>
                <label className="flex flex-col">
                    <p className={labelClass}>Confirmar Nueva Contraseña</p>
                    <input type="password" {...register("confirmPassword", { required: true })} className={inputClass} placeholder="Confirma la nueva contraseña" />
                </label>
            </div>

            <div className="flex justify-end col-span-1 md:col-span-2">
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary text-background-dark hover:brightness-110 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-6 transition-all shadow-md disabled:opacity-50"
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar Contraseña'}
                </button>
            </div>
            {status && <p className={`col-span-2 text-sm font-bold ${status.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>{status.msg}</p>}
        </form>
    </div>
  )
}

export default PasswordSection
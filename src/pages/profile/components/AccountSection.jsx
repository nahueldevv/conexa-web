import React from 'react'

const AccountSection = ({ user }) => {
  
  // Estilos Stitch (Read Only)
  const containerClass = "flex flex-col gap-6 bg-white dark:bg-[#191919] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm"
  const headerBorderClass = "pb-2 border-b border-gray-100 dark:border-white/5"
  const titleClass = "text-xl font-bold text-gray-900 dark:text-[#F5F5F5] leading-tight tracking-[-0.015em]"
  
  const labelClass = "text-sm font-medium text-gray-500 dark:text-gray-400 mb-2"
  // Input deshabilitado con estilo "flat" para que parezca dato fijo pero estructurado
  const readOnlyInputClass = "w-full p-3 rounded-lg bg-gray-100 dark:bg-transparent border border-gray-200 dark:border-white/5 text-gray-700 dark:text-gray-300 cursor-not-allowed select-all"

  // Formateo de fecha
  const formattedDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }) 
    : '-'

  return (
    <div className={containerClass}>
      <div className={headerBorderClass}>
        <h3 className={titleClass}>Información de la Cuenta</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Email (Identidad Principal) */}
        <div className="flex flex-col">
          <p className={labelClass}>Correo Electrónico</p>
          <input readOnly value={user?.email || ''} className={readOnlyInputClass} />
        </div>

        {/* Fecha de Creación */}
        <div className="flex flex-col">
          <p className={labelClass}>Miembro Desde</p>
          <input readOnly value={formattedDate} className={readOnlyInputClass} />
        </div>

        {/* Rol (Inmutable) */}
        <div className="flex flex-col">
          <p className={labelClass}>Tipo de Cuenta</p>
          <input readOnly value={(user?.rol || '').toUpperCase()} className={readOnlyInputClass} />
        </div>

        {/* Fiscal ID / CUIT */}
        <div className="flex flex-col">
          <p className={labelClass}>Identificador Fiscal (CUIT/RUT)</p>
          <input readOnly value={user?.fiscalId || user?.identificador_fiscal || '-'} className={readOnlyInputClass} />
        </div>

      </div>
    </div>
  )
}

export default AccountSection
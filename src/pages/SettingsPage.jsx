import React, { useState } from "react"
import { 
  User, 
  Building2, 
  Bell, 
  Lock, 
  Globe, 
  Save, 
  Camera,
  Mail,
  Phone,
  Shield
} from "lucide-react"
import { useAuth } from "../context/AuthContext"

// --- COMPONENTE: TOGGLE SWITCH (Visual) ---
const ToggleSwitch = ({ label, description, defaultChecked = false }) => {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
        {description && <span className="text-xs text-gray-500 dark:text-gray-400">{description}</span>}
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}

// --- COMPONENTE: INPUT GROUP ---
const InputGroup = ({ label, icon: Icon, type = "text", placeholder, defaultValue, disabled = false }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
      {label}
    </label>
    <div className="relative group">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon size={18} className="text-gray-400 group-focus-within:text-amber-500 transition-colors" />
        </div>
      )}
      <input
        type={type}
        disabled={disabled}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={`
          block w-full rounded-xl border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#111] 
          text-gray-900 dark:text-white placeholder-gray-400 focus:border-amber-500 focus:ring-amber-500 
          sm:text-sm py-3 transition-all
          ${Icon ? 'pl-10' : 'pl-4'}
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        `}
      />
    </div>
  </div>
)

const SettingsPage = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] font-display transition-colors pb-20">
      
      {/* --- HEADER --- */}
      <div className="bg-white dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-white/10 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Configuración
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestiona tu perfil, preferencias y seguridad de la cuenta.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* --- SECCIÓN 1: PERFIL PÚBLICO --- */}
        <section className="bg-white dark:bg-[#191919] rounded-2xl border border-gray-200 dark:border-white/5 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                    <User size={24} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Perfil Personal</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Información visible para otros usuarios.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center gap-3">
                    <div className="relative group cursor-pointer">
                        <div 
                            className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-gray-100 dark:border-[#111]"
                            style={{ backgroundImage: `url('${user?.profileImageUrl || "https://ui-avatars.com/api/?name=User&background=random"}')` }}
                        ></div>
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white" size={24} />
                        </div>
                    </div>
                    <button className="text-sm font-bold text-amber-600 dark:text-amber-500 hover:underline">
                        Cambiar Foto
                    </button>
                </div>

                {/* Form Fields */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Nombre Completo" icon={User} defaultValue={user?.name || "Nombre de Usuario"} />
                    <InputGroup label="Correo Electrónico" icon={Mail} defaultValue={user?.email} disabled={true} />
                    <InputGroup label="Teléfono" icon={Phone} placeholder="+54 9 11 1234 5678" />
                    <InputGroup label="Cargo / Puesto" icon={Building2} placeholder="Ej: Gerente de Logística" />
                </div>
            </div>
        </section>

        {/* --- SECCIÓN 2: EMPRESA --- */}
        <section className="bg-white dark:bg-[#191919] rounded-2xl border border-gray-200 dark:border-white/5 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-500">
                    <Building2 size={24} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Datos de la Empresa</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Información legal y operativa.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Razón Social" icon={Building2} defaultValue={user?.enterpriseName || "Empresa S.A."} />
                <InputGroup label="ID Fiscal (CUIT/RUT)" placeholder="20-12345678-9" />
                <div className="md:col-span-2">
                    <InputGroup label="Dirección Fiscal" icon={Globe} placeholder="Av. Corrientes 1234, CABA, Argentina" />
                </div>
            </div>
        </section>

        {/* --- SECCIÓN 3: NOTIFICACIONES --- */}
        <section className="bg-white dark:bg-[#191919] rounded-2xl border border-gray-200 dark:border-white/5 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
                    <Bell size={24} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notificaciones</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Controla qué alertas recibes.</p>
                </div>
            </div>

            <div className="space-y-2 divide-y divide-gray-100 dark:divide-white/5">
                <ToggleSwitch 
                    label="Mensajes de Chat" 
                    description="Recibir correos cuando te envíen un mensaje directo." 
                    defaultChecked={true} 
                />
                <ToggleSwitch 
                    label="Actualizaciones de Envíos" 
                    description="Alertas sobre cambios de estado en tus tracking." 
                    defaultChecked={true} 
                />
                <ToggleSwitch 
                    label="Nuevas Ofertas/Demandas" 
                    description="Notificarme cuando haya oportunidades relevantes en mi ruta." 
                    defaultChecked={false} 
                />
                <ToggleSwitch 
                    label="Boletín Informativo" 
                    description="Recibir noticias sobre el Corredor Bioceánico." 
                    defaultChecked={true} 
                />
            </div>
        </section>

        {/* --- SECCIÓN 4: SEGURIDAD --- */}
        <section className="bg-white dark:bg-[#191919] rounded-2xl border border-gray-200 dark:border-white/5 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
                <div className="p-2 bg-green-100 dark:bg-green-500/10 rounded-lg text-green-600 dark:text-green-400">
                    <Shield size={24} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Seguridad</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Protege tu cuenta y contraseña.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Contraseña Actual" icon={Lock} type="password" placeholder="••••••••" />
                <InputGroup label="Nueva Contraseña" icon={Lock} type="password" placeholder="••••••••" />
            </div>
            <div className="mt-4 flex justify-end">
                <button className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white underline">
                    ¿Olvidaste tu contraseña?
                </button>
            </div>
        </section>

        {/* --- FOOTER ACTIONS --- */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6">
            <button className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                Cancelar
            </button>
            <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                <Save size={20} />
                Guardar Cambios
            </button>
        </div>

      </main>
    </div>
  )
}

export default SettingsPage
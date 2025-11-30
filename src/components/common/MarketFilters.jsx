import React from 'react'
import { ChevronDown, Search, X } from 'lucide-react'

// Estilos base unificados con el diseño de "Mis Envíos"
const baseContainerClasses = `
  flex h-12 shrink-0 items-center gap-x-2 rounded-xl
  bg-white dark:bg-[#111] 
  border border-gray-200 dark:border-white/10 
  px-4 py-2 
  text-gray-900 dark:text-white 
  text-sm font-medium
  transition-all duration-200
  focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-transparent
  shadow-sm
`

export const SearchInput = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className={`${baseContainerClasses} flex-1 min-w-[240px] max-w-md group`}>
      <Search size={20} className="text-gray-400 group-focus-within:text-amber-500 transition-colors" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-full w-full bg-transparent border-none outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
      />
      {value && (
        <button onClick={() => onChange("")} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
          <X size={16} />
        </button>
      )}
    </div>
  )
}

export const FilterDropdown = ({ label, value, options = [], onChange }) => {
  // Find label for selected value or default to the prompt label
  const selectedLabel = options.find(opt => opt.value === value)?.label || label

  return (
    <div className="relative min-w-40">
      {/* Visual Button */}
      <div className={`${baseContainerClasses} justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5`}>
        <span className={`leading-normal truncate max-w-[140px] ${value ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
          {value ? selectedLabel : label}
        </span>
        <ChevronDown size={16} className="text-gray-400 shrink-0" />
      </div>

      {/* Invisible Native Select */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 dark:bg-neutral-950 h-full w-full cursor-pointer opacity-0 appearance-none z-10"
      >
        <option value="">Todos</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
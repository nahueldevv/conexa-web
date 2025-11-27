import React from 'react'
import { ChevronDown, Search, X } from 'lucide-react'

// Common styles to ensure consistency
const baseControlClasses = `
  flex h-10 shrink-0 items-center gap-x-2 rounded-lg 
  bg-white border border-gray-300 dark:bg-neutral-950 dark:border-transparent 
  px-4 py-2 
  text-gray-900 dark:text-white 
  text-sm font-normal 
  transition-colors
  focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500
`

export const SearchInput = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className={`${baseControlClasses} flex-1 min-w-[200px] max-w-sm`}>
      <Search size={18} className="text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-full w-full bg-transparent outline-none placeholder:text-gray-400"
      />
      {value && (
        <button onClick={() => onChange("")} className="text-gray-400 hover:text-gray-600">
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
    <div className="relative">
      {/* Visual Button (The UI you designed) */}
      <div className={`${baseControlClasses} justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800`}>
        <span className="leading-normal truncate max-w-[140px]">
          {value ? selectedLabel : label}
        </span>
        <ChevronDown size={16} className="text-gray-500 shrink-0" />
      </div>

      {/* Invisible Native Select (For Logic) */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute dark:bg-neutral-950 inset-0 h-full w-full cursor-pointer opacity-0 appearance-none"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
import { ChevronDown } from 'lucide-react'

const FilterDropdown = ({ text }) => {
  const filterClasses =
    `flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg 
    bg-white border border-gray-300 dark:bg-neutral-950 dark:border-transparent 
    px-4 py-2 
    text-gray-900 dark:text-white 
    text-base font-normal 
    hover:bg-gray-200 dark:hover:bg-neutral-700 
    transition-colors`
  return (
    <button className={filterClasses}>
      <span className="leading-normal">{text}</span>
      <ChevronDown size={16} className="text-gray-700 dark:text-gray-300" />
    </button>
  )
}

export default FilterDropdown
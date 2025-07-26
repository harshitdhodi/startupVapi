import { ChevronDown, Edit, Trash2, Star } from "lucide-react"
import React from "react"

// Filter Dropdown Component
export const FilterDropdown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleClickOutside = (event) => {
    if (!event.target.closest(".filter-dropdown")) {
      setIsOpen(false)
    }
  }

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <div className="relative filter-dropdown">
      <button
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value}
        <ChevronDown className="w-4 h-4" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[120px]">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onChange(option)}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Status Badge Component
export const StatusBadge = ({ status }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${
      status === "Present"
        ? "bg-green-100 text-green-800"
        : status === "Absent"
          ? "bg-red-100 text-red-800"
          : "bg-gray-100 text-gray-800"
    }`}
  >
    {status}
  </span>
)

// Payment Badge Component
export const PaymentBadge = ({ payment }) => {
  if (payment === "-") return <span className="text-gray-400">-</span>

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        payment === "Complete"
          ? "bg-green-100 text-green-800"
          : payment === "Pending"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-gray-100 text-gray-800"
      }`}
    >
      {payment}
    </span>
  )
}

// Action Buttons Component
export const ActionButtons = () => (
  <div className="flex gap-2">
    <button className="p-1 text-orange-500 hover:bg-orange-50 rounded">
      <Edit className="w-4 h-4" />
    </button>
    <button className="p-1 text-red-500 hover:bg-red-50 rounded">
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
)

// Star Rating Component
export const StarRating = ({ rating }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))}
  </div>
)
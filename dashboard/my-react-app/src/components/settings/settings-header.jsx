"use client"

export function SettingsHeader({ activeTab, setActiveTab }) {
  const tabs = [
    "General",
    "Homescreen Arrangement",
    "Notifications",
    "Contact",
    "Payment",
    "API",
    "App Update",
    "About",
  ]

  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}

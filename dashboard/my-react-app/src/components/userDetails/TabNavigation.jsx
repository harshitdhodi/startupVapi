export default function TabNavigation({ activeTab, setActiveTab }) {
    const tabs = [
      { id: "about", label: "About" },
      { id: "events", label: "Events Attended" },
      { id: "reviews", label: "Reviews" }
    ]
  
    return (
      <div className="mb-6">
        <div className="flex space-x-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    )
  }
import { NavLink } from "react-router-dom"
import { Home, Calendar, Users, Trophy, UserCheck, BookOpen, Bell, Settings, X } from "lucide-react"
import React from "react"

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Calendar, label: "Events", path: "/events" },
    { icon: Users, label: "Users", path: "/users" },
    { icon: Trophy, label: "StartupStar", path: "/startupstar" },
    { icon: UserCheck, label: "Jury Management", path: "/jury" },
    { icon: BookOpen, label: "Learning Content", path: "/learning" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ]

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose}></div>}

      <div
        className={`fixed left-0 top-0 h-[100vh] w-64 xl:mt-16 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between p-4 border-b lg:hidden">
          <h2 className="text-xl font-bold text-orange-600">Menu</h2>
          <button onClick={onClose} className="p-2 rounded-md text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 lg:mt-5">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-orange-100 text-orange-700 border-r-4 border-orange-500"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
                onClick={() => onClose()}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </>
  )
}

export default Sidebar

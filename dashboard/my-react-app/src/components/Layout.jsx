import React, { useState } from "react"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1    pt-16">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default Layout

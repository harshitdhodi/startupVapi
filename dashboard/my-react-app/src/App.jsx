import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Events from "./pages/Events"
import Users from "./pages/Users"
import StartupStar from "./pages/StartupStar"
import Jury from "./pages/Jury"
import Learning from "./pages/Learning"
import Notifications from "./pages/Notifications"
import Settings from "./pages/Settings"
import "./App.css"
import React from "react"

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/users" element={<Users />} />
          <Route path="/startupstar" element={<StartupStar />} />
          <Route path="/jury" element={<Jury />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

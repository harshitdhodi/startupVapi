"use client"

import { useState } from "react"
import { Header } from "./Header"
import { Tabs } from "./Tabs"
import { AboutTab } from "./AboutTab"
import { AttendanceTab } from "./AttendanceTab"
import { ReviewTab } from "./ReviewTab"

export default function EventsFilter() {
  const [activeTab, setActiveTab] = useState("About")
  const [attendanceFilter, setAttendanceFilter] = useState("Guest")
  const [memberFilter, setMemberFilter] = useState("Members")

  return (
    <div className="p-6 mt-10 bg-white">
      <Header />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      {activeTab === "About" && <AboutTab />}
      
      {activeTab === "Attendance" && (
        <AttendanceTab
          attendanceFilter={attendanceFilter}
          setAttendanceFilter={setAttendanceFilter}
        />
      )}
      
      {activeTab === "Review" && <ReviewTab />}
    </div>
  )
}
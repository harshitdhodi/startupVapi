"use client"

import { useState } from "react"
import { SettingsHeader } from "../components/settings/settings-header"
import { GeneralTab } from "../components/settings/general-tab"
import { HomescreenArrangementTab } from "../components/settings/homescreen-arrangement-tab"
import { NotificationsTab } from "../components/settings/notifications-tab"
import { ContactTab } from "../components/settings/contact-tab"
import { PaymentTab } from "../components/settings/payment-tab"
import { ApiTab } from "../components/settings/api-tab"
import { AppUpdateTab } from "../components/settings/app-update-tab"
import { AboutTab } from "../components/settings/about-tab"

export default function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState("General")

  const renderTabContent = () => {
    switch (activeTab) {
      case "General":
        return <GeneralTab />
      case "Homescreen Arrangement":
        return <HomescreenArrangementTab />
      case "Notifications":
        return <NotificationsTab />
      case "Contact":
        return <ContactTab />
      case "Payment":
        return <PaymentTab />
      case "API":
        return <ApiTab />
      case "App Update":
        return <AppUpdateTab />
      case "About":
        return <AboutTab />
      default:
        return <GeneralTab />
    }
  }

  return (
    <div className="min-h-screen w-full  mt-10 bg-gray-50">
      <div className="w-full p-6">
        <h1 className="text-3xl font-bold text-gray-900 mt-6">Settings</h1>

        <div className="rounded-lg border-none">
          <div className="p-6">
            <SettingsHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="">{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

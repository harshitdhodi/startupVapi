"use client"

import { useState } from "react"
import { Plus, Send, Bell, Eye, Edit, Trash2 } from "lucide-react"

const Notifications = () => {
  const [notifications] = useState([
    {
      id: 1,
      title: "New Event: Startup Pitch Competition",
      message: "Join us for our annual startup pitch competition. Registration closes soon!",
      type: "Event",
      recipients: "All Users",
      sentDate: "2024-02-10",
      status: "Sent",
      openRate: "78%",
      clickRate: "45%",
    },
    {
      id: 2,
      title: "StartupStar Round 2 Results",
      message: "Congratulations to all participants who made it to Round 2! Check your scores now.",
      type: "Competition",
      recipients: "StartupStar Participants",
      sentDate: "2024-02-08",
      status: "Sent",
      openRate: "85%",
      clickRate: "62%",
    },
    {
      id: 3,
      title: "New Learning Content Available",
      message: 'New video course on "Funding Your Startup" is now available in the learning section.',
      type: "Learning",
      recipients: "Members & Students",
      sentDate: "2024-02-05",
      status: "Sent",
      openRate: "72%",
      clickRate: "38%",
    },
    {
      id: 4,
      title: "Jury Scoring Reminder",
      message: "Dear jury members, please complete your scoring for assigned participants.",
      type: "Jury",
      recipients: "Jury Members",
      sentDate: "2024-02-12",
      status: "Draft",
      openRate: "0%",
      clickRate: "0%",
    },
  ])

  const getTypeColor = (type) => {
    switch (type) {
      case "Event":
        return "bg-blue-100 text-blue-800"
      case "Competition":
        return "bg-orange-100 text-orange-800"
      case "Learning":
        return "bg-green-100 text-green-800"
      case "Jury":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Sent":
        return "bg-green-100 text-green-800"
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Create Notification
        </button>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sent</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter((n) => n.status === "Sent").length}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-full">
              <Send className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter((n) => n.status === "Draft").length}
              </p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-full">
              <Edit className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Open Rate</p>
              <p className="text-2xl font-bold text-gray-900">78%</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-full">
              <Eye className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Click Rate</p>
              <p className="text-2xl font-bold text-gray-900">48%</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-full">
              <Bell className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search notifications..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option>All Types</option>
                <option>Event</option>
                <option>Competition</option>
                <option>Learning</option>
                <option>Jury</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option>All Status</option>
                <option>Sent</option>
                <option>Draft</option>
                <option>Scheduled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Open Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Click Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notifications.map((notification) => (
                <tr key={notification.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                      <div className="text-sm text-gray-500">{notification.message}</div>
                      <div className="text-xs text-gray-400 mt-1">{notification.sentDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(notification.type)}`}
                    >
                      {notification.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{notification.recipients}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notification.status)}`}
                    >
                      {notification.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{notification.openRate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{notification.clickRate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-orange-600 hover:text-orange-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Send className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Notifications

import { Users, Calendar, Trophy, TrendingUp, Eye, UserPlus, Award, Bell } from "lucide-react"
import React from "react"
const Dashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "2,543",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Active Events",
      value: "8",
      change: "+2",
      changeType: "positive",
      icon: Calendar,
      color: "bg-green-500",
    },
    {
      title: "StartupStar Participants",
      value: "456",
      change: "+23%",
      changeType: "positive",
      icon: Trophy,
      color: "bg-orange-500",
    },
    {
      title: "Revenue",
      value: "₹1,23,456",
      change: "+8%",
      changeType: "positive",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ]

  const recentActivities = [
    { action: "New user registration", user: "John Doe", time: "2 minutes ago", type: "user" },
    { action: "Event created", user: "Admin", time: "1 hour ago", type: "event" },
    { action: "StartupStar submission", user: "Jane Smith", time: "2 hours ago", type: "submission" },
    { action: "Jury score updated", user: "Dr. Kumar", time: "3 hours ago", type: "score" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-3">
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Create Event
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">by {activity.user}</p>
                </div>
                <div className="text-sm text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center space-y-2">
              <Calendar className="h-8 w-8 text-orange-500" />
              <span className="text-sm font-medium">Create Event</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center space-y-2">
              <Bell className="h-8 w-8 text-blue-500" />
              <span className="text-sm font-medium">Send Notification</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center space-y-2">
              <Award className="h-8 w-8 text-green-500" />
              <span className="text-sm font-medium">Manage Jury</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center space-y-2">
              <Eye className="h-8 w-8 text-purple-500" />
              <span className="text-sm font-medium">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

"use client"

import { useState } from "react"
import { Trophy, Play, Download, Eye, Star, Clock } from "lucide-react"

const StartupStar = () => {
  const [participants] = useState([
    {
      id: 1,
      name: "John Doe",
      teamName: "Tech Innovators",
      idea: "AI-powered learning platform",
      round: "Round 2",
      score: 85,
      status: "Active",
      submissionDate: "2024-02-10",
      videoUrl: "pitch-video-1.mp4",
      paymentStatus: "Completed",
    },
    {
      id: 2,
      name: "Jane Smith",
      teamName: "Green Solutions",
      idea: "Sustainable packaging solutions",
      round: "Round 1",
      score: 78,
      status: "Active",
      submissionDate: "2024-02-12",
      videoUrl: "pitch-video-2.mp4",
      paymentStatus: "Completed",
    },
    {
      id: 3,
      name: "Mike Johnson",
      teamName: "HealthTech",
      idea: "Telemedicine platform for rural areas",
      round: "Screening",
      score: 92,
      status: "Active",
      submissionDate: "2024-02-08",
      videoUrl: "pitch-video-3.mp4",
      paymentStatus: "Completed",
    },
  ])

  const getRoundColor = (round) => {
    switch (round) {
      case "Screening":
        return "bg-gray-100 text-gray-800"
      case "Round 1":
        return "bg-blue-100 text-blue-800"
      case "Round 2":
        return "bg-purple-100 text-purple-800"
      case "Final":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const rounds = [
    { name: "Screening Round", participants: 456, selected: 100, status: "Completed" },
    { name: "Round 1", participants: 100, selected: 30, status: "In Progress" },
    { name: "Round 2", participants: 30, selected: 10, status: "Upcoming" },
    { name: "Final Round", participants: 10, selected: 1, status: "Upcoming" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">StartupStar Competition</h1>
        <div className="flex space-x-3">
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center">
            <Trophy className="h-4 w-4 mr-2" />
            View Leaderboard
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Competition Rounds Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rounds.map((round, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{round.name}</h3>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  round.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : round.status === "In Progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {round.status}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Participants:</span>
                <span className="text-sm font-medium">{round.participants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Selected:</span>
                <span className="text-sm font-medium">{round.selected}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: `${(round.selected / round.participants) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search participants..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option>All Rounds</option>
                <option>Screening</option>
                <option>Round 1</option>
                <option>Round 2</option>
                <option>Final</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Total Participants:</span>
              <span className="text-sm font-medium">{participants.length}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Startup Idea
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Round
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participants.map((participant) => (
                <tr key={participant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                      <div className="text-sm text-gray-500">{participant.teamName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{participant.idea}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoundColor(participant.round)}`}
                    >
                      {participant.round}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className={`h-4 w-4 mr-1 ${getScoreColor(participant.score)}`} />
                      <span className={`text-sm font-medium ${getScoreColor(participant.score)}`}>
                        {participant.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        participant.paymentStatus === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {participant.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {participant.submissionDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Play className="h-4 w-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900">
                        <Download className="h-4 w-4" />
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

export default StartupStar

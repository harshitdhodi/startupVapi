import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Trash2 } from "lucide-react"

export function NotificationsTab() {
  const notifications = [
    {
      notification: "New Feature Announcement",
      description: "Details about the new feature",
      date: "18-07-2025",
      time: "10:00 AM",
      audience: "All Users",
      status: "Active",
    },
    {
      notification: "Event Reminder",
      description: "Reminder for upcoming event",
      date: "20-07-2025",
      time: "6:00 PM",
      audience: "Event Attendees",
      status: "Scheduled",
    },
    {
      notification: "Community Update",
      description: "Latest community updates",
      date: "25-07-2025",
      time: "2:00 PM",
      audience: "Active Users",
      status: "Scheduled",
    },
    {
      notification: "Special Offer",
      description: "Exclusive offer for users",
      date: "05-08-2025",
      time: "11:00 AM",
      audience: "New Users",
      status: "Active",
    },
    {
      notification: "Feedback Request",
      description: "Request for user feedback",
      date: "10-08-2025",
      time: "4:00 PM",
      audience: "All Users",
      status: "Draft",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button className="bg-orange-500 hover:bg-orange-600">New Notification</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium">Notification</th>
              <th className="text-left py-3 px-4 font-medium">Description</th>
              <th className="text-left py-3 px-4 font-medium">Date</th>
              <th className="text-left py-3 px-4 font-medium">Time</th>
              <th className="text-left py-3 px-4 font-medium">Audience</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-left py-3 px-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-4">{item.notification}</td>
                <td className="py-3 px-4">{item.description}</td>
                <td className="py-3 px-4">{item.date}</td>
                <td className="py-3 px-4">{item.time}</td>
                <td className="py-3 px-4">{item.audience}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : item.status === "Scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4 text-orange-500" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-600">Email Notifications</CardTitle>
            <p className="text-sm text-gray-600">Send notifications via email</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Push Notification</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>SMS Notifications</Label>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-600">One Signal Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>One Signal App ID</Label>
              <Input defaultValue="f67c0d2fa-b380-4da1-abe2-fa830b7e8929" className="mt-1" />
            </div>
            <div>
              <Label>One Signal Reset Key</Label>
              <Input defaultValue="MmNtMjMyMzktMDMxYS00MzEwLTkwMTMmYTZ" className="mt-1" />
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600">Save</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2 } from "lucide-react"

export function HomescreenArrangementTab() {
  const items = [
    { id: 1, name: "Startup Vapi Banner", status: true, feature: true },
    { id: 2, name: "Upcoming Events", status: true, feature: true },
    { id: 3, name: "Tips and Tricks", status: true, feature: true },
  ]

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium">Sr.No</th>
              <th className="text-left py-3 px-4 font-medium">Name</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-left py-3 px-4 font-medium">Feature</th>
              <th className="text-left py-3 px-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="border-b">
                <td className="py-3 px-4">{index + 1}.</td>
                <td className="py-3 px-4">{item.name}</td>
                <td className="py-3 px-4">
                  <Switch defaultChecked={item.status} />
                </td>
                <td className="py-3 px-4">
                  <Switch defaultChecked={item.feature} />
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
    </div>
  )
}

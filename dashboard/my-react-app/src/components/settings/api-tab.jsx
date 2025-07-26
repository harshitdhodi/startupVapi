import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ApiTab() {
  const apis = [
    { id: 1, name: "Get Events API", orderBy: "Event Name", sort: "Ascending" },
    { id: 2, name: "Get Users API", orderBy: "User Name", sort: "Ascending" },
    { id: 3, name: "Get Tips and Tricks API", orderBy: "Target Audience", sort: "Ascending" },
    { id: 4, name: "Get Startup Star API", orderBy: "Registered students", sort: "Ascending" },
    { id: 5, name: "Get Video Lessons API", orderBy: "Added date", sort: "Ascending" },
  ]

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium w-8"></th>
              <th className="text-left py-3 px-4 font-medium">API Name</th>
              <th className="text-left py-3 px-4 font-medium">Order By</th>
              <th className="text-left py-3 px-4 font-medium">Sort</th>
            </tr>
          </thead>
          <tbody>
            {apis.map((api, index) => (
              <tr key={api.id} className="border-b">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{api.name}</td>
                <td className="py-3 px-4">
                  <Select defaultValue={api.orderBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Event Name">Event Name</SelectItem>
                      <SelectItem value="User Name">User Name</SelectItem>
                      <SelectItem value="Target Audience">Target Audience</SelectItem>
                      <SelectItem value="Registered students">Registered students</SelectItem>
                      <SelectItem value="Added date">Added date</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-3 px-4">
                  <Select defaultValue={api.sort}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ascending">Ascending</SelectItem>
                      <SelectItem value="Descending">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <Button className="bg-orange-500 hover:bg-orange-600">Save</Button>
      </div>
    </div>
  )
}

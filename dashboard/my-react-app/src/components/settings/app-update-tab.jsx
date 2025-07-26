import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AppUpdateTab() {
  return (
    <div className="space-y-6">
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-600">Updates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Popup Show/Hide</Label>
            <Switch defaultChecked />
          </div>

          <div>
            <Label htmlFor="version-code">New Version Code</Label>
            <Input id="version-code" defaultValue="1.1" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              className="mt-1 h-24"
              defaultValue="Our free mobile friendly tool offers a variety of randomly generated keys and passwords you can use to secure any application, service or device. Simply click to copy a password or press the 'Generate' button for an entirely new set."
            />
          </div>

          <div>
            <Label htmlFor="app-link">App Link</Label>
            <Input id="app-link" defaultValue="TLS" className="mt-1" />
          </div>

          <div className="flex items-center justify-between">
            <Label>Cancel Option</Label>
            <Switch defaultChecked />
          </div>

          <div className="flex justify-end">
            <Button className="bg-orange-500 hover:bg-orange-600">Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

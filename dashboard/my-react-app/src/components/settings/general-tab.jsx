import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export function GeneralTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="app-title">App Title</Label>
          <Input id="app-title" defaultValue="Startup Vapi" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="app-logo">App Logo</Label>
          <div className="mt-1 flex items-center space-x-2">
            <Input id="app-logo" placeholder="Choose file" />
            <Button variant="outline" size="sm">
              Browse
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="admin-favicon">Admin Favicon</Label>
          <div className="mt-1 flex items-center space-x-2">
            <Input id="admin-favicon" placeholder="Choose file" />
            <Button variant="outline" size="sm">
              Browse
            </Button>
          </div>
        </div>
        <div>
          <Label htmlFor="author">Author</Label>
          <Input id="author" defaultValue="RnD Technosoft" className="mt-1" />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          className="mt-1 h-32"
          defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="api-key">API Key</Label>
          <Input id="api-key" defaultValue="1234567890" className="mt-1" />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="product-enable" defaultChecked />
          <Label htmlFor="product-enable">Product Enable</Label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="timezone">Timezone</Label>
          <Input id="timezone" defaultValue="(GMT+05:30) Asia/Calcutta" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Input id="currency" defaultValue="INR" className="mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="app-version">App Version</Label>
          <Input id="app-version" defaultValue="1.1" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="contact">Contact</Label>
          <Input id="contact" defaultValue="+91 99999 24411" className="mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" defaultValue="startupvapi@gmail.com" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input id="website" defaultValue="www.startupvapi.com" className="mt-1" />
        </div>
      </div>

      <div>
        <Label htmlFor="developed-by">Developed By</Label>
        <Input id="developed-by" defaultValue="RnD Technosoft" className="mt-1" />
      </div>

      <div className="flex justify-end">
        <Button className="bg-orange-500 hover:bg-orange-600">Save</Button>
      </div>
    </div>
  )
}

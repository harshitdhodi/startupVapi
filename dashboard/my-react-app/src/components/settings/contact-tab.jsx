import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ContactTab() {
  return (
    <div className="space-y-6">
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-600">Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input id="smtp-host" defaultValue="smtp.gmail.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="startupvapi@gmail.com" className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" defaultValue="300" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="smtp-secure">SMTP Secure</Label>
              <div className="flex space-x-4 mt-1">
                <Input defaultValue="TLS" className="w-20" />
                <Input defaultValue="587" className="w-20" />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-orange-500 hover:bg-orange-600">Save</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-600">WhatsApp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Authentication</Label>
            <Switch defaultChecked />
          </div>
          <div>
            <Label htmlFor="send-otp">Send OTP Message</Label>
            <Textarea
              id="send-otp"
              className="mt-1"
              defaultValue="[OTP] is your One Time Password(OTP) to login to your account. Please enter the OTP to proceed."
            />
          </div>
          <div>
            <Label htmlFor="api-key">API Key</Label>
            <Input id="api-key" defaultValue="v2BdH5Seb8H7bb2r5f2BEf2Q4BH130a50ca" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="instance-id">Instance Id</Label>
            <Input id="instance-id" defaultValue="2F7f6bea0cVhCff" className="mt-1" />
          </div>
          <div className="flex justify-end">
            <Button className="bg-orange-500 hover:bg-orange-600">Save</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-600">WhatsApp Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Enable</Label>
            <Switch defaultChecked />
          </div>
          <div>
            <Label htmlFor="whatsapp-number">WhatsApp Number</Label>
            <Input id="whatsapp-number" defaultValue="+91 75065 32100" className="mt-1" />
          </div>
          <div className="flex justify-end">
            <Button className="bg-orange-500 hover:bg-orange-600">Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

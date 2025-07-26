import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PaymentTab() {
  return (
    <div className="space-y-6">
      <Card className="border-orange-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-orange-600">Razorpay</CardTitle>
            <Switch defaultChecked />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="razorpay-key">Razorpay Key Id</Label>
            <Input id="razorpay-key" defaultValue="rzp_live_crightvnhfuqpf" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="razorpay-secret">Razorpay Secret Key</Label>
            <Input id="razorpay-secret" defaultValue="IcRoRZnqgRcRe6cSRnvf" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="otp-expiry">OTP Expiry (seconds)</Label>
            <Input id="otp-expiry" defaultValue="300" className="mt-1" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-600">Refund Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            className="h-40"
            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
          />
          <div className="flex justify-end mt-4">
            <Button className="bg-orange-500 hover:bg-orange-600">Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

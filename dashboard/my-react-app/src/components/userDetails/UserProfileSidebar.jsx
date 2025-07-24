import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Award } from "lucide-react"

export default function UserProfileSidebar({ userData }) {
  // Format date to show month and year
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const options = { year: 'numeric', month: 'long' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <Card className="border-orange-200 border-2">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Member Since:</span>
          <span>{formatDate(userData?.createdAt)}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Event Participation:</span>
          </div>
          <div className="pl-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Total Events:</span>
              <span className="font-medium">{userData?.participation?.totalEvents || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Attended Events:</span>
              <span className="font-medium">{userData?.participation?.attendedEvents || 0}</span>
            </div>
            <div className="pt-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Attendance Rate:</span>
                <span className="font-medium">{userData?.participation?.percentage || 0}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-orange-500 rounded-full"
                  style={{ width: `${userData?.participation?.percentage || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Award className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Account Status:</span>
          <Badge 
            variant="secondary" 
            className={userData?.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
          >
            {userData?.isVerified ? 'Verified' : 'Pending Verification'}
          </Badge>
        </div>

        <Button 
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => {
            const adminNumber = '8347980883';
            const userNumber = userData?.mobile?.number || '';
            
            if (!userNumber) {
              alert('User phone number not available');
              return;
            }
            
            // Create WhatsApp chat URL with admin number as the sender and user number as the recipient
            const message = `Hi, this is regarding your account. How can I assist you today?`;
            const whatsappUrl = `https://wa.me/91${userNumber}?text=${encodeURIComponent(message)}&phone=91${userNumber}`;
            
            // Open the URL in a new tab
            window.open(whatsappUrl, '_blank');
          }}
          disabled={!userData?.mobile?.number}
        >
          {userData?.mobile?.number ? 'CONTACT NOW' : 'NO PHONE NUMBER'}
        </Button>
      </CardContent>
    </Card>
  )
}
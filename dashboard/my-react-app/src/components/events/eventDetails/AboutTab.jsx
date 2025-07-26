import { Calendar, Clock, MapPin } from "lucide-react"
import { eventData, similarEvents } from "./data"

export const AboutTab = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Event Details */}
      <div className="lg:col-span-3 border border-orange-200 rounded-lg p-4 ">
     
        <div className="w-100 h-100">
            <img src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="" className="w-100 h-100 object-cover"/>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">About this event</h3>
          <p className="text-gray-600 leading-relaxed">{eventData.description}</p>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6 lg:col-span-2">
        {/* Event Info */}
        <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{eventData.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Time:</span>
              <span>{eventData.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Venue:</span>
              <span>{eventData.venue}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Registration deadline:</span>
              <span>{eventData.registrationDeadline}</span>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Ticket price:</span>
              <span>{eventData.ticketPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Seats:</span>
              <span>{eventData.totalSeats}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Register now:</span>
              <button className="bg-orange-500 text-white px-3 py-1 rounded text-xs font-medium">
                REGISTER NOW
              </button>
            </div>
          </div>
        </div>

        {/* Similar Events */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium mb-4">Similar events</h4>
          <div className="grid grid-cols-3 gap-2">
            {similarEvents.map((event) => (
              <div key={event.id} className="bg-black text-white rounded p-3 text-center">
                <div className="w-6 h-6 mx-auto mb-2 bg-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
                <div className="text-xs">{event.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
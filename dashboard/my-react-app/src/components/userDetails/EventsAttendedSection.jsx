import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"

export default function EventsAttendedSection({ eventsData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {eventsData.map((event) => (
        <Card key={event.id} className="border-orange-200 border-2">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <img
                src={`/api/image/download/${event.image}` || "/placeholder.svg"}
                alt={event.name}
                width={80}
                height={80}
                className="rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{event.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.venue}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CustomSwitch from "@/components/ui/CustomSwitch"
import { Badge } from "@/components/ui/badge"
import EventRegistrationForm from "@/components/events/EventRegistrationForm"

// Dummy data fallback
const dummyEvents = [
  {
    _id: "1",
    banner: "event-banner-1.jpeg",
    date: "2025-08-21T18:30:00.000Z",
    time: "15:30",
    location: "Visamo, Dang",
    description: "Family event for fireflies night trek",
    youtubeLinks: ["https://www.youtube.com"],
    prize: "0",
    lastDate: "2025-08-20T18:30:00.000Z",
    eventId: {
      _id: "1",
      name: "Fireflies night Trek",
      max_seats: 65,
      isStartUpVapiEvent: false,
      createdAt: "2025-07-16T13:26:09.359Z",
      updatedAt: "2025-07-16T13:26:09.359Z",
    },
    category: "Family event",
    registrations: 65,
    status: "Past",
  },
  {
    _id: "2",
    banner: "event-banner-2.jpeg",
    date: "2025-07-08T18:30:00.000Z",
    time: "19:00",
    location: "Rofel College, Vapi",
    description: "Networking event for startup connect",
    youtubeLinks: ["https://www.youtube.com"],
    prize: "0",
    lastDate: "2025-07-07T18:30:00.000Z",
    eventId: {
      _id: "2",
      name: "Startup Connect",
      max_seats: 45,
      isStartUpVapiEvent: true,
      createdAt: "2025-07-16T13:26:09.359Z",
      updatedAt: "2025-07-16T13:26:09.359Z",
    },
    category: "Networking",
    registrations: 45,
    status: "Past",
  } 
]

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("All types")
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [isCreateMode, setIsCreateMode] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, selectedType])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/event-details/startup-vapi-events")
      const result = await response.json()

      if (result.status === "success" && result.data) {
        // Transform API data to match our component structure
        const transformedEvents = result.data.map((event) => ({
          ...event,
          category: getCategoryFromDescription(event.description),
          registrations: Math.floor(Math.random() * event.eventId.max_seats), // Since registrations not in API
          status: new Date(event.date) < new Date() ? "Past" : "Upcoming",
        }))
        setEvents(transformedEvents)
      } else {
        // Use dummy data if API doesn't return expected format
        setEvents(dummyEvents)
      }
    } catch (error) {
      console.error("Failed to fetch events:", error)
      // Use dummy data on error
      setEvents(dummyEvents)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryFromDescription = (description) => {
    if (description.toLowerCase().includes("family")) return "Family event"
    if (description.toLowerCase().includes("networking")) return "Networking"
    if (description.toLowerCase().includes("talk")) return "Talk"
    if (description.toLowerCase().includes("workshop")) return "Workshop"
    if (description.toLowerCase().includes("competition")) return "Competition"
    return "General"
  }

  const filterEvents = () => {
    let filtered = events

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.eventId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedType !== "All types") {
      filtered = filtered.filter((event) => event.category === selectedType)
    }

    setFilteredEvents(filtered)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
  }

  const formatTime = (timeString) => {
    return timeString || "00:00"
  }

  const getCategoryColor = (category) => {
    const colors = {
      "Family event": "bg-orange-100 text-orange-800",
      Networking: "bg-blue-100 text-blue-800",
      Talk: "bg-green-100 text-green-800",
      Workshop: "bg-purple-100 text-purple-800",
      Competition: "bg-pink-100 text-pink-800",
      General: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors["General"]
  }

  const handleRegistrationSuccess = (result) => {
    // You can update the UI here if needed after successful registration
    console.log('Registration successful:', result);
  };

  const openRegistration = (event) => {
    setSelectedEvent(event);
    setIsRegistrationOpen(true);
  };

  const openCreateEvent = () => {
    setSelectedEvent({
      _id: 'new',
      eventId: { name: 'New Event' }
    });
    setIsCreateMode(true);
    setIsRegistrationOpen(true);
  };

  const closeRegistration = () => {
    setIsRegistrationOpen(false);
    setSelectedEvent(null);
    setIsCreateMode(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading events...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {isRegistrationOpen && selectedEvent && (
        <EventRegistrationForm
          event={selectedEvent}
          onClose={closeRegistration}
          onSubmit={handleRegistrationSuccess}
          isCreateMode={isCreateMode}
        />
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={openCreateEvent}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search events"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-40 border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All types">All types</SelectItem>
              <SelectItem value="Family event">Family event</SelectItem>
              <SelectItem value="Networking">Networking</SelectItem>
              <SelectItem value="Talk">Talk</SelectItem>
              <SelectItem value="Workshop">Workshop</SelectItem>
              <SelectItem value="Competition">Competition</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-gray-600">Total events: {filteredEvents.length}</div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-300">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Event</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Registrations</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Feature</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event._id} className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{event.eventId.name}</div>
                        <Badge className={`text-xs mt-1 ${getCategoryColor(event.category)}`}>{event.category}</Badge>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{formatDate(event.date)}</td>
                    <td className="py-4 px-4 text-gray-600">{formatTime(event.time)} PM</td>
                    <td className="py-4 px-4 text-gray-600">{event.location}</td>
                    <td className="py-4 px-4 text-gray-600">{event.registrations}</td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={event.status === "Past" ? "secondary" : "default"}
                        className={
                          event.status === "Past" ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800"
                        }
                      >
                        {event.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <CustomSwitch defaultChecked={true} />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-orange-500 hover:text-orange-600"
                          onClick={() => openRegistration(event)}
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Register
                        </Button>
                        <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No events found matching your criteria.</div>
          </div>
        )}
      </div>
    </div>
  )
}

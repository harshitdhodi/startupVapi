"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CustomSwitch from "@/components/ui/CustomSwitch"
import { Badge } from "@/components/ui/badge"
import EventRegistrationForm from "@/components/events/EventRegistrationForm"
import { Link } from "react-router-dom"

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
  }
]

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("All types")
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState('create') // 'create', 'edit', 'register'

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, selectedType])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/event")
      console.log("response",response.data)
      const result = await response.json()
      console.log(result)

      if (result.success && result.data) {
        // Transform API data to match our component structure
        const transformedEvents = result.data.map((event) => ({
          ...event,
          eventId: {  // Create eventId object to match expected structure
            _id: event._id,
            name: event.name,
            max_seats: event.max_seats,
            isStartUpVapiEvent: event.isStartUpVapiEvent,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt
          },
          category: getCategoryFromDescription(event.description),
          registrations: 0, // Default to 0 registrations
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

  // Fetch single event for editing
  const fetchEventById = async (eventId) => {
    try {
      const response = await fetch(`/api/event/${eventId}`)
      const result = await response.json()
      
      if (result.success && result.data) {
        return {
          ...result.data,
          eventId: {
            _id: result.data._id,
            name: result.data.name,
            max_seats: result.data.max_seats,
            isStartUpVapiEvent: result.data.isStartUpVapiEvent,
            createdAt: result.data.createdAt,
            updatedAt: result.data.updatedAt
          }
        }
      }
      return null
    } catch (error) {
      console.error("Failed to fetch event:", error)
      return null
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
    // If the date is already in DD/MM/YYYY format, return as is
    if (typeof dateString === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(dateString.trim())) {
      return dateString.trim();
    }
    
    // Handle ISO date strings or other formats
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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

  const handleFormSuccess = (result) => {
    console.log('Form submission successful:', result);
    // Refresh events list after successful create/edit
    if (formMode === 'create' || formMode === 'edit') {
      fetchEvents();
    }
  };

  // Open form for creating new event
  const openCreateEvent = () => {
    setSelectedEvent(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  // Open form for editing existing event
  const openEditEvent = async (event) => {
    try {
      // Fetch the complete event data
      const eventData = await fetchEventById(event._id);
      if (eventData) {
        setSelectedEvent(eventData);
        setFormMode('edit');
        setIsFormOpen(true);
      } else {
        console.error('Failed to fetch event data for editing');
        // Fallback to using the event data we have
        setSelectedEvent(event);
        setFormMode('edit');
        setIsFormOpen(true);
      }
    } catch (error) {
      console.error('Error opening edit form:', error);
      // Fallback to using the event data we have
      setSelectedEvent(event);
      setFormMode('edit');
      setIsFormOpen(true);
    }
  };

  // Open form for user registration
  const openRegistration = (event) => {
    setSelectedEvent(event);
    setFormMode('register');
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedEvent(null);
    setFormMode('create');
  };

  // Handle delete event
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(`/api/event/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the event from the local state
        setEvents(events.filter(event => event._id !== eventId));
        console.log('Event deleted successfully');
      } else {
        console.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
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
    <div className="p-6 bg-gray-50 mt-10 min-h-screen">
      {isFormOpen && (
        <EventRegistrationForm
          event={selectedEvent}
          onClose={closeForm}
          onSubmit={handleFormSuccess}
          isCreateMode={formMode === 'create'}
          isEditMode={formMode === 'edit'}
          isRegisterMode={formMode === 'register'}
        />
      )}
      <div className="max-w-7xl mt-10 mx-auto">
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
            <SelectContent className="bg-white">
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
                        <Link to={`/events/${event._id}`}>
                          <div className="font-medium text-gray-900">{event.eventId.name}</div>
                        </Link>
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
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-orange-500 hover:text-orange-600"
                          onClick={() => openEditEvent(event)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteEvent(event._id)}
                        >
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
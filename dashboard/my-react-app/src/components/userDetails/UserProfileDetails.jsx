"use client"

import { useState, useEffect } from "react"
import PageHeader from "./PageHeader"
import TabNavigation from "./TabNavigation"
import UserProfileHeader from "./UserProfileHeader"
import UserProfileSidebar from "./UserProfileSidebar"
import EventsAttendedSection from "./EventsAttendedSection"
import ReviewsSection from "./ReviewsSection"
import { useParams } from "react-router-dom"

export default function UserProfileDetails() {
  const [activeTab, setActiveTab] = useState("about")
  const [eventsData, setEventsData] = useState([])
  const [reviewsData, setReviewsData] = useState([])
  const [userData, setUserData] = useState(null) // Changed from hardcoded to state
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { id } = useParams()
  console.log(id)

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/${id}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`)
        }
        const data = await response.json()
        console.log('User data response:', data) // Debug log
        
        // Check if data has the expected structure
        if (!data.data?.user) {
          throw new Error('Invalid user data structure received from API')
        }
        
        setUserData(data.data.user)
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [id])

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/event-payment/user/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        const data = await response.json()
        
        // Transform the API response to match the expected format
        const formattedEvents = data.data.map(event => ({
          id: event._id,
          name: event.eventId?.name || 'Untitled Event',
          date: new Date(event.eventDetails?.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          venue: event.eventDetails?.location || 'Location not specified',
          image: event.eventDetails?.banner 
            ? `/${event.eventDetails.banner}` 
            : '/placeholder.svg?height=100&width=100',
          description: event.eventDetails?.description || '',
          time: event.eventDetails?.time || ''
        }))
        
        setEventsData(formattedEvents)
      } catch (err) {
        console.error('Error fetching events:', err)
        setError(err.message)
      }
    }

    fetchEvents()
  }, [id])

  // Fetch reviews data
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/review/user?userId=${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch reviews')
        }
        const data = await response.json()

        // Transform the API response to match the expected format for ReviewsSection
        const formattedReviews = data.data.map(review => ({
          id: review._id,
          eventName: review.eventId?.name || 'Untitled Event',
          rating: review.rating || 0,
          review: review.message || 'No review provided',
          timeAgo: formatTimeAgo(review.createdAt), // Format timestamp
          avatar: review.userId?.photo 
            ? `/${review.userId.photo}` 
            : '/placeholder.svg?height=40&width=40'
        }))

        setReviewsData(formattedReviews)
      } catch (err) {
        console.error('Error fetching reviews:', err)
        setError(err.message)
      } finally {
        setIsLoading(false) // Set loading to false after all data is fetched
      }
    }

    fetchReviews()
  }, [id])

  // Helper function to format timeAgo (e.g., "2 days ago")
  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const reviewDate = new Date(timestamp)
    const diffInMs = now - reviewDate
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return '1 day ago'
    return `${diffInDays} days ago`
  }

  if (isLoading || !userData) {
    return <div className="flex justify-center items-center min-h-screen">Loading data...</div>
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading data: {error}</div>
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-10 bg-gray-50">
      <PageHeader />
      
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "about" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UserProfileHeader userData={userData} />
          </div>
          <div className="space-y-6">
            <UserProfileSidebar userData={userData} />
          </div>
        </div>
      )}

      {activeTab === "events" && (
        <EventsAttendedSection eventsData={eventsData} />
      )}

      {activeTab === "reviews" && (
        <ReviewsSection reviewsData={reviewsData} />
      )}
    </div>
  )
}
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function ReviewsSection({ reviewsData }) {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-orange-400 text-orange-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="space-y-4">
      {reviewsData.map((review) => (
        <Card key={review.id} className="border-orange-200 border-2">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={`/api/image/download/${review.avatar}`|| "/placeholder.svg"} alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.eventName}</h3>
                    <div className="flex items-center gap-1 mt-1">{renderStars(review.rating)}</div>
                  </div>
                  <span className="text-sm text-gray-500">{review.timeAgo}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{review.review}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
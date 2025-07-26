import { StarRating } from "./UIComponents"
import { reviewsData } from "./data"

export const ReviewTab = () => {
  return (
    <div>
      {reviewsData.map((review) => (
        <div key={review.id} className="border border-orange-200 rounded-lg p-6 bg-orange-50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              <img
                src="/placeholder.svg?height=48&width=48"
                alt={review.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{review.name}</h4>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium">{review.rating}.0</span>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
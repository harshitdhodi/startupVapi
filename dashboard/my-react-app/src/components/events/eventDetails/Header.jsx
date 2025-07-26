import { Link } from "react-router-dom"

export const Header = () => {
    return (
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Events</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/events">
                <span className="hover:text-orange-600 hover:underline">Events</span>
            </Link>
          <span>/</span>
          <span>Event details</span>
        </div>
      </div>
    )
  }
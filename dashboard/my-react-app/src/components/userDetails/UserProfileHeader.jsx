import { Card, CardContent } from "@/components/ui/card"

export default function UserProfileHeader({ userData }) {
  console.log(userData)
  
  // Format date of birth
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Safely get phone number
  const getPhoneNumber = () => {
    if (!userData?.mobile) return 'Not specified';
    const { countryCode = '+1', number = '' } = userData.mobile;
    return `${countryCode} ${number}`.trim();
  };

  // Get full name from firstName and lastName or fallback to fullName
  const getFullName = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }
    return userData?.fullName || 'No Name';
  };

  // Get the correct image URL
  const getImageUrl = (photo) => {
    if (!photo) return "/placeholder.svg";
    // If it's already a full URL, return as is
    if (photo.startsWith('http')) return photo;
    // Otherwise, assume it's a path that needs the API prefix
    return `/api/image/download/${photo}`;
  };

  return (
    <Card className="border-orange-200 border-2">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-20">
          <div className="flex-shrink-0">
            <img
              src={getImageUrl(userData?.photo)}
              alt={getFullName()}
              width={300}
              height={200}
              className="rounded-lg object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.svg";
              }}
            />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {getFullName()}
              </h2>
              {userData?.role && (
                <p className="text-gray-600 capitalize">{userData.role}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Contact Information:</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>{getPhoneNumber()}</span>
                </div>
                {userData?.email && (
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>{userData.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Personal Information:</h3>
              <div className="space-y-1 text-sm text-gray-600">
                {userData?._id && <div>ID: {userData._id}</div>}
                {userData?.gender && <div>Gender: {userData.gender}</div>}
                <div>Date of Birth: {formatDate(userData?.DOB)}</div>
                {userData?.city && <div>City: {userData.city}</div>}
              </div>
            </div>

            {/* <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Account Status:</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Email Verified: {userData?.isVerified ? 'Yes' : 'No'}</div>
                <div>Registration: {userData?.registrationComplete ? 'Complete' : 'Incomplete'}</div>
              </div>
            </div> */}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
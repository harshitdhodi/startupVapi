export default function PageHeader() {
    return (
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <span>Users</span>
          <span className="mx-2">/</span>
          <span>User details</span>
        </div>
      </div>
    )
  }
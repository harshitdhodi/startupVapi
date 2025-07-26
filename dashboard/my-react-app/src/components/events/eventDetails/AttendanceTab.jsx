import { FilterDropdown, StatusBadge, PaymentBadge, ActionButtons } from "./UIComponents"
import { attendeesData } from "./data"

export const AttendanceTab = ({ attendanceFilter, setAttendanceFilter }) => {
  return (
    <div>
      <div className="mb-4">
        <FilterDropdown
          value={attendanceFilter}
          onChange={setAttendanceFilter}
          options={["Guest", "Members", "All"]}
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 font-medium text-sm text-gray-700">
          <div>Name</div>
          <div>Status</div>
          <div>Payment</div>
          <div>Action</div>
        </div>

        {attendeesData.map((attendee) => (
          <div key={attendee.id} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-100 last:border-b-0">
            <div className="font-medium">{attendee.name}</div>
            <div>
              <StatusBadge status={attendee.status} />
            </div>
            <div>
              <PaymentBadge payment={attendee.payment} />
            </div>
            <div>
              <ActionButtons />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
# Quản lý Lịch Hẹn (Appointments Management)

## Tổng quan

Module quản lý lịch hẹn khám bệnh với calendar UI đầy đủ các tính năng.

## Cấu Trúc Mới

```
appointments/
├── components/
│   ├── appointments-layout.tsx    # Layout wrapper với CalendarProvider và settings
│   └── calendar-view-switcher.tsx # Component chuyển đổi giữa các views
├── pages/
│   ├── day-view/                  # Xem theo ngày
│   ├── week-view/                 # Xem theo tuần
│   ├── month-view/                # Xem theo tháng
│   ├── year-view/                 # Xem theo năm
│   └── agenda-view/               # Xem dạng danh sách
└── index.tsx                      # Export chính
```

## Routes (TanStack Router)

Tất cả routes nằm trong `src/routes/_authenticated/appointments/`:

- `/appointments` - Trang chính (mặc định hiển thị month view)
- `/appointments/day-view` - Xem theo ngày
- `/appointments/week-view` - Xem theo tuần
- `/appointments/month-view` - Xem theo tháng
- `/appointments/year-view` - Xem theo năm
- `/appointments/agenda-view` - Xem dạng agenda/danh sách

## Layout Architecture

Layout được định nghĩa trong `components/appointments-layout.tsx`:

- **CalendarProvider**: Bọc tất cả các views, cung cấp calendar context
- **Header & Sidebar**: Giữ nguyên từ layout chính `_authenticated`
- **Settings Accordion**: Ở dưới cùng với các tùy chọn:
  - Badge variant selector
  - Visible hours configuration
  - Working hours configuration

## Page Components

Mỗi page component đơn giản chỉ render `ClientContainer`:

```tsx
import { ClientContainer } from '@/calendar/components/client-container'

export default function Page() {
  return <ClientContainer view='day' />
}
```

Layout tự động wrap và cung cấp calendar context thông qua `<Outlet />`.

## Cấu trúc thư mục

```
src/features/appointments/
├── components/
│   └── calendar-view-switcher.tsx  # Component chuyển đổi giữa các view
├── index.tsx                        # Main appointments page
└── README.md                        # Documentation
```

## Implementation hiện tại

### 1. CalendarProvider

Trang appointments đã được wrap trong `CalendarProvider` với mock data:

```tsx
<CalendarProvider users={USERS_MOCK} events={CALENDAR_ITENS_MOCK}>
  {/* ... */}
</CalendarProvider>
```

**Mock Data:**

- `USERS_MOCK`: 4 users mẫu (từ `@/calendar/mocks`)
- `CALENDAR_ITENS_MOCK`: 80 events mẫu được tạo tự động

### 2. Calendar Views

Hệ thống hỗ trợ 5 loại view:

| View     | Mô tả              | Component            |
| -------- | ------------------ | -------------------- |
| `day`    | Xem theo ngày      | `CalendarDayView`    |
| `week`   | Xem theo tuần      | `CalendarWeekView`   |
| `month`  | Xem theo tháng     | `CalendarMonthView`  |
| `year`   | Xem theo năm       | `CalendarYearView`   |
| `agenda` | Xem dạng danh sách | `CalendarAgendaView` |

### 3. Tính năng

- ✅ **Calendar UI**: 5 chế độ xem khác nhau
- ✅ **View Switcher**: Chuyển đổi giữa các chế độ xem
- ✅ **Badge Variants**: 3 kiểu hiển thị event (dot, colored, mixed)
- ✅ **Mock Data**: 80 events và 4 users mẫu
- ✅ **Layout Integration**: Tích hợp với Header và Main layout
- ⏳ **Real Data**: Chưa kết nối với API thực

## Các bước tiếp theo

### 1. Kết nối với API thực

Thay thế mock data bằng API calls:

```tsx
// Thay vì:
import { CALENDAR_ITENS_MOCK, USERS_MOCK } from '@/calendar/mocks'

// Sử dụng:
const { data: events } = useAppointments()
const { data: users } = useDoctors()
```

### 2. Cập nhật Event Interface

Điều chỉnh `IEvent` interface trong `@/calendar/interfaces.ts` để khớp với appointment data structure:

```tsx
export interface IEvent {
  id: string // Appointment ID
  startDate: string // ISO string
  endDate: string // ISO string
  title: string // Patient name hoặc reason
  color: TEventColor // Màu sắc theo status
  description: string // Notes hoặc symptoms
  user: {
    // Doctor info
    id: string
    name: string
  }
  // Thêm fields mới nếu cần:
  patientId?: string
  status?: AppointmentStatus
  // ...
}
```

### 3. Implement Event Actions

Thêm các chức năng CRUD cho appointments:

```tsx
// components/appointment-dialog.tsx
- Create appointment
- Update appointment
- Cancel appointment
- Reschedule appointment
```

### 4. Filters và Search

Thêm bộ lọc:

- Lọc theo bác sĩ
- Lọc theo chuyên khoa
- Lọc theo địa điểm
- Lọc theo trạng thái
- Tìm kiếm theo tên bệnh nhân

### 5. Permissions

Thêm role-based access:

- Admin: Full access
- Doctor: Chỉ xem appointments của mình
- Staff: Limited access

## API Integration Example

```tsx
// data/use-appointments.ts
import { useQuery } from '@tanstack/react-query'
import { appointmentService } from '@/api/services'

export function useAppointments(params?: AppointmentListParams) {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => appointmentService.getAppointments(params),
  })
}

// Transform API data to IEvent format
function transformToCalendarEvent(appointment: Appointment): IEvent {
  return {
    id: appointment.id,
    startDate: appointment.serviceDate + 'T' + appointment.timeStart,
    endDate: appointment.serviceDate + 'T' + appointment.timeEnd,
    title: appointment.reason,
    color: getColorByStatus(appointment.status),
    description: appointment.notes || '',
    user: {
      id: appointment.doctorId,
      name: appointment.doctorName,
    },
  }
}
```

## Context API

Sử dụng `useCalendar` hook để truy cập calendar state:

```tsx
import { useCalendar } from '@/calendar/contexts/calendar-context'

function MyComponent() {
  const {
    selectedDate, // Ngày được chọn
    setSelectedDate, // Set ngày
    selectedUserId, // User được chọn ('all' or userId)
    setSelectedUserId, // Set user
    events, // Danh sách events
    users, // Danh sách users
    badgeVariant, // Kiểu hiển thị badge
    setBadgeVariant, // Set badge variant
  } = useCalendar()
}
```

## Notes

- Calendar component từ external source, đã được tích hợp sẵn
- Mock data được generate tự động với 80 events
- Hỗ trợ drag & drop (DnD) cho các events
- Responsive design, hoạt động tốt trên mobile và desktop

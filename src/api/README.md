# API Client & Hooks Documentation

## Tổng quan

Hệ thống API client được thiết kế với các tính năng:

- **Interceptors**: Tự động thêm token, xử lý refresh token
- **Error Handling**: Xử lý lỗi tự động với Sonner toast notifications
- **TypeScript**: Type safety đầy đủ
- **React Query**: Caching, optimistic updates, background refetching

## Cấu trúc thư mục

```
src/
├── types/
│   └── api.ts              # Định nghĩa types cho API
├── api/
│   ├── client.ts           # Axios client với interceptors
│   ├── auth.ts             # Authentication endpoints
│   ├── admins.ts           # Admin management endpoints
│   ├── doctors.ts          # Doctor management endpoints
│   ├── specialties.ts      # Specialty management endpoints
│   ├── locations.ts        # Location management endpoints
│   ├── blogs.ts            # Blog management endpoints
│   ├── questions.ts        # Question management endpoints
│   └── index.ts            # Export tất cả API functions
└── hooks/
    └── api/
        ├── useAuth.ts      # Auth hooks
        ├── useAdmins.ts    # Admin hooks
        ├── useDoctors.ts   # Doctor hooks
        ├── useSpecialties.ts # Specialty hooks
        ├── useLocations.ts # Location hooks
        ├── useBlogs.ts     # Blog hooks
        ├── useQuestions.ts # Question hooks
        └── index.ts        # Export tất cả hooks
```

## Cách sử dụng

### 1. Import hooks

```typescript
import { useAdmins, useCreateAdmin } from "@/hooks/api";
```

### 2. Sử dụng trong component

```typescript
const AdminsPage = () => {
  // Query data
  const { data, isLoading, isError } = useAdmins({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Mutation
  const createAdminMutation = useCreateAdmin();

  const handleCreate = async () => {
    try {
      await createAdminMutation.mutateAsync({
        fullName: 'Nguyễn Văn A',
        email: 'admin@example.com',
        password: 'password123',
        gender: 'MALE'
      });
      // Success toast tự động hiển thị
    } catch (error) {
      // Error toast tự động hiển thị
    }
  };

  if (isLoading) return <div>Đang tải...</div>;
  if (isError) return <div>Có lỗi xảy ra</div>;

  return (
    <div>
      <button onClick={handleCreate}>
        {createAdminMutation.isPending ? 'Đang tạo...' : 'Tạo Admin'}
      </button>

      {data?.data.map(admin => (
        <div key={admin.id}>{admin.fullName}</div>
      ))}
    </div>
  );
};
```

## API Endpoints

### Authentication (`/auth`)

- `POST /auth/login` - Đăng nhập
- `POST /auth/logout` - Đăng xuất
- `POST /auth/refresh` - Refresh token
- `PATCH /auth/change-password` - Đổi mật khẩu
- `GET /auth/profile` - Lấy thông tin user hiện tại
- `PATCH /auth/profile` - Cập nhật profile

### Admins (`/admins`)

- `GET /admins` - Lấy danh sách admin (có pagination)
- `GET /admins/:id` - Lấy admin theo ID
- `POST /admins` - Tạo admin mới
- `PATCH /admins/:id` - Cập nhật admin
- `DELETE /admins/:id` - Xóa admin (soft delete)
- `PATCH /admins/:id/status` - Bật/tắt admin
- `GET /admins/stats` - Thống kê admin

### Doctors (`/doctors`)

- `GET /doctors` - Lấy danh sách bác sĩ (có filter)
- `GET /doctors/:id` - Lấy bác sĩ theo ID
- `POST /doctors` - Tạo bác sĩ mới
- `PATCH /doctors/:id` - Cập nhật bác sĩ
- `DELETE /doctors/:id` - Xóa bác sĩ
- `PATCH /doctors/:id/availability` - Bật/tắt availability
- `PATCH /doctors/:id/status` - Bật/tắt status
- `GET /doctors/specialty/:specialtyId` - Lấy bác sĩ theo chuyên khoa
- `GET /doctors/location/:locationId` - Lấy bác sĩ theo địa điểm

### Specialties (`/specialties`)

- `GET /specialties` - Lấy danh sách chuyên khoa
- `GET /specialties/active` - Lấy chuyên khoa đang hoạt động
- `GET /specialties/:id` - Lấy chuyên khoa theo ID
- `POST /specialties` - Tạo chuyên khoa mới
- `PATCH /specialties/:id` - Cập nhật chuyên khoa
- `DELETE /specialties/:id` - Xóa chuyên khoa

### Locations (`/locations`)

- `GET /locations` - Lấy danh sách địa điểm
- `GET /locations/active` - Lấy địa điểm đang hoạt động
- `GET /locations/:id` - Lấy địa điểm theo ID
- `POST /locations` - Tạo địa điểm mới
- `PATCH /locations/:id` - Cập nhật địa điểm
- `DELETE /locations/:id` - Xóa địa điểm

### Blogs (`/blogs`)

- `GET /blogs` - Lấy danh sách blog (có filter)
- `GET /blogs/published` - Lấy blog đã publish (public)
- `GET /blogs/:id` - Lấy blog theo ID
- `GET /blogs/slug/:slug` - Lấy blog theo slug (public)
- `POST /blogs` - Tạo blog mới
- `PATCH /blogs/:id` - Cập nhật blog
- `DELETE /blogs/:id` - Xóa blog
- `PATCH /blogs/:id/status` - Thay đổi status blog
- `POST /blogs/:id/view` - Tăng lượt xem

### Questions (`/questions`)

- `GET /questions` - Lấy danh sách câu hỏi (có filter)
- `GET /questions/public` - Lấy câu hỏi public (FAQ)
- `GET /questions/:id` - Lấy câu hỏi theo ID
- `POST /questions` - Tạo câu hỏi mới (public)
- `PATCH /questions/:id` - Cập nhật câu hỏi
- `DELETE /questions/:id` - Xóa câu hỏi
- `POST /questions/:id/answer` - Trả lời câu hỏi
- `PATCH /questions/:id/assign` - Assign cho bác sĩ

## Error Handling

Tất cả errors được xử lý tự động:

- **400**: "Dữ liệu không hợp lệ"
- **401**: "Bạn không có quyền truy cập" + redirect login
- **403**: "Bạn không có quyền thực hiện hành động này"
- **404**: "Không tìm thấy tài nguyên yêu cầu"
- **409**: "Xung đột dữ liệu"
- **422**: "Dữ liệu không được xác thực"
- **500**: "Lỗi máy chủ nội bộ"
- **Network errors**: "Lỗi kết nối mạng"

## Environment Variables

```env
VITE_API_BASE_URL=https://api.medicalink.com
```

## Token Management

- Access token: Stored in `localStorage` as `access_token`
- Refresh token: Stored in `localStorage` as `refresh_token`
- Auto refresh when access token expires
- Auto logout when refresh fails

## Caching Strategy

- **Query data**: Cache 5 phút
- **Dropdown data**: Cache 10 phút
- **User profile**: Cache 5 phút
- **View counts**: Không cache để tránh refetch không cần thiết

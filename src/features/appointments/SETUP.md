# Hướng dẫn Setup & Test Appointments Page

## 🚀 Truy cập trang

Sau khi chạy ứng dụng, truy cập:

```
http://localhost:5173/appointments
```

Hoặc click vào menu **"Appointments"** trong sidebar (mục Operations).

## ✅ Đã implement

### 1. Route Configuration

- ✅ File: `src/routes/_authenticated/appointments.index.tsx`
- ✅ Route: `/appointments`

### 2. Main Page Component

- ✅ File: `src/features/appointments/index.tsx`
- ✅ Layout: Header + Main với ProfileDropdown, Search, ThemeSwitch
- ✅ Title: "Quản lý lịch hẹn"

### 3. Calendar Integration

- ✅ CalendarProvider với mock data
- ✅ Calendar views: Day, Week, Month, Year, Agenda
- ✅ View Switcher component
- ✅ Badge Variant selector

### 4. Mock Data

- ✅ 4 users mẫu
- ✅ 80 events được tạo tự động
- ✅ Events từ 30 ngày trước đến 30 ngày sau

## 📋 Các tính năng có sẵn

### Calendar Views

1. **Ngày (Day View)**
   - Hiển thị chi tiết theo từng giờ trong ngày
   - Thích hợp xem lịch chi tiết của 1 ngày

2. **Tuần (Week View)**
   - Hiển thị 7 ngày trong tuần
   - Xem tổng quan lịch tuần

3. **Tháng (Month View)**
   - Hiển thị toàn bộ tháng
   - View mặc định khi vào trang

4. **Năm (Year View)**
   - Hiển thị 12 tháng trong năm
   - Xem tổng quan theo năm

5. **Danh sách (Agenda View)**
   - Hiển thị dạng list
   - Dễ đọc và quản lý

### Badge Variants

1. **Dot** - Hiển thị chấm tròn nhỏ
2. **Colored** - Hiển thị background màu sắc
3. **Mixed** - Kết hợp cả hai

### Navigation

- ◀️ ▶️ Navigation buttons để di chuyển giữa các thời gian
- 📅 Date picker để chọn ngày cụ thể
- 🔄 Today button để quay về hôm nay

## 🧪 Testing

### Test các views

```bash
1. Vào trang /appointments
2. Sử dụng dropdown "Chế độ xem" để chuyển đổi
3. Kiểm tra từng view: Day, Week, Month, Year, Agenda
```

### Test navigation

```bash
1. Click vào nút ◀️ ▶️ để di chuyển
2. Click vào nút "Today" để về ngày hiện tại
3. Click vào date picker để chọn ngày bất kỳ
```

### Test badge variants

```bash
1. Scroll xuống dưới cùng
2. Sử dụng dropdown "Change badge variant"
3. Chọn: Dot, Colored, hoặc Mixed
4. Quan sát sự thay đổi trong calendar
```

## 🔧 Mock Data Details

### Users Mock (4 users)

```javascript
;[
  { id: '...', name: 'Leonardo Ramos', picturePath: null },
  { id: '...', name: 'Michael Doe', picturePath: null },
  { id: '...', name: 'Alice Johnson', picturePath: null },
  { id: '...', name: 'Robert Smith', picturePath: null },
]
```

### Events Mock (80 events)

- Event types: Doctor's appointments, meetings, checkups, etc.
- Colors: blue, green, red, yellow, purple, orange, gray
- Time range: 30 days before/after current date
- Duration: 30-180 minutes
- Special event: "My wedding :)" on Sep 20, 2025

## 📝 Notes

- Tất cả data hiện tại là MOCK DATA
- Calendar hỗ trợ drag & drop events (chưa lưu vào DB)
- Responsive design, hoạt động tốt trên mobile
- Chưa có authentication/authorization check
- Chưa kết nối với API backend

## 🎯 Next Steps

Xem file `README.md` để biết các bước tiếp theo cần implement.

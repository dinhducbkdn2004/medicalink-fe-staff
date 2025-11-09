# Specialties Management Feature

## 📋 Overview

Trang quản lý Chuyên khoa (Specialties) với đầy đủ chức năng CRUD cho specialties và info sections, được xây dựng theo API specification.

## 🎯 Features Implemented

### ✅ Specialties Management

- **View List**: Hiển thị danh sách chuyên khoa với pagination
- **Search**: Tìm kiếm theo tên chuyên khoa
- **Filter**: Lọc theo trạng thái (Active/Inactive)
- **Sort**: Sắp xếp theo name, createdAt
- **Create**: Tạo chuyên khoa mới
- **Edit**: Chỉnh sửa thông tin chuyên khoa
- **Delete**: Xóa chuyên khoa (với cảnh báo nếu có info sections)

### ✅ Info Sections Management

- **View**: Xem tất cả info sections của một chuyên khoa
- **Create**: Thêm section mới
- **Edit**: Chỉnh sửa nội dung section
- **Delete**: Xóa section

### ✅ UI Components

- Sử dụng reusable `DataTable` component
- Context menu cho quick actions
- Bulk actions (multi-select)
- Responsive design
- Loading states
- Empty states
- Error handling

## 📁 File Structure

```
src/features/specialties/
├── components/
│   ├── specialties-columns.tsx          # Table columns definition
│   ├── specialties-table.tsx            # Main table component
│   ├── specialties-provider.tsx         # Context provider
│   ├── specialties-action-dialog.tsx    # Create/Edit dialog
│   ├── specialties-delete-dialog.tsx    # Delete confirmation
│   ├── specialties-primary-buttons.tsx  # Action buttons
│   ├── specialties-dialogs.tsx          # Dialog manager
│   ├── info-sections-dialog.tsx         # Info sections viewer
│   ├── info-section-form.tsx            # Info section form
│   ├── info-section-delete-dialog.tsx   # Info section delete
│   ├── data-table-row-actions.tsx       # Row actions dropdown
│   └── data-table-bulk-actions.tsx      # Bulk actions bar
├── data/
│   ├── use-specialties.ts               # React Query hooks
│   ├── schema.ts                        # TypeScript types
│   └── data.ts                          # Static data (filters, options)
├── index.tsx                            # Main page component
├── exports.ts                           # Feature exports
└── README.md                            # This file

src/routes/_authenticated/specialties/
└── index.tsx                            # Route configuration
```

## 🔌 API Integration

Tất cả các endpoint trong API specification đã được implement:

### Specialties Endpoints

- `GET /api/specialties` - List with pagination
- `GET /api/specialties/stats` - Statistics
- `GET /api/specialties/:id` - Get by ID
- `POST /api/specialties` - Create
- `PATCH /api/specialties/:id` - Update
- `DELETE /api/specialties/:id` - Delete

### Info Sections Endpoints

- `GET /api/specialties/:specialtyId/info-sections` - List
- `POST /api/specialties/info-sections` - Create
- `PATCH /api/specialties/info-sections/:id` - Update
- `DELETE /api/specialties/info-sections/:id` - Delete

## 🚀 Usage

### Navigation

Truy cập trang qua sidebar: **Hospital Configuration > Specialties**

URL: `/specialties`

### Permissions Required

- `specialties:read` - Xem danh sách
- `specialties:update` - Tạo/Sửa
- `specialties:delete` - Xóa

### Search Params

```typescript
{
  page?: number          // Trang hiện tại
  pageSize?: number      // Số item mỗi trang
  search?: string        // Tìm kiếm theo tên
  isActive?: string      // Filter: 'true' | 'false'
  sortBy?: string        // Sort field
  sortOrder?: 'asc'|'desc' // Sort order
}
```

## 🎨 Components Used

### Shadcn/UI Components

- ✅ Badge
- ✅ Button
- ✅ Card
- ✅ Checkbox
- ✅ Dialog
- ✅ Alert Dialog
- ✅ Alert
- ✅ Form
- ✅ Input
- ✅ Textarea
- ✅ Dropdown Menu
- ✅ Scroll Area
- ✅ Separator
- ✅ Table
- ✅ Toast (Sonner)

### Custom Components

- ✅ DataTable (reusable)
- ✅ DataTableColumnHeader
- ✅ DataTablePagination
- ✅ DataTableToolbar
- ✅ DataTableContextMenu

## 🧪 Testing

### Manual Testing Checklist

#### Specialties CRUD

- [ ] Tạo specialty mới với tên, mô tả, icon URL
- [ ] Validation: tên phải 2-120 ký tự
- [ ] Chỉnh sửa specialty
- [ ] Xóa specialty (kiểm tra cảnh báo nếu có info sections)
- [ ] Tìm kiếm specialty theo tên
- [ ] Filter theo Active/Inactive
- [ ] Sort theo name, createdAt
- [ ] Pagination hoạt động đúng

#### Info Sections CRUD

- [ ] Mở dialog info sections từ specialty
- [ ] Tạo info section mới
- [ ] Validation: tên phải 2-120 ký tự
- [ ] Chỉnh sửa info section
- [ ] Xóa info section
- [ ] Hiển thị danh sách sections đúng

#### UI/UX

- [ ] Loading states hiển thị khi fetching data
- [ ] Empty states hiển thị khi không có data
- [ ] Error handling với toast messages
- [ ] Responsive trên mobile/tablet/desktop
- [ ] Context menu (right-click) hoạt động
- [ ] Bulk select và bulk actions

## 🐛 Known Issues & Solutions

### Issue: 401 Unauthorized Error

**Nguyên nhân**: Chưa đăng nhập hoặc token hết hạn

**Giải pháp**:

1. Đăng nhập lại vào hệ thống
2. Kiểm tra token trong localStorage
3. Refresh page để renew token

### Issue: Permission Denied

**Nguyên nhân**: User không có quyền truy cập

**Giải pháp**:

1. Kiểm tra user role (phải là ADMIN hoặc SUPER_ADMIN)
2. Kiểm tra permissions trong database
3. Liên hệ Super Admin để cấp quyền

## 🔧 Customization

### Thêm Filter Mới

Edit `src/features/specialties/components/specialties-table.tsx`:

```typescript
filters={[
  // ... existing filters
  {
    columnId: 'yourField',
    title: 'Your Filter',
    options: [...],
  },
]}
```

### Thêm Column Mới

Edit `src/features/specialties/components/specialties-columns.tsx`:

```typescript
{
  accessorKey: 'yourField',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Your Title' />
  ),
  cell: ({ row }) => {
    // Your cell render logic
  },
}
```

## 📚 Related Files

- API Service: `src/api/services/specialty.service.ts`
- Types: `src/api/services/specialty.service.ts` (exported types)
- Sidebar Navigation: `src/components/layout/data/sidebar-data.ts`
- Route: `src/routes/_authenticated/specialties/index.tsx`

## 🎓 Best Practices Applied

1. **TypeScript**: Strong typing for all components and data
2. **React Query**: Efficient data fetching with caching
3. **Form Validation**: Zod schema validation
4. **Error Handling**: Centralized error handling with toast
5. **Code Reusability**: Reusable DataTable component
6. **Responsive Design**: Mobile-first approach
7. **Accessibility**: ARIA labels, keyboard navigation
8. **Performance**: Lazy loading, memoization

## 📝 Notes

- Slug được tự động generate từ tên specialty
- Info sections hỗ trợ markdown/HTML content
- Xóa specialty sẽ kiểm tra associations với doctors
- Tất cả mutations tự động invalidate cache và refetch data

---

**Created**: November 2025  
**Last Updated**: November 2025  
**Version**: 1.0.0

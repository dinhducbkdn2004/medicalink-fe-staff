# Permission-Driven UI System

## Tổng quan

Hệ thống phân quyền Frontend dựa hoàn toàn vào **permissions từ API**, không phụ thuộc vào role (SUPER_ADMIN, ADMIN, DOCTOR).

Khi SuperAdmin/Admin cấp thêm quyền cho một user:

- User **tự động thấy menu** mới
- User **tự động thấy button/action** tương ứng
- **Không cần sửa code Frontend**

## API

```
GET /api/permissions/me
```

Response:

```json
{
  "data": [
    {
      "resource": "doctors",
      "action": "read",
      "effect": "ALLOW"
    },
    {
      "resource": "blogs",
      "action": "update",
      "effect": "ALLOW",
      "conditions": [{ "field": "isSelf", "value": true, "operator": "eq" }]
    }
  ]
}
```

## Cấu trúc files

```
src/
├── stores/
│   └── permission-store.ts     # Zustand store cho permissions
├── hooks/
│   └── use-permissions.tsx     # React hooks cho permission
├── context/
│   └── permission-provider.tsx # Context Provider
├── lib/
│   ├── permission-utils.ts     # Utils cho non-React code
│   └── sidebar-utils.ts        # Sidebar filtering
├── components/
│   └── auth/
│       ├── permission-gate.tsx     # Gate components
│       └── require-permission.tsx  # Route guards
```

## Sử dụng

### 1. Permission Gate (UI level)

```tsx
import { Can } from '@/components/auth/permission-gate'

// Cách 1: Sử dụng I prop
<Can I="doctors:create">
  <CreateDoctorButton />
</Can>

// Cách 2: Sử dụng resource + action
<Can resource="doctors" action="create">
  <CreateDoctorButton />
</Can>
```

### 2. Permission Gate với Context (Action level)

```tsx
import { Can } from '@/components/auth/permission-gate'

// Kiểm tra quyền với điều kiện
;<Can I='blogs:update' context={{ isSelf: blog.authorId === currentUserId }}>
  <EditBlogButton />
</Can>
```

### 3. Route Guard

```tsx
import { RequirePermission } from '@/components/auth/require-permission'

export function DoctorsPage() {
  return (
    <RequirePermission resource='doctors' action='read'>
      <DoctorsContent />
    </RequirePermission>
  )
}
```

### 4. Sử dụng Hooks

```tsx
import {
  useCan,
  useCanWithContext,
  usePermissionChecker,
} from '@/hooks/use-permissions'

function MyComponent() {
  // Check đơn giản
  const canCreateDoctor = useCan('doctors', 'create')

  // Check với context
  const canEditBlog = useCanWithContext('blogs', 'update', { isSelf: true })

  // Lấy function để check nhiều permissions
  const { can, canWithContext, canAny, canAll } = usePermissionChecker()

  if (can('doctors', 'delete')) {
    // ...
  }
}
```

### 5. Sử dụng ngoài React

```ts
import { can, canWithContext } from '@/lib/permission-utils'

// Trong service hoặc utility functions
if (can('doctors', 'update')) {
  // ...
}
```

## Sidebar Configuration

```ts
// src/components/layout/data/sidebar-data.ts
export const navGroups = [
  {
    title: 'User Management',
    items: [
      {
        title: 'Doctors',
        url: '/doctors',
        permission: { resource: 'doctors', action: 'read' },
      },
    ],
  },
]
```

## Action "manage"

Permission `manage` tự động bao gồm: `create`, `read`, `update`, `delete`

```json
{ "resource": "appointments", "action": "manage", "effect": "ALLOW" }
```

User có quyền trên sẽ tự động có thể:

- `appointments:create` ✓
- `appointments:read` ✓
- `appointments:update` ✓
- `appointments:delete` ✓

## Conditional Permissions (ABAC)

```json
{
  "resource": "blogs",
  "action": "update",
  "effect": "ALLOW",
  "conditions": [{ "field": "isSelf", "operator": "eq", "value": true }]
}
```

Khi render button Edit:

```tsx
<Can I='blogs:update' context={{ isSelf: blog.authorId === currentUser.id }}>
  <EditButton />
</Can>
```

## Operators hỗ trợ

| Operator   | Mô tả                  |
| ---------- | ---------------------- |
| `eq`       | Bằng                   |
| `ne`       | Không bằng             |
| `in`       | Giá trị nằm trong mảng |
| `contains` | Mảng chứa giá trị      |

## Best Practices

1. **Luôn dùng `RequirePermission` cho route guards** - Đảm bảo redirect về 403 nếu không có quyền

2. **Dùng `Can` cho UI elements** - Ẩn/hiện buttons, menu items

3. **Dùng `context` cho conditional checks** - Kiểm tra ownership, self-edit

4. **Không hard-code role** - Tránh `if (user.role === 'ADMIN')`

5. **Không duplicate logic** - Sử dụng hooks/utils chung

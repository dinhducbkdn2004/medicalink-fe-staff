# Authentication System

Hệ thống authentication hoàn chỉnh cho MedicaLink Staff Portal, được xây dựng dựa trên API specification.

## 📁 Cấu trúc

```
src/
├── api/
│   ├── types/
│   │   └── auth.types.ts          # Types và Zod schemas cho authentication
│   ├── services/
│   │   └── auth.service.ts        # API calls (login, profile, change-password, etc.)
│   └── core/
│       └── client.ts              # Axios client với token refresh logic
├── stores/
│   └── auth-store.ts              # Zustand store cho auth state
├── hooks/
│   └── use-auth.tsx               # React Query hooks cho auth operations
├── lib/
│   └── auth-utils.ts              # Helper functions (role checks, formatters)
└── components/
    └── auth/
        ├── protected-route.tsx    # Protected route wrapper
        ├── require-auth.tsx       # Route-level authentication với role check
        ├── role-gate.tsx          # Component-level role-based rendering
        ├── change-password-form.tsx   # Form đổi mật khẩu
        └── verify-password-dialog.tsx # Dialog xác thực mật khẩu
```

## 🚀 Tính năng chính

### 1. **Authentication**

- ✅ Login với email và password
- ✅ Automatic token refresh (15 phút access token, 7 ngày refresh token)
- ✅ Token rotation khi refresh
- ✅ Automatic logout khi token hết hạn
- ✅ Persist authentication state trong localStorage

### 2. **User Management**

- ✅ Lấy profile người dùng hiện tại
- ✅ Đổi mật khẩu
- ✅ Xác thực mật khẩu trước các thao tác nhạy cảm

### 3. **Authorization**

- ✅ Role-based access control (SUPER_ADMIN, ADMIN, DOCTOR)
- ✅ Protected routes
- ✅ Component-level permissions
- ✅ Route-level permissions với error UI

### 4. **Error Handling**

- ✅ Xử lý validation errors từ API
- ✅ Hiển thị error messages thân thiện với người dùng
- ✅ Automatic redirect đến login khi unauthorized
- ✅ Toast notifications cho tất cả operations

## 📖 Hướng dẫn sử dụng

### 1. Login Form

```tsx
import { UserAuthForm } from '@/features/auth/sign-in/components/user-auth-form'

function SignInPage() {
  return <UserAuthForm redirectTo='/dashboard' />
}
```

### 2. Protected Routes

**Option A: Sử dụng ProtectedRoute component**

```tsx
import { ProtectedRoute } from '@/components/auth'

function DashboardLayout() {
  return (
    <ProtectedRoute>
      <YourDashboardContent />
    </ProtectedRoute>
  )
}
```

**Option B: Sử dụng RequireAuth với role check**

```tsx
import { RequireAuth } from '@/components/auth'

function AdminPage() {
  return (
    <RequireAuth roles={['ADMIN', 'SUPER_ADMIN']}>
      <AdminDashboard />
    </RequireAuth>
  )
}
```

### 3. Role-Based Rendering

```tsx
import { RoleGate } from '@/components/auth'

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Chỉ hiển thị cho Admin và Super Admin */}
      <RoleGate roles={['ADMIN', 'SUPER_ADMIN']}>
        <AdminPanel />
      </RoleGate>

      {/* Chỉ hiển thị cho Doctor */}
      <RoleGate roles={['DOCTOR']}>
        <DoctorPanel />
      </RoleGate>
    </div>
  )
}
```

### 4. Access Auth State

```tsx
import { useAuth } from '@/hooks/use-auth'

function UserProfile() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Not authenticated</div>

  return (
    <div>
      <h1>{user?.fullName}</h1>
      <p>{user?.email}</p>
      <p>Role: {user?.role}</p>
    </div>
  )
}
```

### 5. Change Password

```tsx
import { ChangePasswordForm } from '@/components/auth'

function AccountSettingsPage() {
  return (
    <div>
      <h1>Account Settings</h1>
      <ChangePasswordForm
        onSuccess={() => {
          console.log('Password changed successfully!')
        }}
      />
    </div>
  )
}
```

### 6. Verify Password Dialog

```tsx
import { Button } from '@/components/ui/button'
import {
  VerifyPasswordDialog,
  useVerifyPasswordDialog,
} from '@/components/auth'

function SensitiveAction() {
  const { open, openDialog, setOpen, onVerified } = useVerifyPasswordDialog(
    () => {
      // Thực hiện hành động sau khi xác thực thành công
      console.log('Password verified! Performing sensitive action...')
      deleteSomething()
    }
  )

  return (
    <>
      <Button onClick={openDialog}>Delete Account</Button>

      <VerifyPasswordDialog
        open={open}
        onOpenChange={setOpen}
        onVerified={onVerified}
        title='Verify your password'
        description='Please enter your password to delete your account.'
      />
    </>
  )
}
```

### 7. Manual Login/Logout

```tsx
import { useLogin, useLogout } from '@/hooks/use-auth'

function AuthControls() {
  const loginMutation = useLogin()
  const logoutMutation = useLogout()

  const handleLogin = async () => {
    await loginMutation.mutateAsync({
      email: 'user@example.com',
      password: 'password123',
    })
  }

  const handleLogout = async () => {
    await logoutMutation.mutateAsync()
  }

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
```

### 8. Role Checking Utilities

```tsx
import { isAdmin, isSuperAdmin, isDoctor, hasAnyRole } from '@/lib/auth-utils'
import { useAuth } from '@/hooks/use-auth'

function Dashboard() {
  const { user } = useAuth()

  if (isAdmin(user)) {
    // Admin or Super Admin
  }

  if (isSuperAdmin(user)) {
    // Only Super Admin
  }

  if (isDoctor(user)) {
    // Only Doctor
  }

  if (hasAnyRole(user, ['ADMIN', 'DOCTOR'])) {
    // Admin or Doctor
  }
}
```

## 🔐 API Endpoints

Tất cả các endpoints được implement trong `src/api/services/auth.service.ts`:

- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Lấy thông tin user hiện tại
- `POST /api/auth/change-password` - Đổi mật khẩu
- `POST /api/auth/verify-password` - Xác thực mật khẩu

## 📝 Types và Schemas

Tất cả types và Zod schemas được định nghĩa trong `src/api/types/auth.types.ts`:

```typescript
// User types
type User = {
  id: string
  fullName: string
  email: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'DOCTOR'
  phone?: string
  isMale?: boolean | null
  dateOfBirth?: string
  createdAt: string
  updatedAt: string
}

// Form schemas
const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(6).max(50),
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6).max(50),
  newPassword: z
    .string()
    .min(8)
    .max(50)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  confirmPassword: z.string(),
})
```

## 🎯 Best Practices

1. **Luôn sử dụng hooks thay vì direct API calls**

   ```tsx
   // ✅ Good
   const loginMutation = useLogin()
   await loginMutation.mutateAsync(credentials)

   // ❌ Bad
   await authService.login(credentials)
   ```

2. **Sử dụng RequireAuth cho routes cần authentication**

   ```tsx
   // ✅ Good - tự động redirect và hiển thị error
   ;<RequireAuth roles={['ADMIN']}>
     <AdminPanel />
   </RequireAuth>

   // ❌ Bad - manual checking
   {
     isAdmin && <AdminPanel />
   }
   ```

3. **Sử dụng RoleGate cho conditional rendering**

   ```tsx
   // ✅ Good
   <RoleGate roles={['ADMIN']} fallback={<NoAccess />}>
     <AdminButton />
   </RoleGate>
   ```

4. **Validate forms với Zod schemas đã định nghĩa**
   ```tsx
   // ✅ Good
   const form = useForm({
     resolver: zodResolver(loginSchema),
   })
   ```

## 🐛 Troubleshooting

### Token không tự động refresh?

- Kiểm tra `refresh_token` có trong localStorage
- Kiểm tra API endpoint `/api/auth/refresh` hoạt động
- Xem console logs trong `client.ts`

### User bị logout không mong muốn?

- Kiểm tra token expiry time
- Kiểm tra API trả về 401 không đúng
- Xem network tab để debug

### Role-based access không hoạt động?

- Kiểm tra user role trong auth store
- Đảm bảo API trả về đúng role format
- Kiểm tra logic trong `auth-utils.ts`

## 📚 Tài liệu tham khảo

- API Specification: `docs/api-specification/Authentication.md`
- User roles: `SUPER_ADMIN`, `ADMIN`, `DOCTOR`
- Token lifetimes: Access (15 min), Refresh (7 days)

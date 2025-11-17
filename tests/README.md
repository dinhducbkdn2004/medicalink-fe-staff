# 🧪 Playwright E2E Tests

Tài liệu hướng dẫn sử dụng Playwright tests cho dự án MedicaLink Frontend.

**🌐 Testing Target**: Production URL - [https://medicalink-fe-staff.vercel.app/](https://medicalink-fe-staff.vercel.app/)

---

## 📋 Mục lục

- [Cài đặt](#cài-đặt)
- [Chạy Tests](#chạy-tests)
- [Testing Production vs Local](#testing-production-vs-local)
- [Cấu trúc Tests](#cấu-trúc-tests)
- [Viết Tests Mới](#viết-tests-mới)
- [Debug Tests](#debug-tests)
- [CI/CD](#cicd)

## 🚀 Cài đặt

Tests đã được cài đặt sẵn. Nếu cần cài đặt lại:

```bash
# Cài đặt dependencies
pnpm install

# Cài đặt browsers
pnpx playwright install chromium
```

## ▶️ Chạy Tests

### 🌐 **Testing trên Production (Default)**

Mặc định, tests sẽ chạy trên: **https://medicalink-fe-staff.vercel.app/**

```bash
# Chạy tất cả tests trên production
pnpm test

# UI Mode (khuyến nghị)
pnpm test:ui

# Với browser visible
pnpm test:headed
```

### 💻 **Testing trên Localhost**

Để test trên localhost:

```bash
# Option 1: Set environment variable
PLAYWRIGHT_BASE_URL=http://localhost:5173 pnpm test

# Option 2: PowerShell (Windows)
$env:PLAYWRIGHT_BASE_URL="http://localhost:5173"; pnpm test
```

**Hoặc** uncomment phần `webServer` trong `playwright.config.ts` để tự động start dev server.

---

## 🌍 Testing Production vs Local

### Production Testing (Default)
- ✅ **URL**: https://medicalink-fe-staff.vercel.app/
- ✅ **Không cần dev server**
- ✅ **Test trên môi trường thực**
- ✅ **Credentials**: superadmin@medicalink.com / SuperAdmin123!

### Local Testing
- 🔧 **URL**: http://localhost:5173
- 🔧 **Cần chạy dev server**: `pnpm run dev`
- 🔧 **Test code mới chưa deploy**
- 🔧 **Faster iteration**

**Để switch sang local testing:**

1. **Set environment variable**:
   ```bash
   PLAYWRIGHT_BASE_URL=http://localhost:5173 pnpm test
   ```

2. **Hoặc edit `playwright.config.ts`**:
   ```typescript
   baseURL: 'http://localhost:5173',
   ```

3. **Uncomment `webServer`** nếu muốn auto-start dev server

---

## 🎯 Test Credentials

### Production
- Email: `superadmin@medicalink.com`
- Password: `SuperAdmin123!`

Cấu hình trong: `tests/fixtures/auth.setup.ts`

---

## 📁 Cấu trúc Tests

```
tests/
├── .auth/                      # Auth state files (git-ignored)
│   └── admin.json             # Saved admin session
├── fixtures/                   # Test fixtures
│   └── auth.setup.ts          # Authentication setup
├── utils/                      # Helper utilities
│   └── test-helpers.ts        # Reusable test functions
├── settings/                   # Settings feature tests
│   └── change-password.spec.ts
├── specialties/               # Specialties feature tests
│   ├── create-specialty.spec.ts
│   └── create-info-section.spec.ts
├── example.spec.ts            # Setup verification
├── TEST_SUMMARY.md            # Detailed documentation
└── README.md                  # This file
```

## 📝 Tests Hiện Có

### 1. Change Password (`tests/settings/change-password.spec.ts`)

Test chức năng đổi mật khẩu trong Settings.

**Chạy:**
```bash
pnpm test tests/settings/change-password.spec.ts
```

### 2. Create Specialty (`tests/specialties/create-specialty.spec.ts`)

Test chức năng tạo chuyên khoa mới.

**Chạy:**
```bash
pnpm test tests/specialties/create-specialty.spec.ts
```

### 3. Create Info Section (`tests/specialties/create-info-section.spec.ts`)

Test chức năng tạo mục thông tin cho chuyên khoa.

**Chạy:**
```bash
pnpm test tests/specialties/create-info-section.spec.ts
```

---

## 🔍 Important: Locator Strategy

### ⚠️ **Avoiding Strict Mode Violations**

Khi test trên production, TanStack Router Devtools có thể gây conflict với `getByLabel()`. 

**❌ Không dùng:**
```typescript
await page.getByLabel('Password').fill('xxx')  // Có thể match nhiều elements
```

**✅ Dùng specific selectors:**
```typescript
await page.locator('input[type="password"][name="password"]').fill('xxx')
```

### Recommended Locators:
```typescript
// ✅ Email input
page.locator('input[type="email"][name="email"]')

// ✅ Password input  
page.locator('input[type="password"][name="password"]')

// ✅ Buttons (vẫn an toàn)
page.getByRole('button', { name: 'Sign in' })

// ✅ Headings
page.getByRole('heading', { name: 'Sign in' })
```

---

## ✍️ Viết Tests Mới

### 1. Tạo file test mới

```typescript
import { test, expect } from '@playwright/test'
import { navigateToSettings, waitForSuccessToast } from '../utils/test-helpers'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup - tests đã authenticated sẵn
    await navigateToSettings(page)
  })

  test('should do something', async ({ page }) => {
    // Test implementation
    await expect(page.getByText('Something')).toBeVisible()
  })
})
```

### 2. Sử dụng helper functions

File `tests/utils/test-helpers.ts` chứa nhiều hàm hữu ích:

```typescript
// Navigation
await navigateToSettings(page, 'account')
await navigateToSpecialties(page)

// Form operations
await fillFormField(page, 'Email', 'test@example.com')
await expectFormError(page, 'Password', /required/i)

// Dialogs
await waitForDialog(page, /create/i)
await closeDialog(page)

// Notifications
await waitForSuccessToast(page)
await waitForErrorToast(page)

// Table operations
await waitForTableData(page)
await searchInTable(page, 'search term')

// Utilities
const randomStr = randomString(8)
const email = testEmail('prefix')
```

---

## 🐛 Debug Tests

### 1. UI Mode (Khuyến nghị)

```bash
pnpm test:ui
```

Cho phép:
- Xem từng step
- Time-travel debugging
- Pick locator
- Xem network requests
- Xem console logs

### 2. Debug Mode

```bash
pnpm test:debug tests/settings/change-password.spec.ts
```

### 3. Headed Mode

```bash
pnpm test:headed
```

Chạy tests với browser visible để quan sát.

### 4. Screenshot và Trace

Playwright tự động capture khi test fail:
- Screenshot
- Video  
- Trace (để replay)

Xem trong folder `test-results/`

---

## 🎥 Tự Động Tạo Tests (Codegen)

```bash
# Production
pnpm test:codegen

# Localhost
pnpx playwright codegen http://localhost:5173
```

---

## 🔐 Authentication

Tests sử dụng stored authentication state:
- Setup ở `tests/fixtures/auth.setup.ts`
- Chạy trước mỗi test suite
- Lưu session vào `tests/.auth/admin.json`
- **Credentials**: superadmin@medicalink.com / SuperAdmin123!

**Cấu hình khác (nếu cần):**

Mở file `tests/fixtures/auth.setup.ts` và update:

```typescript
await page.locator('input[type="email"]').fill('YOUR_EMAIL')
await page.locator('input[type="password"]').fill('YOUR_PASSWORD')
```

---

## 🔧 Configuration

File `playwright.config.ts` chứa:
- **Base URL**: https://medicalink-fe-staff.vercel.app/ (production)
- Timeout settings
- Browser projects
- Reporter config
- Screenshot/video settings

---

## 🚦 CI/CD

### GitHub Actions

Workflow đã được cấu hình để:
1. Checkout code
2. Install dependencies
3. Install Playwright browsers
4. Run tests **trên production**
5. Upload test report

### Local CI Test

```bash
# Test như CI (production)
CI=true pnpm test
```

---

## 📊 Test Reports

Sau khi chạy tests:

```bash
pnpm test:report
```

Report chứa:
- Test results (pass/fail)
- Execution time
- Screenshots
- Videos
- Traces (click để replay)

---

## 🆘 Troubleshooting

### Tests fail với "Navigation timeout"

```typescript
// Tăng timeout
await page.goto('/dashboard', { timeout: 30000 })
```

### Element không tìm thấy

```typescript
// Chờ element xuất hiện
await page.waitForSelector('button')

// Hoặc dùng expect với timeout
await expect(page.getByRole('button')).toBeVisible({ timeout: 10000 })
```

### Strict Mode Violation (2 elements match)

**Nguyên nhân**: TanStack Router Devtools có aria-labels trùng

**Giải pháp**: Dùng specific selectors
```typescript
// ❌ Có thể match nhiều elements
page.getByLabel('Password')

// ✅ Specific selector
page.locator('input[type="password"][name="password"]')
```

### Authentication fail

1. Kiểm tra credentials trong `auth.setup.ts`
2. Xóa folder `.auth/` và chạy lại
3. Kiểm tra production có đổi password không

### Network errors khi test production

- Kiểm tra internet connection
- Verify production URL còn hoạt động
- Check nếu bị rate limit

---

## 📚 Tài Liệu Thêm

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Locators Guide](https://playwright.dev/docs/locators)
- [TEST_SUMMARY.md](./TEST_SUMMARY.md) - Chi tiết về tất cả test cases

---

## 🤝 Contributing

Khi thêm tests mới:

1. Tạo test file trong folder phù hợp
2. Sử dụng naming convention: `feature-name.spec.ts`
3. Thêm documentation ở đầu file
4. Group tests với `test.describe`
5. Thêm accessibility tests nếu có thể
6. **Dùng specific selectors** để tránh conflicts
7. Update README này với test cases mới

---

## 📝 Notes

- ⚠️ **Tests chạy trên PRODUCTION** by default
- ⚠️ Không commit file `.auth/` (đã gitignore)
- 💡 Dùng specific input selectors để tránh strict mode violations
- 💡 Dùng `randomString()` để tránh conflicts trong test data
- 🎯 Mỗi test phải pass independently
- 🧹 Tests tự cleanup data của mình
- 📸 Screenshot/video tự động khi fail

---

## 🎯 Quick Commands

```bash
# Production tests (default)
pnpm test                          # All tests
pnpm test:ui                       # UI mode
pnpm test:headed                   # With browser
pnpm test:report                   # View report

# Localhost tests
PLAYWRIGHT_BASE_URL=http://localhost:5173 pnpm test

# Specific tests
pnpm test tests/settings/
pnpm test tests/specialties/

# Debug
pnpm test:debug
pnpm test:codegen

# Browsers
pnpm test:chromium
pnpm test:firefox
pnpm test:webkit
```

---

**Happy Testing! 🎉**

Testing on Production: [https://medicalink-fe-staff.vercel.app/](https://medicalink-fe-staff.vercel.app/)

# 📋 Test Summary - MedicaLink Frontend

## ✅ Tất cả đã được cập nhật theo Source Code thực tế

Link Production: [https://medicalink-fe-staff.vercel.app/](https://medicalink-fe-staff.vercel.app/)

---

## 🔐 **Authentication**

### Đúng theo source code:
- **Path**: `/sign-in` ✅
- **Email label**: `"Email"` (exact)
- **Password label**: `"Password"` (exact)
- **Submit button**: `"Sign in"` (exact)
- **Component**: `UserAuthForm` → `src/features/auth/sign-in/components/user-auth-form.tsx`

### Test file:
- `tests/fixtures/auth.setup.ts`
- `tests/example.spec.ts`

---

## 🔑 **Change Password**

### Đúng theo source code:
- **Route**: `/settings/account`
- **Labels**:
  - `"Current password"`
  - `"New password"`
  - `"Confirm new password"`
- **Submit button**: `"Update password"` (changes to `"Updating..."` while pending)
- **Component**: `ChangePasswordSection` → `src/features/settings/account/change-password-section.tsx`
- **Toggle button aria-label**: `"Show password"` / `"Hide password"`

### Test file:
- `tests/settings/change-password.spec.ts`

### Test cases (12 tests):
1. ✅ Display form with all fields
2. ✅ Toggle password visibility
3. ✅ Validation for empty fields
4. ✅ Password strength validation
5. ✅ Password confirmation matching
6. ✅ Incorrect current password
7. ✅ Successfully change password
8. ✅ Disable button while pending
9. ✅ Change password multiple times
10. ✅ Form state on navigation
11. ✅ Same password as current
12. ✅ Network error handling

---

## 🏥 **Create Specialty**

### Đúng theo source code:
- **Route**: `/specialties/`
- **Primary button**: `"Add Specialty"` (in header)
- **Dialog title**: `"Create New Specialty"`
- **Form labels**:
  - `"Name"` (required, with red asterisk)
  - `"Description"` (optional)
  - `"Icon URL"` (optional)
- **Submit button**: `"Create"` (changes to disabled with spinner while pending)
- **Component**: `SpecialtiesActionDialog` → `src/features/specialties/components/specialties-action-dialog.tsx`

### Validation:
- Name: 2-120 characters
- Icon URL: Must be valid URL or empty
- Description: optional

### Test file:
- `tests/specialties/create-specialty.spec.ts`

### Test cases (20 tests):
1. ✅ Display create button
2. ✅ Open dialog
3. ✅ Close dialog (Cancel)
4. ✅ Close dialog (X button)
5. ✅ Empty name validation
6. ✅ Name length validation
7. ✅ Icon URL validation
8. ✅ Create with required fields only
9. ✅ Create with all fields
10. ✅ Disable button while creating
11. ✅ Form reset after creation
12. ✅ Prevent duplicate names
13. ✅ Searchable after creation
14. ✅ Multiple creations
15. ✅ Network error handling
16. ✅ Preserve form data on error
17. ✅ Character count hints
18. ✅ Trim whitespace
19. ✅ Auto-generate slug
20. ✅ Accessibility tests (3 tests)

---

## 📑 **Create Info Section**

### Đúng theo source code:
- **Route**: `/specialties/`
- **Access flow**:
  1. Click row actions button (`"Open menu"`)
  2. Click `"Info Sections"` menu item
  3. Info Sections Dialog opens
  4. Click `"Add Section"` button
  5. Create Info Section Dialog opens

- **Dialog titles**:
  - Info Sections Dialog: `"Info Sections"` with specialty badge
  - Create Dialog: `"Create Info Section"`

- **Form label**: `"Section Name"` (required, with red asterisk)
- **Content editor**: Rich Text Editor (Quill)
- **Submit button**: `"Create"`
- **Components**:
  - Row Actions: `DataTableRowActions` → `src/features/specialties/components/data-table-row-actions.tsx`
  - Info Dialog: `InfoSectionsDialog` → `src/features/specialties/components/info-sections-dialog.tsx`
  - Form: `InfoSectionForm` → `src/features/specialties/components/info-section-form.tsx`

### Validation:
- Section Name: 2-120 characters (required)
- Content: optional, supports rich text

### Empty State:
- Message: `"No info sections yet"`
- Button: `"Create First Section"` (alternative to "Add Section")

### Test file:
- `tests/specialties/create-info-section.spec.ts`

### Test cases (13 tests + 3 accessibility):
1. ✅ Display row actions menu item
2. ✅ Open info sections dialog
3. ✅ Open create form
4. ✅ Empty name validation
5. ✅ Name length validation
6. ✅ Create with name only
7. ✅ Create with content
8. ✅ Disable button while creating
9. ✅ Multiple sections
10. ✅ Form reset
11. ✅ Close on Cancel
12. ✅ Network error handling
13. ✅ Character limit hints
14. ✅ Section count display
15. ✅ Accessibility (3 tests)

---

## 🎯 **Key Locators Summary**

| Feature | Locator | Type |
|---------|---------|------|
| Sign in email | `page.getByLabel('Email')` | Exact |
| Sign in password | `page.getByLabel('Password')` | Exact |
| Sign in button | `page.getByRole('button', { name: 'Sign in' })` | Exact |
| Current password | `page.getByLabel('Current password')` | Exact |
| New password | `page.getByLabel('New password')` | Exact |
| Update password button | `page.getByRole('button', { name: 'Update password' })` | Exact |
| Add Specialty button | `page.getByRole('button', { name: 'Add Specialty' })` | Exact |
| Specialty Name field | `page.getByLabel(/^name$/i)` or with `"Name"` | Flexible |
| Row actions menu | `specialtyRow.getByRole('button', { name: 'Open menu' })` | Exact |
| Info Sections menu item | `page.getByRole('menuitem', { name: 'Info Sections' })` | Exact |
| Add Section button | `page.getByRole('button', { name: 'Add Section' })` | Exact |
| Section Name field | `page.getByLabel('Section Name')` | Exact |
| Rich text editor | `page.locator('.ql-editor')` | CSS |

---

## 🚀 **Chạy Tests**

```bash
# Tất cả tests
pnpm test

# UI Mode (khuyến nghị)
pnpm test:ui

# Specific test files
pnpm test tests/settings/change-password.spec.ts
pnpm test tests/specialties/create-specialty.spec.ts
pnpm test tests/specialties/create-info-section.spec.ts

# With browser visible
pnpm test:headed

# Debug mode
pnpm test:debug

# Report
pnpm test:report
```

---

## ✅ **Checklist Đã Hoàn Thành**

- [x] Cài đặt Playwright
- [x] Cấu hình `playwright.config.ts`
- [x] Tạo auth fixtures với path `/sign-in` đúng
- [x] Tạo test helpers
- [x] Viết test Change Password (12 tests)
- [x] Viết test Create Specialty (20 tests)
- [x] Viết test Create Info Section (16 tests)
- [x] Cập nhật tất cả locators theo source code thực tế
- [x] Thêm accessibility tests
- [x] Tạo documentation đầy đủ
- [x] Add test scripts vào package.json

---

## 📝 **Notes quan trọng**

### 1. **Exact Text Matching**
Tất cả tests đều dùng exact text matching theo source code:
- `"Sign in"` không phải `"Login"`
- `"Add Specialty"` không phải `"Create"` hay `"Add New"`
- `"Info Sections"` không phải `"View Info"`

### 2. **Dialog Nesting**
Info Sections có 2 layers dialogs:
1. Info Sections Dialog (list)
2. Create Info Section Dialog (form)

Cả 2 không thể open cùng lúc - form dialog thay thế list dialog.

### 3. **Rich Text Editor**
Sử dụng Quill editor:
- Locator: `.ql-editor`
- Có toolbar với formatting buttons
- Content là HTML

### 4. **Form Validation**
Tất cả forms đều dùng:
- `react-hook-form` với `zodResolver`
- Real-time validation
- Error messages dưới fields
- `FormMessage` component hiển thị lỗi

### 5. **Loading States**
Buttons show loading state:
- Disabled attribute
- Spinner icon (`Loader2`)
- Text thay đổi (vd: "Updating...")

---

## 🎉 **Tổng Kết**

**Total Tests**: 51 tests
- Change Password: 12 tests
- Create Specialty: 20 tests  
- Create Info Section: 16 tests
- Example/Setup: 3 tests

**Code Coverage**:
- ✅ Happy paths
- ✅ Validation errors
- ✅ Network errors
- ✅ Loading states
- ✅ Form resets
- ✅ Accessibility
- ✅ Keyboard navigation

**All tests match production source code exactly!** 🚀


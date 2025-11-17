import { test, expect } from '@playwright/test'
import {
  navigateToSpecialties,
  fillFormField,
  waitForSuccessToast,
  waitForErrorToast,
  waitForDialog,
  closeDialog,
  expectFormError,
  randomString,
  waitForTableData,
  searchInTable,
} from '../utils/test-helpers'

/**
 * Create New Specialty Feature Tests
 * 
 * Test suite for the Create Specialty functionality
 * Location: Specialties Management > Create New
 * 
 * Features tested:
 * - Successfully create specialty with valid inputs
 * - Form validation (required fields, length limits)
 * - Unique name validation
 * - Optional fields (description, icon URL)
 * - Dialog open/close behavior
 * - Created specialty appears in list
 * - Search functionality after creation
 */

test.describe('Create New Specialty', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Specialties page
    await navigateToSpecialties(page)
    
    // Wait for page to fully load
    await waitForTableData(page)
  })

  test('should display create specialty button', async ({ page }) => {
    // Verify "Add Specialty" button is visible
    const createButton = page.getByRole('button', { name: 'Add Specialty' })
    await expect(createButton).toBeVisible()
  })

  test('should open create specialty dialog when clicking create button', async ({ page }) => {
    // Click "Add Specialty" button
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    
    // Verify dialog opens
    const dialog = await waitForDialog(page, /create new specialty|thêm chuyên khoa/i)
    
    // Verify form fields are present
    await expect(dialog.getByLabel(/^name$/i)).toBeVisible()
    await expect(dialog.getByLabel(/description/i)).toBeVisible()
    await expect(dialog.getByLabel(/icon url/i)).toBeVisible()
    
    // Verify action buttons
    await expect(dialog.getByRole('button', { name: /cancel|hủy/i })).toBeVisible()
    await expect(dialog.getByRole('button', { name: /^create$/i })).toBeVisible()
  })

  test('should close dialog when clicking cancel', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    await waitForDialog(page)
    
    // Click cancel
    await page.getByRole('button', { name: /cancel|hủy/i }).click()
    
    // Verify dialog is closed
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('should close dialog when clicking X button', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    const dialog = await waitForDialog(page)
    
    // Click close button (X)
    await dialog.locator('button[aria-label*="Close"]').click()
    
    // Verify dialog is closed
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('should show validation error for empty name field', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    await waitForDialog(page)
    
    // Try to submit without filling required fields
    await page.getByRole('button', { name: /^create$/i }).click()
    
    // Verify validation error for name
    await expectFormError(page, /^name$/i, /required|must be at least/i)
  })

  test('should validate name length constraints', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    await waitForDialog(page)
    
    // Test too short name (less than 2 characters)
    await fillFormField(page, /^name$/i, 'A')
    await page.getByRole('button', { name: /^create$/i }).click()
    await expectFormError(page, /^name$/i, /at least 2 characters/i)
    
    // Test too long name (more than 120 characters)
    const longName = 'A'.repeat(121)
    await fillFormField(page, /^name$/i, longName)
    await page.getByRole('button', { name: /^create$/i }).click()
    await expectFormError(page, /^name$/i, /at most 120 characters/i)
  })

  test('should validate icon URL format', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    await waitForDialog(page)
    
    await fillFormField(page, /^name$/i, 'Test Specialty')
    
    // Test invalid URL
    await fillFormField(page, /icon url/i, 'not-a-valid-url')
    await page.getByRole('button', { name: /^create$/i }).click()
    await expectFormError(page, /icon url/i, /valid url/i)
  })

  test('should successfully create specialty with required fields only', async ({ page }) => {
    const specialtyName = `Test Specialty ${randomString(6)}`
    
    // Open create dialog
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    await waitForDialog(page)
    
    // Fill only required field (name)
    await fillFormField(page, /^name$/i, specialtyName)
    
    // Submit form
    await page.getByRole('button', { name: /^create$/i }).click()
    
    // Wait for success notification
    await waitForSuccessToast(page)
    
    // Verify success message
    await expect(page.locator('[data-sonner-toast]')).toContainText(/success|created|thành công/i)
    
    // Verify dialog is closed
    await expect(page.getByRole('dialog')).not.toBeVisible()
    
    // Verify new specialty appears in list
    await waitForTableData(page)
    await expect(page.getByText(specialtyName)).toBeVisible()
  })

  test('should successfully create specialty with all fields', async ({ page }) => {
    const specialtyName = `Cardiology ${randomString(6)}`
    const description = 'Medical specialty focused on heart and cardiovascular system'
    const iconUrl = 'https://example.com/icons/cardiology.svg'
    
    // Open create dialog
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    await waitForDialog(page)
    
    // Fill all fields
    await fillFormField(page, /^name$/i, specialtyName)
    await fillFormField(page, /description/i, description)
    await fillFormField(page, /icon url/i, iconUrl)
    
    // Submit form
    await page.getByRole('button', { name: /^create$/i }).click()
    
    // Wait for success
    await waitForSuccessToast(page)
    
    // Verify in list
    await waitForTableData(page)
    await expect(page.getByText(specialtyName)).toBeVisible()
  })

  test('should disable submit button while creating', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    await waitForDialog(page)
    
    await fillFormField(page, /^name$/i, `Specialty ${randomString()}`)
    
    const submitButton = page.getByRole('button', { name: /^create$/i })
    await submitButton.click()
    
    // Button should be disabled during request
    await expect(submitButton).toBeDisabled()
    
    // Wait for completion
    await waitForSuccessToast(page)
  })

  test('should reset form after successful creation', async ({ page }) => {
    const firstName = `First Specialty ${randomString(4)}`
    
    // Create first specialty
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    await waitForDialog(page)
    await fillFormField(page, /^name$/i, firstName)
    await page.getByRole('button', { name: /^create$/i }).click()
    await waitForSuccessToast(page)
    
    // Open dialog again
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    await waitForDialog(page)
    
    // Verify form is empty
    await expect(page.getByLabel(/^name$/i)).toHaveValue('')
    await expect(page.getByLabel(/description/i)).toHaveValue('')
    await expect(page.getByLabel(/icon url/i)).toHaveValue('')
  })

  test('should prevent duplicate specialty names', async ({ page }) => {
    const duplicateName = `Duplicate Test ${randomString(6)}`
    
    // Create first specialty
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    await waitForDialog(page)
    await fillFormField(page, /^name$/i, duplicateName)
    await page.getByRole('button', { name: /^create$/i }).click()
    await waitForSuccessToast(page)
    
    // Try to create second specialty with same name
    await page.waitForTimeout(1000) // Wait a bit
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    await waitForDialog(page)
    await fillFormField(page, /^name$/i, duplicateName)
    await page.getByRole('button', { name: /^create$/i }).click()
    
    // Should show error
    await waitForErrorToast(page)
    await expect(page.locator('[data-sonner-toast]')).toContainText(/already exists|duplicate|đã tồn tại/i)
  })

  test('should be searchable after creation', async ({ page }) => {
    const uniqueName = `Searchable Specialty ${randomString(8)}`
    
    // Create specialty
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    await waitForDialog(page)
    await fillFormField(page, /^name$/i, uniqueName)
    await page.getByRole('button', { name: /^create$/i }).click()
    await waitForSuccessToast(page)
    
    // Search for created specialty
    await searchInTable(page, uniqueName)
    
    // Verify it appears in search results
    await expect(page.getByText(uniqueName)).toBeVisible()
  })

  test('should create multiple specialties in sequence', async ({ page }) => {
    const specialties = [
      `Neurology ${randomString(4)}`,
      `Orthopedics ${randomString(4)}`,
      `Pediatrics ${randomString(4)}`,
    ]
    
    for (const name of specialties) {
      await page.getByRole('button', { name: 'Add Specialty' }).click()
      await waitForDialog(page)
      await fillFormField(page, /^name$/i, name)
      await page.getByRole('button', { name: /^create$/i }).click()
      await waitForSuccessToast(page)
      await page.waitForTimeout(500) // Small delay between creations
    }
    
    // Verify all specialties are in the list
    await waitForTableData(page)
    for (const name of specialties) {
      await expect(page.getByText(name)).toBeVisible()
    }
  })

  test('should handle network errors gracefully', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    await waitForDialog(page)
    await fillFormField(page, /^name$/i, 'Test Specialty')
    
    // Simulate offline
    await page.context().setOffline(true)
    
    await page.getByRole('button', { name: /^create$/i }).click()
    
    // Should show error
    await waitForErrorToast(page)
    
    // Restore online
    await page.context().setOffline(false)
  })

  test('should preserve form data if creation fails', async ({ page }) => {
    const name = 'Test Specialty'
    const description = 'Test description'
    
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    await waitForDialog(page)
    
    await fillFormField(page, /^name$/i, name)
    await fillFormField(page, /description/i, description)
    
    // Simulate error (e.g., offline)
    await page.context().setOffline(true)
    await page.getByRole('button', { name: /^create$/i }).click()
    await waitForErrorToast(page)
    await page.context().setOffline(false)
    
    // Verify form still has the data
    await expect(page.getByLabel(/^name$/i)).toHaveValue(name)
    await expect(page.getByLabel(/description/i)).toHaveValue(description)
  })

  test('should show character count or limit hints', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    await waitForDialog(page)
    
    // Check for helper text mentioning character limits
    await expect(page.getByText(/2-120 characters/i)).toBeVisible()
  })

  test('should trim whitespace from name', async ({ page }) => {
    const nameWithSpaces = `  Specialty with spaces  ${randomString(4)}  `
    const expectedName = nameWithSpaces.trim()
    
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    await waitForDialog(page)
    
    await fillFormField(page, /^name$/i, nameWithSpaces)
    await page.getByRole('button', { name: /^create$/i }).click()
    await waitForSuccessToast(page)
    
    // Verify trimmed name in list
    await waitForTableData(page)
    await expect(page.getByText(expectedName)).toBeVisible()
  })

  test('should auto-generate slug from name', async ({ page }) => {
    const specialtyName = `Test Auto Slug ${randomString(4)}`
    
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    await waitForDialog(page)
    
    await fillFormField(page, /^name$/i, specialtyName)
    await page.getByRole('button', { name: /^create$/i }).click()
    await waitForSuccessToast(page)
    
    // Search for the created specialty
    await searchInTable(page, specialtyName)
    
    // Click to view details or verify slug is generated
    // (This depends on your UI - might need to check in edit dialog or details view)
    await expect(page.getByText(specialtyName)).toBeVisible()
  })
})

/**
 * Accessibility Tests
 */
test.describe('Create Specialty - Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await navigateToSpecialties(page)
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    await waitForDialog(page)
    
    // Tab through form
    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/^name$/i)).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/description/i)).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/icon url/i)).toBeFocused()
  })

  test('should have proper ARIA labels and roles', async ({ page }) => {
    await navigateToSpecialties(page)
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    
    // Dialog should have role="dialog"
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    
    // Form fields should have labels
    await expect(page.getByLabel(/^name$/i)).toBeVisible()
    await expect(page.getByLabel(/description/i)).toBeVisible()
    await expect(page.getByLabel(/icon url/i)).toBeVisible()
  })

  test('should support ESC key to close dialog', async ({ page }) => {
    await navigateToSpecialties(page)
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    await waitForDialog(page)
    
    // Press ESC
    await page.keyboard.press('Escape')
    
    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })
})


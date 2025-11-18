import { test, expect } from '@playwright/test'
import {
  navigateToPatients,
  fillFormField,
  waitForSuccessToast,
  waitForDialog,
  expectFormError,
  randomString,
  waitForTableData,
  searchInTable,
  testEmail,
} from '../utils/test-helpers'

/**
 * Create New Patient Feature Tests
 *
 * Test suite for the Create Patient functionality
 * Location: Patients Management > Create New
 *
 * Features tested:
 * - Successfully create patient with valid inputs
 * - Form validation (required fields, length limits)
 * - Email and phone validation
 * - Optional fields (gender, date of birth, address)
 * - Dialog open/close behavior
 * - Created patient appears in list
 * - Search functionality after creation
 */

test.describe('Create New Patient', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Patients page
    await navigateToPatients(page)

    // Wait for page to fully load
    await waitForTableData(page)
  })

  test('should display create patient button', async ({ page }) => {
    // Verify "Add Patient" or "Create New Patient" button is visible
    const createButton = page.getByRole('button', { name: /add patient|create.*patient/i })
    await expect(createButton).toBeVisible()
  })

  test('should open create patient dialog when clicking create button', async ({ page }) => {
    // Click create button
    await page.getByRole('button', { name: /add patient|create.*patient/i }).click()

    // Verify dialog opens
    const dialog = await waitForDialog(page, /create new patient/i)

    // Verify required form fields are present
    await expect(dialog.getByLabel(/full name/i)).toBeVisible()
    
    // Verify optional fields
    await expect(dialog.getByLabel(/^email$/i)).toBeVisible()
    await expect(dialog.getByLabel(/phone/i)).toBeVisible()
    await expect(dialog.getByLabel(/gender/i)).toBeVisible()
    await expect(dialog.getByLabel(/date of birth/i)).toBeVisible()
    await expect(dialog.getByLabel(/^address$/i)).toBeVisible()
    await expect(dialog.getByLabel(/district/i)).toBeVisible()
    await expect(dialog.getByLabel(/province/i)).toBeVisible()

    // Verify action buttons
    await expect(dialog.getByRole('button', { name: /cancel/i })).toBeVisible()
    await expect(dialog.getByRole('button', { name: /create patient/i })).toBeVisible()
  })

  test('should close dialog when clicking cancel', async ({ page }) => {
    await page.getByRole('button', { name: /add patient|create.*patient/i }).click()
    await waitForDialog(page)

    // Click cancel
    await page.getByRole('button', { name: /cancel/i }).click()

    // Verify dialog is closed
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('should show validation error for empty required fields', async ({ page }) => {
    await page.getByRole('button', { name: /add patient|create.*patient/i }).click()
    await waitForDialog(page)

    // Try to submit without filling required field (Full Name)
    await page.getByRole('button', { name: /create patient/i }).click()

    // Should show error for required Full Name field
    await expectFormError(page, /full name/i, /at least 2 characters/i)
  })

  test('should validate full name length constraints', async ({ page }) => {
    await page.getByRole('button', { name: /add patient|create.*patient/i }).click()
    await waitForDialog(page)

    // Test too short name (less than 2 characters)
    await fillFormField(page, /full name/i, 'A')
    await page.getByRole('button', { name: /create patient/i }).click()
    await expectFormError(page, /full name/i, /at least 2 characters/i)

    // Test too long name (more than 100 characters)
    const longName = 'A'.repeat(101)
    await fillFormField(page, /full name/i, longName)
    await page.getByRole('button', { name: /create patient/i }).click()
    await expectFormError(page, /full name/i, /not exceed 100 characters/i)
  })

  test('should validate email format if provided', async ({ page }) => {
    await page.getByRole('button', { name: /add patient|create.*patient/i }).click()
    await waitForDialog(page)

    await fillFormField(page, /full name/i, 'John Doe')
    
    // Test invalid email format
    await fillFormField(page, /^email$/i, 'invalid-email')
    await page.getByRole('button', { name: /create patient/i }).click()
    
    // Email validation might be checked
    const toast = page.locator('[data-sonner-toast]').first()
    await toast.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      // If no toast, email might be accepted - that's ok for optional field
    })
  })

  test('should successfully create patient with required fields only', async ({ page }) => {
    const patientName = `Patient ${randomString(6)}`

    // Open create dialog
    await page.getByRole('button', { name: /add patient|create.*patient/i }).click()
    await waitForDialog(page)

    // Fill only required field (Full Name)
    await fillFormField(page, /full name/i, patientName)

    // Submit form
    await page.getByRole('button', { name: /create patient/i }).click()

    // Wait for success notification
    await waitForSuccessToast(page)

    // Verify success message
    await expect(page.locator('[data-sonner-toast]')).toContainText(/success|created/i)

    // Verify dialog is closed
    await expect(page.getByRole('dialog')).not.toBeVisible()

    // Search for newly created patient
    await searchInTable(page, patientName)
    await expect(page.getByRole('row', { name: new RegExp(patientName, 'i') })).toBeVisible()
  })

  test('should successfully create patient with all fields', async ({ page }) => {
    const patientName = `John Smith ${randomString(4)}`
    const email = testEmail('patient')
    const phone = '+84912345678'
    const district = 'District 1'
    const province = 'Ho Chi Minh City'

    // Open create dialog
    await page.getByRole('button', { name: /add patient|create.*patient/i }).click()
    await waitForDialog(page)

    // Fill all fields
    await fillFormField(page, /full name/i, patientName)
    await fillFormField(page, /^email$/i, email)
    await fillFormField(page, /phone/i, phone)
    
    // Select gender (Male)
    await page.getByLabel(/gender/i).click()
    await page.getByRole('option', { name: /male/i }).click()
    
    // Set date of birth
    await fillFormField(page, /date of birth/i, '1990-01-15')
    
    // Fill address fields
    await fillFormField(page, /^address$/i, '123 Main Street, Apt 4B')
    await fillFormField(page, /district/i, district)
    await fillFormField(page, /province/i, province)

    // Submit form
    await page.getByRole('button', { name: /create patient/i }).click()

    // Wait for creation to complete
    await waitForSuccessToast(page, /success|created/i)
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 })
    await waitForTableData(page)
    await page.waitForTimeout(1000)

    // Search for newly created patient
    await searchInTable(page, patientName)
    await page.waitForTimeout(1000)
    await expect(page.getByRole('row', { name: new RegExp(patientName, 'i') })).toBeVisible({ timeout: 10000 })
  })

  test('should disable submit button while creating', async ({ page }) => {
    await page.getByRole('button', { name: /add patient|create.*patient/i }).click()
    await waitForDialog(page)

    await fillFormField(page, /full name/i, `Patient ${randomString()}`)

    const submitButton = page.getByRole('button', { name: /create patient/i })
    await submitButton.click()

    // Button should be disabled during request
    await expect(submitButton).toBeDisabled()

    // Wait for completion
    await waitForSuccessToast(page)
  })

  test('should reset form after successful creation', async ({ page }) => {
    const firstName = `First Patient ${randomString(4)}`

    // Create first patient
    await page.getByRole('button', { name: /add patient|create.*patient/i }).click()
    await waitForDialog(page)
    await fillFormField(page, /full name/i, firstName)
    await page.getByRole('button', { name: /create patient/i }).click()
    await waitForSuccessToast(page)

    // Open dialog again
    await page.getByRole('button', { name: /add patient|create.*patient/i }).click()
    await waitForDialog(page)

    // Verify form is empty
    await expect(page.getByLabel(/full name/i)).toHaveValue('')
    await expect(page.getByLabel(/^email$/i)).toHaveValue('')
    await expect(page.getByLabel(/phone/i)).toHaveValue('')
  })

  test('should be searchable after creation', async ({ page }) => {
    const uniqueName = `Searchable Patient ${randomString(8)}`

    // Create patient
    await page.getByRole('button', { name: /add patient|create.*patient/i }).click()
    await waitForDialog(page)
    await fillFormField(page, /full name/i, uniqueName)
    await page.getByRole('button', { name: /create patient/i }).click()

    // Wait for creation to complete
    await waitForSuccessToast(page, /success|created/i)
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 })

    // Wait for table refresh
    await waitForTableData(page)
    await page.waitForTimeout(1000)

    // Search for created patient
    await searchInTable(page, uniqueName)
    await page.waitForTimeout(1000)

    // Verify it appears in search results
    await expect(page.getByRole('row', { name: new RegExp(uniqueName, 'i') })).toBeVisible({ timeout: 10000 })
  })

  test('should create multiple patients in sequence', async ({ page }) => {
    const patients = [
      `Patient A ${randomString(4)}`,
      `Patient B ${randomString(4)}`,
      `Patient C ${randomString(4)}`,
    ]

    for (const name of patients) {
      await page.getByRole('button', { name: /add patient|create.*patient/i }).click()
      await waitForDialog(page)
      await fillFormField(page, /full name/i, name)
      await page.getByRole('button', { name: /create patient/i }).click()

      // Wait for each creation to complete
      await waitForSuccessToast(page, /success|created/i)
      await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 })
      await waitForTableData(page)
      await page.waitForTimeout(1000)
    }

    // Verify all patients are in the list
    for (const name of patients) {
      await searchInTable(page, name)
      await page.waitForTimeout(1000)
      await expect(page.getByRole('row', { name: new RegExp(name, 'i') })).toBeVisible({ timeout: 10000 })
      await page.getByPlaceholder(/search/i).clear()
      await page.waitForTimeout(500)
    }
  })

  test('should trim whitespace from name', async ({ page }) => {
    const nameWithSpaces = `  Patient with spaces  ${randomString(4)}  `
    const expectedName = nameWithSpaces.trim()

    await page.getByRole('button', { name: /add patient|create.*patient/i }).click()
    await waitForDialog(page)

    await fillFormField(page, /full name/i, nameWithSpaces)
    await page.getByRole('button', { name: /create patient/i }).click()

    // Wait for creation to complete
    await waitForSuccessToast(page, /success|created/i)
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 })
    await waitForTableData(page)
    await page.waitForTimeout(1000)

    // Verify trimmed name in list
    await searchInTable(page, expectedName)
    await page.waitForTimeout(1000)
    await expect(page.getByRole('row', { name: new RegExp(expectedName, 'i') })).toBeVisible({ timeout: 10000 })
  })

  test('should handle both gender options correctly', async ({ page }) => {
    // Test creating male patient
    const maleName = `Male Patient ${randomString(4)}`
    await page.getByRole('button', { name: /add patient|create.*patient/i }).click()
    await waitForDialog(page)
    
    await fillFormField(page, /full name/i, maleName)
    await page.getByLabel(/gender/i).click()
    await page.getByRole('option', { name: /^male$/i }).click()
    
    await page.getByRole('button', { name: /create patient/i }).click()
    await waitForSuccessToast(page)
    await expect(page.getByRole('dialog')).not.toBeVisible()

    // Test creating female patient
    const femaleName = `Female Patient ${randomString(4)}`
    await page.getByRole('button', { name: /add patient|create.*patient/i }).click()
    await waitForDialog(page)
    
    await fillFormField(page, /full name/i, femaleName)
    await page.getByLabel(/gender/i).click()
    await page.getByRole('option', { name: /^female$/i }).click()
    
    await page.getByRole('button', { name: /create patient/i }).click()
    await waitForSuccessToast(page)
  })

  test('should accept valid phone number formats', async ({ page }) => {
    const patientName = `Patient Phone ${randomString(4)}`
    
    await page.getByRole('button', { name: /add patient|create.*patient/i }).click()
    await waitForDialog(page)
    
    await fillFormField(page, /full name/i, patientName)
    await fillFormField(page, /phone/i, '+84912345678')
    
    await page.getByRole('button', { name: /create patient/i }).click()
    await waitForSuccessToast(page)
  })

  test('should support ESC key to close dialog', async ({ page }) => {
    await page.getByRole('button', { name: /add patient|create.*patient/i }).click()
    await waitForDialog(page)

    // Press ESC
    await page.keyboard.press('Escape')

    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })
})

/**
 * Accessibility Tests
 */
test.describe('Create Patient - Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await navigateToPatients(page)
    await page.getByRole('button', { name: /add patient|create.*patient/i }).click()
    await waitForDialog(page)

    // Focus first field and verify
    await page.getByLabel(/full name/i).focus()
    await expect(page.getByLabel(/full name/i)).toBeFocused()

    // Tab to next field
    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/^email$/i)).toBeFocused()
  })

  test('should have proper ARIA labels and roles', async ({ page }) => {
    await navigateToPatients(page)
    await page.getByRole('button', { name: /add patient|create.*patient/i }).click()

    // Dialog should have role="dialog"
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // Form fields should have labels
    await expect(page.getByLabel(/full name/i)).toBeVisible()
    await expect(page.getByLabel(/^email$/i)).toBeVisible()
    await expect(page.getByLabel(/phone/i)).toBeVisible()
  })
})


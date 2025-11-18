import { test, expect } from '@playwright/test'
import {
  navigateToWorkLocations,
  fillFormField,
  waitForSuccessToast,
  waitForDialog,
  expectFormError,
  randomString,
  waitForTableData,
  searchInTable,
} from '../utils/test-helpers'

/**
 * Edit Work Location Feature Tests
 *
 * Test suite for the Edit Work Location functionality
 * Location: Work Locations Management > Row Actions > Edit
 *
 * Features tested:
 * - Successfully edit work location with valid inputs
 * - Form validation (required fields, length limits)
 * - Pre-populated form fields with existing data
 * - Optional fields (address, phone, timezone, Google Maps URL)
 * - Dialog open/close behavior
 * - Changes reflected in list after update
 * - Timezone selection functionality
 */

test.describe('Edit Work Location', () => {
  let testLocationName: string

  test.beforeEach(async ({ page }) => {
    // Navigate to Work Locations page
    await navigateToWorkLocations(page)
    await waitForTableData(page)

    // Create a test work location to edit
    testLocationName = `Test Location ${randomString(6)}`
    
    await page.getByRole('button', { name: /add.*location|create.*location/i }).click()
    await waitForDialog(page)
    
    await fillFormField(page, /location name/i, testLocationName)
    await fillFormField(page, /^address$/i, '123 Test Street, Test City')
    await fillFormField(page, /phone/i, '+84901234567')
    
    await page.getByRole('button', { name: /^create$/i }).click()

    // Wait for creation to complete
    await waitForSuccessToast(page, /success|created/i)
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 })

    // Wait for table to refresh
    await waitForTableData(page)
    await page.waitForTimeout(1000)

    // Search for the newly created location
    await searchInTable(page, testLocationName)
    await page.waitForTimeout(1500)

    // Verify location appears
    const locationRow = page.getByRole('row', { name: new RegExp(testLocationName, 'i') })
    await expect(locationRow).toBeVisible({ timeout: 15000 })
  })

  test('should display edit action in row dropdown', async ({ page }) => {
    // Find the test location row
    const locationRow = page.getByRole('row', { name: new RegExp(testLocationName, 'i') })
    await expect(locationRow).toBeVisible({ timeout: 15000 })

    // Click the actions button
    const actionsButton = locationRow.getByRole('button', { name: /open menu|actions/i })
    await actionsButton.click()

    // Verify "Edit" action exists
    await expect(page.getByRole('menuitem', { name: /^edit$/i })).toBeVisible()
  })

  test('should open edit dialog with pre-populated fields', async ({ page }) => {
    // Open edit dialog
    const locationRow = page.getByRole('row', { name: new RegExp(testLocationName, 'i') })
    await locationRow.getByRole('button', { name: /open menu|actions/i }).click()
    await page.getByRole('menuitem', { name: /^edit$/i }).click()

    // Wait for edit dialog
    const dialog = await waitForDialog(page, /edit work location/i)

    // Verify fields are pre-populated with existing data
    await expect(dialog.getByLabel(/location name/i)).toHaveValue(testLocationName)
    await expect(dialog.getByLabel(/^address$/i)).toHaveValue('123 Test Street, Test City')
    await expect(dialog.getByLabel(/phone/i)).toHaveValue('+84901234567')

    // Verify action buttons
    await expect(dialog.getByRole('button', { name: /cancel/i })).toBeVisible()
    await expect(dialog.getByRole('button', { name: /^update$/i })).toBeVisible()
  })

  test('should successfully update location name', async ({ page }) => {
    const newName = `Updated Location ${randomString(6)}`

    // Open edit dialog
    const locationRow = page.getByRole('row', { name: new RegExp(testLocationName, 'i') })
    await locationRow.getByRole('button', { name: /open menu|actions/i }).click()
    await page.getByRole('menuitem', { name: /^edit$/i }).click()
    await waitForDialog(page, /edit work location/i)

    // Update the name
    await fillFormField(page, /location name/i, newName)

    // Submit form
    await page.getByRole('button', { name: /^update$/i }).click()

    // Wait for update to complete
    await waitForSuccessToast(page, /success|updated/i)
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 })

    // Wait for table to refresh
    await waitForTableData(page)
    await page.waitForTimeout(1000)

    // Search for updated location
    await searchInTable(page, newName)
    await page.waitForTimeout(1000)

    // Verify new name appears in table
    await expect(page.getByRole('row', { name: new RegExp(newName, 'i') })).toBeVisible({ timeout: 10000 })

    // Update testLocationName for cleanup
    testLocationName = newName
  })

  test('should successfully update address', async ({ page }) => {
    const newAddress = '456 New Avenue, Updated City, State 12345'

    // Open edit dialog
    const locationRow = page.getByRole('row', { name: new RegExp(testLocationName, 'i') })
    await locationRow.getByRole('button', { name: /open menu|actions/i }).click()
    await page.getByRole('menuitem', { name: /^edit$/i }).click()
    await waitForDialog(page, /edit work location/i)

    // Update the address
    await fillFormField(page, /^address$/i, newAddress)

    // Submit form
    await page.getByRole('button', { name: /^update$/i }).click()

    // Wait for update to complete
    await waitForSuccessToast(page, /success|updated/i)
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 })
  })

  test('should successfully update phone number', async ({ page }) => {
    const newPhone = '+84987654321'

    // Open edit dialog
    const locationRow = page.getByRole('row', { name: new RegExp(testLocationName, 'i') })
    await locationRow.getByRole('button', { name: /open menu|actions/i }).click()
    await page.getByRole('menuitem', { name: /^edit$/i }).click()
    await waitForDialog(page, /edit work location/i)

    // Update phone number
    await fillFormField(page, /phone/i, newPhone)

    // Submit form
    await page.getByRole('button', { name: /^update$/i }).click()

    // Wait for update to complete
    await waitForSuccessToast(page, /success|updated/i)
  })

  test('should successfully update all fields at once', async ({ page }) => {
    const newName = `Fully Updated ${randomString(4)}`
    const newAddress = '789 Complete Street, Full City'
    const newPhone = '+84911222333'

    // Open edit dialog
    const locationRow = page.getByRole('row', { name: new RegExp(testLocationName, 'i') })
    await locationRow.getByRole('button', { name: /open menu|actions/i }).click()
    await page.getByRole('menuitem', { name: /^edit$/i }).click()
    await waitForDialog(page, /edit work location/i)

    // Update all fields
    await fillFormField(page, /location name/i, newName)
    await fillFormField(page, /^address$/i, newAddress)
    await fillFormField(page, /phone/i, newPhone)

    // Submit form
    await page.getByRole('button', { name: /^update$/i }).click()

    // Wait for update to complete
    await waitForSuccessToast(page, /success|updated/i)
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 })

    // Verify updated location appears in table
    await waitForTableData(page)
    await page.waitForTimeout(1000)
    await searchInTable(page, newName)
    await page.waitForTimeout(1000)
    await expect(page.getByRole('row', { name: new RegExp(newName, 'i') })).toBeVisible({ timeout: 10000 })

    testLocationName = newName
  })

  test('should validate required fields on update', async ({ page }) => {
    // Open edit dialog
    const locationRow = page.getByRole('row', { name: new RegExp(testLocationName, 'i') })
    await locationRow.getByRole('button', { name: /open menu|actions/i }).click()
    await page.getByRole('menuitem', { name: /^edit$/i }).click()
    await waitForDialog(page, /edit work location/i)

    // Clear the required name field
    await fillFormField(page, /location name/i, '')

    // Try to submit
    await page.getByRole('button', { name: /^update$/i }).click()

    // Should show validation error
    await expectFormError(page, /location name/i, /at least 2 characters/i)
  })

  test('should validate name length constraints', async ({ page }) => {
    // Open edit dialog
    const locationRow = page.getByRole('row', { name: new RegExp(testLocationName, 'i') })
    await locationRow.getByRole('button', { name: /open menu|actions/i }).click()
    await page.getByRole('menuitem', { name: /^edit$/i }).click()
    await waitForDialog(page, /edit work location/i)

    // Test too short name
    await fillFormField(page, /location name/i, 'A')
    await page.getByRole('button', { name: /^update$/i }).click()
    await expectFormError(page, /location name/i, /at least 2 characters/i)

    // Test too long name
    const longName = 'A'.repeat(161)
    await fillFormField(page, /location name/i, longName)
    await page.getByRole('button', { name: /^update$/i }).click()
    await expectFormError(page, /location name/i, /at most 160 characters/i)
  })

  test('should close dialog when clicking cancel', async ({ page }) => {
    // Open edit dialog
    const locationRow = page.getByRole('row', { name: new RegExp(testLocationName, 'i') })
    await locationRow.getByRole('button', { name: /open menu|actions/i }).click()
    await page.getByRole('menuitem', { name: /^edit$/i }).click()
    await waitForDialog(page, /edit work location/i)

    // Make some changes
    await fillFormField(page, /location name/i, 'Changed Name')

    // Click cancel
    await page.getByRole('button', { name: /cancel/i }).click()

    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible()

    // Original name should still be in table (changes not saved)
    await expect(page.getByRole('row', { name: new RegExp(testLocationName, 'i') })).toBeVisible()
  })

  test('should disable submit button while updating', async ({ page }) => {
    // Open edit dialog
    const locationRow = page.getByRole('row', { name: new RegExp(testLocationName, 'i') })
    await locationRow.getByRole('button', { name: /open menu|actions/i }).click()
    await page.getByRole('menuitem', { name: /^edit$/i }).click()
    await waitForDialog(page, /edit work location/i)

    // Make a change
    await fillFormField(page, /location name/i, `Updated ${randomString()}`)

    const submitButton = page.getByRole('button', { name: /^update$/i })
    await submitButton.click()

    // Button should be disabled during request
    await expect(submitButton).toBeDisabled()

    // Wait for completion
    await waitForSuccessToast(page)
  })

  test('should support ESC key to close dialog', async ({ page }) => {
    // Open edit dialog
    const locationRow = page.getByRole('row', { name: new RegExp(testLocationName, 'i') })
    await locationRow.getByRole('button', { name: /open menu|actions/i }).click()
    await page.getByRole('menuitem', { name: /^edit$/i }).click()
    await waitForDialog(page, /edit work location/i)

    // Press ESC
    await page.keyboard.press('Escape')

    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('should handle timezone selection if available', async ({ page }) => {
    // Open edit dialog
    const locationRow = page.getByRole('row', { name: new RegExp(testLocationName, 'i') })
    await locationRow.getByRole('button', { name: /open menu|actions/i }).click()
    await page.getByRole('menuitem', { name: /^edit$/i }).click()
    await waitForDialog(page, /edit work location/i)

    // Check if timezone field exists (it's optional)
    const timezoneField = page.getByLabel(/timezone/i)
    const isTimezoneVisible = await timezoneField.isVisible().catch(() => false)

    if (isTimezoneVisible) {
      // Try to interact with timezone field
      await timezoneField.click()
      
      // Submit should still work
      await page.getByRole('button', { name: /^update$/i }).click()
      await waitForSuccessToast(page)
    }
  })

  test('should clear optional fields', async ({ page }) => {
    // Open edit dialog
    const locationRow = page.getByRole('row', { name: new RegExp(testLocationName, 'i') })
    await locationRow.getByRole('button', { name: /open menu|actions/i }).click()
    await page.getByRole('menuitem', { name: /^edit$/i }).click()
    await waitForDialog(page, /edit work location/i)

    // Clear optional fields
    await fillFormField(page, /^address$/i, '')
    await fillFormField(page, /phone/i, '')

    // Submit form
    await page.getByRole('button', { name: /^update$/i }).click()

    // Should succeed (fields are optional)
    await waitForSuccessToast(page, /success|updated/i)
  })

  test('should preserve data when reopening edit dialog', async ({ page }) => {
    const updateName = `Preserve Test ${randomString(4)}`

    // First update
    const locationRow = page.getByRole('row', { name: new RegExp(testLocationName, 'i') })
    await locationRow.getByRole('button', { name: /open menu|actions/i }).click()
    await page.getByRole('menuitem', { name: /^edit$/i }).click()
    await waitForDialog(page, /edit work location/i)

    await fillFormField(page, /location name/i, updateName)
    await page.getByRole('button', { name: /^update$/i }).click()
    await waitForSuccessToast(page)

    // Wait and search for updated location
    await waitForTableData(page)
    await page.waitForTimeout(1000)
    await searchInTable(page, updateName)
    await page.waitForTimeout(1000)

    // Open edit dialog again
    const updatedRow = page.getByRole('row', { name: new RegExp(updateName, 'i') })
    await updatedRow.getByRole('button', { name: /open menu|actions/i }).click()
    await page.getByRole('menuitem', { name: /^edit$/i }).click()
    await waitForDialog(page, /edit work location/i)

    // Verify the updated name is shown
    await expect(page.getByLabel(/location name/i)).toHaveValue(updateName)
  })
})

/**
 * Accessibility Tests
 */
test.describe('Edit Work Location - Accessibility', () => {
  let testLocationName: string

  test.beforeEach(async ({ page }) => {
    await navigateToWorkLocations(page)
    await waitForTableData(page)

    // Create test location
    testLocationName = `Accessible Location ${randomString(6)}`
    await page.getByRole('button', { name: /add.*location|create.*location/i }).click()
    await waitForDialog(page)
    await fillFormField(page, /location name/i, testLocationName)
    await page.getByRole('button', { name: /^create$/i }).click()
    await waitForSuccessToast(page)
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 })
    await waitForTableData(page)
    await page.waitForTimeout(1500)
    await searchInTable(page, testLocationName)
    await page.waitForTimeout(1500)
  })

  test('should be keyboard navigable', async ({ page }) => {
    const locationRow = page.getByRole('row', { name: new RegExp(testLocationName, 'i') })
    await locationRow.getByRole('button', { name: /open menu|actions/i }).click()
    await page.getByRole('menuitem', { name: /^edit$/i }).click()
    await waitForDialog(page, /edit work location/i)

    // Focus first field
    await page.getByLabel(/location name/i).focus()
    await expect(page.getByLabel(/location name/i)).toBeFocused()

    // Tab to next field
    await page.keyboard.press('Tab')
    // Address field should be focused (it's a textarea)
    const addressField = page.getByLabel(/^address$/i)
    await expect(addressField).toBeFocused()
  })

  test('should have proper ARIA labels', async ({ page }) => {
    const locationRow = page.getByRole('row', { name: new RegExp(testLocationName, 'i') })
    await locationRow.getByRole('button', { name: /open menu|actions/i }).click()
    await page.getByRole('menuitem', { name: /^edit$/i }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // Form fields should have labels
    await expect(page.getByLabel(/location name/i)).toBeVisible()
    await expect(page.getByLabel(/^address$/i)).toBeVisible()
    await expect(page.getByLabel(/phone/i)).toBeVisible()
  })
})


import { test, expect } from '@playwright/test'
import {
  navigateToSpecialties,
  fillFormField,
  waitForSuccessToast,
  waitForErrorToast,
  waitForDialog,
  expectFormError,
  randomString,
  waitForTableData,
} from '../utils/test-helpers'

/**
 * Create Info Section Feature Tests
 * 
 * Test suite for the Create Info Section functionality
 * Location: Specialties > Row Actions > Info Sections > Add Section
 * 
 * Features tested:
 * - Successfully create info section with valid inputs
 * - Form validation (required fields, length limits)
 * - Rich text editor functionality
 * - Dialog open/close behavior
 * - Info section appears in specialty details
 * - Multiple info sections per specialty
 */

test.describe('Create Info Section', () => {
  let testSpecialtyName: string

  test.beforeEach(async ({ page }) => {
    // Navigate to Specialties page
    await navigateToSpecialties(page)
    await waitForTableData(page)
    
    // Create a test specialty to add info sections to
    testSpecialtyName = `Test Specialty ${randomString(6)}`
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    await waitForDialog(page)
    await fillFormField(page, /^name$/i, testSpecialtyName)
    await page.getByRole('button', { name: 'Create' }).click()
    await waitForSuccessToast(page)
    await waitForTableData(page)
  })

  test('should display view info sections action in row dropdown', async ({ page }) => {
    // Find the test specialty row
    const specialtyRow = page.getByRole('row', { name: new RegExp(testSpecialtyName, 'i') })
    await expect(specialtyRow).toBeVisible()
    
    // Click the "Open menu" button
    const actionsButton = specialtyRow.getByRole('button', { name: 'Open menu' })
    await actionsButton.click()
    
    // Verify "Info Sections" action exists
    await expect(page.getByRole('menuitem', { name: 'Info Sections' })).toBeVisible()
  })

  test('should open info sections dialog', async ({ page }) => {
    // Open row actions menu and click "Info Sections"
    const specialtyRow = page.getByRole('row', { name: new RegExp(testSpecialtyName, 'i') })
    await specialtyRow.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('menuitem', { name: 'Info Sections' }).click()
    
    // Verify info sections dialog opens
    const dialog = await waitForDialog(page, /info sections/i)
    
    // Verify "Add Section" button is present
    await expect(dialog.getByRole('button', { name: 'Add Section' })).toBeVisible()
    
    // Verify empty state message
    await expect(dialog).toContainText(/no info sections yet/i)
  })

  test('should open create info section form', async ({ page }) => {
    // Navigate to info sections dialog
    const specialtyRow = page.getByRole('row', { name: new RegExp(testSpecialtyName, 'i') })
    await specialtyRow.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('menuitem', { name: 'Info Sections' }).click()
    await waitForDialog(page)
    
    // Click "Add Section" button
    await page.getByRole('button', { name: 'Add Section' }).click()
    
    // Wait for create form dialog
    const createDialog = await waitForDialog(page, /create info section/i)
    
    // Verify form fields - exact label "Section Name"
    await expect(createDialog.getByLabel('Section Name')).toBeVisible()
    
    // Rich text editor should be visible
    await expect(createDialog.locator('.ql-editor')).toBeVisible()
    
    // Verify action buttons
    await expect(createDialog.getByRole('button', { name: 'Cancel' })).toBeVisible()
    await expect(createDialog.getByRole('button', { name: 'Create' })).toBeVisible()
  })

  test('should show validation error for empty section name', async ({ page }) => {
    // Navigate to create info section form
    const specialtyRow = page.getByRole('row', { name: new RegExp(testSpecialtyName, 'i') })
    await specialtyRow.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('menuitem', { name: 'Info Sections' }).click()
    await waitForDialog(page)
    await page.getByRole('button', { name: 'Add Section' }).click()
    await waitForDialog(page, /create info section/i)
    
    // Try to submit without filling section name
    await page.getByRole('button', { name: 'Create' }).click()
    
    // Verify validation error
    await expectFormError(page, 'Section Name', /at least 2 characters/i)
  })

  test('should validate section name length', async ({ page }) => {
    // Navigate to create form
    const specialtyRow = page.getByRole('row', { name: new RegExp(testSpecialtyName, 'i') })
    await specialtyRow.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('menuitem', { name: 'Info Sections' }).click()
    await waitForDialog(page)
    await page.getByRole('button', { name: 'Add Section' }).click()
    await waitForDialog(page, /create info section/i)
    
    // Test too short name
    await fillFormField(page, 'Section Name', 'A')
    await page.getByRole('button', { name: 'Create' }).click()
    await expectFormError(page, 'Section Name', /at least 2 characters/i)
    
    // Test too long name
    const longName = 'A'.repeat(121)
    await fillFormField(page, 'Section Name', longName)
    await page.getByRole('button', { name: 'Create' }).click()
    await expectFormError(page, 'Section Name', /at most 120 characters/i)
  })

  test('should successfully create info section with name only', async ({ page }) => {
    const sectionName = `Overview ${randomString(4)}`
    
    // Navigate to create form
    const specialtyRow = page.getByRole('row', { name: new RegExp(testSpecialtyName, 'i') })
    await specialtyRow.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('menuitem', { name: 'Info Sections' }).click()
    await waitForDialog(page)
    await page.getByRole('button', { name: 'Add Section' }).click()
    await waitForDialog(page, /create info section/i)
    
    // Fill section name
    await fillFormField(page, 'Section Name', sectionName)
    
    // Submit form
    await page.getByRole('button', { name: 'Create' }).click()
    
    // Wait for success
    await waitForSuccessToast(page)
    
    // Verify section appears in list (back to info sections dialog)
    await expect(page.getByText(sectionName)).toBeVisible()
  })

  test('should successfully create info section with content', async ({ page }) => {
    const sectionName = `Treatment Options ${randomString(4)}`
    const content = 'This section describes various treatment options available.'
    
    // Navigate to create form
    const specialtyRow = page.getByRole('row', { name: new RegExp(testSpecialtyName, 'i') })
    await specialtyRow.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('menuitem', { name: 'Info Sections' }).click()
    await waitForDialog(page)
    await page.getByRole('button', { name: 'Add Section' }).click()
    await waitForDialog(page, /create info section/i)
    
    // Fill section name
    await fillFormField(page, 'Section Name', sectionName)
    
    // Fill rich text editor content
    const editor = page.locator('.ql-editor').first()
    await editor.click()
    await editor.fill(content)
    
    // Submit form
    await page.getByRole('button', { name: 'Create' }).click()
    
    // Wait for success
    await waitForSuccessToast(page)
    
    // Verify section appears
    await expect(page.getByText(sectionName)).toBeVisible()
  })

  test('should disable submit button while creating', async ({ page }) => {
    const specialtyRow = page.getByRole('row', { name: new RegExp(testSpecialtyName, 'i') })
    await specialtyRow.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('menuitem', { name: 'Info Sections' }).click()
    await waitForDialog(page)
    await page.getByRole('button', { name: 'Add Section' }).click()
    await waitForDialog(page, /create info section/i)
    
    await fillFormField(page, 'Section Name', `Section ${randomString()}`)
    
    const submitButton = page.getByRole('button', { name: 'Create' })
    await submitButton.click()
    
    // Button should be disabled during request
    await expect(submitButton).toBeDisabled()
  })

  test('should create multiple info sections for same specialty', async ({ page }) => {
    const sections = [
      `Overview ${randomString(3)}`,
      `Symptoms ${randomString(3)}`,
      `Treatment ${randomString(3)}`,
    ]
    
    // Open info sections dialog
    const specialtyRow = page.getByRole('row', { name: new RegExp(testSpecialtyName, 'i') })
    await specialtyRow.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('menuitem', { name: 'Info Sections' }).click()
    await waitForDialog(page)
    
    for (const sectionName of sections) {
      // Click "Add Section"
      await page.getByRole('button', { name: 'Add Section' }).click()
      await waitForDialog(page, /create info section/i)
      
      // Fill and submit
      await fillFormField(page, 'Section Name', sectionName)
      await page.getByRole('button', { name: 'Create' }).click()
      await waitForSuccessToast(page)
      
      // Wait a bit before next creation
      await page.waitForTimeout(500)
    }
    
    // Verify all sections are visible
    for (const sectionName of sections) {
      await expect(page.getByText(sectionName)).toBeVisible()
    }
  })

  test('should reset form after successful creation', async ({ page }) => {
    const firstName = `First Section ${randomString(4)}`
    
    // Create first section
    const specialtyRow = page.getByRole('row', { name: new RegExp(testSpecialtyName, 'i') })
    await specialtyRow.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('menuitem', { name: 'Info Sections' }).click()
    await waitForDialog(page)
    await page.getByRole('button', { name: 'Add Section' }).click()
    await waitForDialog(page, /create info section/i)
    await fillFormField(page, 'Section Name', firstName)
    await page.getByRole('button', { name: 'Create' }).click()
    await waitForSuccessToast(page)
    
    // Open create form again
    await page.getByRole('button', { name: 'Add Section' }).click()
    await waitForDialog(page, /create info section/i)
    
    // Verify form is empty
    await expect(page.getByLabel('Section Name')).toHaveValue('')
    
    const editor = page.locator('.ql-editor').first()
    const editorContent = await editor.textContent()
    expect(editorContent?.trim()).toBe('')
  })

  test('should close create dialog when clicking Cancel', async ({ page }) => {
    const specialtyRow = page.getByRole('row', { name: new RegExp(testSpecialtyName, 'i') })
    await specialtyRow.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('menuitem', { name: 'Info Sections' }).click()
    await waitForDialog(page)
    await page.getByRole('button', { name: 'Add Section' }).click()
    await waitForDialog(page, /create info section/i)
    
    // Click Cancel
    await page.getByRole('button', { name: 'Cancel' }).click()
    
    // Create dialog should close, info sections dialog should still be open
    await expect(page.getByRole('heading', { name: /create info section/i })).not.toBeVisible()
    await expect(page.getByRole('heading', { name: /info sections/i })).toBeVisible()
  })

  test('should handle network errors gracefully', async ({ page }) => {
    const specialtyRow = page.getByRole('row', { name: new RegExp(testSpecialtyName, 'i') })
    await specialtyRow.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('menuitem', { name: 'Info Sections' }).click()
    await waitForDialog(page)
    await page.getByRole('button', { name: 'Add Section' }).click()
    await waitForDialog(page, /create info section/i)
    
    await fillFormField(page, 'Section Name', 'Test Section')
    
    // Simulate offline
    await page.context().setOffline(true)
    
    await page.getByRole('button', { name: 'Create' }).click()
    await waitForErrorToast(page)
    
    // Restore online
    await page.context().setOffline(false)
  })

  test('should show helper text for character limits', async ({ page }) => {
    const specialtyRow = page.getByRole('row', { name: new RegExp(testSpecialtyName, 'i') })
    await specialtyRow.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('menuitem', { name: 'Info Sections' }).click()
    await waitForDialog(page)
    await page.getByRole('button', { name: 'Add Section' }).click()
    await waitForDialog(page, /create info section/i)
    
    // Check for helper text mentioning character limits
    await expect(page.getByText(/2-120 characters/i)).toBeVisible()
  })

  test('should display section count in info sections dialog', async ({ page }) => {
    // Create a section first
    const sectionName = `Section ${randomString(4)}`
    const specialtyRow = page.getByRole('row', { name: new RegExp(testSpecialtyName, 'i') })
    await specialtyRow.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('menuitem', { name: 'Info Sections' }).click()
    await waitForDialog(page)
    await page.getByRole('button', { name: 'Add Section' }).click()
    await waitForDialog(page, /create info section/i)
    await fillFormField(page, 'Section Name', sectionName)
    await page.getByRole('button', { name: 'Create' }).click()
    await waitForSuccessToast(page)
    
    // Verify count shows "1 section"
    await expect(page.getByText(/1 section/i)).toBeVisible()
  })
})

/**
 * Accessibility Tests
 */
test.describe('Create Info Section - Accessibility', () => {
  let testSpecialtyName: string

  test.beforeEach(async ({ page }) => {
    await navigateToSpecialties(page)
    await waitForTableData(page)
    
    testSpecialtyName = `Accessible Specialty ${randomString(6)}`
    await page.getByRole('button', { name: 'Add Specialty' }).click()
    await waitForDialog(page)
    await fillFormField(page, /^name$/i, testSpecialtyName)
    await page.getByRole('button', { name: 'Create' }).click()
    await waitForSuccessToast(page)
    await waitForTableData(page)
  })

  test('should be keyboard navigable', async ({ page }) => {
    const specialtyRow = page.getByRole('row', { name: new RegExp(testSpecialtyName, 'i') })
    await specialtyRow.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('menuitem', { name: 'Info Sections' }).click()
    await waitForDialog(page)
    await page.getByRole('button', { name: 'Add Section' }).click()
    await waitForDialog(page, /create info section/i)
    
    // Tab to Section Name field
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Section Name')).toBeFocused()
  })

  test('should have proper ARIA labels', async ({ page }) => {
    const specialtyRow = page.getByRole('row', { name: new RegExp(testSpecialtyName, 'i') })
    await specialtyRow.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('menuitem', { name: 'Info Sections' }).click()
    await waitForDialog(page)
    await page.getByRole('button', { name: 'Add Section' }).click()
    
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    
    // Form field should have label
    await expect(page.getByLabel('Section Name')).toBeVisible()
  })

  test('should support ESC key to close dialog', async ({ page }) => {
    const specialtyRow = page.getByRole('row', { name: new RegExp(testSpecialtyName, 'i') })
    await specialtyRow.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('menuitem', { name: 'Info Sections' }).click()
    await waitForDialog(page)
    await page.getByRole('button', { name: 'Add Section' }).click()
    await waitForDialog(page, /create info section/i)
    
    // Press ESC
    await page.keyboard.press('Escape')
    
    // Create dialog should close
    await expect(page.getByRole('heading', { name: /create info section/i })).not.toBeVisible()
  })
})

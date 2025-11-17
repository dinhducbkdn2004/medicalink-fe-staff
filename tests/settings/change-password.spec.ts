import { test, expect } from '@playwright/test'
import {
  navigateToSettings,
  fillFormField,
  waitForSuccessToast,
  waitForErrorToast,
  expectFormError,
} from '../utils/test-helpers'

/**
 * Change Password Feature Tests
 * 
 * Test suite for the Change Password functionality
 * Location: Settings > Account > Change Password
 * 
 * Features tested:
 * - Successfully change password with valid inputs
 * - Form validation for required fields
 * - Password strength validation
 * - Password confirmation matching
 * - Current password verification
 * - UI interactions (show/hide password)
 */

test.describe('Change Password', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Settings > Account page
    await navigateToSettings(page, 'account')
    
    // Wait for Change Password section to be visible
    await expect(page.getByRole('heading', { name: /change password/i })).toBeVisible()
  })

  test('should display change password form with all fields', async ({ page }) => {
    // Verify all form fields are present
    await expect(page.getByLabel(/current password/i)).toBeVisible()
    await expect(page.getByLabel(/^new password$/i)).toBeVisible()
    await expect(page.getByLabel(/confirm new password/i)).toBeVisible()
    
    // Verify submit button is present
    await expect(page.getByRole('button', { name: /update password/i })).toBeVisible()
    
    // Verify password description/hint text
    await expect(page.getByText(/at least 8 characters/i)).toBeVisible()
  })

  test('should toggle password visibility', async ({ page }) => {
    const currentPasswordField = page.getByLabel(/current password/i)
    const toggleButton = page.locator('button[aria-label*="password"]').first()
    
    // Initially password should be hidden
    await expect(currentPasswordField).toHaveAttribute('type', 'password')
    
    // Click show password button
    await toggleButton.click()
    await expect(currentPasswordField).toHaveAttribute('type', 'text')
    
    // Click hide password button
    await toggleButton.click()
    await expect(currentPasswordField).toHaveAttribute('type', 'password')
  })

  test('should show validation errors for empty fields', async ({ page }) => {
    // Click submit without filling any fields
    await page.getByRole('button', { name: /update password/i }).click()
    
    // Verify validation errors appear
    await expectFormError(page, /current password/i)
    await expectFormError(page, /^new password$/i)
    await expectFormError(page, /confirm new password/i)
  })

  test('should validate password strength requirements', async ({ page }) => {
    await fillFormField(page, /current password/i, 'OldPassword123')
    
    // Test too short password
    await fillFormField(page, /^new password$/i, 'short')
    await page.getByRole('button', { name: /update password/i }).click()
    await expectFormError(page, /^new password$/i, /at least 8 characters/i)
    
    // Test password without uppercase
    await fillFormField(page, /^new password$/i, 'lowercase123')
    await page.getByRole('button', { name: /update password/i }).click()
    await expectFormError(page, /^new password$/i, /uppercase/i)
    
    // Test password without number
    await fillFormField(page, /^new password$/i, 'NoNumbers')
    await page.getByRole('button', { name: /update password/i }).click()
    await expectFormError(page, /^new password$/i, /number/i)
  })

  test('should validate password confirmation matches', async ({ page }) => {
    await fillFormField(page, /current password/i, 'OldPassword123')
    await fillFormField(page, /^new password$/i, 'NewPassword123')
    await fillFormField(page, /confirm new password/i, 'DifferentPassword123')
    
    // Submit form
    await page.getByRole('button', { name: /update password/i }).click()
    
    // Verify error message for mismatched passwords
    await expectFormError(page, /confirm new password/i, /match|same/i)
  })

  test('should show error for incorrect current password', async ({ page }) => {
    await fillFormField(page, /current password/i, 'WrongPassword123')
    await fillFormField(page, /^new password$/i, 'NewPassword123')
    await fillFormField(page, /confirm new password/i, 'NewPassword123')
    
    // Submit form
    await page.getByRole('button', { name: /update password/i }).click()
    
    // Wait for error toast
    await waitForErrorToast(page)
    
    // Verify error message about incorrect current password
    await expect(page.locator('[data-sonner-toast]')).toContainText(/current password|incorrect|wrong/i)
  })

  test('should successfully change password with valid inputs', async ({ page }) => {
    // Fill in all fields with valid data
    await fillFormField(page, /current password/i, 'Admin@123')
    await fillFormField(page, /^new password$/i, 'NewAdmin@123')
    await fillFormField(page, /confirm new password/i, 'NewAdmin@123')
    
    // Submit form
    await page.getByRole('button', { name: /update password/i }).click()
    
    // Wait for success notification
    await waitForSuccessToast(page)
    
    // Verify success message
    await expect(page.locator('[data-sonner-toast]')).toContainText(/success|updated|changed/i)
    
    // Verify form is reset (fields are empty)
    await expect(page.getByLabel(/current password/i)).toHaveValue('')
    await expect(page.getByLabel(/^new password$/i)).toHaveValue('')
    await expect(page.getByLabel(/confirm new password/i)).toHaveValue('')
  })

  test('should disable submit button while request is pending', async ({ page }) => {
    await fillFormField(page, /current password/i, 'Admin@123')
    await fillFormField(page, /^new password$/i, 'NewAdmin@123')
    await fillFormField(page, /confirm new password/i, 'NewAdmin@123')
    
    const submitButton = page.getByRole('button', { name: /update password/i })
    
    // Click submit
    await submitButton.click()
    
    // Button should be disabled during request
    await expect(submitButton).toBeDisabled()
    
    // Button text should change to "Updating..."
    await expect(submitButton).toContainText(/updating/i)
  })

  test('should allow changing password multiple times', async ({ page }) => {
    // First password change
    await fillFormField(page, /current password/i, 'Admin@123')
    await fillFormField(page, /^new password$/i, 'TempPassword@123')
    await fillFormField(page, /confirm new password/i, 'TempPassword@123')
    await page.getByRole('button', { name: /update password/i }).click()
    await waitForSuccessToast(page)
    
    // Wait a moment
    await page.waitForTimeout(1000)
    
    // Second password change (revert back)
    await fillFormField(page, /current password/i, 'TempPassword@123')
    await fillFormField(page, /^new password$/i, 'Admin@123')
    await fillFormField(page, /confirm new password/i, 'Admin@123')
    await page.getByRole('button', { name: /update password/i }).click()
    await waitForSuccessToast(page)
  })

  test('should maintain form state when navigating away and back', async ({ page }) => {
    // Fill in some fields
    await fillFormField(page, /current password/i, 'SomePassword')
    
    // Navigate to another settings section
    await page.getByRole('link', { name: /profile|appearance/i }).first().click()
    
    // Navigate back to account
    await page.getByRole('link', { name: /account/i }).click()
    
    // Verify form is reset (security best practice)
    await expect(page.getByLabel(/current password/i)).toHaveValue('')
  })

  test('should not allow same password as current password', async ({ page }) => {
    const samePassword = 'Admin@123'
    
    await fillFormField(page, /current password/i, samePassword)
    await fillFormField(page, /^new password$/i, samePassword)
    await fillFormField(page, /confirm new password/i, samePassword)
    
    await page.getByRole('button', { name: /update password/i }).click()
    
    // Should show error (either validation or API error)
    await Promise.race([
      expectFormError(page, /^new password$/i, /different|same/i),
      waitForErrorToast(page).then(() =>
        expect(page.locator('[data-sonner-toast]')).toContainText(/different|same|current/i)
      ),
    ])
  })

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate offline mode
    await page.context().setOffline(true)
    
    await fillFormField(page, /current password/i, 'Admin@123')
    await fillFormField(page, /^new password$/i, 'NewAdmin@123')
    await fillFormField(page, /confirm new password/i, 'NewAdmin@123')
    
    await page.getByRole('button', { name: /update password/i }).click()
    
    // Should show error notification
    await waitForErrorToast(page)
    
    // Restore online mode
    await page.context().setOffline(false)
  })
})

/**
 * Accessibility Tests
 */
test.describe('Change Password - Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await navigateToSettings(page, 'account')
    
    // Tab through form fields
    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/current password/i)).toBeFocused()
    
    await page.keyboard.press('Tab')
    // Should skip the show/hide button and go to next input
    await expect(page.getByLabel(/^new password$/i)).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/confirm new password/i)).toBeFocused()
  })

  test('should have proper ARIA labels', async ({ page }) => {
    await navigateToSettings(page, 'account')
    
    // Check password toggle buttons have aria-labels
    const toggleButtons = page.locator('button[aria-label*="password"]')
    await expect(toggleButtons.first()).toHaveAttribute('aria-label', /show|hide/i)
    
    // Check form fields have associated labels
    await expect(page.getByLabel(/current password/i)).toBeVisible()
    await expect(page.getByLabel(/^new password$/i)).toBeVisible()
    await expect(page.getByLabel(/confirm new password/i)).toBeVisible()
  })
})


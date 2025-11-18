import { expect, type Page, type Locator } from '@playwright/test'

/**
 * Test Helper Utilities
 * Reusable functions for common test operations
 */

/**
 * Wait for toast notification and verify its message
 */
export async function waitForToast(page: Page, expectedMessage?: string | RegExp) {
  const toast = page.locator('[data-sonner-toast]').first()
  await expect(toast).toBeVisible({ timeout: 10000 })

  if (expectedMessage) {
    await expect(toast).toContainText(expectedMessage)
  }

  return toast
}

/**
 * Wait for success toast
 */
export async function waitForSuccessToast(page: Page, message?: string | RegExp) {
  const toast = await waitForToast(page, message)
  await expect(toast).toHaveAttribute('data-type', 'success', { timeout: 10000 })
  return toast
}

/**
 * Wait for error toast
 */
export async function waitForErrorToast(page: Page) {
  const toast = await waitForToast(page)
  await expect(toast).toHaveAttribute('data-type', 'error')
  return toast
}

/**
 * Wait for dialog to close completely
 */
export async function waitForDialogClose(page: Page) {
  await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 })
  // Extra wait for animations and cleanup
  await page.waitForTimeout(500)
}

/**
 * Fill form field by label
 */
export async function fillFormField(page: Page, label: string | RegExp, value: string) {
  const field = page.getByLabel(label)
  await field.waitFor({ state: 'visible', timeout: 10000 })
  await field.clear()
  await field.fill(value)
}

/**
 * Wait for dialog to be visible
 */
export async function waitForDialog(page: Page, title?: string | RegExp) {
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible({ timeout: 10000 })

  if (title) {
    await expect(dialog.getByRole('heading', { name: title })).toBeVisible()
  }

  // Wait for dialog content to fully render
  await page.waitForTimeout(300)
  return dialog
}

/**
 * Close dialog by clicking Cancel or X button
 */
export async function closeDialog(page: Page) {
  const dialog = page.getByRole('dialog')
  const cancelButton = dialog.getByRole('button', { name: /cancel|close|hủy/i })

  if (await cancelButton.isVisible()) {
    await cancelButton.click()
  } else {
    // Try close button (X)
    await dialog.locator('button[aria-label*="Close"]').click()
  }

  await expect(dialog).not.toBeVisible()
}

/**
 * Wait for loading state to finish
 */
export async function waitForLoadingToFinish(page: Page) {
  // Wait for any loading spinners to disappear
  await page.waitForLoadState('networkidle')

  const loader = page.locator('[data-testid="loader"], [role="status"]').first()
  if (await loader.isVisible()) {
    await expect(loader).not.toBeVisible({ timeout: 10000 })
  }
}

/**
 * Navigate to settings page
 */
export async function navigateToSettings(page: Page, section?: string) {
  // Navigate directly to settings
  if (section) {
    await page.goto(`/settings/${section}`, { waitUntil: 'domcontentloaded' })
  } else {
    await page.goto('/settings', { waitUntil: 'domcontentloaded' })
  }

  await waitForLoadingToFinish(page)
  // Extra wait for forms to fully render
  await page.waitForTimeout(500)
}

/**
 * Navigate to specialties page
 */
export async function navigateToSpecialties(page: Page) {
  await page.goto('/specialties/', { waitUntil: 'domcontentloaded' })
  await waitForLoadingToFinish(page)
  // Wait for page to be interactive
  await page.waitForTimeout(500)
}

/**
 * Navigate to patients page
 */
export async function navigateToPatients(page: Page) {
  await page.goto('/patients', { waitUntil: 'domcontentloaded' })
  await waitForLoadingToFinish(page)
  // Wait for page to be interactive
  await page.waitForTimeout(500)
}

/**
 * Navigate to work locations page
 */
export async function navigateToWorkLocations(page: Page) {
  await page.goto('/work-locations', { waitUntil: 'domcontentloaded' })
  await waitForLoadingToFinish(page)
  // Wait for page to be interactive
  await page.waitForTimeout(500)
}

/**
 * Generate random string for testing
 */
export function randomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Generate test email
 */
export function testEmail(prefix: string = 'test'): string {
  return `${prefix}-${randomString(6)}@test.com`
}

/**
 * Wait for table to load data
 */
export async function waitForTableData(page: Page) {
  await waitForLoadingToFinish(page)

  // Wait for either data rows or empty state
  await Promise.race([
    page.waitForSelector('table tbody tr', { timeout: 10000 }),
    page.waitForSelector('[data-testid="empty-state"]', { timeout: 10000 }),
  ]).catch(() => {
    // Ignore timeout - table might be loading
  })

  // Extra wait for table to stabilize
  await page.waitForTimeout(300)
}

/**
 * Wait for a specialty row to appear in the table by name
 */
export async function waitForSpecialtyRow(page: Page, specialtyName: string) {
  await waitForTableData(page)
  await page.waitForTimeout(1000)
  const row = page.getByRole('row', { name: new RegExp(specialtyName, 'i') })
  await expect(row).toBeVisible({ timeout: 15000 })
  return row
}

/**
 * Search in table/list
 */
export async function searchInTable(page: Page, query: string) {
  const searchInput = page.getByPlaceholder(/search|tìm kiếm/i)
  await searchInput.clear()
  await searchInput.fill(query)
  await waitForLoadingToFinish(page)
}

/**
 * Open row action menu (3-dot menu)
 */
export async function openRowActionMenu(page: Page, rowText: string) {
  const row = page.getByRole('row', { name: new RegExp(rowText, 'i') })
  await row.getByRole('button', { name: /actions|more/i }).click()
}

/**
 * Verify form validation error
 */
export async function expectFormError(page: Page, fieldLabel: string | RegExp, errorMessage?: string | RegExp) {
  const formItem = page.locator(`[data-testid="form-item"]`, {
    has: page.getByLabel(fieldLabel)
  }).or(
    page.locator('.space-y-2, .form-item', {
      has: page.getByLabel(fieldLabel)
    })
  )

  const errorText = formItem.locator('[data-testid="form-message"], .text-destructive, [role="alert"]').first()
  await expect(errorText).toBeVisible()

  if (errorMessage) {
    await expect(errorText).toContainText(errorMessage)
  }
}


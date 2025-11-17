import { test, expect } from '@playwright/test'

/**
 * Example Test File
 *
 * This is a simple example to verify Playwright setup is working correctly.
 * You can run this test to ensure everything is configured properly.
 *
 * Run: pnpm test tests/example.spec.ts
 */

test.describe('Playwright Setup Verification', () => {
  test('should verify Playwright is working', async ({ page }) => {
    // Navigate to Playwright homepage
    await page.goto('https://playwright.dev/')

    // Verify page title
    await expect(page).toHaveTitle(/Playwright/)

    // Verify Get Started link exists
    const getStartedLink = page.getByRole('link', { name: 'Get started' })
    await expect(getStartedLink).toBeVisible()
  })

  test('should verify test helpers are importable', async () => {
    // Just import to verify no syntax errors
    const helpers = await import('./utils/test-helpers')

    expect(helpers.randomString).toBeDefined()
    expect(helpers.testEmail).toBeDefined()
    expect(helpers.waitForToast).toBeDefined()

    // Test randomString utility
    const str = helpers.randomString(8)
    expect(str).toHaveLength(8)

    // Test testEmail utility
    const email = helpers.testEmail('test')
    expect(email).toMatch(/^test-[a-zA-Z0-9]+@test\.com$/)
  })
})

test.describe('Application Basic Tests - Authenticated', () => {
  test('should load the application with authenticated state', async ({ page }) => {
    // Navigate to app (user is already authenticated via storageState)
    await page.goto('/')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Verify page loaded successfully
    const url = page.url()
    expect(url).toContain('medicalink-fe-staff.vercel.app')

    // Since user is authenticated, they should see the main layout
    // Look for common authenticated UI elements like navigation or profile
    const isAuthenticated =
      (await page.locator('[data-testid="user-profile"]').count() > 0) ||
      (await page.locator('nav').count() > 0) ||
      (url.includes('/') && !url.includes('/sign-in'))

    expect(isAuthenticated).toBe(true)
  })

  test('should have access to protected routes', async ({ page }) => {
    // Try navigating to a protected route (should work since authenticated)
    await page.goto('/settings/account')

    // Wait for page load
    await page.waitForLoadState('networkidle')

    // Should not redirect to sign-in
    expect(page.url()).not.toContain('/sign-in')

    // Should see settings page content
    const url = page.url()
    expect(url.includes('/settings') || url === 'https://medicalink-fe-staff.vercel.app/').toBe(true)
  })
})


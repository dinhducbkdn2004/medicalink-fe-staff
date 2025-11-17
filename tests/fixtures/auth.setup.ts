import { test as setup } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Global Setup - Authentication
 * This file runs before all tests to authenticate users
 * and save the auth state for reuse in tests
 */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const authFile = path.join(__dirname, '../.auth/admin.json')

/**
 * Setup Admin Authentication
 * Login as Admin and save cookies/localStorage
 */
setup('authenticate as admin', async ({ page }) => {
  // Navigate to login page
  console.log('🔐 Starting authentication setup...')
  console.log('📍 Navigating to login page...')
  
  await page.goto('/sign-in', { waitUntil: 'domcontentloaded', timeout: 30000 })
  
  console.log(`📄 Current URL: ${page.url()}`)

  // Wait for page to fully load - try multiple selectors
  console.log('⏳ Waiting for login form...')
  
  try {
    // Wait for the Email input field (specific to sign-in form)
    await page.waitForSelector('input[type="email"]', { timeout: 10000 })
  } catch (error) {
    console.error('❌ Login form not found. Current page HTML:')
    const html = await page.content()
    console.error(html.substring(0, 500)) // Print first 500 chars
    throw error
  }

  console.log('✍️ Filling in credentials...')
  
  // Fill in login credentials - use specific input selectors to avoid conflicts
  await page.locator('input[type="email"][name="email"]').fill('superadmin@medicalink.com')
  await page.locator('input[type="password"][name="password"]').fill('SuperAdmin123!')

  console.log('🚀 Submitting login form...')
  
  // Submit login form - exact button text "Sign in"
  await page.getByRole('button', { name: 'Sign in' }).click()

  // Wait for navigation - be more flexible
  console.log('⏳ Waiting for successful login...')
  
  try {
    await page.waitForURL(/dashboard|home|settings|\/(?:$|\?)/, { 
      timeout: 15000 
    })
  } catch (error) {
    console.error(`❌ Navigation failed. Current URL: ${page.url()}`)
    throw error
  }

  console.log(`✅ Successfully navigated to: ${page.url()}`)

  // Save authentication state
  await page.context().storageState({ path: authFile })

  console.log('✅ Admin authentication completed and saved')
})

/**
 * Setup Doctor Authentication (Optional)
 * Uncomment if you need to test with Doctor role
 */
/*
const doctorAuthFile = path.join(__dirname, '../.auth/doctor.json')

setup('authenticate as doctor', async ({ page }) => {
  await page.goto('/sign-in')
  await page.waitForSelector('form')
  
  await page.getByLabel(/email/i).fill('superadmin@medicalink.com')
  await page.getByLabel(/password/i).fill('SuperAdmin123!')
  
  await page.getByRole('button', { name: /sign in|login/i }).click()
  await page.waitForURL(/dashboard/)
  
  await page.context().storageState({ path: doctorAuthFile })
  console.log('✅ Doctor authentication completed')
})
*/


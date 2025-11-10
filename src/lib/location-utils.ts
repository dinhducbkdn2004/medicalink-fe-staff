/**
 * Location Utilities
 * Helper functions for address and Google Maps integration
 */

/**
 * Generate Google Maps URL from address
 */
export function generateGoogleMapsUrl(address: string): string {
  if (!address || address.trim().length === 0) {
    return ''
  }

  const encodedAddress = encodeURIComponent(address.trim())
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
}

/**
 * Validate Google Maps URL
 */
export function isValidGoogleMapsUrl(url: string): boolean {
  if (!url) return true // Empty is valid (optional field)

  try {
    const urlObj = new URL(url)
    const validDomains = [
      'maps.google.com',
      'www.google.com/maps',
      'google.com/maps',
      'goo.gl/maps',
    ]

    return validDomains.some(
      (domain) => urlObj.hostname.includes(domain) || url.includes(domain)
    )
  } catch {
    return false
  }
}

/**
 * Extract address from Google Maps URL (best effort)
 */
export function extractAddressFromMapsUrl(url: string): string | null {
  if (!url) return null

  try {
    const urlObj = new URL(url)

    // Try to get 'query' parameter
    const query = urlObj.searchParams.get('query')
    if (query) {
      return decodeURIComponent(query)
    }

    // Try to get 'q' parameter
    const q = urlObj.searchParams.get('q')
    if (q) {
      return decodeURIComponent(q)
    }

    // Try to parse from path (for share links)
    const pathMatch = url.match(/place\/([^/]+)/)
    if (pathMatch && pathMatch[1]) {
      return decodeURIComponent(pathMatch[1].replace(/\+/g, ' '))
    }

    return null
  } catch {
    return null
  }
}

/**
 * Open Google Maps URL in new tab
 */
export function openGoogleMaps(url: string): void {
  if (!url) return

  try {
    window.open(url, '_blank', 'noopener,noreferrer')
  } catch {
    // Silently fail - browser may have blocked popup
  }
}

/**
 * Format address for display (truncate if too long)
 */
export function formatAddress(address: string, maxLength: number = 50): string {
  if (!address) return ''

  if (address.length <= maxLength) return address

  return `${address.substring(0, maxLength - 3)}...`
}

/**
 * Parse address components (simple implementation)
 * For production, consider using Google Places API
 */
export interface AddressComponents {
  street?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
}

export function parseAddress(address: string): AddressComponents {
  const parts = address.split(',').map((p) => p.trim())

  return {
    street: parts[0] || undefined,
    city: parts[1] || undefined,
    state: parts[2] || undefined,
    country: parts[3] || undefined,
  }
}

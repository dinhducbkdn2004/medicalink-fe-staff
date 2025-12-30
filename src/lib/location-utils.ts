export function generateGoogleMapsUrl(address: string): string {
  if (!address || address.trim().length === 0) {
    return ''
  }

  const encodedAddress = encodeURIComponent(address.trim())
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
}

export function isValidGoogleMapsUrl(url: string): boolean {
  if (!url) return true

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

export function extractAddressFromMapsUrl(url: string): string | null {
  if (!url) return null

  try {
    const urlObj = new URL(url)

    const query = urlObj.searchParams.get('query')
    if (query) {
      return decodeURIComponent(query)
    }

    const q = urlObj.searchParams.get('q')
    if (q) {
      return decodeURIComponent(q)
    }

    const pathMatch = url.match(/place\/([^/]+)/)
    if (pathMatch && pathMatch[1]) {
      return decodeURIComponent(pathMatch[1].replace(/\+/g, ' '))
    }

    return null
  } catch {
    return null
  }
}

export function openGoogleMaps(url: string): void {
  if (!url) return

  try {
    window.open(url, '_blank', 'noopener,noreferrer')
  } catch {
    void 0
  }
}

export function formatAddress(address: string, maxLength: number = 50): string {
  if (!address) return ''

  if (address.length <= maxLength) return address

  return `${address.substring(0, maxLength - 3)}...`
}

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

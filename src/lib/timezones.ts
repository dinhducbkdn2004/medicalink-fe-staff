export interface TimezoneOption {
  value: string
  label: string
  region: string
  offset: number
  gmtLabel: string
}

export function getUserTimezone(): string {
  try {
    return (
      Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Ho_Chi_Minh'
    )
  } catch {
    return 'Asia/Ho_Chi_Minh'
  }
}

export function getGMTOffset(timezone: string): string {
  try {
    const now = new Date()
    const utcOffset = -now.getTimezoneOffset()

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'longOffset',
    })

    const parts = formatter.formatToParts(now)
    const offsetPart = parts.find((part) => part.type === 'timeZoneName')

    if (offsetPart && offsetPart.value.startsWith('GMT')) {
      return offsetPart.value.replace('GMT', 'GMT ')
    }

    const targetDate = new Date(
      now.toLocaleString('en-US', { timeZone: timezone })
    )
    const diff =
      (targetDate.getTime() - now.getTime() + utcOffset * 60000) / 3600000

    if (diff === 0) return 'GMT+0'
    const sign = diff > 0 ? '+' : ''
    return `GMT${sign}${diff}`
  } catch {
    return 'GMT+0'
  }
}

export const timezoneData: TimezoneOption[] = [
  {
    value: 'Asia/Ho_Chi_Minh',
    label: 'Ho Chi Minh City',
    region: 'Asia',
    offset: 420,
    gmtLabel: 'GMT+7',
  },
  {
    value: 'Asia/Bangkok',
    label: 'Bangkok',
    region: 'Asia',
    offset: 420,
    gmtLabel: 'GMT+7',
  },
  {
    value: 'Asia/Jakarta',
    label: 'Jakarta',
    region: 'Asia',
    offset: 420,
    gmtLabel: 'GMT+7',
  },
  {
    value: 'Asia/Singapore',
    label: 'Singapore',
    region: 'Asia',
    offset: 480,
    gmtLabel: 'GMT+8',
  },
  {
    value: 'Asia/Hong_Kong',
    label: 'Hong Kong',
    region: 'Asia',
    offset: 480,
    gmtLabel: 'GMT+8',
  },
  {
    value: 'Asia/Shanghai',
    label: 'Shanghai',
    region: 'Asia',
    offset: 480,
    gmtLabel: 'GMT+8',
  },
  {
    value: 'Asia/Taipei',
    label: 'Taipei',
    region: 'Asia',
    offset: 480,
    gmtLabel: 'GMT+8',
  },
  {
    value: 'Asia/Manila',
    label: 'Manila',
    region: 'Asia',
    offset: 480,
    gmtLabel: 'GMT+8',
  },
  {
    value: 'Asia/Kuala_Lumpur',
    label: 'Kuala Lumpur',
    region: 'Asia',
    offset: 480,
    gmtLabel: 'GMT+8',
  },
  {
    value: 'Asia/Tokyo',
    label: 'Tokyo',
    region: 'Asia',
    offset: 540,
    gmtLabel: 'GMT+9',
  },
  {
    value: 'Asia/Seoul',
    label: 'Seoul',
    region: 'Asia',
    offset: 540,
    gmtLabel: 'GMT+9',
  },
  {
    value: 'Asia/Kolkata',
    label: 'Kolkata',
    region: 'Asia',
    offset: 330,
    gmtLabel: 'GMT+5:30',
  },
  {
    value: 'Asia/Dubai',
    label: 'Dubai',
    region: 'Asia',
    offset: 240,
    gmtLabel: 'GMT+4',
  },
  {
    value: 'Asia/Jerusalem',
    label: 'Jerusalem',
    region: 'Asia',
    offset: 120,
    gmtLabel: 'GMT+2',
  },

  {
    value: 'Europe/London',
    label: 'London',
    region: 'Europe',
    offset: 0,
    gmtLabel: 'GMT+0',
  },
  {
    value: 'Europe/Paris',
    label: 'Paris',
    region: 'Europe',
    offset: 60,
    gmtLabel: 'GMT+1',
  },
  {
    value: 'Europe/Berlin',
    label: 'Berlin',
    region: 'Europe',
    offset: 60,
    gmtLabel: 'GMT+1',
  },
  {
    value: 'Europe/Rome',
    label: 'Rome',
    region: 'Europe',
    offset: 60,
    gmtLabel: 'GMT+1',
  },
  {
    value: 'Europe/Madrid',
    label: 'Madrid',
    region: 'Europe',
    offset: 60,
    gmtLabel: 'GMT+1',
  },
  {
    value: 'Europe/Amsterdam',
    label: 'Amsterdam',
    region: 'Europe',
    offset: 60,
    gmtLabel: 'GMT+1',
  },
  {
    value: 'Europe/Brussels',
    label: 'Brussels',
    region: 'Europe',
    offset: 60,
    gmtLabel: 'GMT+1',
  },
  {
    value: 'Europe/Vienna',
    label: 'Vienna',
    region: 'Europe',
    offset: 60,
    gmtLabel: 'GMT+1',
  },
  {
    value: 'Europe/Athens',
    label: 'Athens',
    region: 'Europe',
    offset: 120,
    gmtLabel: 'GMT+2',
  },
  {
    value: 'Europe/Moscow',
    label: 'Moscow',
    region: 'Europe',
    offset: 180,
    gmtLabel: 'GMT+3',
  },

  {
    value: 'America/New_York',
    label: 'New York',
    region: 'Americas',
    offset: -300,
    gmtLabel: 'GMT-5',
  },
  {
    value: 'America/Chicago',
    label: 'Chicago',
    region: 'Americas',
    offset: -360,
    gmtLabel: 'GMT-6',
  },
  {
    value: 'America/Denver',
    label: 'Denver',
    region: 'Americas',
    offset: -420,
    gmtLabel: 'GMT-7',
  },
  {
    value: 'America/Los_Angeles',
    label: 'Los Angeles',
    region: 'Americas',
    offset: -480,
    gmtLabel: 'GMT-8',
  },
  {
    value: 'America/Toronto',
    label: 'Toronto',
    region: 'Americas',
    offset: -300,
    gmtLabel: 'GMT-5',
  },
  {
    value: 'America/Vancouver',
    label: 'Vancouver',
    region: 'Americas',
    offset: -480,
    gmtLabel: 'GMT-8',
  },
  {
    value: 'America/Mexico_City',
    label: 'Mexico City',
    region: 'Americas',
    offset: -360,
    gmtLabel: 'GMT-6',
  },
  {
    value: 'America/Sao_Paulo',
    label: 'São Paulo',
    region: 'Americas',
    offset: -180,
    gmtLabel: 'GMT-3',
  },
  {
    value: 'America/Buenos_Aires',
    label: 'Buenos Aires',
    region: 'Americas',
    offset: -180,
    gmtLabel: 'GMT-3',
  },

  {
    value: 'Pacific/Auckland',
    label: 'Auckland',
    region: 'Pacific',
    offset: 780,
    gmtLabel: 'GMT+13',
  },
  {
    value: 'Pacific/Sydney',
    label: 'Sydney',
    region: 'Pacific',
    offset: 660,
    gmtLabel: 'GMT+11',
  },
  {
    value: 'Pacific/Melbourne',
    label: 'Melbourne',
    region: 'Pacific',
    offset: 660,
    gmtLabel: 'GMT+11',
  },
  {
    value: 'Pacific/Fiji',
    label: 'Fiji',
    region: 'Pacific',
    offset: 720,
    gmtLabel: 'GMT+12',
  },
  {
    value: 'Pacific/Honolulu',
    label: 'Honolulu',
    region: 'Pacific',
    offset: -600,
    gmtLabel: 'GMT-10',
  },

  {
    value: 'Africa/Cairo',
    label: 'Cairo',
    region: 'Africa',
    offset: 120,
    gmtLabel: 'GMT+2',
  },
  {
    value: 'Africa/Johannesburg',
    label: 'Johannesburg',
    region: 'Africa',
    offset: 120,
    gmtLabel: 'GMT+2',
  },
  {
    value: 'Africa/Lagos',
    label: 'Lagos',
    region: 'Africa',
    offset: 60,
    gmtLabel: 'GMT+1',
  },
  {
    value: 'Africa/Nairobi',
    label: 'Nairobi',
    region: 'Africa',
    offset: 180,
    gmtLabel: 'GMT+3',
  },
]

export function getGroupedTimezones(): Record<string, TimezoneOption[]> {
  const grouped: Record<string, TimezoneOption[]> = {}

  timezoneData.forEach((tz) => {
    if (!grouped[tz.region]) {
      grouped[tz.region] = []
    }
    grouped[tz.region].push(tz)
  })

  Object.keys(grouped).forEach((region) => {
    grouped[region].sort((a, b) => a.offset - b.offset)
  })

  return grouped
}

export function findTimezone(value: string): TimezoneOption | undefined {
  return timezoneData.find((tz) => tz.value === value)
}

export function formatTimezone(timezone: string): string {
  const tz = findTimezone(timezone)
  if (tz) {
    return `${tz.label} (${tz.gmtLabel})`
  }

  const offset = getGMTOffset(timezone)
  const label = timezone.split('/').pop()?.replace(/_/g, ' ') || timezone
  return `${label} (${offset})`
}

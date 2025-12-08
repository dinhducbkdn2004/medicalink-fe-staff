/**
 * Office Hours Schema
 * Type definitions and validation schemas for office hours
 */
import { z } from 'zod'
import type { OfficeHour } from '@/api/services/office-hour.service'

// Re-export API types
export type { OfficeHour } from '@/api/services/office-hour.service'

// Type aliases for UI components
export type OfficeHourWithActions = OfficeHour

// ============================================================================
// Day of Week Constants
// ============================================================================

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
] as const

export function getDayLabel(dayOfWeek: number): string {
  return DAYS_OF_WEEK.find((d) => d.value === dayOfWeek)?.label || 'Unknown'
}

export function getDayShort(dayOfWeek: number): string {
  return DAYS_OF_WEEK.find((d) => d.value === dayOfWeek)?.short || '?'
}

// ============================================================================
// Office Hours Type Constants
// ============================================================================

export const OFFICE_HOURS_TYPES = {
  DOCTOR_AT_LOCATION: 'doctor-at-location', // Both doctorId and workLocationId set
  DOCTOR_ALL_LOCATIONS: 'doctor-all-locations', // Only doctorId set
  GLOBAL_LOCATION: 'global-location', // Only workLocationId set, isGlobal = true
} as const

export type OfficeHoursType =
  (typeof OFFICE_HOURS_TYPES)[keyof typeof OFFICE_HOURS_TYPES]

export function getOfficeHoursType(officeHour: OfficeHour): OfficeHoursType {
  if (officeHour.doctorId && officeHour.workLocationId) {
    return OFFICE_HOURS_TYPES.DOCTOR_AT_LOCATION
  }
  if (officeHour.doctorId && !officeHour.workLocationId) {
    return OFFICE_HOURS_TYPES.DOCTOR_ALL_LOCATIONS
  }
  return OFFICE_HOURS_TYPES.GLOBAL_LOCATION
}

export function getOfficeHoursTypeLabel(type: OfficeHoursType): string {
  switch (type) {
    case OFFICE_HOURS_TYPES.DOCTOR_AT_LOCATION:
      return 'Doctor at Specific Location'
    case OFFICE_HOURS_TYPES.DOCTOR_ALL_LOCATIONS:
      return 'Doctor (All Locations)'
    case OFFICE_HOURS_TYPES.GLOBAL_LOCATION:
      return 'Global Location Hours'
    default:
      return 'Unknown'
  }
}

// ============================================================================
// Validation Schemas
// ============================================================================

// Time validation regex (HH:mm format, 24-hour)
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

// Custom time validator
const timeValidator = z.string().regex(timeRegex, {
  message: 'Time must be in HH:mm format (e.g., 08:00, 14:30)',
})

/**
 * Schema for creating office hours
 * Note: API does not support editing, only create and delete
 */
export const officeHourFormSchema = z
  .object({
    doctorId: z.string().nullable().optional(),
    workLocationId: z.string().nullable().optional(),
    dayOfWeek: z
      .number()
      .int()
      .min(0)
      .max(6, 'Day of week must be between 0 (Sunday) and 6 (Saturday)'),
    startTime: timeValidator,
    endTime: timeValidator,
    isGlobal: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // Validation based on API Office Hours Types:
      // 1. Doctor at location: doctorId + workLocationId
      // 2. Doctor (all locations): doctorId only
      // 3. Work location: workLocationId only, isGlobal can be true
      // 4. Global: isGlobal=true, both can be null

      // If isGlobal is true, it's always valid (type 3 or 4)
      if (data.isGlobal) {
        return true
      }

      // If not global, at least one of doctorId or workLocationId must be set
      return data.doctorId || data.workLocationId
    },
    {
      message: 'Either Doctor, Work Location, or Global must be selected',
      path: ['doctorId'],
    }
  )
  .refine(
    (data) => {
      // If isGlobal is true and doctorId is set, that's invalid
      if (data.isGlobal && data.doctorId) {
        return false
      }
      return true
    },
    {
      message: 'Global hours cannot be assigned to a specific doctor',
      path: ['isGlobal'],
    }
  )
  .refine(
    (data) => {
      // startTime must be before endTime
      if (data.startTime && data.endTime) {
        const [startHour, startMin] = data.startTime.split(':').map(Number)
        const [endHour, endMin] = data.endTime.split(':').map(Number)
        const startMinutes = startHour * 60 + startMin
        const endMinutes = endHour * 60 + endMin
        return startMinutes < endMinutes
      }
      return true
    },
    {
      message: 'Start time must be before end time',
      path: ['endTime'],
    }
  )

export type OfficeHourFormValues = z.infer<typeof officeHourFormSchema>

/**
 * Schema for filtering office hours
 */
export const officeHourFilterSchema = z.object({
  doctorId: z.string().optional(),
  workLocationId: z.string().optional(),
  dayOfWeek: z.number().int().min(0).max(6).optional(),
})

export type OfficeHourFilterValues = z.infer<typeof officeHourFilterSchema>

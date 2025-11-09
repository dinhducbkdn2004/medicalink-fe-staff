/**
 * Specialty Schema
 * Type definitions matching API response
 */
import type {
  Specialty,
  SpecialtyInfoSection,
} from '@/api/services/specialty.service'

// Re-export API types
export type { Specialty, SpecialtyInfoSection }

// Extended types for UI components
// Currently using base types, but can be extended with UI-specific fields later
export type SpecialtyWithActions = Specialty

export type InfoSectionWithActions = SpecialtyInfoSection

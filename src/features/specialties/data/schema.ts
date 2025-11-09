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

// Type aliases for UI components
// These allow for future extension without breaking changes
export type SpecialtyWithActions = Specialty
export type InfoSectionWithActions = SpecialtyInfoSection

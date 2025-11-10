/**
 * Work Location Schema
 * Type definitions matching API response
 */
import type { WorkLocation } from '@/api/services/work-location.service'

// Re-export API types
export type { WorkLocation }

// Type aliases for UI components
// These allow for future extension without breaking changes
export type WorkLocationWithActions = WorkLocation

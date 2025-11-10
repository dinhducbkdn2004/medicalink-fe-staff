/**
 * Work Locations Feature Exports
 * Centralized exports for work locations feature
 */

// Main page component
export { WorkLocations } from './index'

// Data hooks
export {
  useWorkLocations,
  useWorkLocation,
  useWorkLocationStats,
  useActiveWorkLocations,
  useCreateWorkLocation,
  useUpdateWorkLocation,
  useDeleteWorkLocation,
  workLocationKeys,
} from './data/use-work-locations'

// Types
export type { WorkLocation, WorkLocationWithActions } from './data/schema'

// Static data
export { statusOptions, sortOptions } from './data/data'

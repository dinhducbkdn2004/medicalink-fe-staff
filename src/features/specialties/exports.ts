/**
 * Specialties Feature Exports
 * Central export point for specialties feature
 */

// Main component
export { Specialties } from './index'

// Provider & Context
export {
  SpecialtiesProvider,
  useSpecialties,
} from './components/specialties-provider'

// Hooks
export {
  useSpecialties as useSpecialtiesQuery,
  useSpecialty,
  useSpecialtyStats,
  useActiveSpecialties,
  useInfoSections,
  useCreateSpecialty,
  useUpdateSpecialty,
  useDeleteSpecialty,
  useCreateInfoSection,
  useUpdateInfoSection,
  useDeleteInfoSection,
} from './data/use-specialties'

// Types
export type { Specialty, SpecialtyInfoSection } from './data/schema'

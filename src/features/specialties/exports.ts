export { Specialties } from './index'

export {
  SpecialtiesProvider,
  useSpecialties,
} from './components/specialties-provider'

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

export type { Specialty, SpecialtyInfoSection } from './data/schema'

/**
 * Specialties Feature - React Query Hooks
 * Data fetching for specialties
 */
import { useQuery } from '@tanstack/react-query'
import { specialtyService, type SpecialtyQueryParams } from '@/api/services'

// ============================================================================
// Query Keys
// ============================================================================

export const specialtyKeys = {
  all: ['specialties'] as const,
  lists: () => [...specialtyKeys.all, 'list'] as const,
  list: (params: SpecialtyQueryParams) =>
    [...specialtyKeys.lists(), params] as const,
}

// ============================================================================
// Queries
// ============================================================================

/**
 * Get all specialties
 */
export function useSpecialties(params: SpecialtyQueryParams = {}) {
  return useQuery({
    queryKey: specialtyKeys.list(params),
    queryFn: () => specialtyService.getSpecialties(params),
    staleTime: 60 * 60 * 1000, // 1 hour
  })
}

/**
 * Get all public specialties
 */
export function usePublicSpecialties(params: SpecialtyQueryParams = {}) {
  return useQuery({
    queryKey: [...specialtyKeys.lists(), 'public', params],
    queryFn: () => specialtyService.getPublicSpecialties(params),
    staleTime: 60 * 60 * 1000, // 1 hour
  })
}

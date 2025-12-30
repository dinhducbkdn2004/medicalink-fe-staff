import { useQuery } from '@tanstack/react-query'
import { specialtyService, type SpecialtyQueryParams } from '@/api/services'

export const specialtyKeys = {
  all: ['specialties'] as const,
  lists: () => [...specialtyKeys.all, 'list'] as const,
  list: (params: SpecialtyQueryParams) =>
    [...specialtyKeys.lists(), params] as const,
}

export function useSpecialties(params: SpecialtyQueryParams = {}) {
  return useQuery({
    queryKey: specialtyKeys.list(params),
    queryFn: () => specialtyService.getSpecialties(params),
    staleTime: 60 * 60 * 1000,
  })
}

export function usePublicSpecialties(params: SpecialtyQueryParams = {}) {
  return useQuery({
    queryKey: [...specialtyKeys.lists(), 'public', params],
    queryFn: () => specialtyService.getPublicSpecialties(params),
    staleTime: 60 * 60 * 1000,
  })
}

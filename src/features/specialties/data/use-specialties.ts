/**
 * Specialty API Hooks
 * TanStack Query hooks for Specialty management
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { specialtyService } from '@/api/services'
import type {
  SpecialtyQueryParams,
  CreateSpecialtyRequest,
  UpdateSpecialtyRequest,
  CreateInfoSectionRequest,
  UpdateInfoSectionRequest,
} from '@/api/services/specialty.service'

// ============================================================================
// Query Keys
// ============================================================================

export const specialtyKeys = {
  all: ['specialties'] as const,
  lists: () => [...specialtyKeys.all, 'list'] as const,
  list: (params: SpecialtyQueryParams) =>
    [...specialtyKeys.lists(), params] as const,
  details: () => [...specialtyKeys.all, 'detail'] as const,
  detail: (id: string) => [...specialtyKeys.details(), id] as const,
  stats: () => [...specialtyKeys.all, 'stats'] as const,
  infoSections: (specialtyId: string) =>
    [...specialtyKeys.all, 'info-sections', specialtyId] as const,
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Hook to fetch paginated list of specialties with filtering and sorting
 */
export function useSpecialties(params: SpecialtyQueryParams = {}) {
  return useQuery({
    queryKey: specialtyKeys.list(params),
    queryFn: () => specialtyService.getSpecialties(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch single specialty by ID
 */
export function useSpecialty(id: string | undefined) {
  return useQuery({
    queryKey: specialtyKeys.detail(id!),
    queryFn: () => specialtyService.getSpecialty(id!),
    enabled: !!id,
  })
}

/**
 * Hook to fetch specialty statistics
 */
export function useSpecialtyStats() {
  return useQuery({
    queryKey: specialtyKeys.stats(),
    queryFn: () => specialtyService.getSpecialtyStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch all active specialties (for dropdowns)
 */
export function useActiveSpecialties() {
  return useQuery({
    queryKey: [...specialtyKeys.all, 'active'],
    queryFn: () => specialtyService.getAllActiveSpecialties(),
    staleTime: 1000 * 60 * 10, // 10 minutes (rarely changes)
  })
}

/**
 * Hook to fetch info sections for a specialty
 */
export function useInfoSections(specialtyId: string | undefined) {
  return useQuery({
    queryKey: specialtyKeys.infoSections(specialtyId!),
    queryFn: () => specialtyService.getInfoSections(specialtyId!),
    enabled: !!specialtyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// ============================================================================
// Mutation Hooks - Specialties
// ============================================================================

/**
 * Hook to create a new specialty
 */
export function useCreateSpecialty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSpecialtyRequest) =>
      specialtyService.createSpecialty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: specialtyKeys.lists() })
      queryClient.invalidateQueries({ queryKey: specialtyKeys.stats() })
      toast.success('Specialty created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create specialty')
    },
  })
}

/**
 * Hook to update specialty information
 */
export function useUpdateSpecialty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSpecialtyRequest }) =>
      specialtyService.updateSpecialty(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: specialtyKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: specialtyKeys.detail(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: specialtyKeys.stats() })
      toast.success('Specialty updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update specialty')
    },
  })
}

/**
 * Hook to delete a specialty
 */
export function useDeleteSpecialty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => specialtyService.deleteSpecialty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: specialtyKeys.lists() })
      queryClient.invalidateQueries({ queryKey: specialtyKeys.stats() })
      toast.success('Specialty deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete specialty')
    },
  })
}

// ============================================================================
// Mutation Hooks - Info Sections
// ============================================================================

/**
 * Hook to create a new info section
 */
export function useCreateInfoSection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateInfoSectionRequest) =>
      specialtyService.createInfoSection(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: specialtyKeys.infoSections(variables.specialtyId),
      })
      queryClient.invalidateQueries({
        queryKey: specialtyKeys.detail(variables.specialtyId),
      })
      toast.success('Info section created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create info section')
    },
  })
}

/**
 * Hook to update an info section
 */
export function useUpdateInfoSection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      specialtyId: string
      data: UpdateInfoSectionRequest
    }) => specialtyService.updateInfoSection(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: specialtyKeys.infoSections(variables.specialtyId),
      })
      queryClient.invalidateQueries({
        queryKey: specialtyKeys.detail(variables.specialtyId),
      })
      toast.success('Info section updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update info section')
    },
  })
}

/**
 * Hook to delete an info section
 */
export function useDeleteInfoSection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string; specialtyId: string }) =>
      specialtyService.deleteInfoSection(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: specialtyKeys.infoSections(variables.specialtyId),
      })
      queryClient.invalidateQueries({
        queryKey: specialtyKeys.detail(variables.specialtyId),
      })
      toast.success('Info section deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete info section')
    },
  })
}
